describe("server/src/server/plugins/Api", () => {
    const Config       = require('./../../../../client/src/share/Config').Config;
    const SConfig      = require('./../../share/Config').Config;
    const Observer     = require('./../../../../common/src/Observer');
    const Server       = require('./../Server').Server;
    const SEVENTS      = require('./../Server').EVENTS;
    const Client       = require('./../../../../client/src/manager/plugins/client/Client').Client;
    const CEVENTS      = require('./../../../../client/src/manager/plugins/client/Client').EVENTS;
    const EVENT_AMOUNT = require('./../../../../client/src/share/Events').EVENT_AMOUNT;
    const Console      = require('./../../../../client/src/share/Console');
    const SConsole     = require('./../../share/Console');
    const Helper       = require('./../../../../common/tests/Helper');
    const waitEvent    = Helper.waitEvent;
    const host         = Config.serverHost;
    const port         = SConfig.port;

    let error;
    let warn;
    let info;
    let serror;
    let swarn;
    let sinfo;
    let dist;

    beforeAll(() => {
        Config.serverHost = 'ws://127.0.0.1';
        dist = SConfig.modeDistributed;
        SConfig.modeDistributed = false;
        SConfig.port = Config.serverPort;
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
        Config.serverHost = host;
        SConfig.modeDistributed = dist;
        SConfig.port = port;
    });

    it("Checking unique id on client connect", (done) => {
        let waitObj = {done: false};
        class Man extends Observer {
            constructor() {
                super(EVENT_AMOUNT);
                this.activeAround = [false,false,false,false];
                this._clientId = null;
            }
            run()            {}
            stop() {}
            get clientId()   {return this._clientId}
            set clientId(id) {this._clientId = id}
        }
        let maxCon  = SConfig.maxConnections;
        SConfig.maxConnections = 1;
        let server  = new Server(SConfig.port);
        let id      = null;
        const man   = new Man();

        waitEvent(server, SEVENTS.RUN, () => server.run(), () => {
            const client = new Client(man);
            client.on(CEVENTS.GET_ID, (uid) => {id = uid;waitObj.done = true});
            client.run();
            Helper.wait(waitObj, () => {
                expect(id !== null).toEqual(true);
                waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), () => {
                    SConfig.maxConnections = maxCon;
                    client.destroy();
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
                this._clientId = null;
            }
            run()  {}
            stop() {}
            set clientId(id) {this._clientId = id}
        }
        let maxCon  = SConfig.maxConnections;
        SConfig.maxConnections = 1;
        let server  = new Server(SConfig.port);
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
                    waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), () => {
                        SConfig.maxConnections = maxCon;
                        client.destroy();
                        done();
                    });
                });
            });
        });
    });
});