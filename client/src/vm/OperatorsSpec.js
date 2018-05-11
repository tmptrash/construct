const Operators = require('./Operators');
const OConfig   = require('./../manager/plugins/organisms/Config');
const Helper    = require('./../../../common/src/Helper');

describe("client/src/vm/Operators", () => {
    const h       = Helper.toHexNum;
    const MAX_NUM = Number.MAX_VALUE;
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

    describe('vars 2bits per var', () => {
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
        it('Garbage in a tail should not affect vars', () => {
            expect(ops.operators[h('100000 00 01')].call(ops, 0, h('100000 00 01 111111111111111111111'))).toEqual(1);
            expect(ops.vars).toEqual([1,1,2,3]);
            expect(ops.operators[h('100000 00 00')].call(ops, 0, h('100000 00 00 111111111111111111111'))).toEqual(1);
            expect(ops.vars).toEqual([1,1,2,3]);
        });

        describe('vars 3bits per var', () => {
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
            it('Garbage in a tail should not affect vars', () => {
                expect(ops.operators[h('100000 000 001')].call(ops, 0, h('100000 000 001 11111111111111111111'))).toEqual(1);
                expect(ops.vars).toEqual([1,1,2,3,4,5,6,7]);
                expect(ops.operators[h('100000 000 000')].call(ops, 0, h('100000 000 000 11111111111111111111'))).toEqual(1);
                expect(ops.vars).toEqual([1,1,2,3,4,5,6,7]);
            });
        });
    });

    describe('consts 2bits per var', () => {
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
        it('Garbage in a tail should not affect vars', () => {
            expect(ops.operators[h('100001 00')].call(ops, 0, h('100001 00 001 111111111111111111111'))).toEqual(1);
            expect(ops.vars).toEqual([1,1,2,3]);
            expect(ops.operators[h('100001 00')].call(ops, 1, h('100001 00 000 111111111111111111111'))).toEqual(2);
            expect(ops.vars).toEqual([0,1,2,3]);
        });

        describe('consts 3bits per var', () => {
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
            it('Garbage in a tail should not affect vars', () => {
                expect(ops.operators[h('100001 000')].call(ops, 0, h('100001 000 001 11111111111111111111'))).toEqual(1);
                expect(ops.vars).toEqual([1,1,2,3,4,5,6,7]);
                expect(ops.operators[h('100001 000')].call(ops, 1, h('100001 000 000 11111111111111111111'))).toEqual(2);
                expect(ops.vars).toEqual([0,1,2,3,4,5,6,7]);
            });
        });
    });

    describe('ifs 2bits per var', () => {
        it('if(v3!==v3) should be false', () => {
            const code = [
                h('100010 11 11 1110 000000000000000000'), // if (v3!==v3) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100010 11 11 1110')].call(ops, 0)).toEqual(3);
        });
        it('if(v0+v1) should be true', () => {
            const code = [
                h('100010 00 01 0000 000000000000000000'), // if (v0+v1) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100010 11 11 0000')].call(ops, 0)).toEqual(1);
        });
        it('if(v0<=v0) should be false', () => {
            const code = [
                h('100010 00 00 1111 000000000000000000'), // if (v0<=v0) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100010 00 00 1111')].call(ops, 0)).toEqual(1);
        });
        it('Garbage in a tail should not affect if', () => {
            const code = [
                h('100010 00 01 0000 111111111111111111'), // if (v0+v1) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 11111111111111111111111111')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100010 11 11 0000')].call(ops, 0)).toEqual(1);
        });
        it('Test of one if and two closed brackets', () => {
            const code = [
                h('100010 11 11 1110 000000000000000000'), // if (v3!==v3) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000'),    // }
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100010 11 11 1110')].call(ops, 0)).toEqual(3);
        });
        it('Test of one if and two closed brackets 2', () => {
            const code = [
                h('101000 00000000000000000000000000'),    // }
                h('100010 11 11 1110 000000000000000000'), // if (v3!==v3) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100010 11 11 1110')].call(ops, 1)).toEqual(4);
        });
        it('if(false) without closed bracket should go to the next line', () => {
            const code = [
                h('100010 11 11 1110 000000000000000000'), // if (v3!==v3) {
                h('100000 00 01 1111111111111111111111')   //     v0 = v1
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100010 11 11 1110')].call(ops, 0)).toEqual(1);
        });
        it('if(true) without closed bracket should go to the next line', () => {
            const code = [
                h('100010 11 11 1101 000000000000000000'), // if (v3===v3) {
                h('100000 00 01 1111111111111111111111')   //     v0 = v1
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100010 11 11 1101')].call(ops, 0)).toEqual(1);
        });
        it('Garbage in a tail should not affect if', () => {
            const code = [
                h('100010 00 00 1101 111111111111111111'), // if (v0===v0) {
                h('100000 00 01 1111111111111111111111')   //     v0 = v1
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100010 00 00 1101')].call(ops, 0)).toEqual(1);
        });

        describe('ifs 3bits per var', () => {
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

            it('if(v3!==v3) should be false', () => {
                const code = [
                    h('100010 011 011 1110 0000000000000000'), // if (v3!==v3) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100010 011 011 1110')].call(ops, 0)).toEqual(3);
            });
            it('if(v0+v1) should be true', () => {
                const code = [
                    h('100010 000 001 0000 0000000000000000'), // if (v0+v1) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100010 011 011 0000')].call(ops, 0)).toEqual(1);
            });
            it('if(v0<=v0) should be false', () => {
                const code = [
                    h('100010 000 000 1111 0000000000000000'), // if (v0<=v0) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100010 000 000 1111')].call(ops, 0)).toEqual(1);
            });
            it('Garbage in a tail should not affect if', () => {
                const code = [
                    h('100010 000 001 0000 1111111111111111'), // if (v0+v1) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 11111111111111111111111111')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100010 011 011 0000')].call(ops, 0)).toEqual(1);
            });
            it('Test of one if and two closed brackets', () => {
                const code = [
                    h('100010 011 011 1110 0000000000000000'), // if (v3!==v3) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000'),    // }
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100010 011 011 1110')].call(ops, 0)).toEqual(3);
            });
            it('Test of one if and two closed brackets 2', () => {
                const code = [
                    h('101000 00000000000000000000000000'),    // }
                    h('100010 011 011 1110 0000000000000000'), // if (v3!==v3) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('101000')].call(ops, 0, code[0])).toEqual(1);
                expect(ops.operators[h('100010 011 011 1110')].call(ops, 1)).toEqual(4);
            });
            it('if(false) without closed bracket should go to the next line', () => {
                const code = [
                    h('100010 011 011 1110 0000000000000000'), // if (v3!==v3) {
                    h('100000 000 001 11111111111111111111')   //     v0 = v1
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100010 011 011 1110')].call(ops, 0)).toEqual(1);
            });
            it('if(true) without closed bracket should go to the next line', () => {
                const code = [
                    h('100010 011 011 1101 0000000000000000'), // if (v3===v3) {
                    h('100000 000 001 11111111111111111111')   //     v0 = v1
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100010 011 011 1101')].call(ops, 0)).toEqual(1);
            });
            it('Garbage in a tail should not affect if', () => {
                const code = [
                    h('100010 000 000 1101 1111111111111111'), // if (v0===v0) {
                    h('100000 000 001 11111111111111111111')   //     v0 = v1
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100010 000 000 1101')].call(ops, 0)).toEqual(1);
            });
        });
    });

    describe('loops 2bits per var', () => {
        it('while() with false condition should go outside the closed bracket', () => {
            const code = [
                h('100011 11 11 1110 000000000000000000'), // while (v3!==v3) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100011 11 11 1110')].call(ops, 0)).toEqual(3);
        });
        it('while() with true condition should go to the next line', () => {
            const code = [
                h('100011 11 11 1101 000000000000000000'), // while (v3===v3) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100011 11 11 1101')].call(ops, 0)).toEqual(1);
        });
        it('while() with true at the beginning and false after', () => {
            const code = [
                h('100011 00 01 1110 000000000000000000'), // while (v0!==v1) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100011 00 01 1110')].call(ops, 0)).toEqual(1);
            expect(ops.operators[h('100000 00 01')].call(ops, 1)).toEqual(2);
            expect(ops.operators[h('101000')].call(ops, 2, code[2], {}, code)).toEqual(0);
            expect(ops.operators[h('100011 00 01 1110')].call(ops, 0)).toEqual(3);
        });
        it('Garbage in a tail of command should not affect values', () => {
            const code = [
                h('100011 11 11 1110 111111111111111111'), // while (v3!==v3) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 11111111111111111111111111')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100011 11 11 1110')].call(ops, 0)).toEqual(3);
        });
        it('Garbage in a tail of command should not affect values 2', () => {
            const code = [
                h('100011 11 11 1101 111111111111111111'), // while (v3===v3) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 11111111111111111111111111')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100011 11 11 1101')].call(ops, 0)).toEqual(1);
        });

        describe('loops 3bits per var', () => {
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

            it('while() with false condition should go outside the closed bracket', () => {
                const code = [
                    h('100011 011 011 1110 0000000000000000'), // while (v3!==v3) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100011 011 011 1110')].call(ops, 0)).toEqual(3);
            });
            it('while() with true condition should go to the next line', () => {
                const code = [
                    h('100011 011 011 1101 0000000000000000'), // while (v3===v3) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100011 011 011 1101')].call(ops, 0)).toEqual(1);
            });
            it('while() with true at the beginning and false after', () => {
                const code = [
                    h('100011 000 001 1110 0000000000000000'), // while (v0!==v1) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100011 000 001 1110')].call(ops, 0)).toEqual(1);
                expect(ops.operators[h('100000 000 001')].call(ops, 1)).toEqual(2);
                expect(ops.operators[h('101000')].call(ops, 2, code[2], {}, code)).toEqual(0);
                expect(ops.operators[h('100011 000 001 1110')].call(ops, 0)).toEqual(3);
            });
            it('Garbage in a tail of command should not affect values', () => {
                const code = [
                    h('100011 011 011 1110 1111111111111111'), // while (v3!==v3) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 11111111111111111111111111')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100011 011 011 1110')].call(ops, 0)).toEqual(3);
            });
            it('Garbage in a tail of command should not affect values 2', () => {
                const code = [
                    h('100011 011 011 1101 1111111111111111'), // while (v3===v3) {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 11111111111111111111111111')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100011 011 011 1101')].call(ops, 0)).toEqual(1);
            });
        });
    });

    describe('operators 2bits per var', () => {
        it('Checks + operator', () => {
            expect(ops.operators[h('100100 00 01 10 0000')].call(ops, 0)).toEqual(1); // v0 = v1 + v2
            expect(ops.vars).toEqual([3,1,2,3]);
        });
        it('Checks + operator', () => {
            ops.vars[1] = ops.vars[2] = MAX_NUM;
            expect(ops.operators[h('100100 00 01 10 0000')].call(ops, 0)).toEqual(1); // v0 = v1 + v2
            expect(ops.vars).toEqual([MAX_NUM,MAX_NUM,MAX_NUM,3]);
        });
        it('Checks + operator', () => {
            ops.vars[1] = ops.vars[2] = 0;
            expect(ops.operators[h('100100 00 01 10 0000')].call(ops, 0)).toEqual(1); // v0 = v1 + v2
            expect(ops.vars).toEqual([0,0,0,3]);
        });
        it('Checks + operator', () => {
            ops.vars[1] = ops.vars[2] = -1;
            expect(ops.operators[h('100100 00 01 10 0000')].call(ops, 0)).toEqual(1); // v0 = v1 + v2
            expect(ops.vars).toEqual([-2,-1,-1,3]);
        });
        it('Checks - operator', () => {
            expect(ops.operators[h('100100 00 01 10 0001')].call(ops, 0)).toEqual(1); // v0 = v1 - v2
            expect(ops.vars).toEqual([-1,1,2,3]);
        });
        it('Checks - operator', () => {
            ops.vars[1] = ops.vars[2] = -1;
            expect(ops.operators[h('100100 00 01 10 0001')].call(ops, 0)).toEqual(1); // v0 = v1 - v2
            expect(ops.vars).toEqual([0,-1,-1,3]);
        });
        it('Checks - operator', () => {
            ops.vars[1] = -MAX_NUM;
            ops.vars[2] =  MAX_NUM;
            expect(ops.operators[h('100100 00 01 10 0001')].call(ops, 0)).toEqual(1); // v0 = v1 - v2
            expect(ops.vars).toEqual([-MAX_NUM,-MAX_NUM,MAX_NUM,3]);
        });
        it('Checks * operator', () => {
            expect(ops.operators[h('100100 00 01 10 0010')].call(ops, 0)).toEqual(1); // v0 = v1 * v2
            expect(ops.vars).toEqual([2,1,2,3]);
        });
        it('Checks * operator', () => {
            ops.vars[1] = ops.vars[2] = -1;
            expect(ops.operators[h('100100 00 01 10 0010')].call(ops, 0)).toEqual(1); // v0 = v1 * v2
            expect(ops.vars).toEqual([1,-1,-1,3]);
        });
        it('Checks * operator', () => {
            ops.vars[1] = -1;
            expect(ops.operators[h('100100 00 01 10 0010')].call(ops, 0)).toEqual(1); // v0 = v1 * v2
            expect(ops.vars).toEqual([-2,-1,2,3]);
        });
        it('Checks * operator', () => {
            ops.vars[1] = ops.vars[2] = MAX_NUM;
            expect(ops.operators[h('100100 00 01 10 0010')].call(ops, 0)).toEqual(1); // v0 = v1 * v2
            expect(ops.vars).toEqual([MAX_NUM,MAX_NUM,MAX_NUM,3]);
        });
        it('Checks * operator', () => {
            ops.vars[1] =  MAX_NUM;
            ops.vars[2] = -MAX_NUM;
            expect(ops.operators[h('100100 00 01 10 0010')].call(ops, 0)).toEqual(1); // v0 = v1 * v2
            expect(ops.vars).toEqual([MAX_NUM,MAX_NUM,-MAX_NUM,3]);
        });
        it('Checks / operator', () => {
            expect(ops.operators[h('100100 00 01 10 0011')].call(ops, 0)).toEqual(1); // v0 = v1 / v2
            expect(ops.vars).toEqual([.5,1,2,3]);
        });
        it('Checks / operator', () => {
            ops.vars[1] =  1;
            ops.vars[2] = -1;
            expect(ops.operators[h('100100 00 01 10 0011')].call(ops, 0)).toEqual(1); // v0 = v1 / v2
            expect(ops.vars).toEqual([-1,1,-1,3]);
        });
        it('Checks / operator', () => {
            ops.vars[1] = -1;
            ops.vars[2] = -1;
            expect(ops.operators[h('100100 00 01 10 0011')].call(ops, 0)).toEqual(1); // v0 = v1 / v2
            expect(ops.vars).toEqual([1,-1,-1,3]);
        });
        it('Checks / operator', () => {
            ops.vars[1] = -MAX_NUM;
            ops.vars[2] =  MAX_NUM;
            expect(ops.operators[h('100100 00 01 10 0011')].call(ops, 0)).toEqual(1); // v0 = v1 / v2
            expect(ops.vars).toEqual([-1,-MAX_NUM,MAX_NUM,3]);
        });
        it('Checks / operator', () => {
            expect(ops.operators[h('100100 01 10 00 0011')].call(ops, 0)).toEqual(1); // v1 = v2 / v0
            expect(ops.vars).toEqual([0,MAX_NUM,2,3]);
        });
        it('Checks % operator', () => {
            expect(ops.operators[h('100100 00 01 10 0100')].call(ops, 0)).toEqual(1); // v0 = v1 % v2
            expect(ops.vars).toEqual([1,1,2,3]);
        });
        it('Checks % operator', () => {
            ops.vars[2] = 0;
            expect(ops.operators[h('100100 00 01 10 0100')].call(ops, 0)).toEqual(1); // v0 = v1 % v2
            expect(ops.vars).toEqual([0,1,0,3]);
        });
        it('Checks & operator', () => {
            expect(ops.operators[h('100100 00 01 10 0101')].call(ops, 0)).toEqual(1); // v0 = v1 & v2
            expect(ops.vars).toEqual([0,1,2,3]);
        });
        it('Checks & operator', () => {
            expect(ops.operators[h('100100 10 01 00 0101')].call(ops, 0)).toEqual(1); // v2 = v1 & v0
            expect(ops.vars).toEqual([0,1,0,3]);
        });
        it('Checks & operator', () => {
            expect(ops.operators[h('100100 10 01 01 0101')].call(ops, 0)).toEqual(1); // v2 = v1 & v1
            expect(ops.vars).toEqual([0,1,1,3]);
        });
        it('Checks < operator', () => {
            expect(ops.operators[h('100100 10 01 01 1011')].call(ops, 0)).toEqual(1); // v2 = v1 < v1
            expect(ops.vars).toEqual([0,1,0,3]);
        });
        it('Checks < operator', () => {
            expect(ops.operators[h('100100 00 01 10 1011')].call(ops, 0)).toEqual(1); // v0 = v1 < v2
            expect(ops.vars).toEqual([1,1,2,3]);
        });
        it('Checks < operator', () => {
            ops.vars[1] = -1;
            ops.vars[2] = -2;
            expect(ops.operators[h('100100 00 01 10 1011')].call(ops, 0)).toEqual(1); // v0 = v1 < v2
            expect(ops.vars).toEqual([0,-1,-2,3]);
        });

        describe('operators 3bits per var', () => {
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

            it('Checks + operator', () => {
                expect(ops.operators[h('100100 000 001 010 0000')].call(ops, 0)).toEqual(1); // v0 = v1 + v2
                expect(ops.vars).toEqual([3,1,2,3,4,5,6,7]);
            });
            it('Checks + operator', () => {
                ops.vars[1] = ops.vars[2] = MAX_NUM;
                expect(ops.operators[h('100100 000 001 010 0000')].call(ops, 0)).toEqual(1); // v0 = v1 + v2
                expect(ops.vars).toEqual([MAX_NUM, MAX_NUM, MAX_NUM, 3,4,5,6,7]);
            });
            it('Checks + operator', () => {
                ops.vars[1] = ops.vars[2] = 0;
                expect(ops.operators[h('100100 000 001 010 0000')].call(ops, 0)).toEqual(1); // v0 = v1 + v2
                expect(ops.vars).toEqual([0, 0, 0, 3,4,5,6,7]);
            });
            it('Checks + operator', () => {
                ops.vars[1] = ops.vars[2] = -1;
                expect(ops.operators[h('100100 000 001 010 0000')].call(ops, 0)).toEqual(1); // v0 = v1 + v2
                expect(ops.vars).toEqual([-2, -1, -1, 3,4,5,6,7]);
            });
            it('Checks - operator', () => {
                expect(ops.operators[h('100100 000 001 010 0001')].call(ops, 0)).toEqual(1); // v0 = v1 - v2
                expect(ops.vars).toEqual([-1, 1, 2, 3,4,5,6,7]);
            });
            it('Checks - operator', () => {
                ops.vars[1] = ops.vars[2] = -1;
                expect(ops.operators[h('100100 000 001 010 0001')].call(ops, 0)).toEqual(1); // v0 = v1 - v2
                expect(ops.vars).toEqual([0, -1, -1, 3,4,5,6,7]);
            });
            it('Checks - operator', () => {
                ops.vars[1] = -MAX_NUM;
                ops.vars[2] = MAX_NUM;
                expect(ops.operators[h('100100 000 001 010 0001')].call(ops, 0)).toEqual(1); // v0 = v1 - v2
                expect(ops.vars).toEqual([-MAX_NUM, -MAX_NUM, MAX_NUM, 3,4,5,6,7]);
            });
            it('Checks * operator', () => {
                expect(ops.operators[h('100100 000 001 010 0010')].call(ops, 0)).toEqual(1); // v0 = v1 * v2
                expect(ops.vars).toEqual([2, 1, 2, 3,4,5,6,7]);
            });
            it('Checks * operator', () => {
                ops.vars[1] = ops.vars[2] = -1;
                expect(ops.operators[h('100100 000 001 010 0010')].call(ops, 0)).toEqual(1); // v0 = v1 * v2
                expect(ops.vars).toEqual([1, -1, -1, 3,4,5,6,7]);
            });
            it('Checks * operator', () => {
                ops.vars[1] = -1;
                expect(ops.operators[h('100100 000 001 010 0010')].call(ops, 0)).toEqual(1); // v0 = v1 * v2
                expect(ops.vars).toEqual([-2, -1, 2, 3,4,5,6,7]);
            });
            it('Checks * operator', () => {
                ops.vars[1] = ops.vars[2] = MAX_NUM;
                expect(ops.operators[h('100100 000 001 010 0010')].call(ops, 0)).toEqual(1); // v0 = v1 * v2
                expect(ops.vars).toEqual([MAX_NUM, MAX_NUM, MAX_NUM, 3,4,5,6,7]);
            });
            it('Checks * operator', () => {
                ops.vars[1] = MAX_NUM;
                ops.vars[2] = -MAX_NUM;
                expect(ops.operators[h('100100 000 001 010 0010')].call(ops, 0)).toEqual(1); // v0 = v1 * v2
                expect(ops.vars).toEqual([MAX_NUM, MAX_NUM, -MAX_NUM, 3,4,5,6,7]);
            });
            it('Checks / operator', () => {
                expect(ops.operators[h('100100 000 001 010 0011')].call(ops, 0)).toEqual(1); // v0 = v1 / v2
                expect(ops.vars).toEqual([.5, 1, 2, 3,4,5,6,7]);
            });
            it('Checks / operator', () => {
                ops.vars[1] = 1;
                ops.vars[2] = -1;
                expect(ops.operators[h('100100 000 001 010 0011')].call(ops, 0)).toEqual(1); // v0 = v1 / v2
                expect(ops.vars).toEqual([-1, 1, -1, 3,4,5,6,7]);
            });
            it('Checks / operator', () => {
                ops.vars[1] = -1;
                ops.vars[2] = -1;
                expect(ops.operators[h('100100 000 001 010 0011')].call(ops, 0)).toEqual(1); // v0 = v1 / v2
                expect(ops.vars).toEqual([1, -1, -1, 3,4,5,6,7]);
            });
            it('Checks / operator', () => {
                ops.vars[1] = -MAX_NUM;
                ops.vars[2] = MAX_NUM;
                expect(ops.operators[h('100100 000 001 010 0011')].call(ops, 0)).toEqual(1); // v0 = v1 / v2
                expect(ops.vars).toEqual([-1, -MAX_NUM, MAX_NUM, 3,4,5,6,7]);
            });
            it('Checks / operator', () => {
                expect(ops.operators[h('100100 001 010 000 0011')].call(ops, 0)).toEqual(1); // v1 = v2 / v0
                expect(ops.vars).toEqual([0, MAX_NUM, 2, 3,4,5,6,7]);
            });
            it('Checks % operator', () => {
                expect(ops.operators[h('100100 000 001 010 0100')].call(ops, 0)).toEqual(1); // v0 = v1 % v2
                expect(ops.vars).toEqual([1, 1, 2, 3,4,5,6,7]);
            });
            it('Checks % operator', () => {
                ops.vars[2] = 0;
                expect(ops.operators[h('100100 000 001 010 0100')].call(ops, 0)).toEqual(1); // v0 = v1 % v2
                expect(ops.vars).toEqual([0, 1, 0, 3,4,5,6,7]);
            });
            it('Checks & operator', () => {
                expect(ops.operators[h('100100 000 001 010 0101')].call(ops, 0)).toEqual(1); // v0 = v1 & v2
                expect(ops.vars).toEqual([0, 1, 2, 3,4,5,6,7]);
            });
            it('Checks & operator', () => {
                expect(ops.operators[h('100100 010 001 000 0101')].call(ops, 0)).toEqual(1); // v2 = v1 & v0
                expect(ops.vars).toEqual([0, 1, 0, 3,4,5,6,7]);
            });
            it('Checks & operator', () => {
                expect(ops.operators[h('100100 010 001 001 0101')].call(ops, 0)).toEqual(1); // v2 = v1 & v1
                expect(ops.vars).toEqual([0, 1, 1, 3,4,5,6,7]);
            });
            it('Checks < operator', () => {
                expect(ops.operators[h('100100 010 001 001 1011')].call(ops, 0)).toEqual(1); // v2 = v1 < v1
                expect(ops.vars).toEqual([0, 1, 0, 3,4,5,6,7]);
            });
            it('Checks < operator', () => {
                expect(ops.operators[h('100100 000 001 010 1011')].call(ops, 0)).toEqual(1); // v0 = v1 < v2
                expect(ops.vars).toEqual([1, 1, 2, 3,4,5,6,7]);
            });
            it('Checks < operator', () => {
                ops.vars[1] = -1;
                ops.vars[2] = -2;
                expect(ops.operators[h('100100 000 001 010 1011')].call(ops, 0)).toEqual(1); // v0 = v1 < v2
                expect(ops.vars).toEqual([0, -1, -2, 3,4,5,6,7]);
            });
        });
    });

    describe('function declaration 2bits per var', () => {
        it('Func declaration should be skipped during run', () => {
            const code = [
                h('100101 00000001 000000000000000000'),   // func 1() {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100101')].call(ops, 0)).toEqual(3);
        });
        it('Two func declaration should be skipped during run', () => {
            const code = [
                h('100101 00000001 000000000000000000'),   // func 1 {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000'),    // }
                h('100101 00000001 000000000000000000'),   // func 2() {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100101')].call(ops, 0)).toEqual(3);
            expect(ops.operators[h('100101')].call(ops, 3)).toEqual(6);
        });
        it('func inside func should work', () => {
            const code = [
                h('100101 00000001 000000000000000000'),   // func 1 {
                h('100101 00000001 000000000000000000'),   //   func 2 {
                h('101000 00000000000000000000000000'),    //   }
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100101')].call(ops, 1)).toEqual(3);
            expect(ops.operators[h('100101')].call(ops, 0)).toEqual(4);
        });
        it('func without closed bracket should work', () => {
            const code = [
                h('100101 00000001 000000000000000000'),   // func 1 {
                h('100000 00 01 1111111111111111111111')   // v0 = v1
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100101')].call(ops, 0)).toEqual(1);
        });
        it('one line func should work', () => {
            const code = [
                h('100101 00000001 000000000000000000')    // func 1 {
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100101')].call(ops, 0)).toEqual(1);
        });
        it('func with two closed brackets should work', () => {
            const code = [
                h('100101 00000001 000000000000000000'),   // func 1 {
                h('101000 00000000000000000000000000'),    // }
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100101')].call(ops, 0)).toEqual(2);
        });
        it('func with two closed brackets should work', () => {
            const code = [
                h('101000 00000000000000000000000000'),    // }
                h('100101 00000001 000000000000000000'),   // func 1 {
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100101')].call(ops, 1)).toEqual(3);
        });

        xdescribe('function declaration 3bits per var', () => {
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

            it('Func declaration should be skipped during run', () => {
                const code = [
                    h('100101 00000001 000000000000000000'),   // func 1() {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100101')].call(ops, 0)).toEqual(3);
            });
            it('Two func declaration should be skipped during run', () => {
                const code = [
                    h('100101 00000001 000000000000000000'),   // func 1 {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000'),    // }
                    h('100101 00000001 000000000000000000'),   // func 2() {
                    h('100000 000 001 11111111111111111111'),  //     v0 = v1
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100101')].call(ops, 0)).toEqual(3);
                expect(ops.operators[h('100101')].call(ops, 3)).toEqual(6);
            });
            it('func inside func should work', () => {
                const code = [
                    h('100101 00000001 000000000000000000'),   // func 1 {
                    h('100101 00000001 000000000000000000'),   //   func 2 {
                    h('101000 00000000000000000000000000'),    //   }
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100101')].call(ops, 1)).toEqual(3);
                expect(ops.operators[h('100101')].call(ops, 0)).toEqual(4);
            });
            it('func without closed bracket should work', () => {
                const code = [
                    h('100101 00000001 000000000000000000'),   // func 1 {
                    h('100000 000 001 11111111111111111111')   // v0 = v1
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100101')].call(ops, 0)).toEqual(1);
            });
            it('one line func should work', () => {
                const code = [
                    h('100101 00000001 000000000000000000')    // func 1 {
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100101')].call(ops, 0)).toEqual(1);
            });
            it('func with two closed brackets should work', () => {
                const code = [
                    h('100101 00000001 000000000000000000'),   // func 1 {
                    h('101000 00000000000000000000000000'),    // }
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100101')].call(ops, 0)).toEqual(2);
            });
            it('func with two closed brackets should work', () => {
                const code = [
                    h('101000 00000000000000000000000000'),    // }
                    h('100101 00000001 000000000000000000'),   // func 1 {
                    h('101000 00000000000000000000000000')     // }
                ];
                ops.updateIndexes(code);
                expect(ops.operators[h('100101')].call(ops, 1)).toEqual(3);
            });
        });
    });

    describe('function call', () => {
        it('Func call should work', () => {
            const code = [
                h('100101 00000000000000000000000000'),    // func 0() {
                h('101000 00000000000000000000000000'),    // }
                h('100110 1 00000000 00000000000000000')   // call 0()
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100101')].call(ops, 0)).toEqual(2);
            expect(ops.operators[h('100110')].call(ops, 2, code[2], {}, code)).toEqual(1);
            expect(ops.operators[h('101000')].call(ops, 1, code[1], {}, code)).toEqual(3);
        });
        it('Vars within function should not affect outside vars', () => {
            const code = [
                h('100101 00000000000000000000000000'),    // func 0() {
                h('100000 00 01 1111111111111111111111'),  //   v0 = v1
                h('101000 00000000000000000000000000'),    // }
                h('100110 1 00000000 00000000000000000')   // call 0()
            ];
            ops.updateIndexes(code);
            expect(ops.vars).toEqual([0,1,2,3]);
            expect(ops.operators[h('100110')].call(ops, 3, code[3], {}, code)).toEqual(1);
            expect(ops.operators[h('100000 00 01')].call(ops, 1, code[1], {}, code)).toEqual(2);
            expect(ops.vars).toEqual([1,1,2,3]);
            expect(ops.operators[h('101000')].call(ops, 2, code[2], {}, code)).toEqual(4);
            expect(ops.vars).toEqual([0,1,2,3]);
        });
        it('func inside func should be callable', () => {
            const code = [
                h('100101 00000000000000000000000000'),    // func 0 {
                h('100101 00000000000000000000000000'),    //   func 1 {
                h('101000 00000000000000000000000000'),    //   }
                h('101000 00000000000000000000000000'),    // }
                h('100110 1 00000001 00000000000000000')   // call 1()
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100110')].call(ops, 4, code[4], {}, code)).toEqual(2);
            expect(ops.operators[h('101000')].call(ops, 2, code[2], {}, code)).toEqual(5);
        });
        it('func should be callable through var', () => {
            const code = [
                h('100101 00000000000000000000000000'),    // func 0 {
                h('100101 00000000000000000000000000'),    //   func 1 {
                h('101000 00000000000000000000000000'),    //   }
                h('101000 00000000000000000000000000'),    // }
                h('100110 0 01 00000000000000000000000')   // call v1()
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100110')].call(ops, 4, code[4], {}, code)).toEqual(2);
            expect(ops.operators[h('101000')].call(ops, 2, code[2], {}, code)).toEqual(5);
        });
        it('undefined func should not be callable through var', () => {
            const code = [
                h('100101 00000000000000000000000000'),    // func 0 {
                h('100101 00000000000000000000000000'),    //   func 1 {
                h('101000 00000000000000000000000000'),    //   }
                h('101000 00000000000000000000000000'),    // }
                h('100110 0 10 00000000000000000000000')   // call v1()
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100110')].call(ops, 4, code[4], {}, code)).toEqual(5);
        });
    });

    describe('return', () => {
        it('One return should create infinite loop', () => {
            const code = [
                h('100111 00000000000000000000000000')     // return
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100111')].call(ops, 0)).toEqual(0);
        });
        it('return outside the func should jump to zero line', () => {
            const code = [
                h('100000 00 01 1111111111111111111111'),  // v0 = v1
                h('100111 11111111111111111111111111')     // return
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100111')].call(ops, 1)).toEqual(0);
        });
        it('return inside func should jump outside of it', () => {
            const code = [
                h('100101 00000000000000000000000000'),    // func 0() {
                h('100111 00000000000000000000000000'),    //   return
                h('101000 00000000000000000000000000'),    // }
                h('100110 1 00000000 00000000000000000')   // call 0()
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100101')].call(ops, 0)).toEqual(3);
            expect(ops.operators[h('100110')].call(ops, 3, code[3], {}, code)).toEqual(1);
            expect(ops.operators[h('100111')].call(ops, 1, code[1], {}, code)).toEqual(4);
        });
        it('func inside func should be callable', () => {
            const code = [
                h('100101 00000000000000000000000000'),    // func 0 {
                h('100101 00000000000000000000000000'),    //   func 1 {
                h('100111 00000000000000000000000000'),    //     return
                h('101000 00000000000000000000000000'),    //   }
                h('101000 00000000000000000000000000'),    // }
                h('100110 1 00000001 00000000000000000')   // call 1()
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100110')].call(ops, 5, code[5], {}, code)).toEqual(2);
            expect(ops.operators[h('100111')].call(ops, 2, code[2], {}, code)).toEqual(6);
        });
        it('Two return inside func should jump outside of it', () => {
            const code = [
                h('100101 00000000000000000000000000'),    // func 0() {
                h('100111 00000000000000000000000000'),    //   return
                h('100111 00000000000000000000000000'),    //   return
                h('101000 00000000000000000000000000'),    // }
                h('100110 1 00000000 00000000000000000')   // call 0()
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100101')].call(ops, 0)).toEqual(4);
            expect(ops.operators[h('100110')].call(ops, 4, code[4], {}, code)).toEqual(1);
            expect(ops.operators[h('100111')].call(ops, 1, code[1], {}, code)).toEqual(5);
        });
    });

    describe('bracket', () => {
        it('Script of one bracket should work', () => {
            const code = [
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('101000')].call(ops, 0)).toEqual(1);
        });
        it('Script of two brackets should work', () => {
            const code = [
                h('101000 00000000000000000000000000'),    // }
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('101000')].call(ops, 0)).toEqual(1);
            expect(ops.operators[h('101000')].call(ops, 1)).toEqual(2);
        });
        it('if(v3!==v3) should be false', () => {
            const code = [
                h('100010 11 11 1110 000000000000000000'), // if (v3!==v3) {
                h('100000 00 01 1111111111111111111111'),  //     v0 = v1
                h('101000 00000000000000000000000000'),    // }
                h('101000 00000000000000000000000000')     // }
            ];
            ops.updateIndexes(code);
            expect(ops.operators[h('100010 11 11 1110')].call(ops, 0)).toEqual(3);
            expect(ops.operators[h('101000')].call(ops, 3)).toEqual(4);
        });
    });

    describe('toMem 2bits per var', () => {
        it('Script of one bracket should work', () => {
            const code = [
                h('101001 00 01 0000000000000000000000')   // toMem(v0, v1)
            ];
            const org = {mem: [0,1,2,3]};
            ops.updateIndexes(code);
            expect(ops.operators[h('101001 00 01')].call(ops, 0, code[0], org)).toEqual(1);
            expect(org.mem).toEqual([1,1,2,3]);
        });
    });
});