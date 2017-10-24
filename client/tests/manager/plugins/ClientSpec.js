describe("client/src/manager/plugins/Client", () => {
    let Helper       = require('./../../../../common/src/global/Helper');
    let THelper      = require('./../../../../common/tests/Helper');
    let Observer     = require('./../../../../common/src/global/Observer');
    let Config       = require('./../../../../common/src/global/Config').Config;
    let EVENT_AMOUNT = require('./../../../../client/src/global/Events').EVENT_AMOUNT;
    let SEVENTS      = require('./../../../../server/src/server/Server').EVENTS;
    let api          = require('./../../../../common/src/global/Config').api;
    let Console      = require('./../../../../client/src/global/Console');
    let SConsole     = require('./../../../../server/src/global/Console');
    const Api        = require('./../../../../server/src/server/plugins/Api');
    const Request    = require('./../../../../common/src/net/plugins/Request');
    let isNodeJs;
    let Client;
    let CEVENTS;
    let Server;

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
        //
        // These two lines set modeNodeJs mode to Node.js as running environment
        //
        isNodeJs = Config.modeNodeJs;api.set('modeNodeJs', true);
        Client   = require('./../../../../client/src/manager/plugins/Client').Client;
        CEVENTS  = require('./../../../../client/src/manager/plugins/Client').EVENTS;
        Server   = require('./../../../../server/src/server/Server').Server;
        //
        // These lines prevents classes put messages to the console
        //
        error  = Console.error;
        warn   = Console.warn;
        info   = Console.info;
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
    afterAll(() => {
        api.set('modeNodeJs', isNodeJs);
        SConsole.error = serror;
        SConsole.warn  = swarn;
        SConsole.info  = sinfo;

        Console.error = error;
        Console.warn  = warn;
        Console.info  = info;
    });

    it("Checking client creation without server", () => {
        class Man0 extends Observer {
            constructor() {
                super(EVENT_AMOUNT);
                this.activeAround = [false,false,false,false];
                this.clientId = null;
            }
            run()           {}
            setClientId(id) {this.clientId = id}
        }
        const man    = new Man0();
        const client = new Client(man);

        client.destroy();
        man.clear();
    });
    it("Checking client creation with a server", (done) => {
        const waitObj = {done: false};
        class Man extends Observer {
            constructor() {
                super(EVENT_AMOUNT);
                this.activeAround = [false,false,false,false];
                this.clientId = null;
            }
            run()           {waitObj.done = true}
            setClientId(id) {this.clientId = id}
        }
        const man    = new Man();
        const server = new Server(Config.serPort, PLUGINS);

        server.on(SEVENTS.RUN, () => waitObj.done = true);
        server.run();
        THelper.waitFor(waitObj, () => {
            const client = new Client(man);
            THelper.waitFor(waitObj, () => { // waiting for Man.run()
                server.on(SEVENTS.STOP, () => waitObj.done = true);
                server.destroy();
                THelper.waitFor(waitObj, () => {
                    client.destroy();
                    man.clear();
                    done();
                });
            });
        });
    });
    it("Checking two clients with server", (done) => {
        const waitObj = {done: false};
        let   count   = 0;
        class Man1 extends Observer {
            constructor() {
                super(EVENT_AMOUNT);
                this.activeAround = [false,false,false,false];
                this.clientId = null;
            }
            run()           {++count === 2 && (waitObj.done = true)}
            setClientId(id) {this.clientId = id}
        }
        class Man2 extends Observer {
            constructor() {
                super(EVENT_AMOUNT);
                this.activeAround = [false,false,false,false];
                this.clientId = null;
            }
            run()           {++count === 2 && (waitObj.done = true)}
            setClientId(id) {this.clientId = id}
        }
        const man1    = new Man1();
        const man2    = new Man2();
        const server  = new Server(Config.serPort, PLUGINS);

        server.on(SEVENTS.RUN, () => waitObj.done = true);
        server.run();
        THelper.waitFor(waitObj, () => {
            const client1 = new Client(man1);
            const client2 = new Client(man2);
            THelper.waitFor(waitObj, () => { // waiting for Man1.run()
                server.on(SEVENTS.STOP, () => {waitObj.done = true});
                server.destroy();
                THelper.waitFor(waitObj, () => {
                    client1.destroy();
                    client2.destroy();
                    man1.clear();
                    man2.clear();
                    done();
                });
            });
        });
    });
});