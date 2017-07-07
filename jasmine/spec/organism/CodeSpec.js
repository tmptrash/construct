describe("src/organism/Code", () => {
    let Code = require('../../../src/organism/Code').default;

    it("Checking code creation", () => {
        let flag = false;
        function cb() {flag = true;}
        let code = new Code(cb);

        code.run();
        expect(flag).toEqual(false);
        code.run();
        expect(flag).toEqual(true);
    });
});