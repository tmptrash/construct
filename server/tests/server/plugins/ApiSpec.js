describe("server/src/server/plugins/Api", () => {
    const Config       = require('./../../../../client/src/global/Config').Config;
    const Observer     = require('./../../../../common/src/global/Observer');
    const Server       = require('./../../../../server/src/server/Server').Server;
    const OLD_MODE     = Config.modeNodeJs;
    Config.modeNodeJs  = true;
    const Client       = require('./../../../../client/src/manager/plugins/Client').Client;
    const CEVENTS      = require('./../../../../client/src/manager/plugins/Client').EVENTS;
    const SEVENTS      = require('./../../../../server/src/server/Server').EVENTS;
    const EVENT_AMOUNT = require('./../../../../client/src/global/Events').EVENT_AMOUNT;
    const SConsole     = require('./../../../../server/src/global/Console');
    const Console      = require('./../../../../client/src/global/Console');
    const Helper       = require('./../../../../common/tests/Helper');
    const Api          = require('./../../../src/server/plugins/Api');
    const Request      = require('./../../../../common/src/net/plugins/Request');

    const PLUGINS = {
        Request,
        Api
    };

    let error;
    let warn;
    let info;
    let serror;
    let swarn;
    let sinfo;

    beforeAll(() => {
        error = Console.error;
        warn  = Console.warn;
        info  = Console.info;
        Console.error = () => {};
        Console.warn  = () => {};
        Console.info  = () => {};

        serror  = SConsole.error;
        swarn   = SConsole.warn;
        sinfo   = SConsole.info;
        SConsole.error = () => {};
        SConsole.warn  = () => {};
        SConsole.info  = () => {};
    });
    afterAll(()  => {
        SConsole.error = serror;
        SConsole.warn  = swarn;
        SConsole.info  = sinfo;

        Console.error = error;
        Console.warn  = warn;
        Console.info  = info;
        Config.modeNodeJs = OLD_MODE;
    });

    it("Checking unique id on client connect", (done) => {
        let waitObj = {done: false};
        class Man extends Observer {
            constructor() {
                super(EVENT_AMOUNT);
                this.activeAround = [false,false,false,false];
                this.clientId = null;
            }
            run()           {}
            setClientId(id) {this.clientId = id}
        }
        let maxCon  = Config.maxConnections;
        Config.maxConnections = 1;
        let server  = new Server(Config.port, PLUGINS);
        let id      = null;
        const man   = new Man();

        expect(server.run()).toEqual(true);
        server.on(SEVENTS.RUN, () => waitObj.done = true);
        Helper.wait(waitObj, () => {
            const client = new Client(man);
            client.on(CEVENTS.GET_ID, (uid) => {id = uid;waitObj.done = true});
            client.run();
            Helper.wait(waitObj, () => {
                expect(id !== null).toEqual(true);
                server.on(SEVENTS.STOP, () => waitObj.done = true);
                server.destroy();
                Helper.wait(waitObj, () => {
                    Config.maxConnections = maxCon;
                    done();
                });
            });
        });
    });
    it("Checking unique id on client connect/disconnect and connect again with the same id", (done) => {
        let waitObj = {done: false};
        class Man1 extends Observer {
            constructor() {
                super(EVENT_AMOUNT);
                this.activeAround = [false,false,false,false];
                this.clientId = null;
            }
            run()           {}
            setClientId(id) {this.clientId = id}
        }
        let maxCon  = Config.maxConnections;
        Config.maxConnections = 1;
        let server  = new Server(Config.port, PLUGINS);
        let man     = new Man1();
        let oldId   = null;
        let id      = null;

        expect(server.run()).toEqual(true);
        const client = new Client(man);
        client.run();
        client.on(CEVENTS.GET_ID, (uid) => {oldId === null ? oldId = uid : id = uid;waitObj.done = true});
        Helper.wait(waitObj, () => {
            client.on(CEVENTS.CLOSE, () => waitObj.done = true);
            client.stop();
            Helper.wait(waitObj, () => {
                client.run();
                Helper.wait(waitObj, () => {
                    expect(oldId).toEqual(id);
                    server.on(SEVENTS.STOP, () => waitObj.done = true);
                    server.destroy();
                    Helper.wait(waitObj, () => {
                        Config.maxConnections = maxCon;
                        done();
                    });
                });
            });
        });
    });
});