describe("src/organism/JSVM", () => {
    let JSVM         = require('../../../src/organism/JSVM').default;
    let Num          = require('../../../src/organism/Num').default;
    let Observer     = require('../../../src/global/Observer').default;
    let Helper       = require('../../../src/global/Helper').default;
    let Operators    = require('../../../src/organism/base/Operators').default;
    let Config       = require('../../../src/global/Config').Config;
    let api          = require('../../../src/global/Config').api;
    let cls          = null;

    function compare(a1, a2) {
        if (a1.length !== a2.length) {return false}
        return !a1.some((a) => a2.indexOf(a) === -1)
    }

    beforeEach(() => {cls = Config.codeOperatorsCls;api.set('codeOperatorsCls', 'ops')});
    afterEach(() => api.set('codeOperatorsCls', cls));

    it("Checking jsvm creation", () => {
        let   flag = false;
        const obs  = new Observer(1);
        const clss = {ops: () => {}};
        const jsvm = new JSVM(() => flag = true, obs, clss);

        jsvm.run();
        expect(flag).toEqual(false);

        jsvm.destroy();
    });

    it("Checking parent argument and 'cloning' mode", () => {
        const clss   = {ops: () => {}};
        const obs    = new Observer(1);
        const parent = new JSVM(()=>{}, obs, clss);

        parent.insertLine();
        const jsvm   = new JSVM(()=>{}, obs, clss, parent);

        expect(jsvm.code[0] === parent.code[0]).toEqual(true);
        expect(jsvm.size === parent.size).toEqual(true);
        expect(jsvm.vars[0] === parent.vars[0]).toEqual(true);

        parent.destroy();
        jsvm.destroy();
    });

    it("Checking 'vars' getter for non 'cloning' mode", () => {
        const clss = {ops: () => {}};
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, clss);

        expect(jsvm.vars.length === Config.codeVarAmount).toEqual(true);

        jsvm.destroy();
    });

    it("Checking no code size", () => {
        const clss = {ops: () => {}};
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, clss);

        expect(jsvm.size).toEqual(0);
        jsvm.run();
        expect(jsvm.size).toEqual(0);

        jsvm.destroy();
    });

    it("Checking destroy", () => {
        const clss = {ops: () => {}};
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, clss);

        jsvm.destroy();
        expect(jsvm.code).toEqual(null);
    });

    it("Checking 'code' and 'size' properties", () => {
        const clss = {ops: () => {}};
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, clss);

        expect(jsvm.code instanceof Array).toEqual(true);
        expect(jsvm.size).toEqual(0);

        jsvm.insertLine();
        expect(jsvm.code instanceof Array).toEqual(true);
        expect(jsvm.size).toEqual(1);

        jsvm.insertLine();
        expect(jsvm.size).toEqual(2);
        jsvm.removeLine();
        expect(jsvm.size).toEqual(1);
        jsvm.removeLine();
        expect(jsvm.size).toEqual(0);

        jsvm.destroy();
    });

    it("Checking 'operators' property", () => {
        function Ops() {}
        const clss = {ops: Ops};
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, clss);

        expect(jsvm.operators instanceof Ops).toEqual(true);

        jsvm.destroy();
    });

    it("Checking run method", () => {
        let   flag = '';
        class Ops extends Operators {
            get operators() {return {1: (n,l)=>{flag=n+''+l;return l+1}}};
            get size     () {return 1};
        }
        const clss = {ops: Ops};
        const obs  = new Observer(1);
        const jsvm = new JSVM(()=>{}, obs, clss);
        const yp   = api.get('codeYieldPeriod');
        const fc   = api.get('codeFitnessCls');
        //
        // Small hack. Use of private field for this test only
        //
        jsvm._code.push(0b1000000000000000000000000);
        api.set('codeYieldPeriod', 1);
        api.set('codeFitnessCls', null);
        jsvm.run({alive: true});
        expect(flag === '167772160').toEqual(true);
        api.set('codeYieldPeriod', yp);
        api.set('codeFitnessCls', fc);

        jsvm.destroy();
    });

    it("Checking crossover with increasing child code", () => {
        const clss  = {ops: () => {}};
        const obs   = new Observer(1);
        const jsvm1 = new JSVM(()=>{}, obs, clss);
        const jsvm2 = new JSVM(()=>{}, obs, clss);
        const rand  = Helper.rand;
        let   i     = -1;

        Helper.rand = () => {
            i++;
            if (i === 0) {return 1}
            if (i === 1) {return 2}
            if (i === 2) {return 1}
            if (i === 3) {return 3}
        };

        jsvm1._code.push(16000000);
        jsvm1._code.push(16000001);
        jsvm1._code.push(16000002);
        jsvm1._code.push(16000003);
        jsvm1._code.push(16000004);

        jsvm2._code.push(17000000);
        jsvm2._code.push(17000001);
        jsvm2._code.push(17000002);
        jsvm2._code.push(17000003);
        jsvm2._code.push(17000004);

        jsvm1.crossover(jsvm2);
        expect(compare(jsvm1.code, [
            16000000,
            17000001,
            17000002,
            17000003,
            16000003,
            16000004
        ])).toEqual(true);

        Helper.rand = rand;
        jsvm1.destroy();
        jsvm2.destroy();
    });
    // it('Checking insertLine() method', () => {
    //     let code = new JSVM((()=>{}));
    //
    //     code.insertLine();
    //     expect(code.size).toEqual(1);
    //     code.insertLine();
    //     expect(code.size).toEqual(2);
    //
    //     code.destroy();
    // });
    // it('Checking insertLine() method 2', () => {
    //     let code = new JSVM((()=>{}));
    //     let get  = Num.get;
    //     let bc;
    //
    //     Num.get = () => 0xabcdefff;
    //     expect(code.size).toEqual(0);
    //     code.insertLine();
    //     expect(code.size).toEqual(1);
    //
    //     bc = code.cloneByteCode();
    //     expect(bc[0]).toEqual(0xabcdefff);
    //
    //     Num.get = get;
    //     code.destroy();
    // });
    //
    // it('Checking updateLine() method', () => {
    //     let code = new JSVM((()=>{}));
    //     let get  = Num.get;
    //     let bc;
    //
    //     Num.get = () => 0xabcdefff;
    //     code.insertLine();
    //     bc = code.cloneByteCode();
    //     expect(bc[0]).toEqual(0xabcdefff);
    //
    //     code.updateLine(0, 0xffffffff);
    //     bc = code.cloneByteCode();
    //     expect(bc[0]).toEqual(0xffffffff);
    //
    //     code.updateLine(0, 0x12345678);
    //     bc = code.cloneByteCode();
    //     expect(bc[0]).toEqual(0x12345678);
    //
    //
    //     Num.get = get;
    //     code.destroy();
    // });
    //
    // it('Checking removeLine() method', () => {
    //     let code = new JSVM((()=>{}));
    //
    //     code.insertLine();
    //     expect(code.size).toEqual(1);
    //     code.removeLine();
    //     expect(code.size).toEqual(0);
    //
    //     code.destroy();
    // });
    //
    // it('Checking removeLine() for empty jsvm', () => {
    //     let code = new JSVM((()=>{}));
    //
    //     expect(code.size).toEqual(0);
    //     code.removeLine();
    //     expect(code.size).toEqual(0);
    //
    //     code.destroy();
    // });
    //
    // it('Checking getLine()', () => {
    //     let code = new JSVM((()=>{}));
    //     let get  = Num.get;
    //
    //     Num.get = () => 0xabcdefff;
    //     expect(code.size).toEqual(0);
    //     expect(code.getLine(0)).toEqual(undefined);
    //     expect(code.getLine(1)).toEqual(undefined);
    //     code.insertLine();
    //     expect(code.size).toEqual(1);
    //     expect(code.getLine(0)).toEqual(0xabcdefff);
    //
    //     code.removeLine();
    //     expect(code.size).toEqual(0);
    //     expect(code.getLine(0)).toEqual(undefined);
    //     expect(code.getLine(1)).toEqual(undefined);
    //     expect(code.getLine(9)).toEqual(undefined);
    //
    //     Num.get = get;
    //     code.destroy();
    // });
    //
    // it('Checking compile()', () => {
    //     let code = new JSVM((()=>{}));
    //     let get  = Num.get;
    //
    //     Num.get = () => 0x01cdefff;
    //     expect(code.size).toEqual(0);
    //     code.insertLine();
    //     expect(code.size).toEqual(1);
    //     expect(code.cloneCode().length).toEqual(0);
    //
    //     code.compile({});
    //     expect(code.cloneCode().length).toEqual(1);
    //
    //     Num.get = get;
    //     code.destroy();
    // });
    // it('Checking compile() with no byte jsvm', () => {
    //     let code = new JSVM((()=>{}));
    //
    //     expect(code.size).toEqual(0);
    //     code.compile({});
    //     expect(code.cloneCode().length).toEqual(0);
    //
    //     code.destroy();
    // });
});