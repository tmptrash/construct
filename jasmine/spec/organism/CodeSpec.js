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
        flag = false;
        code.run();
        expect(flag).toEqual(true);

        code.destroy();
    });

    it("Checking no code size", () => {
        let code = new Code((()=>{}));

        expect(code.size).toEqual(0);
        code.compile();
        expect(code.size).toEqual(0);

        code.destroy();
    });

    it("Checking destroy", () => {
        let flag = false;
        let code = new Code((()=>{flag = true;}));

        code.destroy();
        code.run();
        expect(flag).toEqual(false);
        code.run();
        expect(flag).toEqual(false);

        code.destroy();
    });

    it("Checking clone", () => {
//        let flag = false;
//        let code = new Code((()=>{flag = true;}));
//
//        expect(flag).toEqual(false);
//        code.run();
//        expect(flag).toEqual(false);
//
//        code.destroy();
    });
});