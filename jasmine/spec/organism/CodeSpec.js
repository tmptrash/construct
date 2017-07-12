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
        let code  = new Code((()=>{}));
        let code1 = new Code(()=>{});

        code.insertLine();
        expect(code.size).toEqual(1);
        code1.clone(code);
        expect(code1.size).toEqual(1);
        expect(code1._byteCode[0] === code._byteCode[0]).toEqual(true);

        code.destroy();
    });

    it('Checking insertLine() method', () => {
        let code  = new Code((()=>{}));

        code.insertLine();
        expect(code.size).toEqual(1);
        code.insertLine();
        expect(code.size).toEqual(2);

        code.destroy();
    })
});