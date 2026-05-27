const Ns = '$ symbol prototype'.split(' ');
// 関数オブジェクト参照ロガーを生成する(FunctionObjectReferenceLogger)
export const getFORL = (currentPath = 'a') => {
  const dummyTarget = function() {};
  dummyTarget.$ = {
    path: currentPath,
    args: null,
  };
  const handler = {
    get(target, key) {
      if (Ns.some(n=>n===key)) {return Reflect.get(target, key);}
      const nextPath = `${target.$.path}.${key}`;
      return getFORL(nextPath);
    },
    apply(target, thisArg, callArgs) {
      target.$.args = callArgs;
      return new Proxy(target, handler);
    }
  };
  return new Proxy(dummyTarget, handler);
}
/*
// --- 技術検証テスト ---
const a = getFORL();
// ユーザーが自由に記述した DSL コールバックを実行してみる
const callback1 = (a) => a.p.num.int;
const callback2 = (a) => a.p.num.int.bit(8);
const callback3 = (a) => a.p.str.some('A', 'B');
const res1 = callback1(a);
const res2 = callback2(a);
const res3 = callback3(a);
// 隠しプロパティ（データ）が正しく回収できるか確認
console.log(res1.$); // { path: "a.p.num.int", args: null }
console.log(res2.$); // { path: "a.p.num.int.bit", args: [8] }
console.log(res3.$); // { path: "a.p.str.some", args: ["A", "B"] }
*/
