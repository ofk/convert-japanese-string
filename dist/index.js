"use strict";
/* eslint-disable no-bitwise, no-continue, no-lonely-if */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = void 0;
function convertFlags(str, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.eol, eol = _c === void 0 ? 0 : _c, // cr: 1, lf: 2
    _d = _b.ascii, // cr: 1, lf: 2
    ascii = _d === void 0 ? 0 : _d, // space: 1, number: 2, alphabet: 4, symbol: 8
    _e = _b.fwAscii, // space: 1, number: 2, alphabet: 4, symbol: 8
    fwAscii = _e === void 0 ? 0 : _e, _f = _b.hiragana, hiragana = _f === void 0 ? 0 : _f, // to hiragana: 1, katakana: 2
    _g = _b.katakana, // to hiragana: 1, katakana: 2
    katakana = _g === void 0 ? 0 : _g;
    var codes = [];
    for (var i = 0, iz = str.length; i < iz; i += 1) {
        var c = str.charCodeAt(i);
        if (c === 0xa || c === 0xd) {
            // \r, \n
            if (eol) {
                if (c === 0xd && str.charCodeAt(i + 1) === 0xa) {
                    i += 1;
                }
                if (eol & 1)
                    codes.push(0xd);
                if (eol & 2)
                    codes.push(0xa);
                continue;
            }
        }
        else if (c >= 0x20 && c <= 0x7e) {
            // ASCII
            if (c === 0x20) {
                // space
                if (ascii & 1)
                    c = 0x3000;
            }
            else if (c >= 0x30 && c <= 0x39) {
                // number
                if (ascii & 2)
                    c += 0xff01 - 0x21;
            }
            else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a)) {
                // alphabet
                if (ascii & 4)
                    c += 0xff01 - 0x21;
            }
            else {
                // symbol
                if (ascii & 8)
                    c += 0xff01 - 0x21;
            }
        }
        else if (c === 0x3000) {
            // Fullwidth space
            if (fwAscii & 1)
                c = 0x20;
        }
        else if (c >= 0xff01 && c <= 0xff5e) {
            // Fullfwidth ASCII
            if (c >= 0xff10 && c <= 0xff19) {
                // number
                if (fwAscii & 2)
                    c += 0x21 - 0xff01;
            }
            else if ((c >= 0xff21 && c <= 0xff3a) || (c >= 0xff41 && c <= 0xff5a)) {
                // alphabet
                if (fwAscii & 4)
                    c += 0x21 - 0xff01;
            }
            else {
                // symbol
                if (fwAscii & 8)
                    c += 0x21 - 0xff01;
            }
        }
        else if ((c >= 0x3041 && c <= 0x3096) || (c >= 0x309d && c <= 0x309e)) {
            // Hiragana
            if (hiragana === 2)
                c += 0x30a1 - 0x3041;
        }
        else if ((c >= 0x30a1 && c <= 0x30f6) || (c >= 0x30fd && c <= 0x30fe)) {
            // Fullwidth Katakana
            if (katakana === 1)
                c += 0x3041 - 0x30a1;
        }
        // TODO: Support Halfwidth Kana Conversion
        codes.push(c);
    }
    return String.fromCharCode.apply(null, codes);
}
function convert(str, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.lf, lf = _c === void 0 ? false : _c, _d = _b.cr, cr = _d === void 0 ? false : _d, _e = _b.crlf, crlf = _e === void 0 ? false : _e, _f = _b.ascii, ascii = _f === void 0 ? false : _f, _g = _b.halfwidthSpace, halfwidthSpace = _g === void 0 ? false : _g, _h = _b.halfwidthNumber, halfwidthNumber = _h === void 0 ? false : _h, _j = _b.halfwidthAlphabet, halfwidthAlphabet = _j === void 0 ? false : _j, _k = _b.halfwidthSymbol, halfwidthSymbol = _k === void 0 ? false : _k, _l = _b.fullwidthAscii, fullwidthAscii = _l === void 0 ? false : _l, _m = _b.fullwidthNumber, fullwidthNumber = _m === void 0 ? false : _m, _o = _b.fullwidthAlphabet, fullwidthAlphabet = _o === void 0 ? false : _o, _p = _b.fullwidthSymbol, fullwidthSymbol = _p === void 0 ? false : _p, _q = _b.fullwidthSpace, fullwidthSpace = _q === void 0 ? false : _q, _r = _b.hiragana, hiragana = _r === void 0 ? false : _r, _s = _b.katakana, katakana = _s === void 0 ? false : _s;
    var eol = 0;
    var fromAscii = 0;
    var fromFullwidthAscii = 0;
    var fromHiragana = 0;
    var fromKatakana = 0;
    if (cr || crlf)
        eol |= 1;
    if (lf || crlf)
        eol |= 2;
    if (halfwidthSpace || ascii)
        fromFullwidthAscii |= 1;
    if (halfwidthNumber || ascii)
        fromFullwidthAscii |= 2;
    if (halfwidthAlphabet || ascii)
        fromFullwidthAscii |= 4;
    if (halfwidthSymbol || ascii)
        fromFullwidthAscii |= 8;
    if (fullwidthSpace || fullwidthAscii)
        fromAscii |= 1;
    if (fullwidthNumber || fullwidthAscii)
        fromAscii |= 2;
    if (fullwidthAlphabet || fullwidthAscii)
        fromAscii |= 4;
    if (fullwidthSymbol || fullwidthAscii)
        fromAscii |= 8;
    if (hiragana)
        fromKatakana = 1;
    if (katakana)
        fromHiragana = 2;
    return convertFlags(str, {
        eol: eol,
        ascii: fromAscii,
        fwAscii: fromFullwidthAscii,
        hiragana: fromHiragana,
        katakana: fromKatakana,
    });
}
exports.convert = convert;
