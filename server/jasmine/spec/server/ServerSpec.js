describe("server/src/server/Server", () => {
    const Server  = require('./../../../src/server/Server');
    const Console = require('./../../../src/global/Console');
    let error;
    let warn;
    let info;

    beforeAll(() => {
        error = Console.error;
        warn  = Console.warn;
        info  = Console.info;
        Console.error = () => {};
        Console.warn  = () => {};
        Console.info  = () => {};
    });
    afterAll(() => {
        Console.error = error;
        Console.warn  = warn;
        Console.info  = info;
    });

    it("Checking server creation", () => {
        let server = new Server(8899);

        server.destroy();
    });
    it("Checking two servers creation", () => {
        let server1 = new Server(8898);
        let server2 = new Server(8899);

        server2.destroy();
        server1.destroy();
    });
    it("Checking two servers creation on the same port", () => {
        let server1 = new Server(8899);
        let server2 = new Server(8899);

        server2.destroy();
        server1.destroy();
    });

    it("Checking server run", () => {
        let server = new Server(8899);

        expect(server.run()).toEqual(true);
        server.stop();

        server.destroy();
    })
});