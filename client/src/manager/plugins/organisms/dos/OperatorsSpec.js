describe("client/src/organism/OperatorsDos", () => {
    let OConfig      = require('./../../organisms/Config');
    let cbpv         = OConfig.codeBitsPerVar;
    OConfig.codeBitsPerVar = 2;
    let OperatorsDos = require('./Operators');
    let Observer     = require('./../../../../../../common/src/Observer');
    let EVENTS       = require('./../../../../share/Events').EVENTS;
    let EVENT_AMOUNT = require('./../../../../share/Events').EVENT_AMOUNT;
    //let Config       = require('./../../../../share/Config').Config;
    let OrganismDos  = require('./../../organisms/dos/Organism');
    //let OEvents      = require('./../../organisms/Organism').EVENTS;
    //let api          = require('./../../../../share/Config').api;

    afterAll(() => OConfig.codeBitsPerVar = cbpv);

    describe('onVar() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});

        it("Checking variables working", () => {
            expect(ops.onVar(0x00dfffff, 0)).toEqual(1);    // 0xd === 0b1101, var3 = var1
            expect(ops.vars).toEqual([0, 1, 2, 1]);
            expect(ops.onVar(0x000fffff, 0)).toEqual(1);    // 0x0 === 0b0000, var0 = var0
            expect(ops.vars).toEqual([0, 1, 2, 1]);
            expect(ops.onVar(0x006fffff, 0)).toEqual(1);    // 0x6 === 0b0110, var1 = var2
            expect(ops.vars).toEqual([0, 2, 2, 1]);
            expect(ops.onVar(0x00ffffff, 0)).toEqual(1);    // 0xf === 0b1111, var3 = var3
            expect(ops.vars).toEqual([0, 2, 2, 1]);
        });

        it("Checking onVar() method with 3 bits per var config", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 3;
            let ops1 = new OperatorsDos([], [0, 1, 2, 3, 4, 5, 6, 7], org);

            expect(ops1.onVar(0x00ffffff, 0)).toEqual(1);    // 0xff === 0b[111111]11, var7 = var7
            expect(ops1.vars).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
            expect(ops1.onVar(0x005dffff, 0)).toEqual(1);    // 0x5d === 0b[010111]01, var2 = var7
            expect(ops1.vars).toEqual([0, 1, 7, 3, 4, 5, 6, 7]);
            expect(ops1.onVar(0x005fffff, 0)).toEqual(1);    // 0x5f === 0b[010111]11, var2 = var7
            expect(ops1.vars).toEqual([0, 1, 7, 3, 4, 5, 6, 7]);
            expect(ops1.onVar(0x0000ffff, 0)).toEqual(1);    // 0x00 === 0b[000000]00, var0 = var0
            expect(ops1.vars).toEqual([0, 1, 7, 3, 4, 5, 6, 7]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });

        it('Checking line increase', () => {
            expect(ops.onVar(0x000fffff, 0)).toEqual(1);     // 0x0 === 0b0000, var0 = var0
            expect(ops.onVar(0x000fffff, 1)).toEqual(2);     // 0x0 === 0b0000, var0 = var0
            expect(ops.onVar(0x000fffff, 100)).toEqual(101); // 0x0 === 0b0000, var0 = var0
        });
    });

    describe('onConst() method', () => {
        let org;
        let ops;
        let codeConstBits = OConfig.codeConstBits;
        OConfig.codeConstBits = 16;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});
        afterAll  (() => OConfig.codeConstBits = codeConstBits);

        it("Checking different constant values", () => {
            expect(ops.onConst(0x01dfffff, 0)).toEqual(1); // 0xdffff === 0b[11][0111111111111111]11, var3 = 0x7fff
            expect(ops.vars).toEqual([0, 1, 2, 0x7fff]);
            expect(ops.onConst(0x010fffff, 0)).toEqual(1); // 0x0ffff === 0b[00][0011111111111111]11, var0 = 0x3fff
            expect(ops.vars).toEqual([0x3fff, 1, 2, 0x7fff]);
            expect(ops.onConst(0x01000000, 0)).toEqual(1); // 0x00000 === 0b[00][0000000000000000]00, var0 = 0x0000
            expect(ops.vars).toEqual([0, 1, 2, 0x7fff]);
        });

        it("Checking onConst() method with 3 bits per var config", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 3;
            let ops1 = new OperatorsDos([], [0, 1, 2, 3, 4, 5, 6, 7], org);

            expect(ops1.onConst(0x01ffffff, 0)).toEqual(1);  // 0xfffff === 0b[111][1111111111111111]1, var7 = 0xffff
            expect(ops1.vars).toEqual([0, 1, 2, 3, 4, 5, 6, 0xffff]);
            expect(ops1.onConst(0x015dffff, 0)).toEqual(1);  // 0x5dfff === 0b[010][1110111111111111]1, var2 = 0xefff
            expect(ops1.vars).toEqual([0, 1, 0xefff, 3, 4, 5, 6, 0xffff]);
            expect(ops1.onConst(0x0100ffff, 0)).toEqual(1);  // 0x00fff === 0b[000][0000011111111111]1, var0 = 0x07ff
            expect(ops1.vars).toEqual([0x07ff, 1, 0xefff, 3, 4, 5, 6, 0xffff]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });

        it('Checking line increase', () => {
            expect(ops.onConst(0x01ffffff, 0)).toEqual(1);     // 0xfffff === 0b[111][1111111111111111]1, var7 = 0xffff
            expect(ops.onConst(0x015dffff, 1)).toEqual(2);     // 0x5dfff === 0b[010][1110111111111111]1, var2 = 0xefff
            expect(ops.onConst(0x0100ffff, 700)).toEqual(701); // 0x00fff === 0b[000][0000011111111111]1, var0 = 0x07ff
        });
    });

    describe('onCondition() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});

        it("Checking conditions", () => {
            expect(ops.onCondition(0x02ffffff, 0)).toEqual(1);   //if(v3!==v3);
            ops.offsets = [1];
            expect(ops.onCondition(0x021fffff, 0)).toEqual(1);   //if(v0!==v1);
            ops.offsets = [1];
            expect(ops.onCondition(0x021abfff, 0)).toEqual(1);   //if(v0===v1);
            ops.offsets = [1];
            expect(ops.onCondition(0x0213ffff, 0)).toEqual(1);   //if(v0 < v1);
        });

        it('Checking closing bracket offset', () => {
            ops.offsets = [2];
            expect(ops.onCondition(0x02ffffff, 0)).toEqual(2);   //if(v3!==v3);
            ops.offsets = [1];
            expect(ops.onCondition(0x02ffffff, 0)).toEqual(1);   //if(v3!==v3);
            ops.offsets = [1];
            expect(ops.onCondition(0x0213ffff, 0)).toEqual(1);   //if(v0 < v1);
        });

        it("Checking onCondition() method with 3 bits per var config", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 3;
            let ops1 = new OperatorsDos([], [0, 1, 2, 3, 4, 5, 6, 7], org);

            ops.offsets = [2];
            expect(ops.onCondition(0x02ffffff, 0)).toEqual(2);   //if(v3!==v3);
            ops.offsets = [2];
            expect(ops.onCondition(0x021fffff, 0)).toEqual(1);   //if(v0!==v7);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onLoop() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});

        it("Checking conditions", () => {
            expect(ops.onCondition(0x03ffffff, 0)).toEqual(1);   //while(v3!==v3);
            ops.offsets = [1];
            expect(ops.onCondition(0x031fffff, 0)).toEqual(1);   //while(v0!==v1);
            ops.offsets = [1];
            expect(ops.onCondition(0x031abfff, 0)).toEqual(1);   //while(v0===v1);
            ops.offsets = [1];
            expect(ops.onCondition(0x0313ffff, 0)).toEqual(1);   //while(v0 < v1);
        });

        it('Checking closing bracket offset', () => {
            ops.offsets = [2];
            expect(ops.onCondition(0x03ffffff, 0)).toEqual(2);   //while(v3!==v3);
            ops.offsets = [1];
            expect(ops.onCondition(0x03ffffff, 0)).toEqual(1);   //while(v3!==v3);
            ops.offsets = [1];
            expect(ops.onCondition(0x0313ffff, 0)).toEqual(1);   //while(v0 < v1);
        });

        it("Checking onLoop() method with 3 bits per var config", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 3;
            let ops1 = new OperatorsDos([], [0, 1, 2, 3, 4, 5, 6, 7], org);

            ops.offsets = [2];
            expect(ops.onCondition(0x03ffffff, 0)).toEqual(2);   //while(v3!==v3);
            ops.offsets = [2];
            expect(ops.onCondition(0x031fffff, 0)).toEqual(1);   //while(v0!==v7);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onOperator() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});

        it("Checking onOperator() method", () => {
            expect(ops.onOperator(0x045a3fff, 0)).toEqual(1); //v1=v1>>v2;
            expect(ops.vars).toEqual([0, 0, 2, 3]);
            expect(ops.onOperator(0x046c7fff, 1)).toEqual(2); //v1=v2-v3;
            expect(ops.vars).toEqual([0, -1, 2, 3]);
            expect(ops.onOperator(0x046fffff, 3)).toEqual(4); //v1=v2<=v3;
            expect(ops.vars).toEqual([0, 1, 2, 3]);
            expect(ops.onOperator(0x04ffffff, 7)).toEqual(8); //v3=v3<=v3;
            expect(ops.vars).toEqual([0, 1, 2, 1]);
            expect(ops.onOperator(0x046d3fff, 0)).toEqual(1); //v1=v2%v3;
            expect(ops.vars).toEqual([0, 0, 2, 1]);

            expect(ops.onOperator(0x046c3fff, 0)).toEqual(1); //v1=v2+v3;
            expect(ops.vars).toEqual([0, 3, 2, 1]);
            expect(ops.onOperator(0x046c7fff, 0)).toEqual(1); //v1=v2-v3;
            expect(ops.vars).toEqual([0, 1, 2, 1]);
            expect(ops.onOperator(0x046cbfff, 0)).toEqual(1); //v1=v2*v3;
            expect(ops.vars).toEqual([0, 2, 2, 1]);
            ops.vars = [0, 1, 2, 4];
            expect(ops.onOperator(0x046cffff, 0)).toEqual(1); //v1=v2/v3;
            expect(ops.vars).toEqual([0, .5, 2, 4]);
            ops.vars = [0, 1, 2, 3];
            expect(ops.onOperator(0x046d3fff, 0)).toEqual(1); //v1=v2%v3;
            expect(ops.vars).toEqual([0, 2, 2, 3]);
        });

        it('Checking onOperator() with 4 bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            expect(ops1.onOperator(0x04ffffff, 0)).toEqual(1);   //v15=v15<=v15
            expect(ops1.vars).toEqual([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,1]);
            expect(ops1.onOperator(0x046ff0ff, 0)).toEqual(1);   //v6=v15+v15
            expect(ops1.vars).toEqual([0,1,2,3,4,5,2,7,8,9,10,11,12,13,14,1]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });

        it("Checking overflows", () => {
            const max =  Number.MAX_VALUE;

            ops.vars = [0, 1, max, max];
            expect(ops.onOperator(0x046c3fff, 0)).toEqual(1); //v1=v2+v3;
            expect(ops.vars).toEqual([0, max, max, max]);
            ops.vars = [0, 1, -max, max];
            expect(ops.onOperator(0x046c7fff, 0)).toEqual(1); //v1=v2-v3;
            expect(ops.vars).toEqual([0, -max, -max, max]);
            ops.vars = [0, 1, max, max];
            expect(ops.onOperator(0x046cbfff, 0)).toEqual(1); //v1=v2*v3;
            expect(ops.vars).toEqual([0, max, max, max]);
            ops.vars = [0, 1, max, 0];
            expect(ops.onOperator(0x046cffff, 0)).toEqual(1); //v1=v2/v3;
            expect(ops.vars).toEqual([0, max, max, 0]);
            ops.vars = [0, 1, 2, 0];
            expect(ops.onOperator(0x046d3fff, 0)).toEqual(1); //v1=v2%v3;
            expect(ops.vars).toEqual([0, 0, 2, 0]);
        });
    });

    it("Checking onLookAt() in a complex way", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);

        expect(ops.onLookAt(0x041bffff, 0, {}, 1)).toEqual(1);//v0=org.lookAt(v1,v2);
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        obs.on(EVENTS.GET_ENERGY, (org, x, y, ret) => {
            ret.ret = 7;
            expect(x === 1 && y === 2).toEqual(true);
        });
        expect(ops.onLookAt(0x041bffff, 0, {}, 1)).toEqual(1);//v0=org.lookAt(v1,v2);
        expect(ops.vars[0] === 7).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        obs.clear();
        obs.on(EVENTS.GET_ENERGY, (org, x, y, ret) => {
            ret.ret = 8;
            expect(x === 2 && y === 3).toEqual(true);
        });
        expect(ops.onLookAt(0x046fffff, 1, {}, 1)).toEqual(2);//v1=org.lookAt(v2,v3);
        expect(ops.vars[0] === 7).toEqual(true);
        expect(ops.vars[1] === 8).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        obs.clear();
        obs.on(EVENTS.GET_ENERGY, (org, x, y, ret) => {
            ret.ret = 9;
            expect(x === 3 && y === 3).toEqual(true);
        });
        expect(ops.onLookAt(0x04ffffff, 3, {}, 1)).toEqual(4);//v3=org.lookAt(v3,v3);
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
        expect(ops.onEatLeft(0x051fffff, 0, org, 1)).toEqual(1); // v0=org.eatLeft(v1);
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
        expect(ops.onEatLeft(0x056fffff, 0, org, 1)).toEqual(1); // v1=org.eatLeft(v2);
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
        expect(ops.onEatLeft(0x05ffffff, 0, org, 1)).toEqual(1); // v3=org.eatLeft(v3);
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
        expect(ops.onEatRight(0x061fffff, 0, org, 1)).toEqual(1); // v0=org.eatRight(v1);
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
        expect(ops.onEatRight(0x066fffff, 0, org, 1)).toEqual(1); // v1=org.eatRight(v2);
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
        expect(ops.onEatRight(0x06ffffff, 0, org, 1)).toEqual(1); // v3=org.eatRight(v3);
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
        expect(ops.onEatUp(0x071fffff, 0, org, 1)).toEqual(1); // v0=org.onEatUp(v1);
        expect(ops.vars[0] === 5).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.energy === 5).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onEatUp() method 2", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [1, 1, 2, 3], obs);
        let org = {x:5, y:6, energy:0};

        obs.on(EVENTS.EAT, (org, x, y, ret) => {
            expect(ret.ret === 2).toEqual(true);
            ret.ret = 5;
            expect(x === 5 && y === 5).toEqual(true);
        });
        expect(ops.onEatUp(0x076fffff, 0, org, 1)).toEqual(1); // v1=org.onEatUp(v2);
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
        expect(ops.onEatUp(0x07ffffff, 0, org, 1)).toEqual(1); // v3=org.onEatUp(v3);
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

    it("Checking onStepLeft() method", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 1;
            ret.x   = 2;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepLeft(0x091fffff, 0, org, 1)).toEqual(1); // v0=org.stepLeft();
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.x === 2 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onStepLeft() method with no free space on the left", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 0;
            ret.x   = 3;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepLeft(0x091fffff, 0, org, 1)).toEqual(1); // v0=org.stepLeft();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.x === 3 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onStepLeft() method 2", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 1;
            ret.x   = 2;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepLeft(0x096fffff, 0, org, 1)).toEqual(1); // v1=org.stepLeft();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.x === 2 && org.y === 4).toEqual(true);
        //expect(ops.onStepLeft(0x08ffffff), 0, org, 1)).toEqual()  // v3=org.stepLeft();

        obs.clear();
        ops.destroy();
    });
    it("Checking onStepLeft() method 2 with no free space on the left", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 0;
            ret.x   = 3;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepLeft(0x096fffff, 0, org, 1)).toEqual(1); // v1=org.stepLeft();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 0).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.x === 3 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onStepLeft() method 3", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 1;
            ret.x   = 2;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepLeft(0x09ffffff, 0, org, 1)).toEqual(1); // v3=org.stepLeft();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 1).toEqual(true);
        expect(org.x === 2 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onStepLeft() method 3 with no free space on the left", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 0;
            ret.x   = 3;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepLeft(0x09ffffff, 0, org, 1)).toEqual(1); // v3=org.stepLeft();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 0).toEqual(true);
        expect(org.x === 3 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });

    it("Checking onStepRight() method", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 1;
            ret.x   = 4;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 4 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepRight(0x0a1fffff, 0, org, 1)).toEqual(1); // v0=org.stepRight();
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.x === 4 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onStepRight() method with no free space on the right", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 0;
            ret.x   = 3;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 4 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepRight(0x0a1fffff, 0, org, 1)).toEqual(1); // v0=org.stepRight();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.x === 3 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onStepRight() method 2", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 1;
            ret.x   = 4;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 4 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepRight(0x0a6fffff, 0, org, 1)).toEqual(1); // v1=org.stepRight();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.x === 4 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onStepRight() method 2 with no free space on the left", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 0;
            ret.x   = 3;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 4 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepRight(0x0a6fffff, 0, org, 1)).toEqual(1); // v1=org.stepRight();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 0).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(org.x === 3 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onStepRight() method 3", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 1;
            ret.x   = 4;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 4 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepRight(0x0affffff, 0, org, 1)).toEqual(1); // v3=org.stepRight();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 1).toEqual(true);
        expect(org.x === 4 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });
    it("Checking onStepRight() method 3 with no free space on the left", () => {
        let obs = new Observer(EVENT_AMOUNT);
        let ops = new OperatorsDos([], [0, 1, 2, 3], obs);
        let org = {x:3, y:4};

        obs.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
            ret.ret = 0;
            ret.x   = 3;
            ret.y   = 4;
            expect(x1 === 3 && y1 === 4 && x2 === 4 && y2 === 4).toEqual(true);
        });
        expect(ops.onStepRight(0x0affffff, 0, org, 1)).toEqual(1); // v3=org.stepRight();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 0).toEqual(true);
        expect(org.x === 3 && org.y === 4).toEqual(true);

        obs.clear();
        ops.destroy();
    });

    it("Checking onFromMem() method", () => {
        let org = {mem: [1,2,3]};
        let ops = new OperatorsDos([], [0, 1, 2, 3], new Observer());

        expect(ops.onFromMem(0x0d1fffff, 0, org, 1)).toEqual(1); //v0=org.fromMem();
        expect(ops.vars[0] === 3).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onFromMem(0x0d6fffff, 1, org, 2)).toEqual(2); //v1=org.fromMem();
        expect(ops.vars[0] === 3).toEqual(true);
        expect(ops.vars[1] === 2).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onFromMem(0x0dffffff, 2, org, 3)).toEqual(3); //v3=org.fromMem();
        expect(ops.vars[0] === 3).toEqual(true);
        expect(ops.vars[1] === 2).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 1).toEqual(true);

        ops.destroy();
    });
    it("Checking onFromMem() method without memory", () => {
        let org = {mem: []};
        let ops = new OperatorsDos([], [7, 1, 2, 3], new Observer());

        expect(ops.onFromMem(0x0d1fffff, 0, org, 1)).toEqual(1); //v0=org.fromMem();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        ops.destroy();
    });

    it("Checking onToMem() method", () => {
        let org = {mem: []};
        let ops = new OperatorsDos([], [0, 1, 2, 3], new Observer());

        expect(ops.onToMem(0x0effffff, 0, org, 1)).toEqual(1); //'v3 = org.toMem(v3)');
        expect(org.mem[0]).toEqual(3);
        expect(ops.onToMem(0x0e6fffff, 0, org, 1)).toEqual(1); //'v1 = org.toMem(v2)');
        expect(org.mem[1]).toEqual(2);
        expect(ops.onToMem(0x0e1fffff, 0, org, 1)).toEqual(1); //'v0 = org.toMem(v1)');
        expect(org.mem[2]).toEqual(2);

        ops.destroy();
    });

    it("Checking onMyX() method", () => {
        let org = {x: 1, y:2};
        let ops = new OperatorsDos([], [0, 7, 2, 3], new Observer());

        expect(ops.onMyX(0x0f1fffff, 0, org, 1)).toEqual(1); // v0=org.myX();
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 7).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onMyX(0x0f6fffff, 0, org, 1)).toEqual(1); // v1=org.myX();
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onMyX(0x0fffffff, 0, org, 1)).toEqual(1); // v3=org.myX();
        expect(ops.vars[0] === 1).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 1).toEqual(true);

        ops.destroy();
    });
    it("Checking onMyX() method", () => {
        let org = {x: 1, y:2};
        let ops = new OperatorsDos([], [0, 7, 2, 3], new Observer());

        expect(ops.onMyY(0x0f1fffff, 0, org, 1)).toEqual(1); // v0=org.myY();
        expect(ops.vars[0] === 2).toEqual(true);
        expect(ops.vars[1] === 7).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onMyY(0x0f6fffff, 0, org, 1)).toEqual(1); // v1=org.myY();
        expect(ops.vars[0] === 2).toEqual(true);
        expect(ops.vars[1] === 2).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);
        expect(ops.onMyY(0x0fffffff, 0, org, 1)).toEqual(1); // v3=org.myY();
        expect(ops.vars[0] === 2).toEqual(true);
        expect(ops.vars[1] === 2).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 2).toEqual(true);

        ops.destroy();
    });

    it("Checking onCheckLeft() method", () => {
        let org = new Observer(EVENT_AMOUNT);
        let obs = new Observer();
        let ops = new OperatorsDos([], [1, 7, 2, 3], obs);

        org.x = 1;
        org.y = 2;

        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 0 && y === 2).toEqual(true);
            ret.ret = 0;
        });
        expect(ops.onCheckLeft(0x111fffff, 0, org)).toEqual(1); // v0=org.onCheckLeft();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 7).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        org.clear();
        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 0 && y === 2).toEqual(true);
            ret.ret = 1;
        });
        expect(ops.onCheckLeft(0x116fffff, 0, org)).toEqual(1); // v1=org.onCheckLeft();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        org.clear();
        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 0 && y === 2).toEqual(true);
            ret.ret = 2;
        });
        expect(ops.onCheckLeft(0x11ffffff, 0, org)).toEqual(1); // v3=org.onCheckLeft();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 2).toEqual(true);

        ops.destroy();
    });

    it("Checking onCheckRight() method", () => {
        let org = new Observer(EVENT_AMOUNT);
        let obs = new Observer();
        let ops = new OperatorsDos([], [1, 7, 2, 3], obs);

        org.x = 1;
        org.y = 2;

        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 2 && y === 2).toEqual(true);
            ret.ret = 0;
        });
        expect(ops.onCheckRight(0x121fffff, 0, org)).toEqual(1); // v0=org.onCheckRight();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 7).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        org.clear();
        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 2 && y === 2).toEqual(true);
            ret.ret = 1;
        });
        expect(ops.onCheckRight(0x126fffff, 0, org)).toEqual(1); // v1=org.onCheckRight();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        org.clear();
        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 2 && y === 2).toEqual(true);
            ret.ret = 2;
        });
        expect(ops.onCheckRight(0x12ffffff, 0, org)).toEqual(1); // v3=org.onCheckRight();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 2).toEqual(true);

        ops.destroy();
    });

    it("Checking onCheckUp() method", () => {
        let org = new Observer(EVENT_AMOUNT);
        let obs = new Observer();
        let ops = new OperatorsDos([], [1, 7, 2, 3], obs);

        org.x = 1;
        org.y = 2;

        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 1 && y === 1).toEqual(true);
            ret.ret = 0;
        });
        expect(ops.onCheckUp(0x131fffff, 0, org)).toEqual(1); // v0=org.onCheckUp();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 7).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        org.clear();
        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 1 && y === 1).toEqual(true);
            ret.ret = 1;
        });
        expect(ops.onCheckUp(0x136fffff, 0, org)).toEqual(1); // v1=org.onCheckUp();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        org.clear();
        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 1 && y === 1).toEqual(true);
            ret.ret = 2;
        });
        expect(ops.onCheckUp(0x13ffffff, 0, org)).toEqual(1); // v3=org.onCheckUp();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 2).toEqual(true);

        ops.destroy();
    });

    it("Checking onCheckDown() method", () => {
        let org = new Observer(EVENT_AMOUNT);
        let obs = new Observer();
        let ops = new OperatorsDos([], [1, 7, 2, 3], obs);

        org.x = 1;
        org.y = 2;

        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 1 && y === 3).toEqual(true);
            ret.ret = 0;
        });
        expect(ops.onCheckDown(0x141fffff, 0, org)).toEqual(1); // v0=org.onCheckDown();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 7).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        org.clear();
        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 1 && y === 3).toEqual(true);
            ret.ret = 1;
        });
        expect(ops.onCheckDown(0x146fffff, 0, org)).toEqual(1); // v1=org.onCheckDown();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 3).toEqual(true);

        org.clear();
        org.on(EVENTS.CHECK_AT, (x, y, ret) => {
            expect(x === 1 && y === 3).toEqual(true);
            ret.ret = 2;
        });
        expect(ops.onCheckDown(0x14ffffff, 0, org)).toEqual(1); // v3=org.onCheckDown();
        expect(ops.vars[0] === 0).toEqual(true);
        expect(ops.vars[1] === 1).toEqual(true);
        expect(ops.vars[2] === 2).toEqual(true);
        expect(ops.vars[3] === 2).toEqual(true);

        ops.destroy();
    });
});