const a = {}
const tag = v => Object.prototype.toString.call(v).slice(8,-1);
//const isO = v => null !== v && 'object' === typeof v; // getId(document.all)
const isO = v => null !== v && Object(v) === v;
const isFn = v => 'function'===typeof v;
const isCls = v => isFn(v) && /^[A-Z]+/.test(v?.name);
a.B = v => {
  if (!isO(v)) return false;
  const proto = Object.getPrototypeOf(v);
  if (null === proto) return false;
  if (Object.prototype.hasOwnProperty.call(v, 'constructor')) {
    if (v.constructor !== proto.constructor) return true;
  }
  const c = v.constructor;
  if (typeof c !== 'function') return true;
  if (!('name' in c) || c.name === '') return true;
  return false;
};
a.b = v => isO(v) && [Boolean,Number,String].some(C=>C===v?.constructor);
a.c = v => Number.isNaN(v) || [null,undefined].some(x=>x===v);
a.p = v => !a.c(v) && !(isO(v) || a.r.cal(v));
a.r = v => isFn(v) || (isO(v) && !a.b(v) && !a.B(v));
// BoxedPrimitive
a.b.bln = v => isO(v) && Boolean===v?.constructor;
a.b.num = v => isO(v) && Number===v?.constructor;
a.b.str = v => isO(v) && String===v?.constructor;
// Constant 非活性定数(inactive constant) 使わないほうが良いかもしれない定数たち
a.c.nul = v => null===v;
a.c.und = v => undefined===v;
a.c.nan = v => Number.isNaN(v);
// Primitive
a.p.bln = v => 'boolean'===typeof v;
a.p.num = v => 'number'===typeof v && !Number.isNaN(v);
a.p.big = v => 'bigint'===typeof v;
a.p.str = v => 'string'===typeof v;
a.p.sym = v => 'symbol'===typeof v;
a.r.ary = v => Array.isArray(v);
a.r.obj = v => isO(v) && Object.prototype===Object.getPrototypeOf(v);
a.r.dic = v => isO(v) && null===Object.getPrototypeOf(v);
class Descriptor {
  static tag(v) {
    switch(this.#get(v)) {
      case 'data': return 'Descriptor.Data.Value';
      case 'function': return 'Descriptor.Data.Function';
      case 'accessor': return 'Descriptor.Accessor.GetterSetter';
      case 'get': return 'Descriptor.Accessor.Getter';
      case 'set': return 'Descriptor.Accessor.Setter';
      default: return '';
    }
  }
  static is(v) {return !!this.#get(v)}
  static isDat(v) {return ['data','function'].some(x=>x===this.#get(v));}
  static isDatV(v) {return 'data'===this.#get(v);}
  static isDatF(v) {return 'function'===this.#get(v);}
  static isAcc(v) {return ['accessor','get','set'].some(x=>x===this.#get(v));}
  static isAccG(v) {return 'get'===this.#get(v);}
  static isAccS(v) {return 'set'===this.#get(v);}
  static isAccGS(v) {return 'accessor'===this.#get(v);}
  static #get(v) {
    if (!isO(v)) return null;
    const validKeys = new Set('configurable enumerable writable value get set'.split(' '));
    const keys = Object.keys(v);
    const hasInvalidKey = keys.some(k=>!validKeys.has(k));
    if (hasInvalidKey) return null;
    const isDataDescriptor = 'value' in v || 'writable' in v;
    const isG = 'get' in v && 'function'===typeof v.get;
    const isS = 'set' in v && 'function'===typeof v.set;
    const dat = 'function'===typeof v.value ? 'function' : 'data';
    const acc = isG && isS ? 'accessor' : (!isG && !isS ? null : (isG ? 'get' : 'set'));
    if (isDataDescriptor && (isG || isS)) return null;
    return isDataDescriptor ? dat : acc;
  }
}
a.r.des = v => Descriptor.is(v);
a.r.des.dat = v => Descriptor.isDat(v);
a.r.des.dat.v = v => Descriptor.isDatV(v);
a.r.des.dat.fn = v => Descriptor.isDatF(v);
a.r.des.acc = v => Descriptor.isAcc(v);
a.r.des.acc.g = v => Descriptor.isAccG(v);
a.r.des.acc.s = v => Descriptor.isAccS(v);
a.r.des.acc.gs = v => Descriptor.isAccGS(v);
a.r.ins = v => a.r(v) && !a.r.cls(v) && !a.r.cal(v) && !a.r.ary(v) && !a.r.obj(v) && !a.r.dic(v) && !a.r.des(v);
a.r.cls = v => isCls(v);
a.r.cal = v => isFn(v) && !isCls(v);//r.cal<Async,Generator,AsyncGenerator/Function,Arrow,Method,Native,Bound>
const isFnS = v => 'Function'===tag(v);
const isFnA = v => 'AsyncFunction'===tag(v);
const isFnG = v => 'GeneratorFunction'===tag(v);
const isFnAG = v => 'AsyncGeneratorFunction'===tag(v);
a.r.cal.S = v => a.r.cal(v) && isFnS(v);
a.r.cal.A = v => a.r.cal(v) && isFnA(v);
a.r.cal.G = v => a.r.cal(v) && isFnG(v);
a.r.cal.AG = v => a.r.cal(v) && isFnAG(v);
const fnSrc = (v)=> Function.prototype.toString.call(v);
const remCmt = s=>s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '').trim();
const calFmt = {
    cls: (v,s)=>/^class\b/.test(s),
    fn: (v,s)=>/^(async\s+)?function([\s*()|$])/.test(s),
    arr: (v,s)=>/^(async\s*)?(\([^)]*\)|[a-zA-Z_$][\w_$]*)\s*=>/.test(s),
    nat: (v,s)=>s.includes('[native code]'),
    bou: (v,s)=>v.name.startsWith('bound '),
}
const isCalFmt = (v,t)=>{
    const s = remCmt(fnSrc(v));
    return Object.keys(calFmt).every(k=>calFmt[k](v,s)===(k===t));
}
const isNat = v=>fnSrc(v).includes('[native code]');
const isBou = v=>v.name.startsWith('bound ');
a.r.cal.arrow = (v)=> a.r.cal(v) && (!v.hasOwnProperty('prototype') && isCalFmt(v,'arr'));
a.r.cal.method = (v)=> a.r.cal(v) && isCalFmt(v,'method');
a.r.cal.native = (v)=> a.r.cal(v) && isNat(v) && !isBou(v);
a.r.cal.bound = (v)=> a.r.cal(v) && isNat(v) && isBou(v);
a.r.cal.fn = (v)=> a.r.cal(v) && isCalFmt(v,'fn') && !isNat(v);
a.r.cal.fn.S = (v)=> a.r.cal.fn(v) && isFnS(v);
a.r.cal.fn.A = (v)=> a.r.cal.fn(v) && isFnA(v);
a.r.cal.fn.G = (v)=> a.r.cal.fn(v) && isFnG(v);
a.r.cal.fn.AG = (v)=> a.r.cal.fn(v) && isFnAG(v);
a.r.cal.arrow.S = (v)=> a.r.cal.arrow(v) && isFnS(v);
a.r.cal.arrow.A = (v)=> a.r.cal.arrow(v) && isFnA(v);
a.r.cal.method.S = (v)=> a.r.cal.method(v) && isFnS(v);
a.r.cal.method.A = (v)=> a.r.cal.method(v) && isFnA(v);
a.r.cal.method.G = (v)=> a.r.cal.method(v) && isFnG(v);
a.r.cal.method.AG = (v)=> a.r.cal.method(v) && isFnAG(v);
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
const identifier = new TypeIdentifier(a);
const getId = v => identifier.identify(v);
export {getId}
