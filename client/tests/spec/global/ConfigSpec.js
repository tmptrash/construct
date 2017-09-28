describe("client/src/global/Config", () => {
    let Config  = require('../../../../src/global/Config').Config;
    let api     = require('../../../../src/global/Config').api;
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