import { describe, test, expect } from 'bun:test';
import {getFORL} from './forl.js';
describe('forl.js',()=>{
describe('getFORL()',()=>{
    test('exist',()=>expect(getFORL).toBeDefined());
    test('function',()=>expect(getFORL).toBeInstanceOf(Function));
    test('return object',()=>expect(getFORL()).toBeInstanceOf(Object));
    test('return object.$',()=>expect(getFORL().$).toBeInstanceOf(Object));
    test('return object.$.path',()=>expect(typeof getFORL().$.path).toBe('string'));
    test('return object.$.args',()=>expect(getFORL().$.args).toBe(null));
    test('a.p',()=>{
        const a = getFORL();
        const callback = a => a.p;
        const r = callback(a);
        expect(r.$.path).toBe('p');
        expect(r.$.args).toBe(null);
    });
    test('a.p.num',()=>{
        const a = getFORL();
        const callback = a => a.p.num;
        const r = callback(a);
        expect(r.$.path).toBe('p.num');
        expect(r.$.args).toBe(null);
    });
    test('a.p.num.bit(8)',()=>{
        const a = getFORL();
        const callback = a => a.p.num.bit(8);
        const r = callback(a);
        expect(r.$.path).toBe('p.num.bit');
        expect(r.$.args).toBeInstanceOf(Array);
        expect(r.$.args.length).toBe(1);
        expect(r.$.args[0]).toBe(8);
    });
    test('a.p.num.range(0, 100)',()=>{
        const a = getFORL();
        const callback = a => a.p.num.range(0, 100);
        const r = callback(a);
        expect(r.$.path).toBe('p.num.range');
        expect(r.$.args).toBeInstanceOf(Array);
        expect(r.$.args.length).toBe(2);
        expect(r.$.args[0]).toBe(0);
        expect(r.$.args[1]).toBe(100);
    });




});
});
