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

        expect(n === 0 || n === 1).toEqual(true);
    });

    it('Checking getOperator() method', () => {
        const n = 0xabffffff;

        expect(Num.getOperator(n)).toEqual(0xab);
    });

    it('Checking setOperator() method', () => {
        const n = 0xabffffff;

        expect(Num.setOperator(n, 0xbd)).toEqual(0xbdffffff);
    });
});