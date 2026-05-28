import { describe, test, expect } from 'bun:test';
import {getId} from './typid.js';
describe('typid.js', ()=>{
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
    [null,'',1].flatMap(v=>[{constructor:v},'B']),
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
    [()=>{}].flatMap(v=>[v,'r.cal.arrow.S']),
    [async()=>{}].flatMap(v=>[v,'r.cal.arrow.A']),
    [function(){}].flatMap(v=>[v,'r.cal.fn.S']),
    [function*(){}].flatMap(v=>[v,'r.cal.fn.G']),
    [async function*(){}].flatMap(v=>[v,'r.cal.fn.AG']),
    [Array.prototype.map].flatMap(v=>[v,'r.cal.native']),
    [(()=>{}).bind(null)].flatMap(v=>[v,'r.cal.bound']),
    [C.sm].flatMap(v=>[v,'r.cal.method.S']),
    [C.sam].flatMap(v=>[v,'r.cal.method.A']),
    [C.sgm].flatMap(v=>[v,'r.cal.method.G']),
    [C.sagm].flatMap(v=>[v,'r.cal.method.AG']),
])('getId(%p)->%p', (v,E)=>expect(getId(v)).toBe(E));
/*
test.each([
    [NaN,'NaN'],[null,'Null'],[undefined,'Undefined'],
    [false,'Boolean'],[0,'Number'],['','String'],[0n, 'BigInt'],[Symbol(),'Symbol'],
    [Boolean,Number,String].flatMap(C=>[new C(), `BoxedPrimitive<${C.name}>`]),
    [{},'Object'],[[],'Array'],
    [Object.create(null),'Dictionary'],
    [Object.getOwnPropertyDescriptor(des,'v'),'Descriptor.Data.Value'],
    [Object.getOwnPropertyDescriptor(des,'f'),'Descriptor.Data.Function'],
    [Object.getOwnPropertyDescriptor(des,'a'),'Descriptor.Accessor.GetterSetter'],
    [Object.getOwnPropertyDescriptor(des,'g'),'Descriptor.Accessor.Getter'],
    [Object.getOwnPropertyDescriptor(des,'s'),'Descriptor.Accessor.Setter'],
    [null,'',1].flatMap(v=>[{constructor:v},'BlokenObject']),
    [new (class A extends Array{})(),'Array'], // Arrayは継承してもArray(ObjectでもInstance<A>でもない)
    [Object.create({}),'Instance<Object>'],
    [new (class O extends Object{})(),'Instance<O>'],
    [new (class C{})(),'Instance<C>'],
    [new Date(),'Instance<Date>'],
    [class C{}, 'Class<C>'],
    [class{}, 'Function'], // 名前の1字目が大文字でないため関数と判断する(BabelでES5化しても対応可能にすべく)
    [()=>{}, function(){}].flatMap(v=>[v,'Function']),
    [async()=>{}, async function(){}].flatMap(v=>[v,'AsyncFunction']),
    [function*(){}].flatMap(v=>[v,'GeneratorFunction']),
    [async function*(){}].flatMap(v=>[v,'AsyncGeneratorFunction']),
])('getTag()', (v,C)=>{
    expect(getTag(v)).toBe(C);
});
*/
});
});
