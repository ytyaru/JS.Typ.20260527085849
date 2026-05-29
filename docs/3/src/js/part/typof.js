import {a} from './a.js';
import {getFORL} from './forl.js';
import {getId} from './get-id.js';
const getPropByPath = (obj, path) => path.split('.').reduce((o,k) => o?.[k], obj);
export const typOf = (isThrow, v,...cbs) => {
    if (!cbs.every(cb=>'function'===typeof cb)) {throw new Error(`引数不正。第二引数以降はa=>a.pなどのコールバック関数であるべきです。`)}
    const F = getFORL();
    const forls = cbs.map(cb=>cb(F));
    const Rs = [];
    for (let f of forls) {
        if (!a.p.str(f?.$?.path)) {throw new Error(`引数不正。第二引数以降はa=>a.pなどのコールバック関数であるべきです。`)}
        const test = getPropByPath(a, f.$.path);
        if ('function'!==typeof test) {throw new Error(`存在しない型です。:${f.$.path}`)}
        //const R = test(v);
        //const R = test(v, f.$.args);
        const R = f.$.args ? test(v, ...f.$.args) : test(v);
        if ('boolean'!==typeof R) {throw new Error(`不正な判定関数です。戻り値は真偽値であるべきです。`)}
        Rs.push(R);
    }
    const R = Rs.some(R=>R);
    if (isThrow && !R) {throw new TypeError(`値が期待する型と違います。期待:${forls.map(f=>f.$.path).join(',')}, 実際:${getId(v, a.r.ins(v) ? v.constructor : (a.r.cls(v) ? v : undefined))}`)}
    return R;
//    return Rs.some(R=>R);
};
