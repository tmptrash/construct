describe("server/src/server/Server", () => {
    const WebSocket = require('ws');
    const Server    = require('./../../../src/server/Server').Server;
    const EVENTS    = require('./../../../src/server/Server').EVENTS;
    const Console   = require('./../../../src/global/Console');
    const Helper    = require('./../../../../tests/spec/Helper').default;
    const Config    = require('./../../../../src/global/Config').Config;
    const STOC      = require('./../../../../src/global/Requests').STOC;

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
    afterAll(()  => {
        Console.error = error;
        Console.warn  = warn;
        Console.info  = info;
    });

    it("Checking server creation", () => {
        let server = new Server(8899);

        server.destroy();
    });
    it("Checking two servers creation on different ports", () => {
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
    it("Checking two servers creation on different ports", () => {
        let server1 = new Server(8898);
        let server2 = new Server(8899);

        server2.destroy();
        server1.destroy();
    });
    it("Checking two servers running on the same port", (done) => {
        let server1 = new Server(8899);
        let server2 = new Server(8899);
        let waitObj = {done: false};

        expect(server1.run()).toEqual(true);
        expect(server2.run()).toEqual(false);

        server2.destroy();
        server1.destroy();

        server1.on(EVENTS.STOP, () => waitObj.done = true);
        Helper.waitFor(waitObj, done);
    });
    it("Checking two servers running on different ports", (done) => {
        let server1 = new Server(8898);
        let server2 = new Server(8899);
        let waitObj = {done: false};
        let times   = 0;

        expect(server1.run()).toEqual(true);
        expect(server2.run()).toEqual(true);

        server2.destroy();
        server1.destroy();

        server1.on(EVENTS.STOP, () => {if (++times === 2) waitObj.done = true});
        server2.on(EVENTS.STOP, () => {if (++times === 2) waitObj.done = true});
        Helper.waitFor(waitObj, done);
    });

    it("Checking server run", (done) => {
        let server  = new Server(8899);
        let waitObj = {done: false};

        server.on(EVENTS.RUN, () => waitObj.done = true);
        expect(server.run()).toEqual(true);
        Helper.waitFor(waitObj, () => {
            server.on(EVENTS.STOP, () => waitObj.done = true);
            server.stop();
            Helper.waitFor(waitObj, () => {
                server.destroy();
                done();
            });
        });
    });

    it("Checking server run + one client connection", (done) => {
        let server  = new Server(8899);
        let waitObj = {done: false};

        server.on(EVENTS.CONNECT, () => waitObj.done = true);
        expect(server.run()).toEqual(true);
        const ws = new WebSocket('ws://127.0.0.1:8899');
        Helper.waitFor(waitObj, () => {
            server.on(EVENTS.STOP, () => waitObj.done = true);
            server.stop();
            Helper.waitFor(waitObj, () => {
                server.destroy();
                done();
            });
        });
    });
    it("Checking server run + two clients connection", (done) => {
        let server  = new Server(8899);
        let waitObj = {done: false};
        let cons    = 0;

        server.on(EVENTS.CONNECT, () => {if (++cons === 2) {waitObj.done = true}});
        expect(server.run()).toEqual(true);
        const ws1 = new WebSocket('ws://127.0.0.1:8899');
        const ws2 = new WebSocket('ws://127.0.0.1:8899');
        Helper.waitFor(waitObj, () => {
            server.on(EVENTS.STOP, () => waitObj.done = true);
            server.stop();
            Helper.waitFor(waitObj, () => {
                server.destroy();
                done();
            });
        });
    });
    it("Checking server run + two clients and one disconnected", (done) => {
        let server  = new Server(8899);
        let waitObj = {done: false};
        let cons    = 0;

        server.on(EVENTS.CONNECT, () => {if (++cons === 2) {waitObj.done = true}});
        expect(server.run()).toEqual(true);
        const ws1 = new WebSocket('ws://127.0.0.1:8899');
        const ws2 = new WebSocket('ws://127.0.0.1:8899');
        Helper.waitFor(waitObj, () => {
            server.on(EVENTS.CLOSE, () => waitObj.done = true);
            ws2.close();
            Helper.waitFor(waitObj, () => {
                server.on(EVENTS.STOP, () => waitObj.done = true);
                server.stop();
                Helper.waitFor(waitObj, () => {
                    server.destroy();
                    done();
                });
            })
        });
    });
    it("Checking server run + one client connect/disconnect/connect", (done) => {
        let server  = new Server(8899);
        let waitObj = {done: false};

        server.on(EVENTS.CONNECT, () => waitObj.done = true);
        expect(server.run()).toEqual(true);
        let ws = new WebSocket('ws://127.0.0.1:8899');
        Helper.waitFor(waitObj, () => {
            ws.close();
            server.on(EVENTS.CLOSE, () => waitObj.done = true);
            Helper.waitFor(waitObj, () => {
                ws = new WebSocket('ws://127.0.0.1:8899');
                Helper.waitFor(waitObj, () => {
                    server.on(EVENTS.STOP, () => waitObj.done = true);
                    server.destroy();
                    Helper.waitFor(waitObj, done);
                });
            });
        });
    });

    it("Checking isRunning() method", (done) => {
        let server  = new Server(8899);
        let waitObj = {done: false};

        server.on(EVENTS.CONNECT, () => waitObj.done = true);
        expect(server.run()).toEqual(true);
        const ws = new WebSocket('ws://127.0.0.1:8899');
        Helper.waitFor(waitObj, () => {
            expect(server.isRunning()).toEqual(true);
            server.on(EVENTS.STOP, () => waitObj.done = true);
            server.destroy();
            Helper.waitFor(waitObj, () => {
                expect(server.isRunning()).toEqual(false);
                done();
            });
        });
    });

    it("Checking unique id on client connect", (done) => {
        let maxCon  = Config.serMaxConnections;
        Config.serMaxConnections = 1;
        let server  = new Server(8899);
        let waitObj = {done: false};

        let id      = null;
        expect(server.run()).toEqual(true);
        const ws = new WebSocket('ws://127.0.0.1:8899');
        ws.onmessage = (uid) => {id = uid; waitObj.done = true};
        Helper.waitFor(waitObj, () => {
            expect(id !== null).toEqual(true);
            server.on(EVENTS.STOP, () => waitObj.done = true);
            server.destroy();
            Helper.waitFor(waitObj, () => {
                Config.serMaxConnections = maxCon;
                done();
            });
        });
    });
    it("Checking unique id on client connect/disconnect and connect again with the same id", (done) => {
        let maxCon  = Config.serMaxConnections;
        Config.serMaxConnections = 1;
        let server  = new Server(8899);
        let waitObj = {done: false};
        let oldId   = null;

        let id      = null;
        expect(server.run()).toEqual(true);
        let ws = new WebSocket('ws://127.0.0.1:8899');
        ws.onmessage = (e) => {oldId = e.data; waitObj.done = true};
        Helper.waitFor(waitObj, () => {
            ws.close();
            server.on(EVENTS.CLOSE, () => waitObj.done = true);
            Helper.waitFor(waitObj, () => {
                ws = new WebSocket('ws://127.0.0.1:8899');
                ws.onmessage = (e) => {id = e.data; waitObj.done = true};
                Helper.waitFor(waitObj, () => {
                    expect(id).toEqual(oldId);
                    server.on(EVENTS.STOP, () => waitObj.done = true);
                    server.destroy();
                    Helper.waitFor(waitObj, () => {
                        Config.serMaxConnections = maxCon;
                        done();
                    });
                });
            });
        });
    });
    it("Checking that extra client should be disconnected", (done) => {
        let maxCon  = Config.serMaxConnections;
        Config.serMaxConnections = 1;
        let server  = new Server(8899);
        let waitObj = {done: false};

        let id;
        expect(server.run()).toEqual(true);
        let ws = new WebSocket('ws://127.0.0.1:8899');
        ws.onmessage = () => waitObj.done = true;
        Helper.waitFor(waitObj, () => {
            let ws1 = new WebSocket('ws://127.0.0.1:8899');
            server.on(EVENTS.OVERFLOW, () => waitObj.done = true);
            Helper.waitFor(waitObj, () => {
                expect(ws1.readyState).toEqual(WebSocket.CLOSED);
                server.on(EVENTS.STOP, () => waitObj.done = true);
                server.destroy();
                Helper.waitFor(waitObj, () => {
                    Config.serMaxConnections = maxCon;
                    done();
                });
            });
        });
    });

    it("Checking sending message by client", (done) => {
        let server  = new Server(8899);
        let waitObj = {done: false};
        let data;

        expect(server.run()).toEqual(true);
        const ws = new WebSocket('ws://127.0.0.1:8899');
        ws.on('message', function(e) {waitObj.done = true; data = JSON.parse(e)});
        Helper.waitFor(waitObj, () => {
            expect(data[0] === STOC.REQ_GIVE_ID).toEqual(true);
            server.on(EVENTS.STOP, () => waitObj.done = true);
            server.stop();
            Helper.waitFor(waitObj, () => {
                server.destroy();
                done();
            });
        });
    });
});