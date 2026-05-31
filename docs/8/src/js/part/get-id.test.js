import { describe, test, expect } from 'bun:test';
import {getId} from './get-id.js';
describe('get-id.js', ()=>{
const des = {};
Object.defineProperty(des, 'v', {value:1});
Object.defineProperty(des, 'f', {value:()=>2});
Object.defineProperty(des, 'a', {get:()=>3,set:(v)=>3});
Object.defineProperty(des, 'g', {get:()=>4});
Object.defineProperty(des, 's', {set:(v)=>5});
class C {static sm(){} static *sgm(){} static async sam(){} static async *sagm(){} m(){} async am(){} *gm(){} async *agm(){}}
describe('getId()', ()=>{
test('exist', ()=>expect(getId).toBeInstanceOf(Function));
test('getId(0)', ()=>expect(getId(0)).toBe('p.num'));
test.each([
    [null,'',1].map(v=>[{constructor:v},'B']).flat(),
    [new Boolean(), 'b.bln'],
    [new Number(), 'b.num'],
    [new String(), 'b.str'],
    [NaN,'c.nan'],[null,'c.nul'],[undefined,'c.und'],
    [false,'p.bln'],[0,'p.num'],['','p.str'],[0n,'p.big'],[Symbol(),'p.sym'],
    [[], 'r.ary'], [new (class A extends Array{})(), 'r.ary'],
    [{}, 'r.obj'],
    [Object.create(null), 'r.dic'],
    [new Date(), 'r.ins'],[new (class C{})(), 'r.ins'],
    [Date,'r.cls'],[class C{},'r.cls'],
    [Object.getOwnPropertyDescriptor(des,'v'),'r.des.dat.v'],
    [Object.getOwnPropertyDescriptor(des,'f'),'r.des.dat.fn'],
    [Object.getOwnPropertyDescriptor(des,'a'),'r.des.acc.gs'],
    [Object.getOwnPropertyDescriptor(des,'g'),'r.des.acc.g'],
    [Object.getOwnPropertyDescriptor(des,'s'),'r.des.acc.s'],
    [new (class A extends Array{})(),'r.ary'], // Arrayは継承してもArray(ObjectでもInstance<A>でもない)
    [Object.create({}),'r.ins'], // r.objでない。Instance<Object>
    [new (class O extends Object{})(),'r.ins'],
    [new (class C{})(),'r.ins'],
    [new Date(),'r.ins'],
    [class C{}, 'r.cls'],
    [class c{}, 'r.cal.S'], // 名前の1字目が大文字でないため関数と判断する(BabelでES5化しても対応可能にすべく)
    [class{}, 'r.cal.S'], // 名前の1字目が大文字でないため関数と判断する(BabelでES5化しても対応可能にすべく)
    [()=>{}].map(v=>[v,'r.cal.arrow.S']).flat(),
    [async()=>{}].map(v=>[v,'r.cal.arrow.A']).flat(),
    [function(){}].map(v=>[v,'r.cal.fn.S']).flat(),
    [function*(){}].map(v=>[v,'r.cal.fn.G']).flat(),
    [async function*(){}].map(v=>[v,'r.cal.fn.AG']).flat(),
    [Array.prototype.map].map(v=>[v,'r.cal.native']).flat(),
    [(()=>{}).bind(null)].map(v=>[v,'r.cal.bound']).flat(),
    [C.sm].map(v=>[v,'r.cal.method.S']).flat(),
    [C.sam].map(v=>[v,'r.cal.method.A']).flat(),
    [C.sgm].map(v=>[v,'r.cal.method.G']).flat(),
    [C.sagm].map(v=>[v,'r.cal.method.AG']).flat(),
])('getId(%p)->%p', (v,E)=>expect(getId(v)).toBe(E));
    test.skip('(document.all)->"r.ins"(ブラウザでないとテストできない。Firefox142で確認済み)',()=>expect(getId(document.all)).toBe('r.ins'));
});
});
