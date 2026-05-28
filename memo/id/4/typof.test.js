import { describe, test, expect } from 'bun:test';
import {typof} from './typof.js';
describe('typof.js', ()=>{
const des = {};
Object.defineProperty(des, 'v', {value:1});
Object.defineProperty(des, 'fn', {value:()=>2});
Object.defineProperty(des, 'gs', {get:()=>3,set:(v)=>3});
Object.defineProperty(des, 'g', {get:()=>4});
Object.defineProperty(des, 's', {set:(v)=>5});
class C {static sm(){} static *sgm(){} static async sam(){} static async *sagm(){} m(){} async am(){} *gm(){} async *agm(){}}
describe('typof()', ()=>{
    test('exist',()=>expect(typof).toBeInstanceOf(Function))
    test('(0,a=>a.p.num)',()=>expect(typof(0,a=>a.p.num)).toBe(true))
    test.each([
        [null,undefined,'',1].map(v=>[{constructor:v}, a=>a.B]).flat(),
        [new Boolean(), a=>a.b.bln],
        [new Number(), a=>a.b.num],
        [new String(), a=>a.b.str],
        [NaN,a=>a.c.nan],[null,a=>a.c.nul],[undefined,a=>a.c.und],
        [false,a=>a.p.bln],[0,a=>a.p.num],['',a=>a.p.str],[0n,a=>a.p.big],[Symbol(),a=>a.p.sym],
        [[],new (class A extends Array{})()].map(v=>[v, a=>a.r.ary]).flat(),
        [{}].map(v=>[v, a=>a.r.obj]).flat(),
        [Object.create(null)].map(v=>[v, a=>a.r.dic]).flat(),
        [new Date()].map(v=>[v, a=>a.r.ins]).flat(),
        [Date, class C{}].map(v=>[v, a=>a.r.cls]).flat(),
        'v fn'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(des,v), a=>a.r.des.dat[v]]).flat(),
        'gs g s'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(des,v), a=>a.r.des.acc[v]]).flat(),
        [new (class A extends Array{})(),a=>a.r.ary], // Arrayは継承してもArray(ObjectでもInstance<A>でもない)
        [Object.create({}),a=>a.r.ins], // r.objでない。Instance<Object>
        [new (class O extends Object{})(),a=>a.r.ins],
        [new (class C{})(),a=>a.r.ins],
        [new Date(),a=>a.r.ins],
        [class C{}, a=>a.r.cls],
        [class c{}, a=>a.r.cal.S], // 名前の1字目が大文字でないため関数と判断する(BabelでES5化しても対応可能にすべく)
        [class{}, a=>a.r.cal.S], // 名前の1字目が大文字でないため関数と判断する(BabelでES5化しても対応可能にすべく)
        [()=>{}].map(v=>[v,a=>a.r.cal.arrow.S]).flat(),
        [async()=>{}].map(v=>[v,a=>a.r.cal.arrow.A]).flat(),
        [function(){}].map(v=>[v,a=>a.r.cal.fn.S]).flat(),
        [function*(){}].map(v=>[v,a=>a.r.cal.fn.G]).flat(),
        [async function*(){}].map(v=>[v,a=>a.r.cal.fn.AG]).flat(),
        [Array.prototype.map].map(v=>[v,a=>a.r.cal.native]).flat(),
        [(()=>{}).bind(null)].map(v=>[v,a=>a.r.cal.bound]).flat(),
        [C.sm].map(v=>[v,a=>a.r.cal.method.S]).flat(),
        [C.sam].map(v=>[v,a=>a.r.cal.method.A]).flat(),
        [C.sgm].map(v=>[v,a=>a.r.cal.method.G]).flat(),
        [C.sagm].map(v=>[v,a=>a.r.cal.method.AG]).flat(),
    ])('(%p)->T',(v,a)=>expect(typof(v,a)).toBe(true));
    test.skip('(document.all)->"r.ins"(ブラウザでないとテストできない。Firefox142で確認済み)',()=>expect(typof(document.all,a=>a.r.ins)).toBe(true));
});
});

