import {a} from './a.js';
import {getFORL} from './forl.js';
import {getId} from './get-id.js';
export class ForlTyp {
    static valid(cb) {return a.r.cal.s(cb) && !a.r.cls(cb)}
    static id(cb) {
        if (!a.r.cal.s(cb)) {throw new Error(`引数不正。a=>a.pなどのコールバック関数であるべきです。`)}
        const f = cb(getFORL());
        const test = this.#getPropByPath(a, f.$.path);
        if (!a.r.cal.s(test)) {throw new Error(`存在しない型です。:${f.$.path}`)}
        return f.$.path;
    }
    static of(v, ...cbs) {
        const res = this.#getForls(v, ...cbs);
        return this.#getNestRes(res);
        /*
        const R = this.#getNestRes(res);
        if (isThrow && !R) {
            const expected = cbs.join(',');
            throw new TypeError(`値が期待する型と違います。期待:${res.forls.map(f=>f.$.path).join(',')}, 実際:${getId(v, a.r.ins(v) ? v.constructor : (a.r.cls(v) ? v : undefined))}`)
        }
        return R;
        */
    }
    static #getForl(v, ...cbs) {
        const res = {forls:null, result:null, children:null};
        if (!cbs.every(cb=>'function'===typeof cb)) {throw new Error(`引数不正。第二引数以降はa=>a.pなどのコールバック関数であるべきです。`)}
        res.forls = cbs.map(cb=>cb(getFORL()));
        const Rs = [];
        for (let f of res.forls) {
            if (!a.p.str(f?.$?.path)) {throw new Error(`引数不正。第二引数以降はa=>a.pなどのコールバック関数であるべきです。`)}
            const test = this.#getPropByPath(a, f.$.path);
            if ('function'!==typeof test) {throw new Error(`存在しない型です。:${f.$.path}`)}
            //const R = test(v);
            //const R = test(v, f.$.args);
            const R = f.$.args ? test(v, ...f.$.args) : test(v);
            if ('boolean'!==typeof R) {throw new Error(`不正な判定関数です。戻り値は真偽値であるべきです。`)}
            if ('r.ary'===f.$.path && f.$.args) {res.children = v.map(x=>getForls(x, ...f.$.args))};
            Rs.push(R);
        }
        res.result = Rs.some(R=>R);
        return res;
    }
    static #getPropByPath(obj, path){return path.split('.').reduce((o,k) => o?.[k], obj)}
    static #getNestRes(res) {
        if (false===res.result) return false;
        if (res.children) {if (res.children.find(c=>false===getNestRes(c))) return false;}
        return true;
    }
}

