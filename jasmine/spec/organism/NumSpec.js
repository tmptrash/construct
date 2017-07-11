describe("src/organism/Code", () => {
    let Num = require('../../../src/organism/Num').default;

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
        let n = 0xabffffff;

        expect(Num.setVar(n, 0, 2)).toEqual(0xabbfffff);
    });
});