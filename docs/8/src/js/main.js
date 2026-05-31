import {a} from './part/a.js';
import {getFORL} from './part/forl.js';
import {getId} from './part/get-id.js';
import {typOf} from './part/typof.js';
import {ConTyp} from './part/con-typ.js';
import {ForlTyp} from './part/forl-typ.js';
import {AryTyp} from './part/ary-typ.js';
import {ObjTyp} from './part/obj-typ.js';
export class Typ {
    static id(...v) {
        if (v.length<1) {throw new Error(`引数不足。引数は判定対象値が必要です。`)}
        return getId(v[0]);
    }
    static of(...args) {return Typ.#of(false, ...args)}
    static throw(...args) {return Typ.#of(true, ...args)}
    static #of(isThrow, ...args) {
        if (args.length<2) {throw new Error(`引数不足。引数は判定対象値と期待型の二つ必要です。`)}
//        return typOf(isThrow, ...args);
//        return ConTyp.is(args[1]) ? ConTyp.of(isThrow, ...args) : typOf(isThrow, ...args);
        const R = [];
        for (let [T,c] of this.#getTyp(args.slice(1))) {
            R.push(T.of(args[0], c));
        }
        return R.some(r=>r);
    }
    static #Ts = [ConTyp,FolrTyp,AryTyp,ObjTyp];
    static *#getTyp(C) {
        for (let c of C) {
            const T = Ts.find(T=>T.valid(c));
            if (!T) {throw new Error(`型指定子が不正です。:${c}`)}
            yield [T,c];
        }
    }
    static #res(isThrow, R) {
        if (isThrow && !R) {
            const expected = cbs.join(',');
            throw new TypeError(`値が期待する型と違います。期待:${res.forls.map(f=>f.$.path).join(',')}, 実際:${getId(v, a.r.ins(v) ? v.constructor : (a.r.cls(v) ? v : undefined))}`)
        }
        return R;
    }
}
