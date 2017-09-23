describe("src/global/Console", () => {
    let Console = require('../../../src/global/Console').default;
    let Config  = require('../../../src/global/Config').Config;
    let log;
    let inc = 0;
    let arg;
    const prefix = '%c';

    beforeEach(() => {
        log = console.log;
        console.log = (msg) => {inc++;arg = msg;}
    });

    afterEach(() => console.log = log);

    it("Checking info() method in default mode", () => {
        inc = 0;
        Console.info("msg");
        expect(inc).toEqual(0);
    });
    it("Checking info() with many arguments", () => {
        inc = 0;
        Console.mode(Config.QUIET_ALL);
        Console.info("msg", 1, 2);
        expect(arg).toEqual(prefix + 'msg12');
        Console.mode(undefined);
    });
    it("Checking info() with QUIET_ALL mode", () => {
        inc = 0;
        Console.mode(Config.QUIET_ALL);
        Console.info("msg");
        expect(inc).toEqual(1);
        Console.mode(undefined);
    });
    it("Checking info() with QUIET_IMPORTANT mode", () => {
        inc = 0;
        Console.mode(Config.QUIET_IMPORTANT);
        Console.info("msg");
        expect(inc).toEqual(0);
        Console.mode(undefined);
    });
    it("Checking info() with QUIET_NO mode", () => {
        inc = 0;
        Console.mode(Config.QUIET_NO);
        Console.info("msg");
        expect(inc).toEqual(0);
        Console.mode(undefined);
    });

    it("Checking warn() method in default mode", () => {
        inc = 0;
        Console.warn("msg");
        expect(inc).toEqual(1);
    });
    it("Checking warn() with many arguments", () => {
        inc = 0;
        Console.warn("msg", 1, 2);
        expect(arg).toEqual(prefix + 'msg12');
    });
    it("Checking warn() with QUIET_ALL mode", () => {
        inc = 0;
        Console.mode(Config.QUIET_ALL);
        Console.warn("msg");
        expect(inc).toEqual(1);
        Console.mode(undefined);
    });
    it("Checking warn() with QUIET_IMPORTANT mode", () => {
        inc = 0;
        Console.mode(Config.QUIET_IMPORTANT);
        Console.warn("msg");
        expect(inc).toEqual(1);
        Console.mode(undefined);
    });
    it("Checking warn() with QUIET_NO mode", () => {
        inc = 0;
        Console.mode(Config.QUIET_NO);
        Console.warn("msg");
        expect(inc).toEqual(0);
        Console.mode(undefined);
    });

    it("Checking error() method in default mode", () => {
        inc = 0;
        Console.error("msg");
        expect(inc).toEqual(1);
    });
    it("Checking error() with many arguments", () => {
        inc = 0;
        Console.error("msg", 1, 2);
        expect(arg).toEqual(prefix + 'msg12');
    });
    it("Checking error() with QUIET_ALL mode", () => {
        inc = 0;
        Console.mode(Config.QUIET_ALL);
        Console.error("msg");
        expect(inc).toEqual(1);
        Console.mode(undefined);
    });
    it("Checking error() with QUIET_IMPORTANT mode", () => {
        inc = 0;
        Console.mode(Config.QUIET_IMPORTANT);
        Console.error("msg");
        expect(inc).toEqual(1);
        Console.mode(undefined);
    });
    it("Checking error() with QUIET_NO mode", () => {
        inc = 0;
        Console.mode(Config.QUIET_NO);
        Console.error("msg");
        expect(inc).toEqual(0);
        Console.mode(undefined);
    });
});