describe("src/global/Console", () => {
    let Console = require('../../../src/global/Console').default;
    let log;
    let inc = 0;

    beforeEach(() => {
        log = console.log;
        console.log = () => inc++;
    });

    afterEach(() => console.log = log);

    it("Checking info() method in default mode", () => {
        inc = 0;
        Console.info("msg");
        expect(inc).toEqual(0);
    });
    it("Checking info() with MODE_QUIET_ALL mode", () => {
        inc = 0;
        Console.mode(Console.MODE_QUIET_ALL);
        Console.info("msg");
        expect(inc).toEqual(1);
        Console.mode(undefined);
    });
    it("Checking info() with MODE_QUIET_IMPORTANT mode", () => {
        inc = 0;
        Console.mode(Console.MODE_QUIET_IMPORTANT);
        Console.info("msg");
        expect(inc).toEqual(0);
        Console.mode(undefined);
    });
    it("Checking info() with MODE_QUIET_NO mode", () => {
        inc = 0;
        Console.mode(Console.MODE_QUIET_NO);
        Console.info("msg");
        expect(inc).toEqual(0);
        Console.mode(undefined);
    });

    it("Checking warn() method in default mode", () => {
        inc = 0;
        Console.warn("msg");
        expect(inc).toEqual(1);
    });
    it("Checking warn() with MODE_QUIET_ALL mode", () => {
        inc = 0;
        Console.mode(Console.MODE_QUIET_ALL);
        Console.warn("msg");
        expect(inc).toEqual(1);
        Console.mode(undefined);
    });
    it("Checking warn() with MODE_QUIET_IMPORTANT mode", () => {
        inc = 0;
        Console.mode(Console.MODE_QUIET_IMPORTANT);
        Console.warn("msg");
        expect(inc).toEqual(1);
        Console.mode(undefined);
    });
    it("Checking warn() with MODE_QUIET_NO mode", () => {
        inc = 0;
        Console.mode(Console.MODE_QUIET_NO);
        Console.warn("msg");
        expect(inc).toEqual(0);
        Console.mode(undefined);
    });

    it("Checking error() method in default mode", () => {
        inc = 0;
        Console.error("msg");
        expect(inc).toEqual(1);
    });
    it("Checking error() with MODE_QUIET_ALL mode", () => {
        inc = 0;
        Console.mode(Console.MODE_QUIET_ALL);
        Console.error("msg");
        expect(inc).toEqual(1);
        Console.mode(undefined);
    });
    it("Checking error() with MODE_QUIET_IMPORTANT mode", () => {
        inc = 0;
        Console.mode(Console.MODE_QUIET_IMPORTANT);
        Console.error("msg");
        expect(inc).toEqual(1);
        Console.mode(undefined);
    });
    it("Checking error() with MODE_QUIET_NO mode", () => {
        inc = 0;
        Console.mode(Console.MODE_QUIET_NO);
        Console.error("msg");
        expect(inc).toEqual(0);
        Console.mode(undefined);
    });
});