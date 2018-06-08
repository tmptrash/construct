const _fill        = require('lodash/fill');
const OperatorsDos = require('./Operators');
const OConfig      = require('./../../../plugins/organisms/Config');
const Config       = require('./../../../../share/Config').Config;
const Helper       = require('./../../../../../../common/src/Helper');
const OrganismDos  = require('./Organism');
const World        = require('./../../../../view/World').World;
const EVENTS       = require('./../../../../share/Events').EVENTS;
const DIRS         = require('./../../../../../../common/src/Directions').DIR;

describe("client/src/manager/plugins/organisms/dos/OperatorsDos", () => {
    const hex    = Helper.toHexNum;
    const ww     = Config.worldWidth;
    const wh     = Config.worldHeight;
    const oldMan = global.man;
    let   org;
    let   cbpv;
    let   ccb;
    let   ops;
    let   offs;
    let   vars;
    let   w;
    let   h;

    beforeAll (() => {
        cbpv = OConfig.codeBitsPerVar;
        OConfig.codeBitsPerVar = 2;
        ccb = OConfig.codeConstBits;
        OConfig.codeConstBits  = 3;
        global.man = {world: {}, positions: [
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]
            ]};
        OperatorsDos.compile();
    });
    afterAll  (() => {
        OConfig.codeBitsPerVar = cbpv;
        OConfig.codeConstBits  = ccb;
        global.man             = oldMan;
    });
    beforeEach(() => {
        w     = 10;
        h     = 10;
        Config.worldWidth  = w;
        Config.worldHeight = h;
        global.man.world = new World(w, h);
        vars  = [0,1,2,3];
        offs  = new Array(10);
        org   = new OrganismDos(0, 0, 0, {});
        ops   = new OperatorsDos(offs, vars, org);
    });
    afterEach (() => {
        ops.destroy();
        global.man.world.destroy();
        org.destroy();
        ops        = null;
        offs       = null;
        vars       = null;
        Config.worldWidth  = ww;
        Config.worldHeight = wh;
    });

    describe('onLookAt() method', () => {
        it("Checking onLookAt() is found nothing", () => {
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,0,2,3]);
        });

        it("Checking onLookAt() looking outside of the world - x", () => {
            ops.vars[0] = 11;
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([11,0,2,3]);
        });

        it("Checking onLookAt() looking outside of the world - y", () => {
            ops.vars[3] = 11;
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,0,2,11]);
        });

        it('Checking onLookAt() found an energy', () => {
            global.man.world.setDot(0,3,0xaabbcc);
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,1,2,3]);
            global.man.world.setDot(0,3,0);
        });

        it('Checking onLookAt() found an object', () => {
            global.man.world.setDot(0,3,0xaabbcc);
            global.man.positions[0][3] = -2;
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,-2,2,3]);
            global.man.world.setDot(0,3,0);
            global.man.positions[0][3] = 0;
        });

        it('Checking onLookAt() found an organism', () => {
            global.man.world.setDot(0,3,0xaabbcc);
            global.man.positions[0][3] = {energy: 123};
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,2,2,3]);
            global.man.world.setDot(0,3,0);
            global.man.positions[0][3] = 0;
        });

        it('Checking onLookAt() with floating coordinates', () => {
            ops.vars[0] = .1;
            ops.vars[3] = .2;
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([.1,0,2,.2]);
        });

        describe('onLookAt() method 3bits per var', () => {
            let bpv;
            let ops;
            let vars;
            let offs;
            beforeAll (() => {
                bpv  = OConfig.codeBitsPerVar;
                OConfig.codeBitsPerVar = 3;
                OperatorsDos.compile();
            });
            afterAll  (() => OperatorsDos.compile());
            beforeEach(() => {
                vars = [0,1,2,3,4,5,6,7];
                offs = new Array(10);
                ops  = new OperatorsDos(offs, vars);
            });
            afterEach (() => {
                ops.destroy();
                ops  = null;
                offs = null;
                vars = null;
                OConfig.codeBitsPerVar = bpv;
            });

            it("Checking onLookAt() is found nothing", () => {
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,0,2,3,4,5,6,7]);
            });

            it("Checking onLookAt() looking outside of the world - x", () => {
                ops.vars[0] = 11;
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([11,0,2,3,4,5,6,7]);
            });

            it("Checking onLookAt() looking outside of the world - y", () => {
                ops.vars[3] = 11;
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,0,2,11,4,5,6,7]);
            });

            it('Checking onLookAt() found an energy', () => {
                global.man.world.setDot(0,3,0xaabbcc);
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,1,2,3,4,5,6,7]);
                global.man.world.setDot(0,3,0);
            });

            it('Checking onLookAt() found an object', () => {
                global.man.world.setDot(0,3,0xaabbcc);
                global.man.positions[0][3] = -2;
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,-2,2,3,4,5,6,7]);
                global.man.world.setDot(0,3,0);
                global.man.positions[0][3] = 0;
            });

            it('Checking onLookAt() found an organism', () => {
                global.man.world.setDot(0,3,0xaabbcc);
                global.man.positions[0][3] = {energy: 123};
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,2,2,3,4,5,6,7]);
                global.man.world.setDot(0,3,0);
                global.man.positions[0][3] = 0;
            });

            it('Checking onLookAt() with floating coordinates', () => {
                ops.vars[0] = .1;
                ops.vars[3] = .2;
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([.1,0,2,.2,4,5,6,7]);
            });
        });
    });

    describe('onStepLeft() method', () => {
        it("Checking step left", () => {
            org.dir = DIRS.LEFT;
            org.on(EVENTS.STEP, (o,x,y,x1,y1) => {
                expect(x === 0 && y === 0 && x1 === -1 && y1 === 0).toBe(true);
            });
            expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
        });

        xit("Checking step left with no free space on the left", () => {
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

        xit("Checking step left with 4 bits per var", () => {
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

    xdescribe('onEatLeft() method', () => {
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

    xdescribe('onMyX() method', () => {
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

    xdescribe('onMyY() method', () => {
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

    xdescribe('onCheckLeft() method', () => {
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

    xdescribe('Checks complex DOS scripts for validness', () => {
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
            ocfg.set('CODE_BITS_PER_OPERATOR', 8);
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