export class ObSt {
  static #strategies = [];
  static #defaultOpt = {
    str: { quote: "'" },
    sym: { quote: "'", mode: "standard" },
    ins: { mode: "lost" }
  };
  static {
    this.#strategies = [
      { is: (v) => v === null, to: () => 'null' },
      { is: (v) => v === undefined, to: () => 'undefined' },
      { is: (v) => typeof v === 'bigint', to: (v) => `${v}n` },
      { is: this.#isCls, to: (v) => v.name },
      { is: (v) => typeof v === 'string', to: (v, opt) => this.#toStr(v, opt) },
      { is: (v) => typeof v === 'symbol', to: (v, opt) => this.#toSym(v, opt) },
      { is: (v) => v instanceof RegExp, to: (v) => String(v) },
      { is: Array.isArray, to: (v, opt) => this.#toAry(v, opt) },
      { is: this.#isIns, to: (v, opt) => this.#toIns(v, opt) },
      { is: (v) => typeof v === 'object', to: (v, opt) => this.#toObj(v, opt) },
      { is: this.#isFn, to: (v) => v.toString() }
    ];
  }
  static to(v, opt = {}) {
    const normalize = (target, key) => {
      if (typeof target === 'function') return { _fn: target };
      return { ...this.#defaultOpt[key], ...target };
    };
    const mergedOpt = {
      str: normalize(opt.str, 'str'),
      sym: normalize(opt.sym, 'sym'),
      ins: normalize(opt.ins, 'ins')
    };
    return this.#execute(v, mergedOpt);
  }
  static #execute(v, opt) {
    for (const { is, to } of this.#strategies) {
      if (is.call(this, v)) return to.call(this, v, opt);
    }
    return String(v);
  }
  static #isFn(v) { return typeof v === 'function'; }
  static #isCls(v) { return this.#isFn(v) && /^[A-Z]+/.test(v.name); }
  static #isIns(v) {
    if (v === null || typeof v !== 'object' || Array.isArray(v) || v instanceof RegExp) return false;
    const proto = Object.getPrototypeOf(v);
    return proto !== Object.prototype && proto !== null;
  }
  static #toStr(v, opt) {
    if (opt.str._fn) return opt.str._fn(v);
    const q = opt.str.quote;
    return `${q}${v.replace(new RegExp(q, 'g'), `\\${q}`)}${q}`;
  }
  static #toSym(v, opt) {
    if (opt.sym._fn) return opt.sym._fn(v);
    if (opt.sym.mode === 'exception') throw new Error('Symbol文字列化禁止');
    const description = v.description ?? '';
    if (opt.sym.mode === 'raw') return `Symbol(${description})`;
    const q = opt.sym.quote;
    return `Symbol(${q}${description.replace(new RegExp(q, 'g'), `\\${q}`)}${q})`;
  }
  static #toIns(v, opt) {
    if (opt.ins._fn) return opt.ins._fn(v);
    if (opt.ins.mode === 'exception') throw new Error('インスタンス文字列化禁止');
    const name = v.constructor ? v.constructor.name : 'Object';
    return `new ${name}(/*引数情報消失*/)`;
  }
  static #toAry(v, opt) {
    return `[${v.map(item => this.#execute(item, opt)).join(', ')}]`;
  }
  static #toObj(v, opt) {
    const pairs = Object.entries(v).map(([key, value]) => {
      const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      return `${validKey}: ${this.#execute(value, opt)}`;
    });
    return `{ ${pairs.join(', ')} }`;
  }
}
