import {a} from './a.js';
import {typOf} from './typof.js';
export class ConTyp {
	static is(C) {
		if (Number.isNaN(C)) return true;
		else if ([null,undefined].some(x=>x===C)) return true;
		else if (a.r.cls(C) || a.r.cal.S(C)) return true;
		else return false;
	}
	static of(isThrow, v, C, ...args) {
		const A = this.#map.get(C) || Number.isNaN(C) ? a.c.nan : null;
		if (Array===C && 0<args.length) {
			const AS = this.#map.get(T) || Number.isNaN(C) ? a.c.nan : null;
//			if (AS) {return Typ.of(v, ...AS)}
			if (A) {return typOf(isThrow, v, A)}
			else {
				if (!a.r.ary(v)) return false;
				if (a.r.cls(C)) return v.every(x=>x instanceof C);
				throw new Error(`Cはクラス(コンストラクタ関数)であるべきです。`);
			}
		}
//		if (as) {return Typ.of(v, ...as, T)}
		if (a) {return typOf(isThrow, v, a, ...args)}
		else {
			if (a.r.cls(C)) return v instanceof C;
			throw new Error(`Cはクラス(コンストラクタ関数)であるべきです。`);
		}
		throw new Error(`Implementation Error.`);
	}
	static #map = new Map([
	//	[NaN, [a=>a.c.nan]],	// === 比較でfalseになってしまうためここに入れられない
		[null, a=>a.c.null],
		[undefined, a=>a.c.und],
		[Boolean, a=>a.p.bln],
		[Number, a=>a.p.num],
		[String, a=>a.p.str],
		[BigInt, a=>a.p.big],
		[Symbol, a=>a.p.sym],
		[Array, a=>a.r.ary],
		[Object, a=>a.p.obj],
//		[Function, a=>a.r.cls(v), a.r.cal(v)], // 'function'===typeof vでやるためここには入れられない
		[Function, a=>a.r.cal(v)],
	]);
}

