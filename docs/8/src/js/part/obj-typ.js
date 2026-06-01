import {a} from './a.js';
import {typOf} from './typof.js';
import {ConTyp} from './con-typ.js';
import {ForlTyp} from './forl-typ.js';
import {AryTyp} from './ary-typ.js';
export class ObjTyp {
	static valid(C) {return a.r.obj(C) || a.r.des(C)}
//	static of(isThrow, v, ...types) {
//		if (!a.p.bln(isThrow)) {throw new Error(`isThrowは真偽値であるべきです。:${isThrow}`)}
    static id(C) {
        if (!a.r.obj(C)) {throw new Error(`引数不正。Objectであるべきです。`)}
        // 再帰処理でキーの値が型を示しているか判定する
        return C.toString();
    }
	static of(isThrow, v, C) {
		if (!a.p.bln(isThrow)) {throw new Error(`isThrowは真偽値であるべきです。:${isThrow}`)}
        if (!this.valid(C)) {throw new Error(`型は[Number]や[a=>a.p]や[{name:String, age:a.p.num}]のような形式であるべきです。`)};
        if (!a.r.obj(v)) return false;
        const R = {res:[], children:null};
        for (let [k,v] of Object.entries(C)) {
            if (a.r.obj(v) || a.r.des(v)) {R.children = this.of(v, C[k])}
//            if (!ConTyp.valid(v) && !ForlTyp.valid(v) && !AryTyp.valid(v)) {throw new Error(`型指定子が不正です。`)}
            const [T,c] = this.#getTyp(C[k]);
            if (!(k in v)) {throw new TypeError(`値は型指定されたキーを持っていません。:key:${k}, v:${v}`)}
            const R = T.of(v[k], c);
            if (isThrow && !R) {throw new TypeError(`値のプロパティ${k}は期待された型と違います。期待:${T.id(c)}, 実際:${getId(v[k])}`)}
            R.res.push(R);
        }
	}
    static *#getTyp(C) {
        for (let c of C) {
            if (ConTyp.valid(c)) {yield ConTyp}
            else if (ForlTyp.valid(c)) {yield ForlTyp}
            else if (ObjTyp.valid(c)) {yield ObjTyp}
            else {throw new Error(`型指定子が不正です。:${c}`)}
        }
    }
}

