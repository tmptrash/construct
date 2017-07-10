describe("src/organism/Code", () => {
    let Num = require('../../../src/organism/Num').default;

    it("Checking getting random operator", () => {
        Num.setOperatorAmount(1);
        const n = Num.get() >>> 24;

        expect(n === 0 || n === 1).toEqual(true);
    });
});