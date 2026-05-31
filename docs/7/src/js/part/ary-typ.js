import {a} from './a.js';
import {typOf} from './typof.js';
export class AryTyp {
	static valid(C) {
        if (a.r.ary(C)) {
            for (let c of C) {
                if (!a.r.ary(c) && !ConTyp.valid(c) && !CbFnTyp.valid(c)) return false;
                //if (!a.r.ary(c) && !ConTyp.valid(c) && !CbFnTyp.valid(c)) {throw new Error(`型は[Number]のような形式であるべきです。`)};
            }
            return true;
        } else {return false}
    }
//	static of(isThrow, v, ...types) {
//		if (!a.p.bln(isThrow)) {throw new Error(`isThrowは真偽値であるべきです。:${isThrow}`)}
	static of(v, C) {
        if (!this.valid(C)) {throw new Error(`型は[Number]や[a=>a.p]や[{name:String, age:a.p.num}]のような形式であるべきです。`)};
        if (!a.r.ary(v)) return false;
        if (a.r.ary(v[0]) && a.r.ary(C[0])) {return this.of(...v, ...C)}
        if (C.every(c=>ConTyp.valid(c) || CbFnTyp.valid(c) || ObjTyp.valid(c))) {
            const Rs = [];
            for (let T of this.#getTyp(C)) {
                const R = v.map(x=>T.of(x,c));
                Rs.push(R.every(r=>r));
            }
            return Rs.some(R=>R);
        } else {throw new Error(`型が不正です。`)}
	}
    static *#getTyp(C) {
        for (let c of C) {
            if (ConTyp.valid(c)) {yield ConTyp}
            else if (CbFnTyp.valid(c)) {yield CbFnTyp}
            else if (ObjTyp.valid(c)) {yield ObjTyp}
            else {throw new Error(`型が不正です。:${c}`)}
        }
    }
}

