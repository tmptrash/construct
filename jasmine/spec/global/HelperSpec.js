describe("src/global/Helper", () => {
    let Helper = require('../../../src/global/Helper').default;

    it("Checking rand() method", () => {
        let val = Helper.rand(2);
        expect(val === 0 || val === 1).toEqual(true);
    });
});