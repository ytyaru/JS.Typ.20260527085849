import {a} from './part/a.js';
import {getFORL} from './part/forl.js';
import {getId} from './part/get-id.js';
import {typOf} from './part/typof.js';
import {ConTyp} from './part/con-typ.js';
export class Typ {
    static id(...v) {
        if (v.length<1) {throw new Error(`引数不足。引数は判定対象値が必要です。`)}
        return getId(v[0]);
    }
    static of(...args) {return Typ.#of(false, ...args)}
    static throw(...args) {return Typ.#of(true, ...args)}
    static #of(isThrow, ...args) {
        if (args.length<2) {throw new Error(`引数不足。引数は判定対象値と期待型の二つ必要です。`)}
        return typOf(isThrow, ...args);
//        return ConTyp.is(args[1]) ? ConTyp.of(isThrow, ...args) : typOf(isThrow, ...args);
    }
}
