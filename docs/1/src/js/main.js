import {a} from './part/a.js';
import {getFORL} from './part/forl.js';
import {getId} from './part/get-id.js';
import {typOf} from './part/typof.js';
const ins = {b:null, e:null}; // b:bool, e:error
const NB = Symbol('NewBlock');
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
    }
    static get b() {return this.#get('b')}
    static get e() {return this.#get('e')}
    static #get(n) {
        if (!['b','e'].some(x=>x===n)) {throw new Error(`Implementation Error.`)}
        if (!ins[n]) {ins[n]=new Typ(NB, 'e'===n);}
        return ins[n];
    }
    constructor(block, isThrow=false) {
        if (NB!==block) {throw new Error(`new禁止`)}
        this._={isThrow}
        if (!a.p.bln(isThrow)) {throw new Error(`isThrowは真偽値であるべきです。:${isThrow}`)}
    }
    of(...args) {return Typ.#of(this._.isThrow, ...args)}
}
