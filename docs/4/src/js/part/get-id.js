import {a} from './a.js';
// a.を全チェックして真な場合、そのa.のプロパティ・パスを文字列化して返す
class TypeIdentifier {
  // 最優先で評価すべき例外的なプロパティ（評価順に並べる）
  static PRIORITY_KEYS = ['B', 'b'];
  constructor(rootObj) {this.root = rootObj;}
  /**
   * 対象の値を検証し、合致する最も具体的なプロパティ・パスを返す
   * @param {*} value - 検証する値
   * @returns {string|null} 判定されたパスの文字列、またはnull
   */
  identify(value) {
    this.value = value;
    this.matches = [];
    this.visitedPaths = new Set();
    // 1. 例外的な判定（B, b）を最優先で先行評価
    for (const key of TypeIdentifier.PRIORITY_KEYS) {
      if (Object.prototype.hasOwnProperty.call(this.root, key)) {
        this._scan(this.root[key], key);
      }
    }
    // 例外判定でヒットがあれば、その時点で確定（全体探索をスキップ）
    if (this.matches.length > 0) {
      return this._pickBestPath();
    }
    // 2. 例外をすり抜けた場合のみ、全体を深さ優先探索（例外キーは自動スキップされる）
    this._scan(this.root);
    return this.matches.length > 0 ? this._pickBestPath() : null;
  }
  /**
   * オブジェクトツリーを深さ優先で再帰走査する（内部メソッド）
   */
  _scan(obj, path = '') {
    // 既に他のフェーズでルートから評価済みのパス（'B' や 'b' など）ならスキップ
    if (this.visitedPaths.has(path)) return;
    this.visitedPaths.add(path);
    // 自身が関数の場合、実行して真ならマッチ一覧に追加
    if (typeof obj === 'function') {
      try {
        if (obj(this.value) === true) {
          this.matches.push(path);
        }
      } catch (e) {}// 判定中の例外は安全にスルー
    }
    // 子プロパティがあれば再帰探索
    if (obj !== null && (typeof obj === 'object' || typeof obj === 'function')) {
      for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
        const currentPath = path ? `${path}.${key}` : key;
        this._scan(obj[key], currentPath);
      }
    }
  }
  /**
   * マッチしたパスの中から、最も具体的（階層が深く、文字列が長い）なものを選択する
   */
  _pickBestPath() {
    return this.matches.reduce((best, current) => {
      const bestDots = best.split('.').length;
      const currentDots = current.split('.').length;
      
      if (currentDots !== bestDots) {
        return currentDots > bestDots ? current : best;
      }
      return current.length > best.length ? current : best;
    });
  }
}
class TypeArgs {
    static get(value, path) {
        switch (path) {
            case 'r.ins': return `${path}(${value.constructor.name})`;
            case 'r.cls': return `${path}(${value.name})`;
            case 'r.ary': return this.#ary(value, path);
            default: return path;
            case 'r.ins': 
        }
    }
    static #ary(value, path) {
        if (0===value.length) return path;
        const T = identifier.identify(value[0]);
        const sameAll = value.every(v=>T===identifier.identify(v));
        return sameAll ? `${path}(${T})` : path;
    }
}
const identifier = new TypeIdentifier(a);
//const getId = v => identifier.identify(v);
const getId = v => TypeArgs.get(v, identifier.identify(v));
export {getId}
