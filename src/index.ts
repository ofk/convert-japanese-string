/* eslint-disable no-bitwise, no-continue, no-lonely-if */

function convertFlags(
  str: string,
  {
    eol = 0, // cr: 1, lf: 2
    ascii = 0, // space: 1, number: 2, alphabet: 4, symbol: 8
    fwAscii = 0,
    hiragana = 0, // to hiragana: 1, katakana: 2
    katakana = 0,
  } = {}
): string {
  const codes: number[] = [];
  for (let i = 0, iz = str.length; i < iz; i += 1) {
    let c = str.charCodeAt(i);
    if (c === 0xa || c === 0xd) {
      // \r, \n
      if (eol) {
        if (c === 0xd && str.charCodeAt(i + 1) === 0xa) {
          i += 1;
        }
        if (eol & 1) codes.push(0xd);
        if (eol & 2) codes.push(0xa);
        continue;
      }
    } else if (c >= 0x20 && c <= 0x7e) {
      // ASCII
      if (c === 0x20) {
        // space
        if (ascii & 1) c = 0x3000;
      } else if (c >= 0x30 && c <= 0x39) {
        // number
        if (ascii & 2) c += 0xff01 - 0x21;
      } else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a)) {
        // alphabet
        if (ascii & 4) c += 0xff01 - 0x21;
      } else {
        // symbol
        if (ascii & 8) c += 0xff01 - 0x21;
      }
    } else if (c === 0x3000) {
      // Fullwidth space
      if (fwAscii & 1) c = 0x20;
    } else if (c >= 0xff01 && c <= 0xff5e) {
      // Fullfwidth ASCII
      if (c >= 0xff10 && c <= 0xff19) {
        // number
        if (fwAscii & 2) c += 0x21 - 0xff01;
      } else if ((c >= 0xff21 && c <= 0xff3a) || (c >= 0xff41 && c <= 0xff5a)) {
        // alphabet
        if (fwAscii & 4) c += 0x21 - 0xff01;
      } else {
        // symbol
        if (fwAscii & 8) c += 0x21 - 0xff01;
      }
    } else if ((c >= 0x3041 && c <= 0x3096) || (c >= 0x309d && c <= 0x309e)) {
      // Hiragana
      if (hiragana === 2) c += 0x30a1 - 0x3041;
    } else if ((c >= 0x30a1 && c <= 0x30f6) || (c >= 0x30fd && c <= 0x30fe)) {
      // Fullwidth Katakana
      if (katakana === 1) c += 0x3041 - 0x30a1;
    }
    // TODO: Support Halfwidth Kana Conversion
    codes.push(c);
  }
  return String.fromCharCode.apply(null, codes);
}

export function convert(
  str: string,
  {
    lf = false,
    cr = false,
    crlf = false,
    ascii = false,
    halfwidthSpace = false,
    halfwidthNumber = false,
    halfwidthAlphabet = false,
    halfwidthSymbol = false,
    fullwidthAscii = false,
    fullwidthNumber = false,
    fullwidthAlphabet = false,
    fullwidthSymbol = false,
    fullwidthSpace = false,
    hiragana = false,
    katakana = false,
  } = {}
): string {
  let eol = 0;
  let fromAscii = 0;
  let fromFullwidthAscii = 0;
  let fromHiragana = 0;
  let fromKatakana = 0;
  if (cr || crlf) eol |= 1;
  if (lf || crlf) eol |= 2;
  if (halfwidthSpace || ascii) fromFullwidthAscii |= 1;
  if (halfwidthNumber || ascii) fromFullwidthAscii |= 2;
  if (halfwidthAlphabet || ascii) fromFullwidthAscii |= 4;
  if (halfwidthSymbol || ascii) fromFullwidthAscii |= 8;
  if (fullwidthSpace || fullwidthAscii) fromAscii |= 1;
  if (fullwidthNumber || fullwidthAscii) fromAscii |= 2;
  if (fullwidthAlphabet || fullwidthAscii) fromAscii |= 4;
  if (fullwidthSymbol || fullwidthAscii) fromAscii |= 8;
  if (hiragana) fromKatakana = 1;
  if (katakana) fromHiragana = 2;
  return convertFlags(str, {
    eol,
    ascii: fromAscii,
    fwAscii: fromFullwidthAscii,
    hiragana: fromHiragana,
    katakana: fromKatakana,
  });
}
