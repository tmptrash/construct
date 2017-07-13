describe("src/organism/Code", () => {
    let Code = require('../../../src/organism/Code').default;
	let Num  = require('../../../src/organism/Num').default;

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

    it("Checking clone()", () => {
        let code1 = new Code((()=>{}));
        let code2 = new Code(()=>{});
        let bc1;
        let bc2;

        expect(code1.size).toEqual(0);
        code1.insertLine();
        expect(code1.size).toEqual(1);
        code2.clone(code1);
        expect(code2.size).toEqual(1);
        bc1 = code1.cloneByteCode();
        bc2 = code2.cloneByteCode();
        expect(bc1[0] === bc2[0]).toEqual(true);

        code1.destroy();
    });

    it("Checking cloneCode()", () => {
        let code1 = new Code((()=>{}));
        let bc1;

        expect(code1.size).toEqual(0);
        code1.insertLine();
        expect(code1.size).toEqual(1);
        bc1 = code1.cloneCode();
        expect(code1._code !== bc1).toEqual(true);
        expect(bc1[0] === code1._code[0]).toEqual(true);

        code1.destroy();
    });

    it("Checking cloneByteCode()", () => {
        let code1 = new Code((()=>{}));
        let bc1;

        expect(code1.size).toEqual(0);
        code1.insertLine();
        expect(code1.size).toEqual(1);
        bc1 = code1.cloneByteCode();
        expect(code1._byteCode !== bc1).toEqual(true);
        expect(bc1[0] === code1._byteCode[0]).toEqual(true);

        code1.destroy();
    });

    it('Checking insertLine() method', () => {
        let code = new Code((()=>{}));

        code.insertLine();
        expect(code.size).toEqual(1);
        code.insertLine();
        expect(code.size).toEqual(2);

        code.destroy();
    });
    it('Checking insertLine() method 2', () => {
        let code = new Code((()=>{}));
		let get  = Num.get;
		let bc;
		
		Num.get = () => 0xabcdefff;
		expect(code.size).toEqual(0);
        code.insertLine();
        expect(code.size).toEqual(1);
		
		bc = code.cloneByteCode();
		expect(bc[0]).toEqual(0xabcdefff);

		Num.get = get;
        code.destroy();
    });
	
    it('Checking updateLine() method', () => {
        let code = new Code((()=>{}));
		let get  = Num.get;
		let bc;
		
		Num.get = () => 0xabcdefff;
        code.insertLine();
		bc = code.cloneByteCode();
		expect(bc[0]).toEqual(0xabcdefff);
		
		code.updateLine(0, 0xffffffff);
		bc = code.cloneByteCode();
		expect(bc[0]).toEqual(0xffffffff);

		code.updateLine(0, 0x12345678);
		bc = code.cloneByteCode();
		expect(bc[0]).toEqual(0x12345678);

		
		Num.get = get;
        code.destroy();
    });
	
    it('Checking removeLine() method', () => {
        let code = new Code((()=>{}));
		
        code.insertLine();
		expect(code.size).toEqual(1);
		code.removeLine();
		expect(code.size).toEqual(0);

        code.destroy();
    });
	
    it('Checking removeLine() for empty code', () => {
        let code = new Code((()=>{}));
		
		expect(code.size).toEqual(0);
		code.removeLine();
		expect(code.size).toEqual(0);

        code.destroy();
    });
	
    it('Checking getLine()', () => {
        let code = new Code((()=>{}));
		let get  = Num.get;
		
		Num.get = () => 0xabcdefff;
		expect(code.size).toEqual(0);
		expect(code.getLine(0)).toEqual(undefined);
		expect(code.getLine(1)).toEqual(undefined);
		code.insertLine();
		expect(code.size).toEqual(1);
		expect(code.getLine(0)).toEqual(0xabcdefff);
		
		code.removeLine();
		expect(code.size).toEqual(0);
		expect(code.getLine(0)).toEqual(undefined);
		expect(code.getLine(1)).toEqual(undefined);
		expect(code.getLine(9)).toEqual(undefined);

		Num.get = get;
        code.destroy();
    });
	
	it('Checking compile()', () => {
        let code = new Code((()=>{}));
		let get  = Num.get;
		
		Num.get = () => 0x01cdefff;
		expect(code.size).toEqual(0);
		code.insertLine();
		expect(code.size).toEqual(1);
		expect(code.cloneCode().length).toEqual(0);
		
		code.compile({});
		expect(code.cloneCode().length).toEqual(1);

		Num.get = get;
        code.destroy();
    });
});