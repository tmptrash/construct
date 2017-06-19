describe("src/global/Helper", () => {
    let Helper = require('../../../src/global/Helper').default;

    it("Checking rand(2)", () => {
        let val = Helper.rand(2);
        expect(val === 0 || val === 1).toEqual(true);
    });
    it("Checking rand(0)", () => {
        expect(Helper.rand(0)).toEqual(0);
    });
    it("Checking rand(1)", () => {
        expect(Helper.rand(1)).toEqual(0);
    });

    it("Checking probIndex() method", () => {
        expect(Helper.probIndex([1])).toEqual(0);
    });
    it("Checking probIndex() method 2", () => {
        let zero = 0;
        let one  = 0;

        for (let i=0; i<10000000; i++) {
            if (Helper.probIndex([2,4]) === 0) {
                zero++;
            } else {
                one++;
            }
        }
        expect(Math.round(one / zero)).toEqual(2);
    });

    it("Checking empty() method", () => {
        expect(Helper.empty({x: 0, y: 0})).toEqual(true);
        expect(Helper.empty({x: 2, y: 0})).toEqual(false);
        expect(Helper.empty({x: 0, y: 2})).toEqual(false);
        expect(Helper.empty({x: 3, y: 2})).toEqual(false);
        expect(Helper.empty({})).toEqual(false);
    });
});