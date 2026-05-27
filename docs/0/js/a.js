const a = {};
const isO = v => null!==v && 'object'===typeof v;
const isFn = v => 'function'===typeof v;
const isCls = v => isFn(v) && /^[A-Z]/.test(v?.name);
const isStr = v => 'string'===typeof v;
const typof = v => {
    if (Number.isNaN(v)) return 'NaN';
    const T = typeof v;
    if ('object'===T) return null===v ? 'null' : v;
    return T;
}
const isBrokenObject = v => {
  if (!isO(v)) return false;
  const proto = Object.getPrototypeOf(v);
  if (null === proto) return false; // Dictionary
  if (Object.prototype.hasOwnProperty.call(v, 'constructor')) {
    if (v.constructor !== proto.constructor) return true;
  }
  const c = v.constructor;
  if (typeof c !== 'function') return true;
  if (!('name' in c) || c.name === '') return true;
  return false; // constructorや.nameが無い
};
a.B	= v => isBrokenObject(v);
a.b	= v => isO(v) && [Boolean,Number,String].some(b=>b===v?.constructor);
a.c	= v => Number.isNaN(v) || [undefined,null].some(x=>x===v);
a.p	= v => [Boolean,Number,String,BigInt,Symbol].some(C=>C.name.toLowerCase()===typeof v)
a.r	= v => isO(v) && isFn(v) && !a.B(v) && !a.b(v);
a.b.bln	= v => isO(v) && Boolean===v?.constructor;
a.b.num	= v => isO(v) && Number===v?.constructor;
a.b.str	= v => isO(v) && String===v?.constructor;
a.c.nan	= v => Number.isNaN(v);
a.c.nul	= v => null===v;
a.c.und	= v => undefined===v;
a.p.bln	= v => 'boolean'===typeof v;
a.p.num	= v => 'number'===typeof v;
a.p.str	= v => 'string'===typeof v;
a.p.big	= v => 'bigint'===typeof v;
a.p.sym	= v => 'symbol'===typeof v;
a.r.ary	= (v,...types) => {
    if (!types.every(t=>a.c(t) || isCls(t))) {throw new Error(`引数不正です。...typesの要素はNaN,null,undefined,コンストラクタ関数のいずれかであるべきです。`)}
    if (!Array.isArray(v)) return false;
    if (0===types.length) return true;
    return C ? v.every(x=>types.some(t=>(a.c(t) ? typof(t) : ([Boolean,Number,String.BigInt,Symbol].some(p=>p===t) ? t.name.toLowerCase() : t.name))===typof(x))) : true;
};
//a.r.ary	= v => Array.isArray(v);
/*
a.r.ary	= (v,C) => {
    if (undefined!==C && !isCls(C)) {throw new Error(`第二引数Cはコンストラクタ関数であるべきです。`)}
    if (!Array.isArray(v)) return false;
    return C ? v.every(x=>C.name.===typof(x)) : true;
};
a.r.ary	= (v,C) => {
    if (undefined!==C && !isCls(C)) {throw new Error(`...typesはコンストラクタ関数であるべきです。`)}
    if (!Array.isArray(v)) return false;
    if (0===types.length) return true;
    return v.every(x=>C.name.===typof(x));
    for (let T of types) {
        if (!isCls(T)) {throw new Error(`...typesはコンストラクタ関数であるべきです。`)}
        if ()
    }
};
a.r.ary	= (v,...types) => {
    if (!Array.isArray(v)) return false;
    if (0===types.length) return true;
    for (let T of types) {
        if (!isCls(T)) {throw new Error(`...typesはコンストラクタ関数であるべきです。`)}
        if ()
    }
}
*/
a.r.obj	= v => isO(v) && Object.prototype===Object.getPrototypeOf(v) && !a.r.des(v);
a.r.dic	= v => isO(v) && null===Object.getPrototypeOf(v);
a.r.dec	
a.r.cal	
a.r.cls	...types
a.r.ins	...types

a.p.bln.T	
a.p.bln.F	
a.p.num.inf	
a.p.num.unsafe	
a.p.num.dec	
a.p.num.int	
a.p.num.int.range	min,max
a.p.num.int.s	
a.p.num.int.u	
a.p.num.int.s.bit	bit
a.p.num.int.u.bit	bit
a.p.num.int.s8	
a.p.num.int.u8	
a.p.num.int.s16	
a.p.num.int.u16	
a.p.num.int.s32	
a.p.num.int.u32	
a.p.big.range	min,max
a.p.big.s	
a.p.big.u	
a.p.big.s.bit	bit
a.p.big.u.bit	bit
a.p.big.s64	
a.p.big.u64	
a.p.big.s128	
a.p.big.u128	
a.p.big.s256	
a.p.big.u256	

a.r.dec.dat	
a.r.dec.acc	
a.r.dec.dat.v	
a.r.dec.dat.fn	
a.r.dec.acc.g	
a.r.dec.acc.s	
a.r.dec.acc.gs	

a.r.cal.S	
a.r.cal.G	
a.r.cal.A	
a.r.cal.AG	

a.r.cal.fn	
a.r.cal.arrow	
a.r.cal.method	
a.r.cal.native	
a.r.cal.bound	

a.r.cal.fn.s	
a.r.cal.fn.a	
a.r.cal.fn.g	
a.r.cal.fn.ag	
a.r.cal.arrow.s	
a.r.cal.arrow.a	
a.r.cal.method.s	
a.r.cal.method.a	
a.r.cal.method.g	
a.r.cal.method.ag	

export {a};
