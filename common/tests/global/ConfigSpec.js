describe("common/src/global/Config", () => {
    let Config  = require('./../../../client/src/global/Config').Config;
    let api     = require('./../../../client/src/global/Config').api;
    let cfg;

    beforeEach(() => {
        cfg = JSON.parse(JSON.stringify(Config));
    });
    afterEach(() => {
       for (let c in cfg) {
           if (cfg.hasOwnProperty(c)) {
               Config[c] = cfg[c];
           }
       }
    });

    it("Checking set()/get() method", () => {
        api.set('worldWidth', 123);
        expect(api.get('worldWidth')).toEqual(123);
        expect(Config.worldWidth).toEqual(123);

        api.set('worldWidth', 124);
        expect(api.get('worldWidth')).toEqual(124);
        expect(Config.worldWidth).toEqual(124);
    });
});