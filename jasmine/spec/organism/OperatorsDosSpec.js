describe("src/organism/OperatorsDos", () => {
    let OperatorsDos = require('../../../src/organism/OperatorsDos').default;
    let Helper       = require('../../../src/global/Helper').default;
    let Observer     = require('../../../src/global/Observer').default;
    let EVENTS       = require('../../../src/global/Events').EVENTS;
    let EVENT_AMOUNT = require('../../../src/global/Events').EVENT_AMOUNT;

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
        expect(ops.onVar(0x0000ffff, 0)).toEqual(1);
        expect(ops.vars[0] === 0x3fff).toEqual(true);
        expect(ops.vars[1] === 0).toEqual(true);
        expect(ops.vars[2] === 0).toEqual(true);
        expect(ops.vars[3] === 0).toEqual(true);

        ops.destroy();
    });
    it("Checking onVar() method 2", () => {
        let ops = new OperatorsDos([], [1, 2, 3, 4], new Observer());

        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 2).toEqual(true);
        expect(ops.vars[2] === 3).toEqual(true);
        expect(ops.vars[3] === 4).toEqual(true);
        expect(ops.onVar(0x001fffff, 0)).toEqual(1);
        expect(ops.vars[0] === 2).toEqual(true);
        expect(ops.vars[1] === 2).toEqual(true);
        expect(ops.vars[2] === 3).toEqual(true);
        expect(ops.vars[3] === 4).toEqual(true);

        ops.destroy();
    });

    it("Checking onCondition() method", () => {
        let ops = new OperatorsDos([], [0, 1, 2, 3], new Observer());

        expect(ops.onCondition(0x01ffffff, 0, {}, 0)).toEqual(0);   //if(v3!=v3)');
        expect(ops.onCondition(0x011fffff, 0, {}, 0)).toEqual(1);   //if(v0!=v1)');
        expect(ops.onCondition(0x011abfff, 0, {}, 0)).toEqual(0);   //if(v0==v1)');
        expect(ops.onCondition(0x01ffffff, 0, {}, 0)).toEqual(0);   //if(v3!=v3)');
        expect(ops.onCondition(0x011fffff, 0, {}, 2)).toEqual(1);   //if(v0!=v1)');
        expect(ops.onCondition(0x01ffffff, 0, {}, 2)).toEqual(2);   //if(v3!=v3)');
        expect(ops.onCondition(0x01ffffff, 0, {}, 20)).toEqual(16); //if(v3!=v3)');

        ops.destroy();
    });

    it("Checking onLoop() method", () => {
        let ops = new OperatorsDos([], [0, 1, 2, 3], new Observer());

        expect(ops.onLoop(0x02ffffff, 0, {}, 2)).toEqual(2);   //for(v3=v3;v3<v3;v3++);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onLoop(0x02ffffff, 0, {}, 20)).toEqual(16); //for(v3=v3;v3<v3;v3++);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onLoop(0x02ffffff, 0, {}, 20, true)).toEqual(16); //for(v3=v3;v3<v3;v3++);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 4).toEqual(true);

        ops.destroy();
    });
    it("Checking onLoop() method 2", () => {
        let ops = new OperatorsDos([], [0, 1, 2, 3], new Observer());

        expect(ops.onLoop(0x028fffff, 0, {}, 20)).toEqual(1);   //for(v2=v0;v2<v3;v2++);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 0).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onLoop(0x028fffff, 0, {}, 20, true)).toEqual(1);   //for(v2=v0;v2<v3;v2++);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 1).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onLoop(0x028fffff, 0, {}, 20, true)).toEqual(1);   //for(v2=v0;v2<v3;v2++);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onLoop(0x028fffff, 0, {}, 20, true)).toEqual(16);   //for(v2=v0;v2<v3;v2++);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 3).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        ops.destroy();
    });
    it("Checking onLoop() method 3", () => {
        let ops = new OperatorsDos([], [0, 1, 2, 3], new Observer());

        expect(ops.onLoop(0x0287ffff, 0, {}, 15)).toEqual(1);   //for(v2=v0;v2<v1;v2++);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 0).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onLoop(0x0287ffff, 0, {}, 15, true)).toEqual(15);  //for(v2=v0;v2<v1;v2++);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 1).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        ops.destroy();
    });

    it("Checking onOperator() method", () => {
        let ops = new OperatorsDos([], [0, 3, 1, 3], new Observer());

        expect(ops.onOperator(0x031a3fff, 0, {}, 1)).toEqual(1); //'v0=v1>>v2';
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 3).toEqual(true);
        expect(ops.vars[2] === 1).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        ops.destroy();
    });
    it("Checking onOperator() method 2", () => {
        let ops = new OperatorsDos([], [0, 3, 1, 3], new Observer());

        expect(ops.onOperator(0x036c7fff, 1, {}, 1)).toEqual(2); //'v1=v2-v3';
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === -2).toEqual(true);
        expect(ops.vars[2] === 1).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        ops.destroy();
    });
    it("Checking onOperator() method 3", () => {
        let ops = new OperatorsDos([], [0, 3, 1, 3], new Observer());

        expect(ops.onOperator(0x036fffff, 3, 1)).toEqual(4); //'v1=v2<=v3';
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 1).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        ops.destroy();
    });
    it("Checking onOperator() method 3", () => {
        let ops = new OperatorsDos([], [0, 3, 1, 3], new Observer());

        expect(ops.onOperator(0x03ffffff, 7, {}, 1)).toEqual(8); //'v3=v3<=v3';
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 3).toEqual(true);
        expect(ops.vars[2] === 1).toEqual(true);
        expect(ops.vars[3] === 1).toEqual(true);

        ops.destroy();
    });

    it("Checking onNot() method", () => {
        let ops = new OperatorsDos([], [0, 1, 2, 3], new Observer());

        expect(ops.onNot(0x041fffff, 0, {}, 1)).toEqual(1); //'v0=!v1';
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onNot(0x046fffff, 1, {}, 1)).toEqual(2); //'v1=!v2';
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 0).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onNot(0x04ffffff, 2, {}, 1)).toEqual(3); //'v3=!v3';
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 0).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 0).toEqual(true);
    });
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

    it("Checking onLookAt() in a complex way", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);

        expect(ops.onLookAt(0x071bffff, 0, {}, 1)).toEqual(1);//v0=org.lookAt(v1,v2);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        obs.on(EVENTS.GET_ENERGY, (org, x, y, ret) => {
            ret.ret = 7;
            expect(x === 1 && y === 2).toEqual(true);
        });
        expect(ops.onLookAt(0x071bffff, 0, {}, 1)).toEqual(1);//v0=org.lookAt(v1,v2);
        expect(ops.vars[0] === 7).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        obs.clear();
        obs.on(EVENTS.GET_ENERGY, (org, x, y, ret) => {
            ret.ret = 8;
            expect(x === 2 && y === 3).toEqual(true);
        });
        expect(ops.onLookAt(0x076fffff, 1, {}, 1)).toEqual(2);//v1=org.lookAt(v2,v3);
        expect(ops.vars[0] === 7).toEqual(true);
        expect(ops.vars[1] === 8).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        obs.clear();
        obs.on(EVENTS.GET_ENERGY, (org, x, y, ret) => {
            ret.ret = 9;
            expect(x === 3 && y === 3).toEqual(true);
        });
        expect(ops.onLookAt(0x07ffffff, 3, {}, 1)).toEqual(4);//v3=org.lookAt(v3,v3);
        expect(ops.vars[0] === 7).toEqual(true);
        expect(ops.vars[1] === 8).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 9).toEqual(true);

        obs.clear();
        ops.destroy();
    });

    it("Checking onEatLeft() method", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:4, y:5, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 1).toEqual(true);
            ret.ret = 5;
            expect(x === 3 && y === 5).toEqual(true);
        });
        expect(ops.onEatLeft(0x081fffff, 0, org, 1)).toEqual(1); // v0=org.eatLeft(v1);
        expect(ops.vars[0] === 5).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.energy === 5).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onEatLeft() method 2", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:5, y:6, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 2).toEqual(true);
            ret.ret = 5;
            expect(x === 4 && y === 6).toEqual(true);
        });
        expect(ops.onEatLeft(0x086fffff, 0, org, 1)).toEqual(1); // v1=org.eatLeft(v2);
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 5).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.energy === 5).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onEatLeft() method 3", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:3, y:4, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 3).toEqual(true);
            ret.ret = 1;
            expect(x === 2 && y === 4).toEqual(true);
        });
        expect(ops.onEatLeft(0x08ffffff, 0, org, 1)).toEqual(1); // v3=org.eatLeft(v3);
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 1).toEqual(true);
        expect(org.energy === 1).toEqual(true);

        obs.clear();
        ops.destroy();
    });

    it("Checking onEatRight() method", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:4, y:5, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 1).toEqual(true);
            ret.ret = 5;
            expect(x === 5 && y === 5).toEqual(true);
        });
        expect(ops.onEatRight(0x081fffff, 0, org, 1)).toEqual(1); // v0=org.eatRight(v1);
        expect(ops.vars[0] === 5).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.energy === 5).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onEatRight() method 2", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:5, y:6, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 2).toEqual(true);
            ret.ret = 5;
            expect(x === 6 && y === 6).toEqual(true);
        });
        expect(ops.onEatRight(0x086fffff, 0, org, 1)).toEqual(1); // v1=org.eatRight(v2);
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 5).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.energy === 5).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onEatRight() method 3", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:3, y:4, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 3).toEqual(true);
            ret.ret = 1;
            expect(x === 4 && y === 4).toEqual(true);
        });
        expect(ops.onEatRight(0x08ffffff, 0, org, 1)).toEqual(1); // v3=org.eatRight(v3);
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 1).toEqual(true);
        expect(org.energy === 1).toEqual(true);

        obs.clear();
        ops.destroy();
    });

    it("Checking onEatUp() method", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:4, y:5, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 1).toEqual(true);
            ret.ret = 5;
            expect(x === 4 && y === 4).toEqual(true);
        });
        expect(ops.onEatUp(0x081fffff, 0, org, 1)).toEqual(1); // v0=org.onEatUp(v1);
        expect(ops.vars[0] === 5).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.energy === 5).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onEatRight() method 2", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:5, y:6, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 2).toEqual(true);
            ret.ret = 5;
            expect(x === 5 && y === 5).toEqual(true);
        });
        expect(ops.onEatUp(0x086fffff, 0, org, 1)).toEqual(1); // v1=org.onEatUp(v2);
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 5).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.energy === 5).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onEatUp() method 3", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:3, y:4, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 3).toEqual(true);
            ret.ret = 1;
            expect(x === 3 && y === 3).toEqual(true);
        });
        expect(ops.onEatUp(0x08ffffff, 0, org, 1)).toEqual(1); // v3=org.onEatUp(v3);
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 1).toEqual(true);
        expect(org.energy === 1).toEqual(true);

        obs.clear();
        ops.destroy();
    });

    it("Checking onEatDown() method", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:4, y:5, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 1).toEqual(true);
            ret.ret = 5;
            expect(x === 4 && y === 6).toEqual(true);
        });
        expect(ops.onEatDown(0x081fffff, 0, org, 1)).toEqual(1); // v0=org.onEatDown(v1);
        expect(ops.vars[0] === 5).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.energy === 5).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onEatDown() method 2", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:5, y:6, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 2).toEqual(true);
            ret.ret = 5;
            expect(x === 5 && y === 7).toEqual(true);
        });
        expect(ops.onEatDown(0x086fffff, 0, org, 1)).toEqual(1); // v1=org.onEatDown(v2);
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 5).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.energy === 5).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onEatDown() method 3", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:3, y:4, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 3).toEqual(true);
            ret.ret = 1;
            expect(x === 3 && y === 5).toEqual(true);
        });
        expect(ops.onEatDown(0x08ffffff, 0, org, 1)).toEqual(1); // v3=org.onEatDown(v3);
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 1).toEqual(true);
        expect(org.energy === 1).toEqual(true);

        obs.clear();
        ops.destroy();
    });

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