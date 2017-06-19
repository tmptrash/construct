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
    it("Checking warn() method in default mode", () => {
        inc = 0;
        Console.warn("msg");
        expect(inc).toEqual(1);
    });
    it("Checking error() method in default mode", () => {
        inc = 0;
        Console.warn("msg");
        expect(inc).toEqual(1);
    });
});