describe("server/src/server/Server", () => {
    const WebSocket    = require('ws');
    const Config       = require('./../../../common/src/global/Config').Config;
    const Observer     = require('./../../../common/src/global/Observer');
    const Server       = require('./../../../server/src/server/Server').Server;
    const OLD_MODE     = Config.modeNodeJs;
    Config.modeNodeJs  = true;
    const Client       = require('./../../../client/src/manager/plugins/Client').Client;
    const CEVENTS      = require('./../../../client/src/manager/plugins/Client').EVENTS;
    const SEVENTS      = require('./../../../server/src/server/Server').EVENTS;
    const EVENT_AMOUNT = require('./../../../client/src/global/Events').EVENT_AMOUNT;
    const SConsole     = require('./../../../server/src/global/Console');
    const Console      = require('./../../../client/src/global/Console');
    const Helper       = require('./../../../common/tests/Helper');
    const TYPES        = require('./../../../common/src/global/Requests').TYPES;
    const Api          = require('./../../src/server/plugins/Api');
    const Request      = require('./../../../common/src/net/plugins/Request');

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

    it("Checking server creation", () => {
        let server = new Server(8899, PLUGINS);

        server.destroy();
    });
    it("Checking many servers creation", () => {
        let server;

        for (let i = 0; i < 100; i++) {
            server = new Server(8899, PLUGINS);
            server.destroy();
        }
    });
    it("Checking two servers creation on different ports", () => {
        let server1 = new Server(8898, PLUGINS);
        let server2 = new Server(8899, PLUGINS);

        server2.destroy();
        server1.destroy();
    });
    it("Checking two servers creation on the same port", () => {
        let server1 = new Server(8899, PLUGINS);
        let server2 = new Server(8899, PLUGINS);

        server2.destroy();
        server1.destroy();
    });
    it("Checking two servers creation on different ports", () => {
        let server1 = new Server(8898, PLUGINS);
        let server2 = new Server(8899, PLUGINS);

        server2.destroy();
        server1.destroy();
    });
    it("Checking two servers running on the same port", (done) => {
        let server1 = new Server(8899, PLUGINS);
        let server2 = new Server(8899, PLUGINS);
        let waitObj = {done: false};

        expect(server1.run()).toEqual(true);
        expect(server2.run()).toEqual(false);

        server2.destroy();
        server1.destroy();

        server1.on(SEVENTS.STOP, () => waitObj.done = true);
        Helper.waitFor(waitObj, done);
    });
    it("Checking two servers running on different ports", (done) => {
        let server1 = new Server(8898, PLUGINS);
        let server2 = new Server(8899, PLUGINS);
        let waitObj = {done: false};
        let times   = 0;

        expect(server1.run()).toEqual(true);
        expect(server2.run()).toEqual(true);

        server2.destroy();
        server1.destroy();

        server1.on(SEVENTS.STOP, () => {if (++times === 2) {waitObj.done = true}});
        server2.on(SEVENTS.STOP, () => {if (++times === 2) {waitObj.done = true}});
        Helper.waitFor(waitObj, done);
    });

    it("Checking stopping of created server", () => {
        let server = new Server(8899, PLUGINS);
        expect(server.stop()).toBe(false);
        server.destroy();
    });
    it("Checking many times stopping of created server", () => {
        let server = new Server(8899, PLUGINS);
        for (let i = 0; i < 1000; i++) {
            expect(server.stop()).toBe(false);
        }
        server.destroy();
    });
    it("Checking many times running/stopping of created server", () => {
        let server = new Server(8899, PLUGINS);
        for (let i = 0; i < 100; i++) {
            server.run();
            server.stop();
        }
        server.destroy();
    });
    it("Checking server running many times", () => {
        let server = new Server(8899, PLUGINS);
        for (let i = 0; i < 100; i++) {
            server.run();
        }
        server.destroy();
    });
    it("Checking server run", (done) => {
        let server  = new Server(8899, PLUGINS);
        let waitObj = {done: false};

        server.on(SEVENTS.RUN, () => waitObj.done = true);
        expect(server.run()).toEqual(true);
        Helper.waitFor(waitObj, () => {
            server.on(SEVENTS.STOP, () => waitObj.done = true);
            server.stop();
            Helper.waitFor(waitObj, () => {
                server.destroy();
                done();
            });
        });
    });
    it("Checking server run/stop/run/stop", (done) => {
        let server  = new Server(8899, PLUGINS);
        let waitObj = {done: false};

        server.on(SEVENTS.RUN, () => waitObj.done = true);
        expect(server.run()).toEqual(true);
        Helper.waitFor(waitObj, () => {
            server.on(SEVENTS.STOP, () => waitObj.done = true);
            server.on(SEVENTS.RUN,  () => waitObj.done = true);
            server.stop();
            Helper.waitFor(waitObj, () => {
                expect(server.run()).toEqual(true);
                Helper.waitFor(waitObj, () => {
                    server.stop();
                    Helper.waitFor(waitObj, () => {
                        server.destroy();
                        done();
                    });
                });
            });
        });
    });

    it("Checking server run + one client connection", (done) => {
        let server  = new Server(8899, PLUGINS);
        let waitObj = {done: false};

        server.on(SEVENTS.CONNECT, () => waitObj.done = true);
        expect(server.run()).toEqual(true);
        const ws = new WebSocket('ws://127.0.0.1:8899');
        Helper.waitFor(waitObj, () => {
            server.on(SEVENTS.STOP, () => waitObj.done = true);
            server.stop();
            Helper.waitFor(waitObj, () => {
                server.destroy();
                done();
            });
        });
    });
    it("Checking server run + two clients connection", (done) => {
        let server  = new Server(8899, PLUGINS);
        let waitObj = {done: false};
        let cons    = 0;

        server.on(SEVENTS.CONNECT, () => {if (++cons === 2) {waitObj.done = true}});
        expect(server.run()).toEqual(true);
        const ws1 = new WebSocket('ws://127.0.0.1:8899');
        const ws2 = new WebSocket('ws://127.0.0.1:8899');
        Helper.waitFor(waitObj, () => {
            server.on(SEVENTS.STOP, () => waitObj.done = true);
            server.stop();
            Helper.waitFor(waitObj, () => {
                server.destroy();
                done();
            });
        });
    });
    it("Checking server run + two clients and one disconnected", (done) => {
        let server  = new Server(8899, PLUGINS);
        let waitObj = {done: false};
        let cons    = 0;

        server.on(SEVENTS.CONNECT, () => {if (++cons === 2) {waitObj.done = true}});
        expect(server.run()).toEqual(true);
        const ws1 = new WebSocket('ws://127.0.0.1:8899');
        const ws2 = new WebSocket('ws://127.0.0.1:8899');
        Helper.waitFor(waitObj, () => {
            server.on(SEVENTS.CLOSE, () => waitObj.done = true);
            ws2.close();
            Helper.waitFor(waitObj, () => {
                server.on(SEVENTS.STOP, () => waitObj.done = true);
                server.stop();
                Helper.waitFor(waitObj, () => {
                    server.destroy();
                    done();
                });
            })
        });
    });
    it("Checking server run + one client connect/disconnect/connect", (done) => {
        let server  = new Server(8899, PLUGINS);
        let waitObj = {done: false};

        server.on(SEVENTS.CONNECT, () => waitObj.done = true);
        expect(server.run()).toEqual(true);
        let ws = new WebSocket('ws://127.0.0.1:8899');
        Helper.waitFor(waitObj, () => {
            ws.close();
            server.on(SEVENTS.CLOSE, () => waitObj.done = true);
            Helper.waitFor(waitObj, () => {
                ws = new WebSocket('ws://127.0.0.1:8899');
                Helper.waitFor(waitObj, () => {
                    server.on(SEVENTS.STOP, () => waitObj.done = true);
                    server.destroy();
                    Helper.waitFor(waitObj, done);
                });
            });
        });
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
        let maxCon  = Config.serMaxConnections;
        Config.serMaxConnections = 1;
        let server  = new Server(Config.serPort, PLUGINS);
        let id      = null;
        const man   = new Man();

        expect(server.run()).toEqual(true);
        server.on(SEVENTS.RUN, () => waitObj.done = true);
        Helper.waitFor(waitObj, () => {
            const client = new Client(man);
            client.on(CEVENTS.GET_ID, (uid) => {id = uid;waitObj.done = true});
            Helper.waitFor(waitObj, () => {
                expect(id !== null).toEqual(true);
                server.on(SEVENTS.STOP, () => waitObj.done = true);
                server.destroy();
                Helper.waitFor(waitObj, () => {
                    Config.serMaxConnections = maxCon;
                    done();
                });
            });
        });
    });

    it("Checking isActive() method", (done) => {
        let server  = new Server(8899, PLUGINS);
        let waitObj = {done: false};

        server.on(SEVENTS.CONNECT, () => waitObj.done = true);
        expect(server.run()).toEqual(true);
        const ws = new WebSocket('ws://127.0.0.1:8899');
        Helper.waitFor(waitObj, () => {
            expect(server.isActive()).toEqual(true);
            server.on(SEVENTS.STOP, () => waitObj.done = true);
            server.destroy();
            Helper.waitFor(waitObj, () => {
                expect(server.isActive()).toEqual(false);
                done();
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
        let maxCon  = Config.serMaxConnections;
        Config.serMaxConnections = 1;
        let server  = new Server(Config.serPort, PLUGINS);
        let man     = new Man1();
        let oldId   = null;
        let id      = null;

        expect(server.run()).toEqual(true);
        const client = new Client(man);
        client.on(CEVENTS.GET_ID, (uid) => {oldId === null ? oldId = uid : id = uid;waitObj.done = true});
        Helper.waitFor(waitObj, () => {
            client.on(CEVENTS.CLOSE, () => waitObj.done = true);
            client.stop();
            Helper.waitFor(waitObj, () => {
                client.run();
                Helper.waitFor(waitObj, () => {
                    expect(oldId).toEqual(id);
                    server.on(SEVENTS.STOP, () => waitObj.done = true);
                    server.destroy();
                    Helper.waitFor(waitObj, () => {
                        Config.serMaxConnections = maxCon;
                        done();
                    });
                });
            });
        });
    });
    // it("Checking that extra client should be disconnected", (done) => {
    //     let maxCon  = Config.serMaxConnections;
    //     Config.serMaxConnections = 1;
    //     let server  = new Server(8899, PLUGINS);
    //     let waitObj = {done: false};
    //
    //     let id;
    //     expect(server.run()).toEqual(true);
    //     let ws = new WebSocket('ws://127.0.0.1:8899');
    //     ws.onmessage = () => waitObj.done = true;
    //     Helper.waitFor(waitObj, () => {
    //         let ws1 = new WebSocket('ws://127.0.0.1:8899');
    //         server.on(SEVENTS.OVERFLOW, () => waitObj.done = true);
    //         Helper.waitFor(waitObj, () => {
    //             expect(ws1.readyState).toEqual(WebSocket.CLOSED);
    //             server.on(SEVENTS.STOP, () => waitObj.done = true);
    //             server.destroy();
    //             Helper.waitFor(waitObj, () => {
    //                 Config.serMaxConnections = maxCon;
    //                 done();
    //             });
    //         });
    //     });
    // });
    //
    // it("Checking sending message by client", (done) => {
    //     let server  = new Server(8899, PLUGINS);
    //     let waitObj = {done: false};
    //     let data;
    //
    //     expect(server.run()).toEqual(true);
    //     const ws = new WebSocket('ws://127.0.0.1:8899');
    //     ws.on('message', function(e) {waitObj.done = true; data = JSON.parse(e)});
    //     Helper.waitFor(waitObj, () => {
    //         expect(data[0] === TYPES.REQ_GIVE_ID).toEqual(true);
    //         server.on(SEVENTS.STOP, () => waitObj.done = true);
    //         server.stop();
    //         Helper.waitFor(waitObj, () => {
    //             server.destroy();
    //             done();
    //         });
    //     });
    // });
});