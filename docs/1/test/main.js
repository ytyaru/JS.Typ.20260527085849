import { describe, test, expect } from 'bun:test';
import {Typ} from '../src/js/main.js';
const terr = (T,E,M) => {
    try {
        T();
        expect.unreachable('例外発生すべき所で発生しなかった。');
    } catch (e) {
        expect(e).toBeInstanceOf(E);
        expect(e.message).toBe(M);
    }
}
describe('main.js', ()=>{
describe('Typ', ()=>{
    test('exist', ()=>expect(Typ).toBeDefined());
describe('.id', ()=>{
    test('exist', ()=>expect(Typ.id).toBeDefined());
    test('()', ()=>terr(()=>Typ.id(), Error, `引数不足。引数は判定対象値が必要です。`));
});
describe('.of', ()=>{
    test('exist', ()=>expect(Typ.of).toBeDefined());
    test('()', ()=>terr(()=>Typ.of(), Error, `引数不足。引数は判定対象値と期待型の二つ必要です。`));
    test('(0)', ()=>terr(()=>Typ.of(0), Error, `引数不足。引数は判定対象値と期待型の二つ必要です。`));
    test('(0,a=>a.p)->T', ()=>expect(Typ.of(0,a=>a.p)).toBe(true));
    test('(0,a=>a.r)->F', ()=>expect(Typ.of(0,a=>a.r)).toBe(false));
});
describe('.throw', ()=>{
    test('exist', ()=>expect(Typ.throw).toBeDefined());
    test('()', ()=>terr(()=>Typ.throw(), Error, `引数不足。引数は判定対象値と期待型の二つ必要です。`));
    test('(0)', ()=>terr(()=>Typ.throw(0), Error, `引数不足。引数は判定対象値と期待型の二つ必要です。`));
    test('(0,a=>a.p)->T', ()=>expect(Typ.throw(0,a=>a.p)).toBe(true));
    test('(0,a=>a.r)->E', ()=>terr(()=>Typ.throw(0,a=>a.r), TypeError, `値が期待する型と違います。期待:r, 実際:p.num`));
});
describe('.b', ()=>{
    test('exist', ()=>expect(Typ.b).toBeDefined());
    test('get', ()=>expect(Typ.b).toBeInstanceOf(Typ));
    test('._.isThrow=false', ()=>expect(Typ.b._.isThrow).toBe(false));
});
describe('.e', ()=>{
    test('exist', ()=>expect(Typ.e).toBeDefined());
    test('get', ()=>expect(Typ.e).toBeInstanceOf(Typ));
    test('._.isThrow=true', ()=>expect(Typ.e._.isThrow).toBe(true));
});
describe('constructor', ()=>{
    test('呼出禁止', ()=>terr(()=>new Typ(), Error, `new禁止`));
});
});
});
