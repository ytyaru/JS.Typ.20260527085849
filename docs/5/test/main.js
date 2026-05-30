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
    describe('UT', ()=>{
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
        });
    });
    describe('IT', ()=>{
        class A extends Array{}
        class O extends Object{}
        const des = {};
        Object.defineProperty(des, 'v', {value:1});
        Object.defineProperty(des, 'fn', {value:()=>2});
        Object.defineProperty(des, 'gs', {get:()=>3,set:(v)=>3});
        Object.defineProperty(des, 'g', {get:()=>4});
        Object.defineProperty(des, 's', {set:(v)=>5});
        class C {
            static sm(){}
            static *sgm(){}
            static async sam(){}
            static async *sagm(){}
            static get sg() {}
            static set ss(v) {}
            static get sgs() {}
            static set sgs(v) {}
            m(){} async am(){}
            *gm(){}
            async *agm(){}
            get g() {}
            set s(v) {}
            get gs() {}
            set gs(v) {}
        }
        const c = new C();
        describe('Typ.id', ()=>{
            test.each([
                ...[null,'',1].map(v=>[{constructor:v},'B']),
                [new Boolean(), 'b.bln'],
                [new Number(), 'b.num'],
                [new String(), 'b.str'],
                [NaN,'c.nan'],[null,'c.nul'],[undefined,'c.und'],
                [false,'p.bln'],[0,'p.num'],['','p.str'],[0n,'p.big'],[Symbol(),'p.sym'],
                ...[[],new A()].map(v=>[v,'r.ary']),
                [[],'r.ary'],
                [[0,1],'r.ary(p.num)'],
                [[0,''],'r.ary'],
                [[[]],'r.ary(r.ary)'],
                [[[[]]],'r.ary(r.ary(r.ary))'],
                [[[0,1]],'r.ary(r.ary(p.num))'],
                [[[0,'1']],'r.ary(r.ary)'],
                [{}, 'r.obj'],
                [Object.create(null), 'r.dic'],
                [new Date(), 'r.ins(Date)'],[new (class C{})(), 'r.ins(C)'],
                [Date,'r.cls(Date)'],[class C{},'r.cls(C)'],
                // Object Descriptor
                ...'v fn gs g s'.split(' ').map(n=>[Object.getOwnPropertyDescriptor(des,n),`r.des.${'v fn'.split(' ').some(x=>x===n) ? 'dat' : 'acc'}.${n}`]),
                // Class Descriptor
                ...'gs g s'.split(' ').map(n=>[Object.getOwnPropertyDescriptor(C,'s'+n),`r.des.${'v fn'.split(' ').some(x=>x===n) ? 'dat' : 'acc'}.${n}`]),
                // Instance Descriptor
                ...'gs g s'.split(' ').map(n=>[Object.getOwnPropertyDescriptor(C.prototype,n),`r.des.${'v fn'.split(' ').some(x=>x===n) ? 'dat' : 'acc'}.${n}`]),
                // Arrayは継承してもArray(ObjectでもInstance<A>でもない)
                [new A(),'r.ary'],
                [[0,1,-1,0.1,Infinity],'r.ary(p.num)'],
                [Object.create({}),'r.ins(Object)'], // r.objでない。Instance<Object>
                [new O(),'r.ins(O)'], // r.objでない。Instance<O>
                [new C(),'r.ins(C)'],
                [new Date(),'r.ins(Date)'],
//                [C,'r.ins(C)'],
                [class MyClass{}, 'r.cls(MyClass)'],
                // 名前の1字目が大文字でないため関数と判断する(BabelでES5化しても対応可能にすべく)
                ...[(class c{}), (class{})].map(v=>[v,'r.cal.S']),
                ...[()=>{}].map(v=>[v,'r.cal.arrow.S']),
                ...[async()=>{}].map(v=>[v,'r.cal.arrow.A']),
                ...[function(){}].map(v=>[v,'r.cal.fn.S']),
                ...[function*(){}].map(v=>[v,'r.cal.fn.G']),
                ...[async function*(){}].map(v=>[v,'r.cal.fn.AG']),
                ...[Array.prototype.map].map(v=>[v,'r.cal.native']),
                ...[(()=>{}).bind(null)].map(v=>[v,'r.cal.bound']),
                ...[C.sm,c.m].map(v=>[v,'r.cal.method.S']),
                ...[C.sam,c.am].map(v=>[v,'r.cal.method.A']),
                ...[C.sgm,c.gm].map(v=>[v,'r.cal.method.G']),
                ...[C.sagm,c.agm].map(v=>[v,'r.cal.method.AG']),
            ])('(%p)->%p', (v,E)=>expect(Typ.id(v)).toBe(E));
            test.skip('(document.all)->"r.ins"(ブラウザでないとテストできない。Firefox142で確認済み)',()=>expect(Typ.id(document.all)).toBe('r.ins'));
        });
        describe('Typ.of', ()=>{
            test.each([[0,1],[0,null],[0,undefined],[0,()=>1],[0,()=>({})],[0,()=>({$:{path:1}})]])('(%p,%p)->E',(v,a)=>terr(()=>Typ.of(v,a), Error, `引数不正。第二引数以降はa=>a.pなどのコールバック関数であるべきです。`));
            test.each([[0,()=>({$:{path:'存在しないパス'}})]])('(%p,%p)->E',(v,a)=>terr(()=>Typ.of(v,a), Error, `存在しない型です。:存在しないパス`));
            test.each([
                ...[null,undefined,'',1].map(v=>[{constructor:v}, a=>a.B]),
                [new Boolean(), a=>a.b.bln],
                [new Number(), a=>a.b.num],
                [new String(), a=>a.b.str],
                [NaN,a=>a.c.nan],[null,a=>a.c.nul],[undefined,a=>a.c.und],
                [false,a=>a.p.bln],[0,a=>a.p.num],['',a=>a.p.str],[0n,a=>a.p.big],[Symbol(),a=>a.p.sym],
                ...[[],new A()].map(v=>[v, a=>a.r.ary]),
                ...[{}].map(v=>[v, a=>a.r.obj]),
                ...[Object.create(null)].map(v=>[v, a=>a.r.dic]),
                ...[new Date()].map(v=>[v, a=>a.r.ins]),
                ...[Date, class C{}].map(v=>[v, a=>a.r.cls]),
                ...'v fn'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(des,v), a=>a.r.des.dat[v]]),
                ...'gs g s'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(des,v), a=>a.r.des.acc[v]]),
                ...'gs g s'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(C,'s'+v), a=>a.r.des.acc[v]]),
                ...'gs g s'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(C.prototype,v), a=>a.r.des.acc[v]]),
                // Arrayは継承してもArray(ObjectでもInstance<A>でもない)
                [new A(),a=>a.r.ary], 
                [new A(),a=>a.r.ary(A)], 
                [[], a=>a.r.ary],
                [[0], a=>a.r.ary],
                [[0], a=>a.r.ary(a=>a.p.num)],
                [[0,1,-1,0.1,Infinity],a=>a.r.ary(a=>a.p.num)],
                [[[]], a=>a.r.ary(a=>a.r.ary)],
                [[[0]], a=>a.r.ary(a=>a.r.ary(a.p.num))],
                [[[0,'']], a=>a.r.ary(a=>a.r.ary)],
                [[[[]]], a=>a.r.ary(a=>a.r.ary(a=>a.r.ary))],
                [[[[0]]], a=>a.r.ary(a=>a.r.ary(a=>a.r.ary(a.p.num)))],
                [[0,'1'], a=>a.r.ary(a=>a.p.num, a=>a.p.str)],
                [[0,NaN], a=>a.r.ary(a=>a.p.num, a=>a.c.nan)],
                [['',null], a=>a.r.ary(a=>a.p.str, a=>a.c.nul)],
                [Object.create({}),a=>a.r.ins], // r.objでない。Instance<Object>
                [Object.create({}),a=>a.r.ins(Object)], // r.objでない。Instance<Object>
                [new O(),a=>a.r.ins], // r.objでない。Instance<O>
                [new O(),a=>a.r.ins(O)], // r.objでない。Instance<O>
                [new C(),a=>a.r.ins],
                [new C(),a=>a.r.ins(C)],
                [new Date(),a=>a.r.ins],
                [new Date(),a=>a.r.ins(Date)],
                [C, a=>a.r.cls],
                [C, a=>a.r.cls(C)],
                // 名前の1字目が大文字でないため関数と判断する(BabelでES5化しても対応可能にすべく)
                ...[class c{}, class{}].map(v=>[v,a=>a.r.cal.S]),
                ...[()=>{}].map(v=>[v,a=>a.r.cal.arrow.S]),
                ...[async()=>{}].map(v=>[v,a=>a.r.cal.arrow.A]),
                ...[function(){}].map(v=>[v,a=>a.r.cal.fn.S]),
                ...[function*(){}].map(v=>[v,a=>a.r.cal.fn.G]),
                ...[async function*(){}].map(v=>[v,a=>a.r.cal.fn.AG]),
                ...[Array.prototype.map].map(v=>[v,a=>a.r.cal.native]),
                ...[(()=>{}).bind(null)].map(v=>[v,a=>a.r.cal.bound]),
                ...[C.sm].map(v=>[v,a=>a.r.cal.method.S]),
                ...[C.sam].map(v=>[v,a=>a.r.cal.method.A]),
                ...[C.sgm].map(v=>[v,a=>a.r.cal.method.G]),
                ...[C.sagm].map(v=>[v,a=>a.r.cal.method.AG]),
            ])('(%p)->T',(v,a)=>expect(Typ.of(v,a)).toBe(true));
            test.skip('(document.all)->"r.ins"(ブラウザでないとテストできない。Firefox142で確認済み)',()=>expect(Typ.of(document.all,a=>a.r.ins)).toBe(true));
            test.each([
                ...[null,undefined,'',1].map(v=>[{constructor:v}, a=>a.r.obj]),
                [new Boolean(), a=>a.b.num],
                [new Number(), a=>a.b.str],
                [new String(), a=>a.b.bln],
                [NaN,a=>a.c.und],[null,a=>a.c.nan],[undefined,a=>a.c.nul],
                [false,a=>a.p.sym],[0,a=>a.p.bln],['',a=>a.p.num],[0n,a=>a.p.str],[Symbol(),a=>a.p.big],
                ...[[],new (class A extends Array{})()].map(v=>[v, a=>a.r.obj]),
                ...[{}].map(v=>[v, a=>a.r.ins]),
                ...[Object.create(null)].map(v=>[v, a=>a.r.obj]),
                ...[new Date()].map(v=>[v, a=>a.r.obj]),
                ...[Date, class C{}].map(v=>[v, a=>a.r.cal]),
                ...'v fn'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(des,v), a=>a.r.obj]),
                ...'gs g s'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(des,v), a=>a.r.obj]),
                [new (class A extends Array{})(),a=>a.r.ins], // Arrayは継承してもArray(ObjectでもInstance<A>でもない)
                [new (class A extends Array{})(),a=>a.r.ins(A)], // Arrayは継承してもArray(ObjectでもInstance<A>でもない)
                [[], a=>a.r.obj],
                [[], a=>a.r.ins],
                [[0], a=>a.r.ary(a=>a.p.str)],
                [[0,1,-1,0.1,Infinity],a=>a.r.ary(a=>a.p.str)],
                [[0,1,-1,0.1,''],a=>a.r.ary(a=>a.p.num)],
                [[0,1,-1,0.1,'1'],a=>a.r.ary(a=>a.p.num)],
                [[[]], a=>a.r.ary(a=>a.r.obj)],
                [[0], a=>a.r.ary(a=>a.p.str)],
                [[[0]], a=>a.r.ary(a=>a.r.ary(a=>a.p.str))],
                [Object.create({}),a=>a.r.obj], // r.objでない。Instance<Object>
                [new (class O extends Object{})(),a=>a.r.obj],
                [new C(),a=>a.r.obj],
                [new Date(),a=>a.r.obj],
                [C, a=>a.r.cal],
                [class MyClass{}, a=>a.r.cal],
                [class c{}, a=>a.r.cal.A], // 名前の1字目が大文字でないため関数と判断する(BabelでES5化しても対応可能にすべく)
                [class{}, a=>a.r.cal.G], // 名前の1字目が大文字でないため関数と判断する(BabelでES5化しても対応可能にすべく)
                ...[()=>{}].map(v=>[v,a=>a.r.cal.arrow.A]),
                ...[async()=>{}].map(v=>[v,a=>a.r.cal.arrow.S]),
                ...[function(){}].map(v=>[v,a=>a.r.cal.arrow.S]),
                ...[function*(){}].map(v=>[v,a=>a.r.cal.arrow]),
                ...[async function*(){}].map(v=>[v,a=>a.r.cal.arrow.A]),
                ...[Array.prototype.map].map(v=>[v,a=>a.r.cal.fn]),
                ...[(()=>{}).bind(null)].map(v=>[v,a=>a.r.cal.fn]),
                ...[C.sm].map(v=>[v,a=>a.r.cal.fn.S]),
                ...[C.sam].map(v=>[v,a=>a.r.cal.fn.A]),
                ...[C.sgm].map(v=>[v,a=>a.r.cal.fn.G]),
                ...[C.sagm].map(v=>[v,a=>a.r.cal.fn.AG]),
            ])('(%p)->F %p',(v,a)=>expect(Typ.of(v,a)).toBe(false));
        });
        describe('Typ.throw', ()=>{
            test.each([[0,1],[0,null],[0,undefined],[0,()=>1],[0,()=>({})],[0,()=>({$:{path:1}})]])('(%p,%p)->E',(v,a)=>terr(()=>Typ.throw(v,a), Error, `引数不正。第二引数以降はa=>a.pなどのコールバック関数であるべきです。`));
            test.each([[0,()=>({$:{path:'存在しないパス'}})]])('(%p,%p)->E',(v,a)=>terr(()=>Typ.throw(v,a), Error, `存在しない型です。:存在しないパス`));
            test.each([
                ...[null,undefined,'',1].map(v=>[{constructor:v}, a=>a.B]),
                [new Boolean(), a=>a.b.bln],
                [new Number(), a=>a.b.num],
                [new String(), a=>a.b.str],
                [NaN,a=>a.c.nan],[null,a=>a.c.nul],[undefined,a=>a.c.und],
                [false,a=>a.p.bln],[0,a=>a.p.num],['',a=>a.p.str],[0n,a=>a.p.big],[Symbol(),a=>a.p.sym],
                ...[[],new (class A extends Array{})()].map(v=>[v, a=>a.r.ary]),
                ...[{}].map(v=>[v, a=>a.r.obj]),
                ...[Object.create(null)].map(v=>[v, a=>a.r.dic]),
                ...[new Date()].map(v=>[v, a=>a.r.ins]),
                ...[Date, class C{}].map(v=>[v, a=>a.r.cls]),
                ...'v fn'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(des,v), a=>a.r.des.dat[v]]),
                ...'gs g s'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(des,v), a=>a.r.des.acc[v]]),
                ...'gs g s'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(C,'s'+v), a=>a.r.des.acc[v]]),
                ...'gs g s'.split(' ').map(v=>[Object.getOwnPropertyDescriptor(C.prototype,v), a=>a.r.des.acc[v]]),
                // Arrayは継承してもArray(ObjectでもInstance<A>でもない)
                [new (class A extends Array{})(),a=>a.r.ary], 
                [[0,1,-1,0.1,Infinity],a=>a.r.ary(a=>a.p.num)],
                [Object.create({}),a=>a.r.ins], // r.objでない。Instance<Object>
                [new (class O extends Object{})(),a=>a.r.ins], // r.objでない。Instance<O>
                [new (class C{})(),a=>a.r.ins],
                [new Date(),a=>a.r.ins],
                [class C{}, a=>a.r.cls],
                // 名前の1字目が大文字でないため関数と判断する(BabelでES5化しても対応可能にすべく)
                ...[class c{}, class{}].map(v=>[v,a=>a.r.cal.S]),
                ...[()=>{}].map(v=>[v,a=>a.r.cal.arrow.S]),
                ...[async()=>{}].map(v=>[v,a=>a.r.cal.arrow.A]),
                ...[function(){}].map(v=>[v,a=>a.r.cal.fn.S]),
                ...[function*(){}].map(v=>[v,a=>a.r.cal.fn.G]),
                ...[async function*(){}].map(v=>[v,a=>a.r.cal.fn.AG]),
                ...[Array.prototype.map].map(v=>[v,a=>a.r.cal.native]),
                ...[(()=>{}).bind(null)].map(v=>[v,a=>a.r.cal.bound]),
                ...[C.sm].map(v=>[v,a=>a.r.cal.method.S]),
                ...[C.sam].map(v=>[v,a=>a.r.cal.method.A]),
                ...[C.sgm].map(v=>[v,a=>a.r.cal.method.G]),
                ...[C.sagm].map(v=>[v,a=>a.r.cal.method.AG]),
            ])('(%p)->T',(v,a)=>expect(Typ.throw(v,a)).toBe(true));
            test.skip('(document.all)->"r.ins"(ブラウザでないとテストできない。Firefox142で確認済み)',()=>expect(Typ.throw(document.all,a=>a.r.ins)).toBe(true));
            test('(c,a=>a.r.obj)->E',()=>terr(()=>Typ.throw(c,a=>a.r.obj),TypeError,`値が期待する型と違います。期待:r.obj, 実際:r.ins(C)`));
        });
    });
    test('someTest',()=>expect(Typ.of([[]], a=>a.r.ary(a=>a.r.ary))).toBe(true));
});
