const tag = v => Object.prototype.toString.call(v).slice(8,-1);
const typeOf = v => {
    if (Number.isNaN(v)) return 'NaN';
    if (null===v) return 'null'
    return typeof v;
};
const isO = v => 'object'===typeOf(v);
const isCls = v => 'function'===typeof(v) && /^[A-Z]+/.test(v?.name);
const isPrimitive = v => [Boolean,Number,String,BigInt,Symbol].some(C=>C.name.toLowerCase()===typeof v);
const isBoxedPrimitive = v => isO(v) && [Boolean,Number,String].some(C=>C===v?.constructor);
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
const validValue = v => {
    if (isBoxedPrimitive(v)) {throw new Error(`不正な値です。BoxedPrimitive<${v?.constructor}>`)}
    if (isBrokenObject(v)) {throw new Error(`不正な値です。constructorまたはそのnameが無い型破綻オブジェクトです。`)}
}
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
  static isDat(v) {return ['data','function'].some(x=>x===getDes(v));}
  static isDatV(v) {return 'data'===getDes(v);}
  static isDatF(v) {return 'function'===getDes(v);}
  static isAcc(v) {return ['accessor','get','set'].some(x=>x===getDes(v));}
  static isAccG(v) {return 'get'===getDes(v);}
  static isAccS(v) {return 'set'===getDes(v);}
  static isAccGS(v) {return 'accessor'===getDes(v);}
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
const getTag = v => {
    if (Number.isNaN(v)) return 'NaN';
    else if (Array.isArray(v)) return 'Array';
    else if ('object'===typeOf(v)) {//Object(Array/Object/Dictionary/Descriptor/BoxedPrimitive<X>/BlokenObject)
        const proto = Object.getPrototypeOf(v);
        const des = Descriptor.tag(v);
        if (null===proto) return 'Dictionary';
        else if (des) return des;
        else if (isBoxedPrimitive(v)) return `BoxedPrimitive<${v.constructor.name}>`;
        else if (isBrokenObject(v)) return `BlokenObject`;
        else if (Object.prototype===proto) return 'Object';
        else return `Instance<${v.constructor.name}>`
    }
    else if (isCls(v)) {return `Class<${v.name}>`}
    return tag(v);
};
export {getTag};
/*
const a = {};
a.p = v => isPrimitive(v);
const typof = (v,a) => {
    const is = a(a);
    if (!isFn(is)) {throw new Error(`引数不正。第二引数はa=>a.p等のように指定してください。`)}
    const R = is(v);
    const T = getTag(v);
}
*/
