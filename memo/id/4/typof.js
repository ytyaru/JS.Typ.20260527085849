import {a} from './a.js';
import {getFORL} from './forl.js';
const getPropByPath = (obj, path) => path.split('.').reduce((o,k) => o?.[k], obj);
export const typof = (v,...cbs) => {
    if (!cbs.every(cb=>'function'===typeof cb)) {throw new Error(`引数不正。第二引数以降はa=>a.pなどのコールバック関数であるべきです。:${cbs}`)}
    const F = getFORL();
    const forls = cbs.map(cb=>cb(F));
    const tests = forls.map(f=>getPropByPath(a,f.$.path));
    const Rs = [];
    for (let f of forls) {
        if (!f?.$?.path) {throw new Error(`第二引数以降はa=>a.p.numなどであるべきです。`)}
        const test = getPropByPath(a, f.$.path);
        if ('function'!==typeof test) {throw new Error(`存在しない型です。:${f.$.path}`)}
        const R = test(v);
        if ('boolean'!==typeof R) {throw new Error(`不正な判定関数です。戻り値は真偽値であるべきです。`)}
        Rs.push(R);
    }
    return Rs.some(R=>R);
};
