import { describe, test, expect } from 'bun:test';
import {getTag} from './x.js';
describe('x.js', ()=>{
const des = {};
Object.defineProperty(des, 'v', {value:1});
Object.defineProperty(des, 'f', {value:()=>2});
Object.defineProperty(des, 'a', {get:()=>3,set:(v)=>3});
Object.defineProperty(des, 'g', {get:()=>4});
Object.defineProperty(des, 's', {set:(v)=>5});
describe('getTag()', ()=>{
test('exist', ()=>expect(getTag).toBeInstanceOf(Function));
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

});
});
