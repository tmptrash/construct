describe("src/global/Helper", () => {
    let   Helper = require('../../../src/global/Helper').default;
    let   Config = require('../../../src/global/Config').Config;
    let   api    = require('../../../src/global/Config').api;
    const WORLD_WIDTH  = Config.worldWidth;
    const WORLD_HEIGHT = Config.worldHeight;

    it("Checking posId() method", () => {
        expect(Helper.posId(0,0)).toEqual(0);
        expect(Helper.posId(0,1)).toEqual(Config.worldWidth);
        expect(Helper.posId(1,0)).toEqual(1);
        expect(Helper.posId(1,1)).toEqual(Config.worldWidth + 1);
        expect(Helper.posId(2,1)).toEqual(Config.worldWidth + 2);
        expect(Helper.posId(3,2)).toEqual(Config.worldWidth * 2 + 3);
        expect(Helper.posId(3,2) === Helper.posId(3,2)).toEqual(true);
        expect(Helper.posId(3,2) === Helper.posId(2,3)).toEqual(false);
    });
    it("Checking override() method", () => {
        class Tmp {method() {inc++;}}
        function oMethod() {inc++;}
        let inc = 0;
        let tmp = new Tmp();

        Helper.override(tmp, 'method', oMethod);
        tmp.method();
        expect(inc).toEqual(2);
    });
    it("Checking two override()/unoverride() method calls", () => {
        class Tmp1 {method() {inc++;}}
        function oMethod1()  {inc++;one++;}
        function oMethod2()  {inc++;two++;}
        let inc = 0;
        let two = 0;
        let one = 0;
        let tmp = new Tmp1();

        Helper.override(tmp, 'method', oMethod1);
        Helper.override(tmp, 'method', oMethod2);
        tmp.method();
        expect(inc).toEqual(3);
        expect(one).toEqual(1);
        expect(two).toEqual(1);
        //
        // unoverride
        //
        Helper.unoverride(tmp, 'method', oMethod2);
        tmp.method();
        expect(inc).toEqual(5);
        expect(one).toEqual(2);
        expect(two).toEqual(1);

        Helper.unoverride(tmp, 'method', oMethod1);
        tmp.method();
        expect(inc).toEqual(6);
        expect(one).toEqual(2);
        expect(two).toEqual(1);
    });
    it("Checking rand(2)", () => {
        let val = Helper.rand(2);
        expect(val === 0 || val === 1).toEqual(true);
    });
    it("Checking rand(0)", () => {
        expect(Helper.rand(0)).toEqual(0);
    });
    it("Checking rand(1)", () => {
        expect(Helper.rand(1)).toEqual(0);
    });

    it("Checking probIndex() method", () => {
        expect(Helper.probIndex([1])).toEqual(0);
    });
    it("Checking probIndex() method 2", () => {
        let zero = 0;
        let one  = 0;

        for (let i=0; i<5000000; i++) {
            if (Helper.probIndex([2,4]) === 0) {
                zero++;
            } else {
                one++;
            }
        }
        expect(Math.round(one / zero)).toEqual(2);
    });

    it("Checking empty() method", () => {
        expect(Helper.empty({x: 0, y: 0})).toEqual(true);
        expect(Helper.empty({x: 2, y: 0})).toEqual(false);
        expect(Helper.empty({x: 0, y: 2})).toEqual(false);
        expect(Helper.empty({x: 3, y: 2})).toEqual(false);
        expect(Helper.empty({})).toEqual(false);
    });

    it("Checking normalize() method", () => {
        const cyc = api.get('worldCyclical');

        api.set('worldCyclical', true);
        expect(Helper.normalize(0,0)).toEqual([0,0]);
        expect(Helper.normalize(WORLD_WIDTH - 1, WORLD_HEIGHT - 1)).toEqual([WORLD_WIDTH - 1, WORLD_HEIGHT - 1]);
        expect(Helper.normalize(WORLD_WIDTH, WORLD_HEIGHT)).toEqual([0, 0]);
        expect(Helper.normalize(-1, WORLD_HEIGHT - 1)).toEqual([WORLD_WIDTH - 1, WORLD_HEIGHT - 1]);
        api.set('worldCyclical', cyc);
    });
});