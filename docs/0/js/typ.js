const NB = Symbol();
const ins = {throw:null, bool:null};
export class Typ {
    static get bool() {return this.#get('bool')}
    static get throw() {return this.#get('throw')}
    static #get(n) {
        if (!['bool','throw'].some(x=>x===n)) {throw new Error(`Implementation Error.`)}
        if (!ins[n]) {ins[n]=new Typ(NB, 'throw'===n);}
        return ins[n];
    }
    constructor(block, isThrow=false) {
        if (NB!==block) {throw new Error(`new禁止`)}
        this._={isThrow}
        if ('boolean'!==typeof isThrow) {throw new Error(`isThrowは真偽値であるべきです。`)}
    }
    as(v, a) {}
    of(v, a) {
        Value.throw(v);
        return Expector.get(a).of(v);
    }
    some(v, ...as) {}
    not(v, ...as) {}
}
const isBoxedPrimitive = v=> isO(v) && [Boolean,Number,String].some(b=>b===v?.constructor);
const isBrokenObject = v => {
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
class Value {
    static throw(v) {
        this.#throwBoxedPrimitive(v);
        this.#throwBrokenObject(v);
    }
    static #throwBoxedPrimitive(v) {return isO(v) && [Boolean,Number,String].some(b=>b===v?.constructor)}
    static #throwBrokenObject(v) {return isBrokenObject(v)}
}
class Expecter {
    static #es = [ConExpecter,ObjExpecter].map(C=>new C());
    static get(v) {
        const E = this.#es.find(C=>C.is(v));
        if (!E) {throw new Error(`型指定子が不正です。NaN,null,undefined,コンストラクタ関数またはa=>a.p等のコールバック関数であるべきです。:${v}`)}
        return E;
    }
}
const isO =v=>null!==v && 'object'===typeof v;
const isFn =v=>'function'===typeof v;
const isStr =v=>'string'===typeof v;
const isCls =v=>isFn(v) && /^[A-Z]/.test(v.name);
const isNun =v=>Number.isNaN(v) || [null,undefined].some(x=>x===v);
const CONTINUE = Symbol();
class ConExpecter {
    //static #P = 'Boolean Number String BigInt Symbol'.split(' ');
    static #P = [Boolean,Number,String,BigInt,Symbol];
    static #p = this.#P.map(p=>p.name.toLowerCase());
    static #M = 'Nun Primitive Function Container Instance'.split(' ');
    is(v) {return isNun(v) || isCls(v)}
    test(v, C) {
        for (let N of this.#M) {
            const R = this[`_is${N}`](v,C);
            if (R!==CONTINUE) return R;
        }
        throw new Error(`到達不能のはず。:v:${v}, C:${C}`);
    }
    _isNun(v,C) {
        if ([v,C].some(x=>Number.isNaN(x))) return [v,C].every(x=>Number.isNaN(x));
        if ([null,undefined].some(x=>x===C)) return v===C;
        return CONTINUE;
    }
    _isPrimitive(v,C) {
        const P = ConExpecter.#P.find(p=>p===C);
        if (!P) return CONTINUE;
        return p.name.toLowerCase()===typeof C;
    }
    _isFunction(v,C) {
        if (C===Function) return isFn(v);
        return CONTINUE;
    }
    _isContainer(v,C) {
        if (C===Array) return Array.isArray(v);
        else if (C===Object) {
            const proto = Object.getPrototypeOf(v);
            if (null===proto) return true; // Dictionary(Object.create(null))
            else if (Object.prototype===proto) return true; // Pure Object/Descriptor
            return CONTINUE; // Instance/Object.create({})
        }
    }
    _isInstance(v,C) {
        if (isBoxedPrimitive(v)) {throw new Error(`不正な値です。BoxedPrimitive<${v.constructor.name}>`)}
        else if (isBrokenObject(v)) {throw new Error(`不正な値です。constructorが破綻したオブジェクトです。:${v}`)}
        else if (isFn(C)) return v instanceof C;
        else return CONTINUE;
    }
}
class ObjExpecter {
    constructor(o) {this._{o:o}}
    is(v) {
        if (!isO(v)) return false;
        if (!Object.hasOwn(v, '$')) return false;
        if (!Object.hasOwn(v.$, 'path')) return false;
        if (!isStr(v.$.path)) return false;
        return this.#exist(path);
    }
    #exist(path) {
        return path.split('.').reduce((o, key) => {
            if (o===null || o===undefined) return undefined;
            return acc[key];
        }, this._.o) !== undefined;
    }
    test(v, C) {

    }
}
class ConTyp {
}
class ObjTyp {
    of(v) {return this.#exist(path);}
}
