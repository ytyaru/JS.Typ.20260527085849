import { describe, test, expect } from 'bun:test';
import {ConTyp} from '../../src/js/part/con-typ.js';
const terr = (T,E,M) => {
    try {
        T();
        expect.unreachable('例外発生すべき所で発生しなかった。');
    } catch (e) {
        expect(e).toBeInstanceOf(E);
        expect(e.message).toBe(M);
    }
}
class A extends Array{}
class O extends Object{}
class C {static get sg(){}};

describe('con-typ.js', ()=>{
    describe('ConTyp', ()=>{
        test('exist', ()=>expect(ConTyp).toBeDefined(ConTyp));
        describe('.valid', ()=>{
            test('exist', ()=>expect(ConTyp.valid).toBeInstanceOf(Function));
            test.each([
                NaN,null,undefined,
                Boolean,Number,String,BigInt,Symbol,
                Array,Object,Function,
                Date,RegExp,class C{},(function C(){}),
            ].map(v=>[v]))('(%p)->T',v=>expect(ConTyp.valid(v)).toBe(true));
            test.each([
                true,false,
                0,-1,0.1,Infinity,
                '','a',[],{},Object.create(null),new Date(),
                class{}, class c{}, 
                function(){}, function c(){}, async function C(){},
                a=>a,
            ].map(v=>[v]))('(%p)->F',v=>expect(ConTyp.valid(v)).toBe(false));
        });
        describe('.of', ()=>{
            test('exist', ()=>expect(ConTyp.of).toBeInstanceOf(Function));
            describe('Error', ()=>{
                test('isThrow',()=>terr(()=>ConTyp.of(0), Error, `isThrowは真偽値であるべきです。:0`));
                test('...types',()=>terr(()=>ConTyp.of(true,0,1), Error, `...typesはNaN,null,undefined,コンストラクタ関数のいずれかであるべきです。:1`));
            });
            describe('(T)', ()=>{
                test.each([NaN,null,undefined].map(v=>[v]))('(%p)->T',v=>expect(ConTyp.of(false,v,v)).toBe(true));
                test.each([false,true].map(v=>[v,Boolean]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true));
                test.each([0,-1,0.1,Infinity].map(v=>[v,Number]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true));
                test.each(['','a'].map(v=>[v,String]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true));
                test.each([0n,-1n,1n].map(v=>[v,BigInt]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true));
                test.each([Symbol(),Symbol('a'),Symbol.for('a')].map(v=>[v,Symbol]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true));
                test.each([[],[0],[0,1],[0,''],[[]],[[0]],new A()].map(v=>[v,Array]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true));
                test.each([{},Object.create(null)].map(v=>[v,Object]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true)); // a=>a.r.dic
                test.each([Object.getOwnPropertyDescriptor(C,'sg')].map(v=>[v,Object]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true)); // a=>a.r.des
                test.each([Object.create({})].map(v=>[v,Object]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true)); // a=>a.r.ins(Object)
                test.each([new O()].map(v=>[v,O]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true));
                test.each([new C()].map(v=>[v,C]))('(%p,C)->T',(v,C)=>expect(ConTyp.of(false,v,C)).toBe(true));
                test.each([Function,Date,class{},function(){},()=>{},C].map(v=>[v,C]))('(%p,Function)->T',(v,C)=>expect(ConTyp.of(false,v,Function)).toBe(true));
            });
            describe('(...Ts)', ()=>{
                test('(0,Number,String)->T',()=>expect(ConTyp.of(false,0,Number,String)).toBe(true));
                test('("",Number,String)->T',()=>expect(ConTyp.of(false,'',Number,String)).toBe(true));
                test('(0n,Number,String)->F',()=>expect(ConTyp.of(false,0n,Number,String)).toBe(false));
                test('(0,Number,NaN)->T',()=>expect(ConTyp.of(false,0,Number,NaN)).toBe(true));
                test('(NaN,Number,NaN)->T',()=>expect(ConTyp.of(false,NaN,Number,NaN)).toBe(true));
                test('("",Number,NaN)->T',()=>expect(ConTyp.of(false,'',Number,NaN)).toBe(false));
                test('("",String,null)->T',()=>expect(ConTyp.of(false,'',String,null)).toBe(true));
                test('(null,String,null)->T',()=>expect(ConTyp.of(false,null,String,null)).toBe(true));
                test('(0,String,null)->T',()=>expect(ConTyp.of(false,0,String,null)).toBe(false));
            });
        });
    });
});
