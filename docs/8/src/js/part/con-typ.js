import {a,getTag} from './a.js';
import {typOf} from './typof.js';
export class ConTyp {
	static valid(C) {
		if (Number.isNaN(C)) return true;
		else if ([null,undefined].some(x=>x===C)) return true;
		else if (a.r.cls(C)) return true;
		else return false;
	}
    static id(C) {
        if (!this.valid(C)) {throw new Error(`CはNaN,null,undefined,コンストラクタ関数のいずれかであるべきです。:${C}`)}
        return a.c(C) ? getTag(C) : C.name;
    }
	static of(isThrow, v, ...types) {
		if (!a.p.bln(isThrow)) {throw new Error(`isThrowは真偽値であるべきです。:${isThrow}`)}
		if (!types.every(T=>this.valid(T))) {throw new Error(`...typesはNaN,null,undefined,コンストラクタ関数のいずれかであるべきです。:${types}`)}
		const Ts = types.map(T=>this.#map.get(T));
		const cbs = Ts.filter(T=>T);
		const Cs = Ts.reduce((a,v,i)=>{if(!v){a.push(types[i])};return a;}, []);
//		console.log(cbs, Cs, typOf(isThrow, v, ...cbs.flat()), (0===Cs.length ? true : Cs.some(C=>v instanceof C)));
		const R = typOf(isThrow, v, ...cbs.flat());
		if (R || 0===Cs.length) return R;
		return Cs.some(C=>v instanceof C);
	}
	static #map = new Map([
		[NaN, [a=>a.c.nan]],	// === 比較でfalseになってしまうがMapは同一と判定される
		[null, [a=>a.c.nul]],
		[undefined, [a=>a.c.und]],
		[Boolean, [a=>a.p.bln]],
		[Number, [a=>a.p.num]],
		[String, [a=>a.p.str]],
		[BigInt, [a=>a.p.big]],
		[Symbol, [a=>a.p.sym]],
		[Array, [a=>a.r.ary]],
		[Object, [a=>a.r.obj, a=>a.r.dic, a=>a.r.des, a=>a.r.ins(Object), a=>a.B, a=>b]],
		[Function, [a=>a.r.cal]],
//		[Function, [a=>a.r.cal, a=>a.r.cls]],
	]);
}

