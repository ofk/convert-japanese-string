import { convert } from '.';

describe('convert', () => {
  it('returns itself', () => {
    expect(convert('aｚあン永🍣')).toEqual('aｚあン永🍣');
  });

  it('converts eol', () => {
    expect(convert('a\nb\r\nc\r', { lf: true })).toEqual('a\nb\nc\n');
    expect(convert('a\nb\r\nc\r', { cr: true })).toEqual('a\rb\rc\r');
    expect(convert('a\nb\r\nc\r', { crlf: true })).toEqual('a\r\nb\r\nc\r\n');
  });

  it('converts from ascii', () => {
    expect(convert('aｚあン永🍣', { fullwidthAscii: true })).toEqual('ａｚあン永🍣');
    expect(convert('abc{123} XYZ', { fullwidthAscii: true })).toEqual('ａｂｃ｛１２３｝　ＸＹＺ');
    expect(convert('abc{123} XYZ', { fullwidthNumber: true })).toEqual('abc{１２３} XYZ');
    expect(convert('abc{123} XYZ', { fullwidthAlphabet: true })).toEqual('ａｂｃ{123} ＸＹＺ');
    expect(convert('abc{123} XYZ', { fullwidthSymbol: true })).toEqual('abc｛123｝ XYZ');
    expect(convert('abc{123} XYZ', { fullwidthSpace: true })).toEqual('abc{123}　XYZ');
  });

  it('converts from fullwidth ascii', () => {
    expect(convert('aｚあン永🍣', { ascii: true })).toEqual('azあン永🍣');
    expect(convert('ａｂｃ｛１２３｝　ＸＹＺ', { ascii: true })).toEqual('abc{123} XYZ');
    expect(convert('ａｂｃ｛１２３｝　ＸＹＺ', { halfwidthNumber: true })).toEqual(
      'ａｂｃ｛123｝　ＸＹＺ'
    );
    expect(convert('ａｂｃ｛１２３｝　ＸＹＺ', { halfwidthAlphabet: true })).toEqual(
      'abc｛１２３｝　XYZ'
    );
    expect(convert('ａｂｃ｛１２３｝　ＸＹＺ', { halfwidthSymbol: true })).toEqual(
      'ａｂｃ{１２３}　ＸＹＺ'
    );
    expect(convert('ａｂｃ｛１２３｝　ＸＹＺ', { halfwidthSpace: true })).toEqual(
      'ａｂｃ｛１２３｝ ＸＹＺ'
    );
  });

  it('converts from hiragana', () => {
    expect(convert('aｚあン永🍣', { katakana: true })).toEqual('aｚアン永🍣');
    expect(convert('にっぽん', { katakana: true })).toEqual('ニッポン');
  });

  it('converts from katakana', () => {
    expect(convert('aｚあン永🍣', { hiragana: true })).toEqual('aｚあん永🍣');
    expect(convert('パーソナリティ', { hiragana: true })).toEqual('ぱーそなりてぃ');
    expect(convert('ヱヴァンゲリヲン', { hiragana: true })).toEqual('ゑゔぁんげりをん');
  });
});
