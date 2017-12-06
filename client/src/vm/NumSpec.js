describe("client/src/organism/Num", () => {
    let Num = require('./Num');

    it("Checking getting random zero operator", () => {
        Num.setOperatorAmount(0);
        const n = Num.get() >>> 24;

        expect(n).toEqual(0);
    });
    it("Checking getting random operator (0..1)", () => {
        Num.setOperatorAmount(1);
        const n = Num.get() >>> 24;

        expect(n === 0 || n === 1).toEqual(true);
    });
    it("Checking getting random operator with probability", () => {
        Num.setOperatorAmount(3);
        let n;

        for (let i = 0; i < 10000; i++) {
            n = Num.get() >>> 24;
            expect(n >= 0 && n <= 2).toEqual(true);
        }
    });

    it('Checking getOperator() method', () => {
        const n = 0xabffffff;

        expect(Num.getOperator(n)).toEqual(0xab);
    });

    it('Checking setOperator() method', () => {
        const n = 0xabffffff;

        expect(Num.setOperator(n, 0xbd)).toEqual(0xbdffffff);
        expect(Num.setOperator(n, 0x00)).toEqual(0x00ffffff);
        expect(Num.setOperator(n, 0x01)).toEqual(0x01ffffff);
        expect(Num.setOperator(n, 0xff)).toEqual(0xffffffff);
    });

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