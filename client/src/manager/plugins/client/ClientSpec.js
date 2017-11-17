describe("client/src/manager/plugins/Client", () => {
    let Helper       = require('./../../../../../common/src/Helper');
    let THelper      = require('./../../../../../common/tests/Helper');
    let Observer     = require('./../../../../../common/src/Observer');
    let Config       = require('./../../../share/Config').Config;
    let SConfig      = require('./../../../../../server/src/share/Config').Config;
    let EVENT_AMOUNT = require('./../../../share/Events').EVENT_AMOUNT;
    let SEVENTS      = require('./../../../../../server/src/server/Server').EVENTS;
    let api          = require('./../../../share/Config').api;
    let Console      = require('./../../../share/Console');
    let SConsole     = require('./../../../../../server/src/share/Console');
    const Api        = require('./../../../../../server/src/server/plugins/Api');
    const Request    = require('./../../../../../common/src/plugins/Request');
    const waitEvent  = THelper.waitEvent;
    let isNodeJs;
    let Client;
    let CEVENTS;
    let Server;

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
        Client   = require('./Client').Client;
        CEVENTS  = require('./Client').EVENTS;
        Server   = require('./../../../../../server/src/server/Server').Server;
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

    it("Checking client creation without server", (done) => {
        class Man0 extends Observer {
            constructor() {
                super(EVENT_AMOUNT);
                this.activeAround = [false,false,false,false];
                this._clientId = null;
            }
            run()            {}
            set clientId(id) {this._clientId = id}
        }
        const man    = new Man0();
        const client = new Client(man);

        waitEvent(client, CEVENTS.DESTROY, () => client.destroy(), () => {
            man.clear();
            done();
        });
    });
    it("Checking client creation with a server", (done) => {
        class Man extends Observer {
            constructor() {
                super(EVENT_AMOUNT);
                this.activeAround = [false, false, false, false];
                this._clientId = null;
            }
            run() {}
            set clientId(id) {this._clientId = id}
        }
        const man = new Man();
        const server = new Server(SConfig.port);

        waitEvent(server, SEVENTS.RUN, () => server.run(), () => {
            const client = new Client(man);
            waitEvent(client, CEVENTS.GET_ID, () => client.run(), () => {
                waitEvent(client, CEVENTS.CLOSE, () => server.destroy(), () => {
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
                this._clientId = null;
            }
            run()            {++count === 2 && (waitObj.done = true)}
            set clientId(id) {this._clientId = id}
        }
        class Man2 extends Observer {
            constructor() {
                super(EVENT_AMOUNT);
                this.activeAround = [false,false,false,false];
                this._clientId = null;
            }
            run()            {++count === 2 && (waitObj.done = true)}
            set clientId(id) {this._clientId = id}
        }
        const man1    = new Man1();
        const man2    = new Man2();
        const server  = new Server(SConfig.port);

        waitEvent(server, SEVENTS.RUN, () => server.run(), () => {
            const client1 = new Client(man1);
            const client2 = new Client(man2);
            client1.run();
            client2.run();
            THelper.wait(waitObj, () => { // waiting for Man1.run()
                count = 0;
                client1.on(CEVENTS.CLOSE, () => ++count === 2 && (waitObj.done = true));
                client2.on(CEVENTS.CLOSE, () => ++count === 2 && (waitObj.done = true));
                server.destroy();
                THelper.wait(waitObj, () => {
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