import { expect, test, describe } from "bun:test";
import { ObSt } from "../../src/js/part/obst.js";

class CustomClass {}

describe("ObSt.to 基本動作テスト", () => {
  test("デフォルト設定での文字列化（キーのクォートなし、文字列はシングルクォート）", () => {
    const o = {
      name: 'a',
      age: 1,
      nan: NaN,
      big: 10n,
      cls: Date,
      ins: new Date(),
      reg: /^[A-Z]+/,
      sym: Symbol.for('sym-bol'),
      list: [1, 'b'],
      nested: { x: 1 }
    };

    const result = ObSt.to(o);
    
    expect(result).toBe(
      `{ name: 'a', age: 1, nan: NaN, big: 10n, cls: Date, ins: new Date(/*引数情報消失*/), reg: /^[A-Z]+/, sym: Symbol('sym-bol'), list: [1, 'b'], nested: { x: 1 } }`
    );
  });
});

describe("ObSt.to オプション（A案）テスト", () => {
  test("文字列のオプション：オブジェクト指定（ダブルクォート）", () => {
    const o = { text: "hello" };
    const result = ObSt.to(o, { str: { quote: '"' } });
    expect(result).toBe(`{ text: "hello" }`);
  });

  test("文字列のオプション：関数（コールバック）直接指定", () => {
    const o = { text: "hello" };
    // バッククォートに強制変換するユーザー関数
    const result = ObSt.to(o, { str: (v) => `\`${v}\`` });
    expect(result).toBe("{ text: `hello` }");
  });

  test("Symbolのオプション：例外発生モード", () => {
    const o = { sym: Symbol('test') };
    expect(() => {
      ObSt.to(o, { sym: { mode: 'exception' } });
    }).toThrow('Symbol文字列化禁止');
  });

  test("Symbolのオプション：関数直接指定", () => {
    const o = { sym: Symbol.for('global-sym') };
    const result = ObSt.to(o, { sym: (v) => `@@${v.description}` });
    expect(result).toBe("{ sym: @@global-sym }");
  });

  test("インスタンスのオプション：関数直接指定による特定型の復元模索", () => {
    const o = { date: new Date('2026-06-01T00:00:00.000Z'), other: new CustomClass() };
    const result = ObSt.to(o, {
      ins: (v) => {
        if (v instanceof Date) return `new Date('${v.toISOString()}')`;
        return `new ${v.constructor.name}()`;
      }
    });
    expect(result).toBe("{ date: new Date('2026-06-01T00:00:00.000Z'), other: new CustomClass() }");
  });
});

