let Num     = require('./Num');
let OConfig = require('./../manager/plugins/organisms/Config');

describe("client/src/organism/Num", () => {
    const bpo = OConfig.codeBitsPerOperator;
    const bpv = OConfig.codeBitsPerVar;

    beforeEach(() => {OConfig.codeBitsPerOperator = 8;   OConfig.codeBitsPerVar = 2});
    afterEach( () => {OConfig.codeBitsPerOperator = bpo; OConfig.codeBitsPerVar = bpv});

    describe('Checks initialization', () => {
        it ('Checks init() method', () => {
            Num.init(3);
            expect(Num.OPERATOR_AMOUNT).toBe(3);
            expect(Num.BITS_PER_VAR).toBe(OConfig.codeBitsPerVar);
            expect(Num.BITS_PER_OPERATOR).toBe(OConfig.codeBitsPerOperator);
        });
    });

    describe('Checks rand() method', () => {
        it('Checks if rand() generates a number', () => {
            for (let i = 0; i < 10000; i++) {
                const n = Num.rand();
                expect(typeof n).toBe('number');
                expect(n >= 0).toBe(true);
            }
        });
        it('Checks if rand() generates correct operator', () => {
            for (let i = 0; i < 10000; i++) {
                expect(Num.getOperator(Num.rand()) < Num.OPERATOR_AMOUNT).toBe(true);
            }
        });
    });

    describe('Checks operator', () => {
        it("Checking getting random zero operator", () => {
            Num.init(0);
            expect(Num.getOperator(Num.rand())).toEqual(0);
        });
        it("Checking getting random operator (0..1)", () => {
            Num.init(1);
            const n = Num.getOperator(Num.rand());
            expect(n === 0 || n === 1).toEqual(true);
        });
        it("Checking getting random operator with probability", () => {
            Num.init(3);
            let n;

            for (let i = 0; i < 10000; i++) {
                n = Num.getOperator(Num.rand());
                expect(n >= 0 && n <= 2).toEqual(true);
            }
        });

        it('Checking getOperator() method', () => {
            const n = 0xabffffff;
            Num.init(0xbb);
            expect(Num.getOperator(n)).toEqual(0xab);
        });

        it('Checking setOperator() method', () => {
            const n = 0xabffffff;

            Num.init(0xff);
            expect(Num.setOperator(n, 0xbd)).toEqual(0xbdffffff);
            expect(Num.setOperator(n, 0x00)).toEqual(0x00ffffff);
            expect(Num.setOperator(n, 0x01)).toEqual(0x01ffffff);
            expect(Num.setOperator(n, 0xff)).toEqual(0xffffffff);
        });
    });

    describe('Checks getVar() method', () => {
        it('Checking getVar() method', () => {
            let n = 0xabffffff;

            expect(Num.getVar(n, 0)).toEqual(3);
            expect(Num.getVar(n, 1)).toEqual(3);
            expect(Num.getVar(n, 3)).toEqual(3);

            n = 0xbcbfffff;
            expect(Num.getVar(n, 0)).toEqual(2);
            expect(Num.getVar(n, 1)).toEqual(3);

            n = 0xbc9fffff;
            expect(Num.getVar(n, 0)).toEqual(2);
            expect(Num.getVar(n, 1)).toEqual(1);

            n = 0xbc00ffff;
            expect(Num.getVar(n, 0)).toEqual(0);
            expect(Num.getVar(n, 1)).toEqual(0);
        });
        it('Checking getVarX() methods', () => {
            let n = 0xabffffff;

            expect(Num.getVar0(n)).toEqual(3);
            expect(Num.getVar1(n)).toEqual(3);
            expect(Num.getVar2(n)).toEqual(3);

            n = 0xbcbfffff;
            expect(Num.getVar0(n)).toEqual(2);
            expect(Num.getVar1(n)).toEqual(3);

            n = 0xbc9fffff;
            expect(Num.getVar0(n)).toEqual(2);
            expect(Num.getVar1(n)).toEqual(1);

            n = 0xbc00ffff;
            expect(Num.getVar0(n)).toEqual(0);
            expect(Num.getVar1(n)).toEqual(0);
        });
    });

    it('Checking setVar() method', () => {
        expect(Num.setVar(0xabffffff, 0, 2)).toEqual(0xabbfffff);
        expect(Num.setVar(0xabffffff, 0, 3)).toEqual(0xabffffff);
        expect(Num.setVar(0xabffffff, 0, 0)).toEqual(0xab3fffff);
        expect(Num.setVar(0xabffffff, 2, 0)).toEqual(0xabf3ffff);
        expect(Num.setVar(0xabffffff, 2, 2)).toEqual(0xabfbffff);
    });

    it('Checking getBits() method', () => {
        expect(Num.getBits(0xabffffff, 0, 8)).toEqual(0xab);
        expect(Num.getBits(0xabffffff, 0, 4)).toEqual(0xa);
        expect(Num.getBits(0xabffffff, 4, 4)).toEqual(0xb);
        expect(Num.getBits(0xabfbffff, 12, 2)).toEqual(0x2);
        expect(Num.getBits(0xabcdffff, 8, 8)).toEqual(0xcd);
        expect(Num.getBits(0xabcdffff, 16, 8)).toEqual(0xff);
    });
});