describe("src/organism/OperatorsDos", () => {
    let OperatorsDos = require('../../../src/organism/OperatorsDos').default;
    let Helper       = require('../../../src/global/Helper').default;
    let Observer     = require('../../../src/global/Observer').default;

    it("Checking onVar() method", () => {
        let ops = new OperatorsDos([], [0, 0, 0, 0], new Observer());

        expect(ops.onVar(0x00ffffff, 0)).toEqual(1);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 0).toEqual(true);
        expect(ops.vars[2] === 0).toEqual(true);
        expect(ops.vars[3] === 0).toEqual(true);
        expect(ops.onVar(0x000fffff, 0)).toEqual(1);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 0).toEqual(true);
        expect(ops.vars[2] === 0).toEqual(true);
        expect(ops.vars[3] === 0).toEqual(true);
        //expect(ops.onVar(0x001fffff)).toEqual('v0=v1');
    });

    // it("Checking onCondition() method", () => {
    //     let ops = new OperatorsDos([], [0, 1, 2, 3], new Observer());
    //
    //     expect(ops.onCondition(0x01ffffff), 0, 1).toEqual('yield;if(v3!=v3){');
    //     expect(ops.onCondition(0x011fffff), 0, 1).toEqual('yield;if(v0!=v1){');
    //     expect(ops.onCondition(0x011abfff), 0, 1).toEqual('yield;if(v0==v1){');
    //     expect(ops.onCondition(0x01ffffff), 0, 1).toEqual('yield;if(v3!=v3){');
    // });
    //
    // it("Checking onLoop() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onLoop(0x02ffffff), 0, 1).toEqual('for(v3=v3;v3<v3;v3++){yield');
    //     expect(ops.onLoop(0x028fffff), 0, 1).toEqual('for(v2=v0;v2<v3;v2++){yield');
    //     expect(ops.onLoop(0x0287ffff), 0, 1).toEqual('for(v2=v0;v2<v1;v2++){yield');
    //     expect(ops.onLoop(0x02ffffff), 0, 1).toEqual('for(v3=v3;v3<v3;v3++){yield');
    // });
    //
    // it("Checking onOperator() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onOperator(0x031a3fff), 0, 1).toEqual('v0=v1>>v2');
    //     expect(ops.onOperator(0x036c7fff), 0, 1).toEqual('v1=v2-v3');
    //     expect(ops.onOperator(0x036fffff), 0, 1).toEqual('v1=v2<=v3');
    //     expect(ops.onOperator(0x03ffffff), 0, 1).toEqual('v3=v3<=v3');
    // });
    //
    // it("Checking onNot() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onNot(0x041fffff), 0, 1).toEqual('v0=!v1');
    //     expect(ops.onNot(0x046fffff), 0, 1).toEqual('v1=!v2');
    //     expect(ops.onNot(0x04ffffff), 0, 1).toEqual('v3=!v3');
    // });
    //
    // it("Checking onPi() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onPi(0x053fffff), 0, 1).toEqual('v0=pi');
    //     expect(ops.onPi(0x057fffff), 0, 1).toEqual('v1=pi');
    //     expect(ops.onPi(0x05ffffff), 0, 1).toEqual('v3=pi');
    // });
    //
    // it("Checking onTrig() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onTrig(0x061bffff), 0, 1).toEqual('v0=Math.tan(v1)');
    //     expect(ops.onTrig(0x0663ffff), 0, 1).toEqual('v1=Math.sin(v2)');
    //     expect(ops.onTrig(0x06ffffff), 0, 1).toEqual('v3=Math.abs(v3)');
    // });
    //
    // it("Checking onLookAt() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onLookAt(0x071bffff), 0, 1).toEqual('v0=org.lookAt(v1,v2)');
    //     expect(ops.onLookAt(0x076fffff), 0, 1).toEqual('v1=org.lookAt(v2,v3)');
    //     expect(ops.onLookAt(0x07ffffff), 0, 1).toEqual('v3=org.lookAt(v3,v3)');
    // });
    //
    // it("Checking onEatLeft() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onEatLeft(0x081fffff), 0, 1).toEqual('v0=org.eatLeft(v1)');
    //     expect(ops.onEatLeft(0x086fffff), 0, 1).toEqual('v1=org.eatLeft(v2)');
    //     expect(ops.onEatLeft(0x08ffffff), 0, 1).toEqual('v3=org.eatLeft(v3)');
    // });
    // it("Checking onEatRight() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onEatRight(0x081fffff), 0, 1).toEqual('v0=org.eatRight(v1)');
    //     expect(ops.onEatRight(0x086fffff), 0, 1).toEqual('v1=org.eatRight(v2)');
    //     expect(ops.onEatRight(0x08ffffff), 0, 1).toEqual('v3=org.eatRight(v3)');
    // });
    // it("Checking onEatUp() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onEatUp(0x081fffff), 0, 1).toEqual('v0=org.eatUp(v1)');
    //     expect(ops.onEatUp(0x086fffff), 0, 1).toEqual('v1=org.eatUp(v2)');
    //     expect(ops.onEatUp(0x08ffffff), 0, 1).toEqual('v3=org.eatUp(v3)');
    // });
    // it("Checking onEatDown() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onEatDown(0x081fffff), 0, 1).toEqual('v0=org.eatDown(v1)');
    //     expect(ops.onEatDown(0x086fffff), 0, 1).toEqual('v1=org.eatDown(v2)');
    //     expect(ops.onEatDown(0x08ffffff), 0, 1).toEqual('v3=org.eatDown(v3)');
    // });
    //
    // it("Checking onStepLeft() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onStepLeft(0x081fffff), 0, 1).toEqual('v0=org.stepLeft()');
    //     expect(ops.onStepLeft(0x086fffff), 0, 1).toEqual('v1=org.stepLeft()');
    //     expect(ops.onStepLeft(0x08ffffff), 0, 1).toEqual('v3=org.stepLeft()');
    // });
    // it("Checking onStepRight() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onStepRight(0x081fffff), 0, 1).toEqual('v0=org.stepRight()');
    //     expect(ops.onStepRight(0x086fffff), 0, 1).toEqual('v1=org.stepRight()');
    //     expect(ops.onStepRight(0x08ffffff), 0, 1).toEqual('v3=org.stepRight()');
    // });
    // it("Checking onStepUp() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onStepUp(0x081fffff), 0, 1).toEqual('v0=org.stepUp()');
    //     expect(ops.onStepUp(0x086fffff), 0, 1).toEqual('v1=org.stepUp()');
    //     expect(ops.onStepUp(0x08ffffff), 0, 1).toEqual('v3=org.stepUp()');
    // });
    // it("Checking onStepDown() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onStepDown(0x081fffff), 0, 1).toEqual('v0=org.stepDown()');
    //     expect(ops.onStepDown(0x086fffff), 0, 1).toEqual('v1=org.stepDown()');
    //     expect(ops.onStepDown(0x08ffffff), 0, 1).toEqual('v3=org.stepDown()');
    // });
    //
    // it("Checking onFromMem() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onFromMem(0x081fffff), 0, 1).toEqual('v0=org.fromMem()');
    //     expect(ops.onFromMem(0x086fffff), 0, 1).toEqual('v1=org.fromMem()');
    //     expect(ops.onFromMem(0x08ffffff), 0, 1).toEqual('v3=org.fromMem()');
    // });
    //
    // it("Checking onToMem() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onToMem(0x081fffff), 0, 1).toEqual('org.toMem(v0)');
    //     expect(ops.onToMem(0x086fffff), 0, 1).toEqual('org.toMem(v1)');
    //     expect(ops.onToMem(0x08ffffff), 0, 1).toEqual('org.toMem(v3)');
    // });
    //
    // it("Checking onMyX() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onMyX(0x081fffff), 0, 1).toEqual('v0=org.myX()');
    //     expect(ops.onMyX(0x086fffff), 0, 1).toEqual('v1=org.myX()');
    //     expect(ops.onMyX(0x08ffffff), 0, 1).toEqual('v3=org.myX()');
    // });
    // it("Checking onMyY() method", () => {
    //     let ops = new OperatorsDos([]);
    //
    //     expect(ops.onMyY(0x081fffff), 0, 1).toEqual('v0=org.myY()');
    //     expect(ops.onMyY(0x086fffff), 0, 1).toEqual('v1=org.myY()');
    //     expect(ops.onMyY(0x08ffffff), 0, 1).toEqual('v3=org.myY()');
    // });
});