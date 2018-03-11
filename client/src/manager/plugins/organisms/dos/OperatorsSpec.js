const _fill       = require('lodash/fill');

describe("client/src/organism/OperatorsDos", () => {
    const OConfig      = require('./../../organisms/Config');
    const THelper      = require('./../../../../../../common/tests/Helper');
    const cbpv         = OConfig.codeBitsPerVar;
    OConfig.codeBitsPerVar = 2;
    const OperatorsDos = require('./Operators');
    const EVENTS       = require('./../../../../share/Events').EVENTS;
    const Config       = require('./../../../../share/Config').Config;
    const OrganismDos  = require('./../../organisms/dos/Organism');
    const ConfigHelper = require('./../../../../../../common/tests/Config');

    afterAll(() => OConfig.codeBitsPerVar = cbpv);

    describe('Checks creation, destroy and public API', () => {
        it('Checking instance creation', () => {
            let offs = [];
            let vars = [];
            let obs  = {};
            let ops  = new OperatorsDos(offs, vars, obs);
            expect(ops.offs).toBe(offs);
            expect(ops.vars).toBe(vars);
            expect(ops.obs).toBe(obs);
            ops.destroy();
        });
        it('Checking destroy', () => {
            let offs = [];
            let vars = [];
            let obs  = {};
            let ops  = new OperatorsDos(offs, vars, obs);
            ops.destroy();
            expect(ops.offsets).not.toBe(offs);
            expect(ops.vars).not.toBe(vars);
            expect(ops.obs).not.toBe(obs);
        });
        it('Checking operators getter', () => {
            let offs = [];
            let vars = [];
            let obs  = {};
            let ops  = new OperatorsDos(offs, vars, obs);
            expect(Array.isArray(ops.operators)).toBe(true);
            expect(ops.operators.length > 0).toBe(true);
            ops.destroy();
        });
    });

    describe('onVar() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([], [0, 1, 2, 3], org)});
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

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([], [0, 1, 2, 3], org)});
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

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
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

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
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

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
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

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
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

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
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

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
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

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
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

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
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

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy(); Config.worldHeight = h; Config.worldWidth = w});

        it("Checking step left", () => {
            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                org.x = x2;
                org.y = y2;
                expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toBe(true);
            });
            expect(ops.onStepLeft(0x0a1fffff, 0, org)).toEqual(1); // v0=stepLeft();
            expect(ops.vars).toEqual([2,1,2,3]);
            expect(org.x).toBe(2);
            expect(org.y).toBe(4);
        });

        it("Checking step left with no free space on the left", () => {
            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                expect(x1 === 3 && y1 === 4 && x2 === 2 && y2 === 4).toBe(true);
            });
            expect(ops.onStepLeft(0x0a1fffff, 0, org)).toEqual(1); // v0=stepLeft();
            expect(ops.vars).toEqual([0,1,2,3]);
            expect(org.x).toBe(3);
            expect(org.y).toBe(4);
        });

        it("Checking step left with 4 bits per var", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                org.x = x2;
                org.y = y2;
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

    describe('onStepRight() method', () => {
        let   org;
        let   ops;
        const w = Config.worldWidth;
        const h = Config.worldHeight;

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy(); Config.worldHeight = h; Config.worldWidth = w});

        it("Checking step right", () => {
            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                org.x = x2;
                org.y = y2;
                expect(x1 === 3 && y1 === 4 && x2 === 4 && y2 === 4).toBe(true);
            });
            expect(ops.onStepRight(0x0a1fffff, 0, org)).toEqual(1); // v0=stepRight();
            expect(ops.vars).toEqual([4,1,2,3]);
            expect(org.x).toBe(4);
            expect(org.y).toBe(4);
        });

        it("Checking step right with no free space on the right", () => {
            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                expect(x1 === 3 && y1 === 4 && x2 === 4 && y2 === 4).toBe(true);
            });
            expect(ops.onStepRight(0x0a1fffff, 0, org)).toEqual(1); // v0=stepRight();
            expect(ops.vars).toEqual([0,1,2,3]);
            expect(org.x).toBe(3);
            expect(org.y).toBe(4);
        });

        it("Checking step right with 4 bits per var", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                org.x = x2;
                org.y = y2;
                expect(x1 === 3 && y1 === 4 && x2 === 4 && y2 === 4).toBe(true);
            });
            expect(ops1.onStepRight(0x0a1fffff, 0, org)).toEqual(1); // v1=stepRight();
            expect(ops1.vars).toEqual([0,4,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
            expect(org.x).toBe(4);
            expect(org.y).toBe(4);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onStepUp() method', () => {
        let   org;
        let   ops;
        const w = Config.worldWidth;
        const h = Config.worldHeight;

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy(); Config.worldHeight = h; Config.worldWidth = w});

        it("Checking step up", () => {
            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                org.x = x2;
                org.y = y2;
                expect(x1 === 3 && y1 === 4 && x2 === 3 && y2 === 3).toBe(true);
            });
            expect(ops.onStepUp(0x0a1fffff, 0, org)).toEqual(1); // v0=stepUp();
            expect(ops.vars).toEqual([3,1,2,3]);
            expect(org.x).toBe(3);
            expect(org.y).toBe(3);
        });

        it("Checking step up with no free space on above", () => {
            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                expect(x1 === 3 && y1 === 4 && x2 === 3 && y2 === 3).toBe(true);
            });
            expect(ops.onStepUp(0x0a1fffff, 0, org)).toEqual(1); // v0=stepUp();
            expect(ops.vars).toEqual([0,1,2,3]);
            expect(org.x).toBe(3);
            expect(org.y).toBe(4);
        });

        it("Checking step up with 4 bits per var", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                org.x = x2;
                org.y = y2;
                expect(x1 === 3 && y1 === 4 && x2 === 3 && y2 === 3).toBe(true);
            });
            expect(ops1.onStepUp(0x0a1fffff, 0, org)).toEqual(1); // v1=stepUp();
            expect(ops1.vars).toEqual([0,3,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
            expect(org.x).toBe(3);
            expect(org.y).toBe(3);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onStepDown() method', () => {
        let   org;
        let   ops;
        const w = Config.worldWidth;
        const h = Config.worldHeight;

        beforeEach(() => {Config.worldHeight = Config.worldWidth = 10;org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy(); Config.worldHeight = h; Config.worldWidth = w});

        it("Checking step down", () => {
            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                org.x = x2;
                org.y = y2;
                expect(x1 === 3 && y1 === 4 && x2 === 3 && y2 === 5).toBe(true);
            });
            expect(ops.onStepDown(0x0a1fffff, 0, org)).toEqual(1); // v0=stepDown();
            expect(ops.vars).toEqual([5,1,2,3]);
            expect(org.x).toBe(3);
            expect(org.y).toBe(5);
        });

        it("Checking step down with no free space below", () => {
            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                expect(x1 === 3 && y1 === 4 && x2 === 3 && y2 === 5).toBe(true);
            });
            expect(ops.onStepDown(0x0a1fffff, 0, org)).toEqual(1); // v0=stepDown();
            expect(ops.vars).toEqual([0,1,2,3]);
            expect(org.x).toBe(3);
            expect(org.y).toBe(4);
        });

        it("Checking step down with 4 bits per var", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.x = 3;
            org.y = 4;
            org.on(EVENTS.STEP, (org, x1, y1, x2, y2) => {
                org.x = x2;
                org.y = y2;
                expect(x1 === 3 && y1 === 4 && x2 === 3 && y2 === 5).toBe(true);
            });
            expect(ops1.onStepDown(0x0a1fffff, 0, org)).toEqual(1); // v1=stepDown();
            expect(ops1.vars).toEqual([0,5,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
            expect(org.x).toBe(3);
            expect(org.y).toBe(5);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onFromMem() method', () => {
        let   org;
        let   ops;
        let   mbits;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});
        beforeAll(()  => {mbits = OConfig.orgMemBits; OConfig.orgMemBits = 2});
        afterAll(()   => OConfig.orgMemBits = mbits);

        it("Checking getting value by constant", () => {
            org.mem.splice(0, org.mem.length, ...[1,2,3,4]);
            expect(ops.onFromMem(0x0b10ffff, 0, org)).toEqual(1); //v0=fromMem();
            expect(ops.vars).toEqual([1,1,2,3]);

            org.mem.splice(0, org.mem.length, ...[0,1,2,3]);
            expect(ops.onFromMem(0x0b50ffff, 0, org)).toEqual(1); //v1=fromMem();
            expect(ops.vars).toEqual([1,0,2,3]);
        });

        it("Checking getting value by variable value", () => {
            org.mem.splice(0, org.mem.length, ...[1,2,3,4]);
            expect(ops.onFromMem(0x0b1fffff, 0, org)).toEqual(1); //v0=fromMem();
            expect(ops.vars).toEqual([2,1,2,3]);

            org.mem.splice(0, org.mem.length, ...[0,1,2,3]);
            expect(ops.onFromMem(0x0b58ffff, 0, org)).toEqual(1); //v1=fromMem();
            expect(ops.vars).toEqual([2,1,2,3]);
        });

        it("Checking getting value by variable floating value", () => {
            ops.vars.splice(0, ops.vars.length, ...[.1,3.2,.3,.4]);
            org.mem.splice(0, org.mem.length, ...[1,2,3,4]);
            expect(ops.onFromMem(0x0b1fffff, 0, org)).toEqual(1); //v0=fromMem();
            expect(ops.vars).toEqual([4,3.2,.3,.4]);

            ops.vars.splice(0, ops.vars.length, ...[.1,3.2,.3,.4]);
            org.mem.splice(0, org.mem.length, ...[0,1,2,3]);
            expect(ops.onFromMem(0x0b58ffff, 0, org)).toEqual(1); //v1=fromMem();
            expect(ops.vars).toEqual([.1,3,.3,.4]);
        });

        it("Checking getting value by variable value with 4 bits per var", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.mem.splice(0, org.mem.length, ...[1,2,3,4]);
            expect(ops1.onFromMem(0x0b0fffff, 0, org)).toEqual(1); //v1=fromMem();
            expect(ops1.vars).toEqual([1,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);

            org.mem.splice(0, org.mem.length, ...[0,7,2,3]);
            expect(ops1.onFromMem(0x0b51ffff, 0, org)).toEqual(1); //v5=fromMem();
            expect(ops1.vars).toEqual([1,1,2,3,4,7,6,7,8,9,10,11,12,13,14,15]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onToMem() method', () => {
        let   org;
        let   ops;
        let   mbits;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([1], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});
        beforeAll(()  => {mbits = OConfig.orgMemBits; OConfig.orgMemBits = 2});
        afterAll(()   => OConfig.orgMemBits = mbits);

        it("Checking setting value by constant", () => {
            org.mem.splice(0, org.mem.length, ...[1,2,3,4]);
            expect(ops.onToMem(0x0b17ffff, 0, org)).toEqual(1); //toMem(v0, 3);
            expect(org.mem).toEqual([1,2,3,0]);
        });

        it("Checking setting value by variable value", () => {
            org.mem.splice(0, org.mem.length, ...[0,2,3,4]);
            expect(ops.onToMem(0x0b1fffff, 0, org)).toEqual(1); //toMem(v0, v0);
            expect(org.mem).toEqual([1,2,3,4]);
        });

        it("Checking setting value by variable value with 4 bits per var", () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.mem.splice(0, org.mem.length, ...[0,2,3,4]);
            expect(ops1.onToMem(0x0b1fffff, 0, org)).toEqual(1); //toMem(v0, v0);
            expect(org.mem).toEqual([0,15,3,4]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onMyX() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});

        it("Checking simple values", () => {
            org.x = 1;
            expect(ops.onMyX(0x0c1fffff, 0, org)).toEqual(1); // v0=myX()
            expect(ops.vars).toEqual([1,1,2,3]);
            org.x = 3;
            expect(ops.onMyX(0x0c6fffff, 0, org)).toEqual(1); // v1=myX()
            expect(ops.vars).toEqual([1,3,2,3]);
            org.x = 0;
            expect(ops.onMyX(0x0cffffff, 0, org)).toEqual(1); // v3=myX()
            expect(ops.vars).toEqual([1,3,2,0]);
        });

        it('Checking simple values with 4 bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.x = 3;
            expect(ops1.onMyX(0x0c1fffff, 0, org)).toEqual(1); // v1=myX()
            expect(ops1.vars).toEqual([0,3,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
            org.x = 3;
            expect(ops1.onMyX(0x0c6fffff, 0, org)).toEqual(1); // v6=myX()
            expect(ops1.vars).toEqual([0,3,2,3,4,5,3,7,8,9,10,11,12,13,14,15]);
            org.x = 0;
            expect(ops1.onMyX(0x0cffffff, 0, org)).toEqual(1); // v15=myX()
            expect(ops1.vars).toEqual([0,3,2,3,4,5,3,7,8,9,10,11,12,13,14,0]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onMyY() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});

        it("Checking simple values", () => {
            org.y = 1;
            expect(ops.onMyY(0x0c1fffff, 0, org)).toEqual(1); // v0=myY()
            expect(ops.vars).toEqual([1,1,2,3]);
            org.y = 3;
            expect(ops.onMyY(0x0c6fffff, 0, org)).toEqual(1); // v1=myY()
            expect(ops.vars).toEqual([1,3,2,3]);
            org.y = 0;
            expect(ops.onMyY(0x0cffffff, 0, org)).toEqual(1); // v3=myY()
            expect(ops.vars).toEqual([1,3,2,0]);
        });

        it('Checking simple values with 4 bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.y = 3;
            expect(ops1.onMyY(0x0c1fffff, 0, org)).toEqual(1); // v1=myX()
            expect(ops1.vars).toEqual([0,3,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
            org.y = 3;
            expect(ops1.onMyY(0x0c6fffff, 0, org)).toEqual(1); // v6=myX()
            expect(ops1.vars).toEqual([0,3,2,3,4,5,3,7,8,9,10,11,12,13,14,15]);
            org.y = 0;
            expect(ops1.onMyY(0x0cffffff, 0, org)).toEqual(1); // v15=myX()
            expect(ops1.vars).toEqual([0,3,2,3,4,5,3,7,8,9,10,11,12,13,14,0]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onCheckLeft() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});

        it('Checks left, but nothing there', () => {
            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(0);
                expect(y).toBe(2);
                ret.ret = 0;
            });
            org.x = 1;
            org.y = 2;
            expect(ops.onCheckLeft(0x0c7fffff, 0, org)).toEqual(1); // v1=checkLeft()
            expect(ops.vars).toEqual([0,0,2,3]);
        });

        it('Checks left and energy there', () => {
            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(0);
                expect(y).toBe(2);
                ret.ret = 9;
            });
            org.x = 1;
            org.y = 2;
            expect(ops.onCheckLeft(0x0c7fffff, 1, org)).toEqual(2); // v1=checkLeft()
            expect(ops.vars).toEqual([0,9,2,3]);
        });

        it('Checks left with 4 bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(0);
                expect(y).toBe(2);
                ret.ret = 9;
            });
            org.x = 1;
            org.y = 2;
            expect(ops1.onCheckLeft(0x0c7fffff, 1, org)).toEqual(2); // v7=checkLeft()
            expect(ops1.vars).toEqual([0,1,2,3,4,5,6,9,8,9,10,11,12,13,14,15]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onCheckRight() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});

        it('Checks right, but nothing there', () => {
            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(2);
                expect(y).toBe(2);
                ret.ret = 0;
            });
            org.x = 1;
            org.y = 2;
            expect(ops.onCheckRight(0x0c7fffff, 0, org)).toEqual(1); // v1=checkRight()
            expect(ops.vars).toEqual([0,0,2,3]);
        });

        it('Checks right and energy there', () => {
            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(2);
                expect(y).toBe(2);
                ret.ret = 9;
            });
            org.x = 1;
            org.y = 2;
            expect(ops.onCheckRight(0x0c7fffff, 1, org)).toEqual(2); // v1=checkRight()
            expect(ops.vars).toEqual([0,9,2,3]);
        });

        it('Checks right with 4 bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(2);
                expect(y).toBe(2);
                ret.ret = 9;
            });
            org.x = 1;
            org.y = 2;
            expect(ops1.onCheckRight(0x0c7fffff, 1, org)).toEqual(2); // v7=checkRight()
            expect(ops1.vars).toEqual([0,1,2,3,4,5,6,9,8,9,10,11,12,13,14,15]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onCheckUp() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});

        it('Checks up, but nothing there', () => {
            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(1);
                expect(y).toBe(1);
                ret.ret = 0;
            });
            org.x = 1;
            org.y = 2;
            expect(ops.onCheckUp(0x0c7fffff, 0, org)).toEqual(1); // v1=checkUp()
            expect(ops.vars).toEqual([0,0,2,3]);
        });

        it('Checks up and energy there', () => {
            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(1);
                expect(y).toBe(1);
                ret.ret = 9;
            });
            org.x = 1;
            org.y = 2;
            expect(ops.onCheckUp(0x0c7fffff, 1, org)).toEqual(2); // v1=checkUp()
            expect(ops.vars).toEqual([0,9,2,3]);
        });

        it('Checks up with 4 bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(1);
                expect(y).toBe(1);
                ret.ret = 9;
            });
            org.x = 1;
            org.y = 2;
            expect(ops1.onCheckUp(0x0c7fffff, 1, org)).toEqual(2); // v7=checkUp()
            expect(ops1.vars).toEqual([0,1,2,3,4,5,6,9,8,9,10,11,12,13,14,15]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('onCheckDown() method', () => {
        let org;
        let ops;

        beforeEach(() => {org = new OrganismDos('0', 0, 0, {}); ops = new OperatorsDos([], [0, 1, 2, 3], org)});
        afterEach (() => {ops.destroy(); org.destroy()});

        it('Checks down, but nothing there', () => {
            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(1);
                expect(y).toBe(3);
                ret.ret = 0;
            });
            org.x = 1;
            org.y = 2;
            expect(ops.onCheckDown(0x0c7fffff, 0, org)).toEqual(1); // v1=checkDown()
            expect(ops.vars).toEqual([0,0,2,3]);
        });

        it('Checks down and energy there', () => {
            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(1);
                expect(y).toBe(3);
                ret.ret = 9;
            });
            org.x = 1;
            org.y = 2;
            expect(ops.onCheckDown(0x0c7fffff, 1, org)).toEqual(2); // v1=checkDown()
            expect(ops.vars).toEqual([0,9,2,3]);
        });

        it('Checks right with 4 bits per var', () => {
            let bpv = OConfig.codeBitsPerVar;
            OConfig.codeBitsPerVar = 4;
            let ops1 = new OperatorsDos([1], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], org);

            org.on(EVENTS.CHECK_AT, (x, y, ret) => {
                expect(x).toBe(1);
                expect(y).toBe(3);
                ret.ret = 9;
            });
            org.x = 1;
            org.y = 2;
            expect(ops1.onCheckDown(0x0c7fffff, 1, org)).toEqual(2); // v7=checkDown()
            expect(ops1.vars).toEqual([0,1,2,3,4,5,6,9,8,9,10,11,12,13,14,15]);

            OConfig.codeBitsPerVar = bpv;
            ops1.destroy();
        });
    });

    describe('Checks complex DOS scripts for validness', () => {
        const newWeights = [.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1];
        const weights    = OConfig.orgOperatorWeights.slice();
        let   ocfg;
        let   org;
        const script     = (code) => {
            THelper.script(org.vm, code);
            OConfig.codeYieldPeriod = code.length;
        };


        beforeEach(() => {
            ocfg = new ConfigHelper(OConfig);
            ocfg.set('codeYieldPeriod',     2);
            ocfg.set('codeBitsPerBlock',    8);
            ocfg.set('codeBitsPerOperator', 8);
            ocfg.set('codeBitsPerVar',      2);
            ocfg.set('codeConstBits',       16);
            ocfg.set('orgMemBits',          8);
            OConfig.orgOperatorWeights.splice(0, OConfig.orgOperatorWeights.length, ...newWeights);

            org  = new OrganismDos('0', 0, 0, {});
            _fill(org.vm.vars, 0);
            org.energy = 100;
        });
        afterEach (() => {
            org.destroy();
            ocfg.reset();
            OConfig.orgOperatorWeights.splice(0, OConfig.orgOperatorWeights.length, ...weights);
        });

        /**
         * if (v0 === v1) { // true
         *   v3 = 0x7fff
         * }
         */
        it('if should go inside the block, if condition is true', () => {
            script([0x021abfff, 0x01dfffff]);
            org.vm.run(org);
            expect(org.vm.vars).toEqual([0,0,0,0x7fff]);
        });
        /**
         * if (v0 === v1) {} // true
         * v3 = 0x7fff
         */
        it('if without body should go to the next row, if condition is true', () => {
            script([0x021803ff, 0x01dfffff]);
            org.vm.run(org);
            expect(org.vm.vars).toEqual([0,0,0,0x7fff]);
        });
        /**
         * v0 = 1
         * if (v0 === v1) {} // true
         * v0 = 0
         */
        it('Checks if operator without body and with other code around', () => {
            script([0x0100007f, 0x021803ff, 0x0100003f]);
            org.vm.run(org);
            expect(org.vm.vars).toEqual([0,0,0,0]);
        });
        /**
         * if (v0 === v1) {    // true
         *   if (v0 === v1) {} // true
         *     v0 = 1
         * }
         * v1 = 1
         */
        it('Checks if inside if with true condition', () => {
            script([
                '10 00 01 10 00000010 1111111111',
                '10 00 01 10 00000001 1111111111',
                '01 00 0000000000000001 111111',
                '01 01 0000000000000001 111111'
            ]);
            org.vm.run(org);
            expect(org.vm.vars).toEqual([1,1,0,0]);
        });
        /**
         * if (v0 !== v1) {    // false
         *   if (v0 === v1) {} // true
         *   v0 = 1
         * }
         * v1 = 1
         */
        it('Checks if inside if with false condition outside', () => {
            script([
                '10 00 01 11 00000010 1111111111',
                '10 00 01 10 00000001 1111111111',
                '01 00 0000000000000001 111111',
                '01 01 0000000000000001 111111'
            ]);
            org.vm.run(org);
            expect(org.vm.vars).toEqual([0,1,0,0]);
        });
        /**
         * if (v0 !== v1) {    // false
         *   if (v0 === v1) {  // true
         *     v0 = 3
         *   }
         *   v0 = 2
         * }
         * v1 = 1
         */
        it('Checks if inside if with false condition outside 2', () => {
            script([
                '10 00 01 11 00000011 1111111111',
                '10 00 01 10 00000010 1111111111',
                '01 00 0000000000000011 111111',
                '01 00 0000000000000010 111111',
                '01 01 0000000000000001 111111'
            ]);
            OConfig.codeYieldPeriod = 2;
            org.vm.run(org);
            expect(org.vm.vars).toEqual([0,1,0,0]);
        });
        /**
         * if (v0 === v1) {    // true
         *   if (v0 === v1) {  // true
         *     v0 = 3
         *   }
         *   v0 = 2
         * }
         * v1 = 1
         */
        it('Checks if inside if with true condition and 3 assignments', () => {
            script([
                '10 00 01 10 00000011 1111111111',
                '10 00 01 10 00000010 1111111111',
                '01 00 0000000000000011 111111',
                '01 00 0000000000000010 111111',
                '01 01 0000000000000001 111111'
            ]);
            org.vm.run(org);
            expect(org.vm.vars).toEqual([2,1,0,0]);
        });
        /**
         * if (v0 === v1) {    // true
         *   v0 = 2
         *   if (v0 === v1) {} // false
         * }
         * v1 = 1
         */
        it('Checks if inside if with var assign', () => {
            script([
                '10 00 01 10 00000010 1111111111',
                '01 00 0000000000000010 111111',
                '10 00 01 10 00000010 1111111111',
                '01 01 0000000000000001 111111'
            ]);
            org.vm.run(org);
            expect(org.vm.vars).toEqual([2,1,0,0]);
        });
        /**
         * if (v0 === v1) {    // true
         *   if (v0 === v1) {  // true
         *     v0 = 2
         *   }
         * }
         * v1 = 1
         */
        it('Checks if inside if with both true conditions', () => {
            script([
                '10 00 01 10 00000010 1111111111',
                '10 00 01 10 00000001 1111111111',
                '01 00 0000000000000010 111111',
                '01 01 0000000000000001 111111'
            ]);
            org.vm.run(org);
            expect(org.vm.vars).toEqual([2,1,0,0]);
        });


        /**
         * while (v0 === v1) {    // true
         *   v0 = 1
         * }
         * v1 = 1
         */
        it('Checks while with true and then false conditions', () => {
            script([
                '11 00 01 10 00000001 1111111111',
                '01 00 0000000000000001 111111',
                '01 01 0000000000000001 111111'
            ]);
            OConfig.codeYieldPeriod = 4;
            org.vm.run(org);
            expect(org.vm.vars).toEqual([1,1,0,0]);
        });
        /**
         * while (v0 !== v1) {}   // false
         * v0 = 1
         */
        it('Checks while with false condition', () => {
            script([
                '11 00 01 11 00000000 1111111111',
                '01 00 0000000000000001 111111'
            ]);
            org.vm.run(org);
            expect(org.vm.vars).toEqual([1,0,0,0]);
        });
        /**
         * if (v0 === v1) {
         *   while (v0 === v1) {    // true
         *     v0 = 1
         *   }
         * }
         * v1 = 1
         */
        it('Checks while with if outside', () => {
            script([
                '10 00 01 10 00000010 1111111111',
                '11 00 01 10 00000001 1111111111',
                '01 00 0000000000000001 111111',
                '01 01 0000000000000001 111111'
            ]);
            OConfig.codeYieldPeriod = 5;
            org.vm.run(org);
            expect(org.vm.vars).toEqual([1,1,0,0]);
        });
        /**
         * while (v0 === v1) {
         *   while (v0 === v1) {    // true
         *     v0 = 1
         *   }
         * }
         * v1 = 1
         */
        it('Checks 2 whiles', () => {
            script([
                '11 00 01 10 00000010 1111111111',
                '11 00 01 10 00000001 1111111111',
                '01 00 0000000000000001 111111',
                '01 01 0000000000000001 111111'
            ]);
            OConfig.codeYieldPeriod = 6;
            org.vm.run(org);
            expect(org.vm.vars).toEqual([1,1,0,0]);
        });
    });
});