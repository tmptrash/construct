const _fill        = require('lodash/fill');
const OperatorsDos = require('./Operators');
const OConfig      = require('./../../../plugins/organisms/Config');
const Config       = require('./../../../../share/Config').Config;
const Helper       = require('./../../../../../../common/src/Helper');
const OrganismDos  = require('./Organism');
const World        = require('./../../../../view/World').World;
const EVENTS       = require('./../../../../share/Events').EVENTS;
const DIRS         = require('./../../../../../../common/src/Directions').DIR;
const OBJECT_TYPES = require('./../../../../view/World').OBJECT_TYPES;

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

    describe('lookAt() operator', () => {
        it("Checking lookAt() is found nothing", () => {
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,0,2,3]);
        });

        it("Checking lookAt() looking outside of the world - x", () => {
            ops.vars[0] = 11;
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([11,0,2,3]);
        });

        it("Checking lookAt() looking outside of the world - y", () => {
            ops.vars[3] = 11;
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,0,2,11]);
        });

        it('Checking lookAt() found an energy', () => {
            global.man.world.setDot(0,3,0xaabbcc);
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,1,2,3]);
            global.man.world.setDot(0,3,0);
        });

        it('Checking lookAt() found an object', () => {
            global.man.world.setDot(0,3,0xaabbcc);
            global.man.positions[0][3] = OBJECT_TYPES.TYPE_ENERGY2;
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,OBJECT_TYPES.TYPE_ENERGY2,2,3]);
            global.man.world.setDot(0,3,0);
            global.man.positions[0][3] = 0;
        });

        it('Checking lookAt() found an organism', () => {
            global.man.world.setDot(0,3,0xaabbcc);
            global.man.positions[0][3] = {energy: 123};
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([0,2,2,3]);
            global.man.world.setDot(0,3,0);
            global.man.positions[0][3] = 0;
        });

        it('Checking lookAt() with floating coordinates', () => {
            ops.vars[0] = .1;
            ops.vars[3] = .2;
            expect(ops.operators[hex('101100 01 00 11')].call(ops, 0)).toEqual(1);
            expect(ops.vars).toEqual([.1,0,2,.2]);
        });

        describe('lookAt() method 3bits per var', () => {
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

            it("Checking lookAt() is found nothing", () => {
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,0,2,3,4,5,6,7]);
            });

            it("Checking lookAt() looking outside of the world - x", () => {
                ops.vars[0] = 11;
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([11,0,2,3,4,5,6,7]);
            });

            it("Checking lookAt() looking outside of the world - y", () => {
                ops.vars[3] = 11;
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,0,2,11,4,5,6,7]);
            });

            it('Checking lookAt() found an energy', () => {
                global.man.world.setDot(0,3,0xaabbcc);
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,1,2,3,4,5,6,7]);
                global.man.world.setDot(0,3,0);
            });

            it('Checking lookAt() found an object', () => {
                global.man.world.setDot(0,3,0xaabbcc);
                global.man.positions[0][3] = OBJECT_TYPES.TYPE_ENERGY2;
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,OBJECT_TYPES.TYPE_ENERGY2,2,3,4,5,6,7]);
                global.man.world.setDot(0,3,0);
                global.man.positions[0][3] = 0;
            });

            it('Checking lookAt() found an organism', () => {
                global.man.world.setDot(0,3,0xaabbcc);
                global.man.positions[0][3] = {energy: 123};
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([0,2,2,3,4,5,6,7]);
                global.man.world.setDot(0,3,0);
                global.man.positions[0][3] = 0;
            });

            it('Checking lookAt() with floating coordinates', () => {
                ops.vars[0] = .1;
                ops.vars[3] = .2;
                expect(ops.operators[hex('101100 001 000 011')].call(ops, 0)).toEqual(1);
                expect(ops.vars).toEqual([.1,0,2,.2,4,5,6,7]);
            });
        });
    });

    describe('step() operator', () => {
        it("Checking step left", () => {
            org.x   = 1;
            org.y   = 1;
            org.dir = DIRS.LEFT;
            org.on(EVENTS.STEP, (o,x,y,x1,y1) => {
                expect(x === 1 && y === 1 && x1 === 0 && y1 === 1).toBe(true);
                o.x = x1;
                o.y = y1;
            });
            expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
            expect(org.x).toBe(0);
            expect(org.y).toBe(1);
        });

        it("Checking step left with no free space on the left", () => {
            org.dir = DIRS.LEFT;
            org.on(EVENTS.STEP, (o,x,y,x1,y1) => {
                expect(x === 0 && y === 0 && x1 === -1 && y1 === 0).toBe(true);
                o.x = x;
                o.y = y1;
            });
            expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
            expect(org.x).toBe(0);
            expect(org.y).toBe(0);
        });

        describe('step() operator with 3bits per var', () => {
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
                ops  = new OperatorsDos(offs, vars, org);
            });
            afterEach (() => {
                ops.destroy();
                ops  = null;
                offs = null;
                vars = null;
                OConfig.codeBitsPerVar = bpv;
            });

            it("Checking step left", () => {
                org.x   = 1;
                org.y   = 1;
                org.dir = DIRS.LEFT;
                org.on(EVENTS.STEP, (o,x,y,x1,y1) => {
                    expect(x === 1 && y === 1 && x1 === 0 && y1 === 1).toBe(true);
                    o.x = x1;
                    o.y = y1;
                });
                expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
                expect(org.x).toBe(0);
                expect(org.y).toBe(1);
            });

            it("Checking step left with no space", () => {
                org.dir = DIRS.LEFT;
                org.on(EVENTS.STEP, (o,x,y,x1,y1) => {
                    expect(x === 0 && y === 0 && x1 === -1 && y1 === 0).toBe(true);
                    o.x = x;
                    o.y = y1;
                });
                expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
                expect(org.x).toBe(0);
                expect(org.y).toBe(0);
            });
        });
    });

    describe('dir() operator', () => {
        it("Checking up direction 1", () => {
            ops.vars[0] = DIRS.UP;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.UP);
        });
        it("Checking up direction 2", () => {
            ops.vars[0] = DIRS.UP + 4;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.UP);
        });
        it("Checking up direction 3", () => {
            ops.vars[0] = DIRS.UP + 4 + .1;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.UP);
        });

        it("Checking right direction 1", () => {
            ops.vars[0] = DIRS.RIGHT;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.RIGHT);
        });
        it("Checking right direction 2", () => {
            ops.vars[0] = DIRS.RIGHT + 4;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.RIGHT);
        });
        it("Checking right direction 3", () => {
            ops.vars[0] = DIRS.RIGHT + 4 + .1;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.RIGHT);
        });

        it("Checking down direction 1", () => {
            ops.vars[0] = DIRS.DOWN;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.DOWN);
        });
        it("Checking down direction 2", () => {
            ops.vars[0] = DIRS.DOWN + 4;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.DOWN);
        });
        it("Checking down direction 3", () => {
            ops.vars[0] = DIRS.DOWN + 4 + .1;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.DOWN);
        });

        it("Checking left direction 1", () => {
            ops.vars[0] = DIRS.LEFT;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.LEFT);
        });
        it("Checking left direction 2", () => {
            ops.vars[0] = DIRS.LEFT + 4;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.LEFT);
        });
        it("Checking left direction 3", () => {
            ops.vars[0] = DIRS.LEFT + 4 + .1;
            expect(ops.operators[hex('101110 00')].call(ops, 0, hex('101110 00'), org)).toEqual(1);
            expect(org.dir).toBe(DIRS.LEFT);
        });

        it("Checking left direction while moving", () => {
            org.x = 1;
            org.y = 1;
            org.dir = DIRS.LEFT;
            org.on(EVENTS.STEP, (o, x, y, x1, y1) => {
                expect(x === 1 && y === 1 && x1 === 0 && y1 === 1).toBe(true);
                o.x = x1;
                o.y = y1;
            });
            expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
            expect(org.x).toBe(0);
            expect(org.y).toBe(1);
        });
        it("Checking right direction while moving", () => {
            org.x = 1;
            org.y = 1;
            org.dir = DIRS.RIGHT;
            org.on(EVENTS.STEP, (o, x, y, x1, y1) => {
                expect(x === 1 && y === 1 && x1 === 2 && y1 === 1).toBe(true);
                o.x = x1;
                o.y = y1;
            });
            expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
            expect(org.x).toBe(2);
            expect(org.y).toBe(1);
        });
        it("Checking up direction while moving", () => {
            org.x = 1;
            org.y = 1;
            org.dir = DIRS.UP;
            org.on(EVENTS.STEP, (o, x, y, x1, y1) => {
                expect(x === 1 && y === 1 && x1 === 1 && y1 === 0).toBe(true);
                o.x = x1;
                o.y = y1;
            });
            expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
            expect(org.x).toBe(1);
            expect(org.y).toBe(0);
        });
        it("Checking down direction while moving", () => {
            org.x = 1;
            org.y = 1;
            org.dir = DIRS.DOWN;
            org.on(EVENTS.STEP, (o, x, y, x1, y1) => {
                expect(x === 1 && y === 1 && x1 === 1 && y1 === 2).toBe(true);
                o.x = x1;
                o.y = y1;
            });
            expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
            expect(org.x).toBe(1);
            expect(org.y).toBe(2);
        });

        describe('dir() operator with 3bits per var', () => {
            let bpv;
            let ops;
            let vars;
            let offs;
            beforeAll(() => {
                bpv = OConfig.codeBitsPerVar;
                OConfig.codeBitsPerVar = 3;
                OperatorsDos.compile();
            });
            afterAll(() => OperatorsDos.compile());
            beforeEach(() => {
                vars = [0, 1, 2, 3, 4, 5, 6, 7];
                offs = new Array(10);
                ops = new OperatorsDos(offs, vars, org);
            });
            afterEach(() => {
                ops.destroy();
                ops = null;
                offs = null;
                vars = null;
                OConfig.codeBitsPerVar = bpv;
            });

            it("Checking up direction 1", () => {
                ops.vars[0] = DIRS.UP;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.UP);
            });
            it("Checking up direction 2", () => {
                ops.vars[0] = DIRS.UP + 4;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.UP);
            });
            it("Checking up direction 3", () => {
                ops.vars[0] = DIRS.UP + 4 + .1;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.UP);
            });

            it("Checking right direction 1", () => {
                ops.vars[0] = DIRS.RIGHT;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.RIGHT);
            });
            it("Checking right direction 2", () => {
                ops.vars[0] = DIRS.RIGHT + 4;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.RIGHT);
            });
            it("Checking right direction 3", () => {
                ops.vars[0] = DIRS.RIGHT + 4 + .1;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.RIGHT);
            });

            it("Checking down direction 1", () => {
                ops.vars[0] = DIRS.DOWN;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.DOWN);
            });
            it("Checking down direction 2", () => {
                ops.vars[0] = DIRS.DOWN + 4;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.DOWN);
            });
            it("Checking down direction 3", () => {
                ops.vars[0] = DIRS.DOWN + 4 + .1;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.DOWN);
            });

            it("Checking left direction 1", () => {
                ops.vars[0] = DIRS.LEFT;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.LEFT);
            });
            it("Checking left direction 2", () => {
                ops.vars[0] = DIRS.LEFT + 4;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.LEFT);
            });
            it("Checking left direction 3", () => {
                ops.vars[0] = DIRS.LEFT + 4 + .1;
                expect(ops.operators[hex('101110 000')].call(ops, 0, hex('101110 000'), org)).toEqual(1);
                expect(org.dir).toBe(DIRS.LEFT);
            });

            it("Checking left direction while moving", () => {
                org.x = 1;
                org.y = 1;
                org.dir = DIRS.LEFT;
                org.on(EVENTS.STEP, (o, x, y, x1, y1) => {
                    expect(x === 1 && y === 1 && x1 === 0 && y1 === 1).toBe(true);
                    o.x = x1;
                    o.y = y1;
                });
                expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
                expect(org.x).toBe(0);
                expect(org.y).toBe(1);
            });
            it("Checking right direction while moving", () => {
                org.x = 1;
                org.y = 1;
                org.dir = DIRS.RIGHT;
                org.on(EVENTS.STEP, (o, x, y, x1, y1) => {
                    expect(x === 1 && y === 1 && x1 === 2 && y1 === 1).toBe(true);
                    o.x = x1;
                    o.y = y1;
                });
                expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
                expect(org.x).toBe(2);
                expect(org.y).toBe(1);
            });
            it("Checking up direction while moving", () => {
                org.x = 1;
                org.y = 1;
                org.dir = DIRS.UP;
                org.on(EVENTS.STEP, (o, x, y, x1, y1) => {
                    expect(x === 1 && y === 1 && x1 === 1 && y1 === 0).toBe(true);
                    o.x = x1;
                    o.y = y1;
                });
                expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
                expect(org.x).toBe(1);
                expect(org.y).toBe(0);
            });
            it("Checking down direction while moving", () => {
                org.x = 1;
                org.y = 1;
                org.dir = DIRS.DOWN;
                org.on(EVENTS.STEP, (o, x, y, x1, y1) => {
                    expect(x === 1 && y === 1 && x1 === 1 && y1 === 2).toBe(true);
                    o.x = x1;
                    o.y = y1;
                });
                expect(ops.operators[hex('101101')].call(ops, 0, hex('101101'), org)).toEqual(1);
                expect(org.x).toBe(1);
                expect(org.y).toBe(2);
            });
        });
    });

    describe('myX() method', () => {
        it("Checking simple values", () => {
            org.x = 1;
            expect(ops.operators[hex('101111 00')].call(ops, 0, hex('101111 00'), org)).toEqual(1); // v0=myX()
            expect(ops.vars).toEqual([1,1,2,3]);
            org.x = 3;
            expect(ops.operators[hex('101111 01')].call(ops, 0, hex('101111 01'), org)).toEqual(1); // v1=myX()
            expect(ops.vars).toEqual([1,3,2,3]);
            org.x = 0;
            expect(ops.operators[hex('101111 11')].call(ops, 0, hex('101111 11'), org)).toEqual(1); // v3=myX()
            expect(ops.vars).toEqual([1,3,2,0]);
        });

        describe('myX() operator with 3bits per var', () => {
            let bpv;
            let ops;
            let vars;
            let offs;
            beforeAll(() => {
                bpv = OConfig.codeBitsPerVar;
                OConfig.codeBitsPerVar = 3;
                OperatorsDos.compile();
            });
            afterAll(() => OperatorsDos.compile());
            beforeEach(() => {
                vars = [0, 1, 2, 3, 4, 5, 6, 7];
                offs = new Array(10);
                ops = new OperatorsDos(offs, vars, org);
            });
            afterEach(() => {
                ops.destroy();
                ops = null;
                offs = null;
                vars = null;
                OConfig.codeBitsPerVar = bpv;
            });

            it("Checking simple values", () => {
                org.x = 1;
                expect(ops.operators[hex('101111 000')].call(ops, 0, hex('101111 000'), org)).toEqual(1); // v0=myX()
                expect(ops.vars).toEqual([1,1,2,3,4,5,6,7]);
                org.x = 3;
                expect(ops.operators[hex('101111 001')].call(ops, 0, hex('101111 001'), org)).toEqual(1); // v1=myX()
                expect(ops.vars).toEqual([1,3,2,3,4,5,6,7]);
                org.x = 0;
                expect(ops.operators[hex('101111 011')].call(ops, 0, hex('101111 011'), org)).toEqual(1); // v3=myX()
                expect(ops.vars).toEqual([1,3,2,0,4,5,6,7]);
            });
        });
    });

    describe('myY() method', () => {
        it("Checking simple values", () => {
            org.y = 1;
            expect(ops.operators[hex('110000 00')].call(ops, 0, hex('110000 00'), org)).toEqual(1); // v0=myY()
            expect(ops.vars).toEqual([1,1,2,3]);
            org.y = 3;
            expect(ops.operators[hex('110000 01')].call(ops, 0, hex('110000 01'), org)).toEqual(1); // v1=myY()
            expect(ops.vars).toEqual([1,3,2,3]);
            org.y = 0;
            expect(ops.operators[hex('110000 11')].call(ops, 0, hex('110000 11'), org)).toEqual(1); // v3=myY()
            expect(ops.vars).toEqual([1,3,2,0]);
        });

        describe('myY() operator with 3bits per var', () => {
            let bpv;
            let ops;
            let vars;
            let offs;
            beforeAll(() => {
                bpv = OConfig.codeBitsPerVar;
                OConfig.codeBitsPerVar = 3;
                OperatorsDos.compile();
            });
            afterAll(() => OperatorsDos.compile());
            beforeEach(() => {
                vars = [0, 1, 2, 3, 4, 5, 6, 7];
                offs = new Array(10);
                ops = new OperatorsDos(offs, vars, org);
            });
            afterEach(() => {
                ops.destroy();
                ops = null;
                offs = null;
                vars = null;
                OConfig.codeBitsPerVar = bpv;
            });

            it("Checking simple values", () => {
                org.y = 1;
                expect(ops.operators[hex('110000 000')].call(ops, 0, hex('110000 000'), org)).toEqual(1); // v0=myY()
                expect(ops.vars).toEqual([1,1,2,3,4,5,6,7]);
                org.y = 3;
                expect(ops.operators[hex('110000 001')].call(ops, 0, hex('110000 001'), org)).toEqual(1); // v1=myY()
                expect(ops.vars).toEqual([1,3,2,3,4,5,6,7]);
                org.y = 0;
                expect(ops.operators[hex('110000 011')].call(ops, 0, hex('110000 011'), org)).toEqual(1); // v3=myY()
                expect(ops.vars).toEqual([1,3,2,0,4,5,6,7]);
            });
        });
    });

    describe('eat() operator', () => {
        let maxEnergy = OConfig.orgMaxEnergy;
        beforeEach(() => OConfig.orgMaxEnergy = 100);
        afterEach (() => OConfig.orgMaxEnergy = maxEnergy);

        it("Checking eating nothing 1", () => {
            const energy = org.energy;
            ops.vars = [0, 0, 1, 2];
            expect(ops.operators[hex('110001 00')].call(ops, 0, hex('110001 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([0, 0, 1, 2]);
            expect(org.energy).toEqual(energy);
        });
        it("Checking eating nothing 2", () => {
            const energy = org.energy;
            ops.vars = [1, 0, 1, 2];
            expect(ops.operators[hex('110001 00')].call(ops, 0, hex('110001 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([1, 0, 1, 2]);
            expect(org.energy).toEqual(energy);
        });

        it("Checking eating energy", () => {
            org.energy = 1;
            ops.vars = [1, 0, 1, 2];
            ops.world.setDot(1,0,10);
            org.dir = DIRS.UP;
            org.x = 1;
            org.y = 1;
            expect(ops.operators[hex('110001 00')].call(ops, 0, hex('110001 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([1, 0, 1, 2]);
            expect(org.energy).toEqual(2);
        });

        it("Checking eating world object", () => {
            org.energy = 1;
            ops.vars = [1, 0, 1, 2];
            ops.world.setDot(1,0,10);
            org.dir = DIRS.UP;
            org.x = 1;
            org.y = 1;
            global.man.positions[1][0] = OBJECT_TYPES.TYPE_ENERGY2;
            expect(ops.operators[hex('110001 00')].call(ops, 0, hex('110001 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([1, 0, 1, 2]);
            expect(org.energy).toEqual(1);

            global.man.positions[1][0] = 0;
            ops.world.setDot(1,0,0);
        });

        it("Checking eating out of the world", () => {
            org.energy = 1;
            ops.vars = [1, 0, 1, 2];
            org.dir = DIRS.UP;
            org.x = 0;
            org.y = 0;
            expect(ops.operators[hex('110001 00')].call(ops, 0, hex('110001 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([1, 0, 1, 2]);
            expect(org.energy).toEqual(1);
        });

        it("Checking eating other organism", () => {
            const org2   = new OrganismDos(1, 0, 0, {});
            const energy = org2.energy;
            org.energy = 1;
            ops.vars = [1, 0, 1, 2];
            ops.world.setDot(1,0,10);
            org.dir = DIRS.UP;
            org.x = 1;
            org.y = 1;
            global.man.positions[1][0] = org2;
            expect(ops.operators[hex('110001 00')].call(ops, 0, hex('110001 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([1, 0, 1, 2]);
            expect(org.energy).toEqual(2);
            expect(org2.energy).toEqual(energy - 1);


            global.man.positions[1][0] = 0;
            ops.world.setDot(1,0,0);
        });

        describe('eat() operator with 3bits per var', () => {
            let bpv;
            let ops;
            let vars;
            let offs;
            beforeAll(() => {
                bpv = OConfig.codeBitsPerVar;
                OConfig.codeBitsPerVar = 3;
                OperatorsDos.compile();
            });
            afterAll(() => OperatorsDos.compile());
            beforeEach(() => {
                vars = [0, 1, 2, 3, 4, 5, 6, 7];
                offs = new Array(10);
                ops = new OperatorsDos(offs, vars, org);
            });
            afterEach(() => {
                ops.destroy();
                ops = null;
                offs = null;
                vars = null;
                OConfig.codeBitsPerVar = bpv;
            });

            it("Checking eating nothing 1", () => {
                const energy = org.energy;
                ops.vars = [0, 0, 1, 2, 3, 4, 5, 6, 7];
                expect(ops.operators[hex('110001 000')].call(ops, 0, hex('110001 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([0, 0, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(energy);
            });
            it("Checking eating nothing 2", () => {
                const energy = org.energy;
                ops.vars = [1, 0, 1, 2, 3, 4, 5, 6, 7];
                expect(ops.operators[hex('110001 000')].call(ops, 0, hex('110001 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([1, 0, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(energy);
            });
            it("Checking eating energy", () => {
                org.energy = 1;
                ops.vars = [1, 0, 1, 2, 3, 4, 5, 6, 7];
                ops.world.setDot(1,0,10);
                org.dir = DIRS.UP;
                org.x = 1;
                org.y = 1;
                expect(ops.operators[hex('110001 000')].call(ops, 0, hex('110001 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([1, 0, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(2);
            });

            it("Checking eating world object", () => {
                org.energy = 1;
                ops.vars = [1, 0, 1, 2, 3, 4, 5, 6, 7];
                ops.world.setDot(1,0,10);
                org.dir = DIRS.UP;
                org.x = 1;
                org.y = 1;
                global.man.positions[1][0] = OBJECT_TYPES.TYPE_ENERGY2;
                expect(ops.operators[hex('110001 000')].call(ops, 0, hex('110001 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([1, 0, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(1);

                global.man.positions[1][0] = 0;
                ops.world.setDot(1,0,0);
            });

            it("Checking eating out of the world", () => {
                org.energy = 1;
                ops.vars = [1, 0, 1, 2, 3, 4, 5, 6];
                org.dir = DIRS.UP;
                org.x = 0;
                org.y = 0;
                expect(ops.operators[hex('110001 000')].call(ops, 0, hex('110001 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([1, 0, 1, 2, 3, 4, 5, 6]);
                expect(org.energy).toEqual(1);
            });

            it("Checking eating other organism", () => {
                const org2   = new OrganismDos(1, 0, 0, {});
                const energy = org2.energy;
                org.energy = 1;
                ops.vars = [1, 0, 1, 2, 3, 4, 5, 6, 7];
                ops.world.setDot(1,0,10);
                org.dir = DIRS.UP;
                org.x = 1;
                org.y = 1;
                global.man.positions[1][0] = org2;
                expect(ops.operators[hex('110001 000')].call(ops, 0, hex('110001 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([1, 0, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(2);
                expect(org2.energy).toEqual(energy - 1);


                global.man.positions[1][0] = 0;
                ops.world.setDot(1,0,0);
            });
        });
    });

    describe('put() operator', () => {
        it("Checking put nothing", () => {
            const energy = org.energy;
            ops.vars = [0, 1, 2, 3];
            expect(ops.operators[hex('110010 00')].call(ops, 0, hex('110010 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([0, 1, 2, 3]);
            expect(org.energy).toEqual(energy);
        });

        it("Checking put of energy", () => {
            const energy = org.energy = 10;
            org.x = 1;
            org.y = 1;
            ops.vars = [1, 1, 2, 3];
            expect(ops.operators[hex('110010 00')].call(ops, 0, hex('110010 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([1, 1, 2, 3]);
            expect(org.energy).toEqual(energy - 1);
        });

        it("Checking put huge amount of energy", () => {
            org.energy = 0xfffffff;
            org.x = 1;
            org.y = 1;
            ops.vars = [0xfffffff, 1, 2, 3];
            expect(ops.operators[hex('110010 00')].call(ops, 0, hex('110010 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([0xfffffff, 1, 2, 3]);
            expect(org.energy).toEqual(0xfffffff - 0xffffff);
        });

        it("Checking killing of organism while put energy", () => {
            org.energy = 1;
            org.x = 1;
            org.y = 1;
            ops.vars = [1, 1, 2, 3];
            expect(ops.operators[hex('110010 00')].call(ops, 0, hex('110010 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([1, 1, 2, 3]);
            expect(org.energy).toEqual(0);
        });

        it("Checking put if organism is out of bounds", () => {
            org.energy = 1;
            org.x = 0;
            org.y = 0;
            org.dir = DIRS.UP;
            ops.vars = [1, 1, 2, 3];
            expect(ops.operators[hex('110010 00')].call(ops, 0, hex('110010 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([1, 1, 2, 3]);
            expect(org.energy).toEqual(1);
        });

        it("Checking negative put", () => {
            org.energy = 1;
            org.x = 1;
            org.y = 1;
            org.dir = DIRS.UP;
            ops.vars = [-1, 1, 2, 3];
            expect(ops.operators[hex('110010 00')].call(ops, 0, hex('110010 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([-1, 1, 2, 3]);
            expect(org.energy).toEqual(1);
        });

        it("Checking put if something is there", () => {
            org.energy = 1;
            org.x = 1;
            org.y = 1;
            org.dir = DIRS.UP;
            ops.vars = [1, 1, 2, 3];
            global.man.world.setDot(1,0,0xaabbcc);
            expect(ops.operators[hex('110010 00')].call(ops, 0, hex('110010 00'), org)).toEqual(1);
            expect(ops.vars).toEqual([1, 1, 2, 3]);
            expect(org.energy).toEqual(1);

            global.man.world.setDot(1,0,0);
        });

        describe('eat() operator with 3bits per var', () => {
            let bpv;
            let ops;
            let vars;
            let offs;
            beforeAll(() => {
                bpv = OConfig.codeBitsPerVar;
                OConfig.codeBitsPerVar = 3;
                OperatorsDos.compile();
            });
            afterAll(() => OperatorsDos.compile());
            beforeEach(() => {
                vars = [0, 1, 2, 3, 4, 5, 6, 7];
                offs = new Array(10);
                ops = new OperatorsDos(offs, vars, org);
            });
            afterEach(() => {
                ops.destroy();
                ops = null;
                offs = null;
                vars = null;
                OConfig.codeBitsPerVar = bpv;
            });

            it("Checking put nothing", () => {
                const energy = org.energy;
                ops.vars = [0, 1, 2, 3, 4, 5, 6, 7];
                expect(ops.operators[hex('110010 000')].call(ops, 0, hex('110010 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(energy);
            });

            it("Checking put of energy", () => {
                const energy = org.energy = 10;
                org.x = 1;
                org.y = 1;
                ops.vars = [1, 1, 2, 3, 4, 5, 6, 7];
                expect(ops.operators[hex('110010 000')].call(ops, 0, hex('110010 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([1, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(energy - 1);
            });

            it("Checking put huge amount of energy", () => {
                org.energy = 0xfffffff;
                org.x = 1;
                org.y = 1;
                ops.vars = [0xfffffff, 1, 2, 3, 4, 5, 6, 7];
                expect(ops.operators[hex('110010 000')].call(ops, 0, hex('110010 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([0xfffffff, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(0xfffffff - 0xffffff);
            });

            it("Checking killing of organism while put energy", () => {
                org.energy = 1;
                org.x = 1;
                org.y = 1;
                ops.vars = [1, 1, 2, 3, 4, 5, 6, 7];
                expect(ops.operators[hex('110010 000')].call(ops, 0, hex('110010 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([1, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(0);
            });

            it("Checking put if organism is out of bounds", () => {
                org.energy = 1;
                org.x = 0;
                org.y = 0;
                org.dir = DIRS.UP;
                ops.vars = [1, 1, 2, 3, 4, 5, 6, 7];
                expect(ops.operators[hex('110010 000')].call(ops, 0, hex('110010 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([1, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(1);
            });

            it("Checking negative put", () => {
                org.energy = 1;
                org.x = 1;
                org.y = 1;
                org.dir = DIRS.UP;
                ops.vars = [-1, 1, 2, 3, 4, 5, 6, 7];
                expect(ops.operators[hex('110010 000')].call(ops, 0, hex('110010 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([-1, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(1);
            });

            it("Checking put if something is there", () => {
                org.energy = 1;
                org.x = 1;
                org.y = 1;
                org.dir = DIRS.UP;
                ops.vars = [1, 1, 2, 3, 4, 5, 6, 7];
                global.man.world.setDot(1,0,0xaabbcc);
                expect(ops.operators[hex('110010 000')].call(ops, 0, hex('110010 000'), org)).toEqual(1);
                expect(ops.vars).toEqual([1, 1, 2, 3, 4, 5, 6, 7]);
                expect(org.energy).toEqual(1);

                global.man.world.setDot(1,0,0);
            });
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