describe("client/src/organism/JSVM", () => {
    let Observer     = require('./../../../common/src/Observer');
    let Helper       = require('./../../../common/src/Helper');
    let THelper      = require('./../../../common/tests/Helper');
    let Config       = require('./../share/Config').Config;
    let OConfig      = require('./../manager/plugins/organisms/Config');
    let api          = require('./../share/Config').api;
    let JSVM         = require('./JSVM');
    let Num          = require('./Num');
    let Operators    = require('./Operators');
    let cls          = null;

    it("Checking jsvm creation", () => {
        let   flag = false;
        const obs  = new Observer(1);
        const jsvm = new JSVM(() => flag = true, obs, ()=>{});

        jsvm.run();
        expect(flag).toEqual(false);

        jsvm.destroy();
    });

    it("Checking parent argument and 'cloning' mode", () => {
        const obs    = new Observer(1);
        const parent = new JSVM(()=>{}, obs, ()=>{});

        parent.insertLine();
        const jsvm   = new JSVM(()=>{}, obs, ()=>{}, parent);

        expect(jsvm.code[0] === parent.code[0]).toEqual(true);
        expect(jsvm.size === parent.size).toEqual(true);
        expect(jsvm.vars[0] === parent.vars[0]).toEqual(true);

        parent.destroy();
        jsvm.destroy();
    });

    it("Checking 'vars' getter for non 'cloning' mode", () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});

        expect(jsvm.vars.length === Math.pow(2, OConfig.codeBitsPerVar)).toEqual(true);

        jsvm.destroy();
    });

    it("Checking no code size", () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});

        expect(jsvm.size).toEqual(0);
        jsvm.run();
        expect(jsvm.size).toEqual(0);

        jsvm.destroy();
    });

    it("Checking destroy", () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});

        jsvm.destroy();
        expect(jsvm.code).toEqual(null);
    });

    it("Checking 'code' and 'size' properties", () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});

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
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, Operators);

        expect(jsvm.operators instanceof Operators).toEqual(true);

        jsvm.destroy();
    });

    // it("Checking run method", () => {
    //     let   flag = '';
    //     class Ops extends Operators {
    //         get operators() {return {1: (n,l)=>{flag=n+''+l;return l+1}}}
    //         get size     () {return 1}
    //     }
    //     const obs  = new Observer(1);
    //     const jsvm = new JSVM(()=>{}, obs, ()=>{});
    //     const coc  = api.get('codeOperatorsCls');
    //     const yp   = api.get('codeYieldPeriod');
    //     const fc   = api.get('codeFitnessCls');
    //     //
    //     // Small hack. Use of private field for this test only
    //     //
    //     jsvm._code.push(0b1000000000000000000000000);
    //     api.set('codeYieldPeriod', 1);
    //     api.set('codeFitnessCls', null);
    //     api.set('codeOperatorsCls', '');
    //     jsvm.run({alive: true});
    //     expect(flag === '167772160').toEqual(true);
    //     api.set('codeYieldPeriod', yp);
    //     api.set('codeFitnessCls', fc);
    //     api.set('codeOperatorsCls', coc);
    //
    //     jsvm.destroy();
    // });

    it("Checking crossover with increasing child code", () => {
        const obs   = new Observer(1);
        const jsvm1 = new JSVM(()=>{}, obs, ()=>{});
        const jsvm2 = new JSVM(()=>{}, obs, ()=>{});
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
        expect(THelper.compare(jsvm1.code, [
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
    it("Checking crossover with decreasing child code", () => {
        const obs   = new Observer(1);
        const jsvm1 = new JSVM(()=>{}, obs, ()=>{});
        const jsvm2 = new JSVM(()=>{}, obs, ()=>{});
        const rand  = Helper.rand;
        let   i     = -1;

        Helper.rand = () => {
            i++;
            if (i === 0) {return 1}
            if (i === 1) {return 2}
            if (i === 2) {return 1}
            if (i === 3) {return 1}
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
        expect(THelper.compare(jsvm1.code, [
            16000000,
            17000001,
            16000003,
            16000004
        ])).toEqual(true);

        Helper.rand = rand;
        jsvm1.destroy();
        jsvm2.destroy();
    });
    it("Checking crossover with the same child code size", () => {
        const obs   = new Observer(1);
        const jsvm1 = new JSVM(()=>{}, obs, ()=>{});
        const jsvm2 = new JSVM(()=>{}, obs, ()=>{});
        const rand  = Helper.rand;
        let   i     = -1;

        Helper.rand = () => {
            i++;
            if (i === 0) {return 1}
            if (i === 1) {return 3}
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
        expect(THelper.compare(jsvm1.code, [
            16000000,
            17000001,
            17000002,
            17000003,
            16000004
        ])).toEqual(true);

        Helper.rand = rand;
        jsvm1.destroy();
        jsvm2.destroy();
    });
    it("Checking crossover with no code size in parents", () => {
        const obs   = new Observer(1);
        const jsvm1 = new JSVM(()=>{}, obs, ()=>{});
        const jsvm2 = new JSVM(()=>{}, obs, ()=>{});

        jsvm1.crossover(jsvm2);
        expect(jsvm1.size).toEqual(0);
        expect(jsvm2.size).toEqual(0);

        jsvm1.destroy();
        jsvm2.destroy();
    });
    it("Checking crossover with no code size for one parent and twp lines of code for other", () => {
        const obs   = new Observer(1);
        const jsvm1 = new JSVM(()=>{}, obs, ()=>{});
        const jsvm2 = new JSVM(()=>{}, obs, ()=>{});
        const rand  = Helper.rand;
        let   i     = -1;

        Helper.rand = () => {
            i++;
            if (i === 0) {return 0}
            if (i === 1) {return 0}
            if (i === 2) {return 1}
            if (i === 3) {return 2}
        };

        jsvm2._code.push(17000000);
        jsvm2._code.push(17000001);
        jsvm2._code.push(17000002);
        jsvm2._code.push(17000003);

        jsvm1.crossover(jsvm2);
        expect(THelper.compare(jsvm1.code, [
            17000001,
            17000002
        ])).toEqual(true);

        Helper.rand = rand;
        jsvm1.destroy();
        jsvm2.destroy();
    });
    it("Checking crossover with no code size for one parent and twp lines of code for other 2", () => {
        const obs   = new Observer(1);
        const jsvm1 = new JSVM(()=>{}, obs, ()=>{});
        const jsvm2 = new JSVM(()=>{}, obs, ()=>{});
        const rand  = Helper.rand;
        let   i     = -1;

        Helper.rand = () => {
            i++;
            if (i === 0) {return 1}
            if (i === 1) {return 2}
            if (i === 2) {return 0}
            if (i === 3) {return 0}
        };

        jsvm1._code.push(16000000);
        jsvm1._code.push(16000001);
        jsvm1._code.push(16000002);
        jsvm1._code.push(16000003);

        jsvm1.crossover(jsvm2);
        expect(THelper.compare(jsvm1.code, [
            16000000,
            16000003,
        ])).toEqual(true);
        expect(jsvm2.size).toEqual(0);

        Helper.rand = rand;
        jsvm1.destroy();
        jsvm2.destroy();
    });

    it('Checking insertLine() method', () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});

        expect(jsvm.size).toEqual(0);
        jsvm.insertLine();
        expect(jsvm.size).toEqual(1);
        jsvm.insertLine();
        expect(jsvm.size).toEqual(2);

        jsvm.destroy();
    });
    it('Checking insertLine() method 2', () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});
        let   get  = Num.get;

        Num.get = () => 0xabcdefff;
        expect(jsvm.size).toEqual(0);
        jsvm.insertLine();
        expect(jsvm.size).toEqual(1);

        expect(jsvm.code[0]).toEqual(0xabcdefff);

        Num.get = get;
        jsvm.destroy();
    });

    it('Checking copyLines() method', () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});
        let   rand = Helper.rand;
        let   i    = -1;

        jsvm.insertLine();
        jsvm.insertLine();
        jsvm.insertLine();
        jsvm.insertLine();
        Helper.rand = function (n) {
            i++;
            if (i === 0) {        // start
                return 1;
            } else if (i === 1) { // end
                return 2;
            } else if (i === 2) { // rand(2)
                return 0;
            } else if (i === 3) { // rand(start)
                return 0;
            }
        };
        expect(jsvm.size).toEqual(4);
        jsvm.copyLines();
        expect(jsvm.size).toEqual(6);
        expect(jsvm.code[0]).toEqual(jsvm.code[3]);
        expect(jsvm.code[1]).toEqual(jsvm.code[4]);

        Helper.rand = rand;
        jsvm.destroy();
    });
    it('Checking copyLines() method 2', () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});
        let   rand = Helper.rand;
        let   i    = -1;

        jsvm.insertLine();
        jsvm.insertLine();
        jsvm.insertLine();
        jsvm.insertLine();
        Helper.rand = function (n) {
            i++;
            if (i === 0) {        // start
                return 1;
            } else if (i === 1) { // end
                return 2;
            } else if (i === 2) { // rand(2)
                return 1;
            } else if (i === 3) { // rand(codeLen - end)
                return 0;
            }
        };
        expect(jsvm.size).toEqual(4);
        jsvm.copyLines();
        expect(jsvm.size).toEqual(6);
        expect(jsvm.code[1]).toEqual(jsvm.code[3]);
        expect(jsvm.code[2]).toEqual(jsvm.code[4]);

        Helper.rand = rand;
        jsvm.destroy();
    });
    it('Checking copyLines() method 3', () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});
        let   rand = Helper.rand;
        let   i    = -1;

        jsvm.insertLine();
        jsvm.insertLine();
        jsvm.insertLine();
        jsvm.insertLine();
        Helper.rand = function (n) {
            i++;
            if (i === 0) {        // start
                return 1;
            } else if (i === 1) { // end
                return 2;
            } else if (i === 2) { // rand(2)
                return 1;
            } else if (i === 3) { // rand(codeLen - end)
                return 1;
            }
        };
        expect(jsvm.size).toEqual(4);
        jsvm.copyLines();
        expect(jsvm.size).toEqual(6);
        expect(jsvm.code[1]).toEqual(jsvm.code[4]);
        expect(jsvm.code[2]).toEqual(jsvm.code[5]);

        Helper.rand = rand;
        jsvm.destroy();
    });
    it('Checking copyLines() method with no code', () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});
        let   rand = Helper.rand;

        Helper.rand = () => 0;
        expect(jsvm.size).toEqual(0);
        jsvm.copyLines();
        expect(jsvm.size).toEqual(0);

        Helper.rand = rand;
        jsvm.destroy();
    });

    it('Checking updateLine() method', () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});
        let   get  = Num.get;

        Num.get = () => 0xabcdefff;
        jsvm.insertLine();
        expect(jsvm.code[0]).toEqual(0xabcdefff);

        jsvm.updateLine(0, 0xffffffff);
        expect(jsvm.code[0]).toEqual(0xffffffff);

        jsvm.updateLine(0, 0x12345678);
        expect(jsvm.code[0]).toEqual(0x12345678);

        Num.get = get;
        jsvm.destroy();
    });

    it('Checking removeLine() method', () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});

        jsvm.insertLine();
        expect(jsvm.size).toEqual(1);
        jsvm.removeLine();
        expect(jsvm.size).toEqual(0);

        jsvm.destroy();
    });
    it('Checking removeLine() for empty code', () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});

        expect(jsvm.size).toEqual(0);
        jsvm.removeLine();
        expect(jsvm.size).toEqual(0);
        jsvm.removeLine();
        expect(jsvm.size).toEqual(0);

        jsvm.destroy();
    });

    it('Checking getLine()', () => {
        const obs  = new Observer(2);
        const jsvm = new JSVM(()=>{}, obs, ()=>{});
        let get  = Num.get;

        Num.get = () => 0xabcdefff;
        expect(jsvm.size).toEqual(0);
        expect(jsvm.getLine(0)).toEqual(undefined);
        expect(jsvm.getLine(1)).toEqual(undefined);
        jsvm.insertLine();
        expect(jsvm.size).toEqual(1);
        expect(jsvm.getLine(0)).toEqual(0xabcdefff);

        jsvm.removeLine();
        expect(jsvm.size).toEqual(0);
        expect(jsvm.getLine(0)).toEqual(undefined);
        expect(jsvm.getLine(1)).toEqual(undefined);
        expect(jsvm.getLine(9)).toEqual(undefined);

        Num.get = get;
        jsvm.destroy();
    });
});