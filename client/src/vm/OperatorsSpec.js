const Operators = require('./Operators');
const OConfig   = require('./../manager/plugins/organisms/Config');
const Helper    = require('./../../../common/src/Helper');

describe("client/src/vm/Operators", () => {
    const h = Helper.toHexNum;
    let   cbpv;
    let   ccb;
    let   ops;
    let   offs;
    let   vars;

    beforeAll (() => {
        cbpv = OConfig.codeBitsPerVar;
        OConfig.codeBitsPerVar = 2;
        ccb = OConfig.codeConstBits;
        OConfig.codeConstBits  = 3;
        Operators.compile();
    });
    afterAll(() => {
        OConfig.codeBitsPerVar = cbpv;
        OConfig.codeConstBits  = ccb;
    });
    beforeEach(() => {
        vars = [0,1,2,3];
        offs = new Array(10);
        ops  = new Operators(offs, vars);
    });
    afterEach (() => {
        ops.destroy();
        ops  = null;
        offs = null;
        vars = null;
    });

    describe('Creation and destroy', () => {
        it('Checks creation', () => {
            expect(ops.offs).toEqual(offs);
            expect(ops.vars).toEqual(vars);
            expect(Array.isArray(ops.stack)).toEqual(true);
            expect(Array.isArray(ops.funcs)).toEqual(true);
            expect(Object.keys(ops.operators).length > 0).toEqual(true);
        });

        it('Checks simple destroy', () => {
            const ops2  = new Operators(offs, vars);
            const offs2 = offs;
            const vars2 = vars;
            expect(ops2.offs).toEqual(offs);
            expect(ops2.vars).toEqual(vars);
            expect(Array.isArray(ops2.stack)).toEqual(true);
            expect(Array.isArray(ops2.funcs)).toEqual(true);
            expect(Object.keys(ops.operators).length > 0).toEqual(true);
            ops2.destroy();
            expect(ops2.offs).toEqual(null);
            expect(ops2.vars).toEqual(null);
            expect(ops2.stack).toEqual(null);
            expect(ops2.funcs).toEqual(null);
            expect(ops2.operators).toEqual(null);
            expect(offs2).toEqual(offs);
            expect(vars2).toEqual(vars);
        });
    });

    describe('var', () => {
        it('Checks v0=v1', () => {
            expect(ops.operators[h('100000 00 01')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([1,1,2,3]);
        });
        it('Checks v0=v0', () => {
            expect(ops.operators[h('100000 00 00')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,1,2,3]);
        });
        it('Checks v0=v3', () => {
            expect(ops.operators[h('100000 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([3,1,2,3]);
        });
        it('Checks v3=v3', () => {
            expect(ops.operators[h('100000 11 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,1,2,3]);
        });
        it('Checks correct line return', () => {
            expect(ops.operators[h('100000 11 11')].call(ops, 0)).toEqual(1);
            expect(ops.operators[h('100000 11 01')].call(ops, 1)).toEqual(2);
            expect(ops.operators[h('100000 01 11')].call(ops, 100)).toEqual(101);
        });
        describe('var', () => {
            let bpv;
            let ops;
            let vars;
            let offs;
            beforeAll (() => {
                bpv  = OConfig.codeBitsPerVar;
                OConfig.codeBitsPerVar = 3;
                Operators.compile();
            });
            afterAll  (() => Operators.compile());
            beforeEach(() => {
                vars = [0,1,2,3,4,5,6,7];
                offs = new Array(10);
                ops  = new Operators(offs, vars);
            });
            afterEach (() => {
                ops.destroy();
                ops  = null;
                offs = null;
                vars = null;
                OConfig.codeBitsPerVar = bpv;
            });

            it('Checks v0=v1', () => {
                expect(ops.operators[h('100000 000 001')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([1,1,2,3,4,5,6,7]);
            });
            it('Checks v0=v0', () => {
                expect(ops.operators[h('100000 000 000')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,1,2,3,4,5,6,7]);
            });
            it('Checks v0=v3', () => {
                expect(ops.operators[h('100000 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([3,1,2,3,4,5,6,7]);
            });
            it('Checks v7=v7', () => {
                expect(ops.operators[h('100000 111 111')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,1,2,3,4,5,6,7]);
            });
            it('Checks correct line return', () => {
                expect(ops.operators[h('100000 011 011')].call(ops, 0)).toEqual(1);
                expect(ops.operators[h('100000 011 001')].call(ops, 1)).toEqual(2);
                expect(ops.operators[h('100000 001 011')].call(ops, 100)).toEqual(101);
            });
        });
    });

    describe('const', () => {
        it('Checks v0=1', () => {
            expect(ops.operators[h('100001 00')].call(ops, 0, h('100001 00 001 000000000000000000000'))).toEqual(1);
            expect(ops.vars).toEqual([1,1,2,3]);
        });
        it('Checks v0=0', () => {
            expect(ops.operators[h('100001 00')].call(ops, 0, h('100001 00 000 000000000000000000000'))).toEqual(1);
            expect(ops.vars).toEqual([0,1,2,3]);
        });
        it('Checks v0=3', () => {
            expect(ops.operators[h('100001 00')].call(ops, 0, h('100001 00 011 000000000000000000000'))).toEqual(1);
            expect(ops.vars).toEqual([3,1,2,3]);
        });
        it('Checks v3=3', () => {
            expect(ops.operators[h('100001 11')].call(ops, 0, h('100001 11 011 000000000000000000000'))).toEqual(1);
            expect(ops.vars).toEqual([0,1,2,3]);
        });
        it('Checks correct line return', () => {
            expect(ops.operators[h('100001 11')].call(ops, 0, h('100001 11 011 000000000000000000000'))).toEqual(1);
            expect(ops.operators[h('100001 11')].call(ops, 1, h('100001 11 001 000000000000000000000'))).toEqual(2);
            expect(ops.operators[h('100001 01')].call(ops, 100, h('100001 01 011 000000000000000000000'))).toEqual(101);
        });
        describe('var', () => {
            let bpv;
            let ops;
            let vars;
            let offs;
            beforeAll (() => {
                bpv  = OConfig.codeBitsPerVar;
                OConfig.codeBitsPerVar = 3;
                Operators.compile();
            });
            afterAll  (() => Operators.compile());
            beforeEach(() => {
                vars = [0,1,2,3,4,5,6,7];
                offs = new Array(10);
                ops  = new Operators(offs, vars);
            });
            afterEach (() => {
                ops.destroy();
                ops  = null;
                offs = null;
                vars = null;
                OConfig.codeBitsPerVar = bpv;
            });

            it('Checks v0=1', () => {
                expect(ops.operators[h('100001 000')].call(ops, 0, h('100001 000 001 00000000000000000000'))).toEqual(1);
                expect(ops.vars).toEqual([1,1,2,3,4,5,6,7]);
            });
            it('Checks v0=0', () => {
                expect(ops.operators[h('100001 000')].call(ops, 0, h('100001 000 000 00000000000000000000'))).toEqual(1);
                expect(ops.vars).toEqual([0,1,2,3,4,5,6,7]);
            });
            it('Checks v0=3', () => {
                expect(ops.operators[h('100001 000')].call(ops, 0, h('100001 000 011 00000000000000000000'))).toEqual(1);
                expect(ops.vars).toEqual([3,1,2,3,4,5,6,7]);
            });
            it('Checks v7=7', () => {
                expect(ops.operators[h('100001 111')].call(ops, 0, h('100001 000 111 00000000000000000000'))).toEqual(1);
                expect(ops.vars).toEqual([0,1,2,3,4,5,6,7]);
            });
            it('Checks correct line return', () => {
                expect(ops.operators[h('100001 011')].call(ops, 0, h('100001 011 011 00000000000000000000'))).toEqual(1);
                expect(ops.operators[h('100001 011')].call(ops, 1, h('100001 011 001 00000000000000000000'))).toEqual(2);
                expect(ops.operators[h('100001 001')].call(ops, 100, h('100001 001 011 00000000000000000000'))).toEqual(101);
            });
        });
    });
});