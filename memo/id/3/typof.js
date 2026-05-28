
const getPropByPath = (obj, path) => path.split('.').reduce((o,k) => o?.[k], obj);
export typof = (v,...cbs) => {
    const F = getFORL();
    const forls = cbs.map(cb=>cb(F));
    const tests = forls.map(f=>getPropByPath(f.$.path));
    const Rs = [];
    for (let forl of forls) {
        if (!f?.$?.path) {throw new Error(`第二引数以降はa=>a.p.numなどであるべきです。`)}
        const test = getPropByPath(a, f.$.path);
        if ('function'!==typeof test) {throw new Error(`存在しない型です。:${f.$.path}`)}
        const R = test(v);
        if ('boolean'!==typeof test) {throw new Error(`不正な判定関数です。戻り値は真偽値であるべきです。`)}
        Rs.push(R);
    }
    return Rs.some(R=>R);
};
