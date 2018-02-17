describe("client/src/organism/OperatorsDos", () => {
    let OConfig      = require('./../../organisms/Config');
    let cbpv         = OConfig.codeBitsPerVar;
    OConfig.codeBitsPerVar = 2;
    let OperatorsDos = require('./Operators');
    let Observer     = require('./../../../../../../common/src/Observer');
    let EVENTS       = require('./../../../../share/Events').EVENTS;
    let EVENT_AMOUNT = require('./../../../../share/Events').EVENT_AMOUNT;
    let Config       = require('./../../../../share/Config').Config;
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

    describe('onLookAt() method', () => {
        let   org;
        let   ops;
        const w = Config.worldWidth;
        const h = Config.worldHeight;

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy(); Config.worldHeight = h; Config.worldWidth = w});

        it("Checking onLookAt() is found nothing", () => {
            org.on(EVENTS.GET_ENERGY, (x, y, ret) => {
                expect(x).toBe(2);
                expect(y).toBe(3);
                ret.ret = 0;
            });
            expect(ops.onLookAt(0x056fffff, 0, org)).toEqual(1); //v1=lookAt(v2,v3);
            expect(ops.vars).toEqual([0,0,2,3]);
        });

        it("Checking onLookAt() looking outside of the world", () => {
            ops.vars = [0, 1, 20, 30];
            expect(ops.onLookAt(0x056fffff, 0, org)).toEqual(1); //v1=lookAt(v2,v3);
            expect(ops.vars).toEqual([0,0,20,30]);

            ops.vars = [0, 1, -20, -30];
            expect(ops.onLookAt(0x056fffff, 0, org)).toEqual(1); //v1=lookAt(v2,v3);
            expect(ops.vars).toEqual([0,0,-20,-30]);
        });

        it('Checking onLookAt() found an energy', () => {
            org.on(EVENTS.GET_ENERGY, (x, y, ret) => {
                expect(x).toBe(2);
                expect(y).toBe(3);
                ret.ret = 13;
            });
            expect(ops.onLookAt(0x056fffff, 0, org)).toEqual(1); //v1=lookAt(v2,v3);
            expect(ops.vars).toEqual([0,13,2,3]);
        });

        it('Checking onLookAt() with 4 bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,7], org);

            org.on(EVENTS.GET_ENERGY, (x, y, ret) => {
                expect(x).toBe(7);
                expect(y).toBe(7);
                ret.ret = 13;
            });
            expect(ops1.onLookAt(0x056fffff, 0, org)).toEqual(1); //v6=lookAt(v15,v15);
            expect(ops1.vars).toEqual([0,1,2,3,4,5,13,7,8,9,10,11,12,13,14,7]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });

        it('Checking onLookAt() with floating coordinates', () => {
            org.on(EVENTS.GET_ENERGY, (x, y, ret) => {
                expect(x).toBe(0);
                expect(y).toBe(4);
                ret.ret = 13;
            });
            ops.vars = [0, 1, .1, 3.6];
            expect(ops.onLookAt(0x056fffff, 0, org)).toEqual(1); //v1=lookAt(v2,v3);
            expect(ops.vars).toEqual([0,13,.1,3.6]);
        });
    });

    describe('onEatLeft() method', () => {
        let   org;
        let   ops;
        const w = Config.worldWidth;
        const h = Config.worldHeight;

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy(); Config.worldHeight = h; Config.worldWidth = w});

        it("Checking eating nothing", () => {
            ops.vars = [1, 0, 1, 2];
            expect(ops.onEatLeft(0x061fffff, 0, org)).toEqual(1); // v0=eatLeft(v1);
            expect(ops.vars).toEqual([0, 0, 1, 2]);
        });
        it("Checking eating nothing 2", () => {
            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(1);
                expect(x).toBe(1);
                expect(y).toBe(3);
                ret.ret = 0;
            });
            org.x = 2;
            org.y = 3;
            expect(ops.onEatLeft(0x061fffff, 0, org)).toEqual(1); // v0=eatLeft(v1);
            expect(ops.vars).toEqual([0,1,2,3]);
        });

        it("Checking eating energy", () => {
            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(1);
                expect(x).toBe(1);
                expect(y).toBe(3);
                ret.ret = 5;
            });
            org.x = 2;
            org.y = 3;
            expect(ops.onEatLeft(0x061fffff, 0, org)).toEqual(1); // v0=eatLeft(v1);
            expect(ops.vars).toEqual([5,1,2,3]);
        });

        it('Checking eating with 3bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 3;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7], org);

            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(4);
                expect(x).toBe(1);
                expect(y).toBe(3);
                ret.ret = 5;
            });
            org.x = 2;
            org.y = 3;
            expect(ops1.onEatLeft(0x0633ffff, 0, org)).toEqual(1); // v1=eatLeft(v4);
            expect(ops1.vars).toEqual([0,5,2,3,4,5,6,7]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        })
    });

    describe('onEatRight() method', () => {
        let   org;
        let   ops;
        const w = Config.worldWidth;
        const h = Config.worldHeight;

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy(); Config.worldHeight = h; Config.worldWidth = w});

        it("Checking eating nothing", () => {
            ops.vars = [1, 0, 1, 2];
            expect(ops.onEatRight(0x071fffff, 0, org)).toEqual(1); // v0=eatRight(v1);
            expect(ops.vars).toEqual([0, 0, 1, 2]);
        });
        it("Checking eating nothing 2", () => {
            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(1);
                expect(x).toBe(3);
                expect(y).toBe(3);
                ret.ret = 0;
            });
            org.x = 2;
            org.y = 3;
            expect(ops.onEatRight(0x071fffff, 0, org)).toEqual(1); // v0=eatRight(v1);
            expect(ops.vars).toEqual([0,1,2,3]);
        });

        it("Checking eating energy", () => {
            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(1);
                expect(x).toBe(3);
                expect(y).toBe(3);
                ret.ret = 5;
            });
            org.x = 2;
            org.y = 3;
            expect(ops.onEatRight(0x071fffff, 0, org)).toEqual(1); // v0=eatRight(v1);
            expect(ops.vars).toEqual([5,1,2,3]);
        });

        it('Checking eating with 3bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 3;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7], org);

            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(4);
                expect(x).toBe(3);
                expect(y).toBe(3);
                ret.ret = 5;
            });
            org.x = 2;
            org.y = 3;
            expect(ops1.onEatRight(0x0733ffff, 0, org)).toEqual(1); // v1=eatRight(v4);
            expect(ops1.vars).toEqual([0,5,2,3,4,5,6,7]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        })
    });

    describe('onEatUp() method', () => {
        let   org;
        let   ops;
        const w = Config.worldWidth;
        const h = Config.worldHeight;

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy(); Config.worldHeight = h; Config.worldWidth = w});

        it("Checking eating nothing", () => {
            ops.vars = [1, 0, 1, 2];
            expect(ops.onEatUp(0x081fffff, 0, org)).toEqual(1); // v0=eatUp(v1);
            expect(ops.vars).toEqual([0, 0, 1, 2]);
        });
        it("Checking eating nothing 2", () => {
            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(1);
                expect(x).toBe(2);
                expect(y).toBe(2);
                ret.ret = 0;
            });
            org.x = 2;
            org.y = 3;
            expect(ops.onEatUp(0x081fffff, 0, org)).toEqual(1); // v0=eatUp(v1);
            expect(ops.vars).toEqual([0,1,2,3]);
        });

        it("Checking eating energy", () => {
            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(1);
                expect(x).toBe(2);
                expect(y).toBe(2);
                ret.ret = 5;
            });
            org.x = 2;
            org.y = 3;
            expect(ops.onEatUp(0x081fffff, 0, org)).toEqual(1); // v0=eatUp(v1);
            expect(ops.vars).toEqual([5,1,2,3]);
        });

        it('Checking eating with 3bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 3;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7], org);

            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(4);
                expect(x).toBe(2);
                expect(y).toBe(2);
                ret.ret = 5;
            });
            org.x = 2;
            org.y = 3;
            expect(ops1.onEatUp(0x0833ffff, 0, org)).toEqual(1); // v1=eatUp(v4);
            expect(ops1.vars).toEqual([0,5,2,3,4,5,6,7]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        })
    });

    describe('onEatDown() method', () => {
        let   org;
        let   ops;
        const w = Config.worldWidth;
        const h = Config.worldHeight;

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy(); Config.worldHeight = h; Config.worldWidth = w});

        it("Checking eating nothing", () => {
            ops.vars = [1, 0, 1, 2];
            expect(ops.onEatDown(0x091fffff, 0, org)).toEqual(1); // v0=eatDown(v1);
            expect(ops.vars).toEqual([0, 0, 1, 2]);
        });
        it("Checking eating nothing 2", () => {
            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(1);
                expect(x).toBe(2);
                expect(y).toBe(4);
                ret.ret = 0;
            });
            org.x = 2;
            org.y = 3;
            expect(ops.onEatDown(0x091fffff, 0, org)).toEqual(1); // v0=eatDown(v1);
            expect(ops.vars).toEqual([0,1,2,3]);
        });

        it("Checking eating energy", () => {
            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(1);
                expect(x).toBe(2);
                expect(y).toBe(4);
                ret.ret = 5;
            });
            org.x = 2;
            org.y = 3;
            expect(ops.onEatDown(0x091fffff, 0, org)).toEqual(1); // v0=eatDown(v1);
            expect(ops.vars).toEqual([5,1,2,3]);
        });

        it('Checking eating with 3bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 3;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7], org);

            org.on(EVENTS.EAT, (org, x, y, ret) => {
                expect(ret.ret).toBe(4);
                expect(x).toBe(2);
                expect(y).toBe(4);
                ret.ret = 5;
            });
            org.x = 2;
            org.y = 3;
            expect(ops1.onEatDown(0x0933ffff, 0, org)).toEqual(1); // v1=eatDown(v4);
            expect(ops1.vars).toEqual([0,5,2,3,4,5,6,7]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        })
    });

    describe('onStepLeft() method', () => {
        let   org;
        let   ops;
        const w = Config.worldWidth;
        const h = Config.worldHeight;

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, true, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy(); Config.worldHeight = h; Config.worldWidth = w});

        it("Checking step left", () => {
            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
                ret.ret = 1;
                ret.x   = x2;
                ret.y   = y2;
                expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toBe(true);
            });
            expect(ops.onStepLeft(0x0a1fffff, 0, org)).toEqual(1); // v0=stepLeft();
            expect(ops.vars).toEqual([2,1,2,3]);
            expect(org.x).toBe(2);
            expect(org.y).toBe(4);
        });

        it("Checking step left() with no free space on the left", () => {
            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
                ret.ret = 0;
                ret.x   = x1;
                ret.y   = y1;
                expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toBe(true);
            });
            expect(ops.onStepLeft(0x0a1fffff, 0, org)).toEqual(1); // v0=stepLeft();
            expect(ops.vars).toEqual([3,1,2,3]);
            expect(org.x).toBe(3);
            expect(org.y).toBe(4);
        });

        it("Checking step left with 4 bits per var", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2, ret) => {
                ret.ret = 1;
                ret.x   = x2;
                ret.y   = y2;
                expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toBe(true);
            });
            expect(ops1.onStepLeft(0x0a1fffff, 0, org)).toEqual(1); // v1=stepLeft();
            expect(ops1.vars).toEqual([0,2,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
            expect(org.x).toBe(2);
            expect(org.y).toBe(4);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
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
});