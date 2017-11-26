describe("client/src/manager/Manager", () => {
    const Config       = require('./../../../client/src/share/Config').Config;
    const SConfig      = require('./../../../server/src/share/Config').Config;
    const OLD_MODE     = Config.modeNodeJs;
    Config.modeNodeJs  = true;
    const Server       = require('./../../../server/src/server/Server').Server;
    const EVENTS       = require('./../../../client/src/share/Events').EVENTS;
    const SEVENTS      = require('./../../../server/src/server/Server').EVENTS;
    const Console      = require('./../../../client/src/share/Console');
    const SConsole     = require('./../../../server/src/share/Console');
    const THelper      = require('./../../../common/tests/Helper');
    const World        = require('./../../../client/src/view/World').World;
    const Manager      = require('./Manager');
    const emptyFn      = () => {};
    const waitEvent    = THelper.waitEvent;
    const wait         = THelper.wait;

    let error;
    let warn;
    let info;
    let serror;
    let swarn;
    let sinfo;
    let timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;


    beforeEach(() => delete Config.Ips);
    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        Config.plugIncluded.splice(Config.plugIncluded.indexOf('ips/Ips'));
        error = Console.error;
        warn  = Console.warn;
        info  = Console.info;
        Console.error = emptyFn;
        Console.warn  = emptyFn;
        Console.info  = emptyFn;

        serror = SConsole.error;
        swarn  = SConsole.warn;
        sinfo  = SConsole.info;
        SConsole.error = emptyFn;
        SConsole.warn  = emptyFn;
        SConsole.info  = emptyFn;
    });
    afterAll(()  => {
        SConsole.error = serror;
        SConsole.warn  = swarn;
        SConsole.info  = sinfo;

        Console.error = error;
        Console.warn  = warn;
        Console.info  = info;
        Config.modeNodeJs = OLD_MODE;
        Config.plugIncluded.push('ips/Ips');
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });

    it("Checking manager creation", (done) => {
        const man = new Manager(false);
        expect(man.canvas).toBe(null);
        man.destroy(done);
    });
    it("Checking manager creation and it's properties", (done) => {
        const man = new Manager(false);
        expect(man.organisms.size).toBe(0);
        expect(Object.keys(man.positions).length).toBe(0);
        expect(man.codeRuns).toBe(0);
        expect(!!man.api.version).toBe(true);
        expect(man.api.visualize).toBe(undefined);
        expect(man.active).toBe(false);
        expect(man.clientId).toBe(null);
        expect(man.isDistributed()).toBe(false);
        expect(man.hasView).toBe(false);
        man.destroy(done);
    });
    it("Checking creation of two managers", (done) => {
        const man1 = new Manager(false);
        const man2 = new Manager(false);

        waitEvent(man1, EVENTS.DESTROY, () => man1.destroy(), () => {
            waitEvent(man2, EVENTS.DESTROY, () => man2.destroy(), done);
        });
    });
    it("Checking creation huge amount of managers", (done) => {
        const mans      = [];
        const amount    = 100;
        let   destroyed = 0;
        let   waitObj   = {done: false};

        for (let i = 0; i < amount; i++) {mans.push(new Manager(false))}
        for (let i = 0; i < amount; i++) {mans[i].destroy(() => ++destroyed === amount && (waitObj.done = true))}

        if (waitObj.done) {done(); return}
        wait(waitObj, () => done, 30000);
    });

    it("Checking running manager", (done) => {
        const man = new Manager(false);
        man.run(() => man.on(EVENTS.ITERATION, () => man.destroy(done)));
    });
    it("Checking if manager runs main loop", (done) => {
        const man   = new Manager(false);
        let   count = 0;
        man.run(() => man.on(EVENTS.ITERATION, () => {
            ++count === 100 && man.destroy(done);
        }));
    });

    it("Checking RUN event", (done) => {
        const man = new Manager(false);
        waitEvent(man, EVENTS.RUN, () => man.run(), () => man.destroy(done));
    });
    it("Checking STOP event", (done) => {
        const man = new Manager(false);
        waitEvent(man, EVENTS.RUN, () => man.run(), () => {
            waitEvent(man, EVENTS.STOP, () => man.stop(), () => man.destroy(done));
        });
    });
    it("Checking DESTROY event", (done) => {
        const man = new Manager(false);
        waitEvent(man, EVENTS.RUN, () => man.run(), () => {
            waitEvent(man, EVENTS.STOP, () => man.stop(), () => {
                waitEvent(man, EVENTS.DESTROY, () => man.destroy(), done);
            });
        });
    });
    it("Checking ITERATION event", (done) => {
        const man = new Manager(false);
        let   ok  = false;

        man.on(EVENTS.ITERATION, () => ok = true);
        waitEvent(man, EVENTS.RUN, () => man.run(), () => {
            expect(ok).toBe(true);
            waitEvent(man, EVENTS.STOP, () => man.stop(), () => man.destroy(done));
        });
    });

    it("Checking isDistributed() method", (done) => {
        const man = new Manager(false);

        expect(man.isDistributed()).toBe(false);
        waitEvent(man, EVENTS.RUN, () => man.run(), () => {
            expect(man.isDistributed()).toBe(false);
            waitEvent(man, EVENTS.STOP, () => man.stop(), () => {
                expect(man.isDistributed()).toBe(false);
                man.destroy(done);
            });
        });
    });
    it("Checking 'codeRuns' property", (done) => {
        const man = new Manager(false);
        let   ok  = false;

        man.on(EVENTS.ITERATION, () => ok = true);
        expect(man.codeRuns).toBe(0);
        waitEvent(man, EVENTS.RUN, () => man.run(), () => {
            // codeRuns should be 0, because there is no code lines
            expect(man.codeRuns).toBe(0);
            waitEvent(man, EVENTS.STOP, () => man.stop(), () => man.destroy(done));
        });
    });

    it("Checking running of manager with a server", (done) => {
        const server = new Server();
        const man    = new Manager(false);

        expect(man.clientId).toBe(null);
        server.run();
        man.run(() => {
            expect(man.active).toBe(true);
            expect(man.clientId !== null).toBe(true);
            man.destroy(() => {
                waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), done);
            });
        });
    });

    it("Checking one organism creation in a manager", (done) => {
        const man      = new Manager(false);
        const amount   = Config.orgStartAmount;
        const period   = Config.mutationPeriod;
        const percent  = Config.orgCloneMutationPercent;
        const clone    = Config.orgClonePeriod;
        let   iterated = false;

        Config.orgStartAmount          = 1;
        Config.mutationPeriod          = 0;
        Config.orgCloneMutationPercent = 0;
        Config.orgClonePeriod          = 0;
        expect(man.organisms.size).toBe(0);
        man.on(EVENTS.ITERATION, () => {
            if (iterated) {return}
            expect(man.organisms.size).toBe(1);
            man.stop(() => {
                man.destroy(() => {
                    Config.orgClonePeriod          = clone;
                    Config.orgCloneMutationPercent = percent;
                    Config.mutationPeriod          = period;
                    Config.orgStartAmount          = amount;
                    done();
                });
            });
            iterated = true;
        });
        man.run();
    });
    it("Checking two managers with a server", (done) => {
        const amount    = Config.orgStartAmount;
        const period    = Config.mutationPeriod;
        const percent   = Config.orgCloneMutationPercent;
        const period1   = Config.orgEnergySpendPeriod;
        const clone     = Config.orgClonePeriod;
        const server    = new Server();
        const man1      = new Manager(false);
        const man2      = new Manager(false);
        let   iterated1 = false;
        let   iterated2 = false;
        let   blocked   = false;
        const destroy   = () => {
            blocked = true;
            man1.destroy(() => {
                man2.destroy(() => {
                    waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), () => {
                        Config.orgClonePeriod          = clone;
                        Config.orgEnergySpendPeriod    = period1;
                        Config.orgCloneMutationPercent = percent;
                        Config.mutationPeriod          = period;
                        Config.orgStartAmount          = amount;
                        done();
                    });
                });
            });
        };

        Config.orgStartAmount          = 1;
        Config.mutationPeriod          = 0;
        Config.orgCloneMutationPercent = 0;
        Config.orgEnergySpendPeriod    = 0;
        Config.orgClonePeriod          = 0;
        expect(man1.clientId).toBe(null);
        expect(man2.clientId).toBe(null);
        expect(man1.organisms.size).toBe(0);
        expect(man2.organisms.size).toBe(0);
        server.run();

        man1.on(EVENTS.ITERATION, () => {
            if (blocked) {return}
            expect(man1.organisms.size).toBe(1);
            if (iterated1 && iterated2) {destroy(); return}
            iterated1 = true;
        });
        man2.on(EVENTS.ITERATION, () => {
            if (blocked) {return}
            expect(man2.organisms.size).toBe(1);
            if (iterated2 && iterated1) {destroy(); return}
            iterated2 = true;
        });

        man1.run(() => {
            expect(man1.active).toBe(true);
            expect(man1.clientId !== null).toBe(true);
            man2.run(() => {
                expect(man2.active).toBe(true);
                expect(man2.clientId !== null).toBe(true);
            });
        });
    });

    it("Checking moving of organism from one Manager to another", (done) => {
        const amount    = Config.orgStartAmount;
        const period    = Config.mutationPeriod;
        const percent   = Config.orgCloneMutationPercent;
        const period1   = Config.orgEnergySpendPeriod;
        const clone     = Config.orgClonePeriod;
        const height    = Config.worldHeight;
        const energy    = Config.orgStartEnergy;
        const server    = new Server();
        const man1      = new Manager(false);
        const man2      = new Manager(false);
        let   iterated1 = 0;
        let   iterated2 = 0;
        let   freePos   = World.prototype.getFreePos;
        let   org1      = null;
        const destroy   = () => {
            man1.destroy(() => {
                man2.destroy(() => {
                    waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), () => {
                        World.prototype.getFreePos     = freePos;
                        Config.orgStartEnergy          = energy;
                        Config.orgClonePeriod          = clone;
                        Config.orgEnergySpendPeriod    = period1;
                        Config.orgCloneMutationPercent = percent;
                        Config.mutationPeriod          = period;
                        Config.orgStartAmount          = amount;
                        Config.worldHeight             = height;
                        done();
                    });
                });
            });
        };

        Config.orgStartAmount          = 1;
        Config.mutationPeriod          = 0;
        Config.orgCloneMutationPercent = 0;
        Config.orgEnergySpendPeriod    = 0;
        Config.orgClonePeriod          = 0;
        Config.worldHeight             = 400;
        Config.orgStartEnergy          = 10000;
        World.prototype.getFreePos     = () => {return {x: 1, y: 399}};

        man1.on(EVENTS.ITERATION, () => {
            if (iterated1 > 0 && iterated2 > 0 && org1 === null) {
                org1 = man1.organisms.first.val;
                org1.jsvm.code.push(0b00001101000000000000000000000000); // onStepDown()
            } else if (man2.organisms.size === 2) {
                destroy();
            }
            if (iterated1 > 10000) {throw 'Error sending organism between Managers'}
            iterated1++;
        });
        man2.on(EVENTS.ITERATION, () => iterated2++);

        server.run();
        man1.run(man2.run);
    });
    /**
     * The meaning of this test is in checking if one organism from up manager
     * will go into the down manager, but there will be another organism. First
     * organism should die in this case.
     */
    it("Checking moving of organism from one Manager to another 2", (done) => {
        const amount    = Config.orgStartAmount;
        const period    = Config.mutationPeriod;
        const percent   = Config.orgCloneMutationPercent;
        const period1   = Config.orgEnergySpendPeriod;
        const clone     = Config.orgClonePeriod;
        const height    = Config.worldHeight;
        const energy    = Config.orgStartEnergy;
        const server    = new Server();
        const man1      = new Manager(false);
        const man2      = new Manager(false);
        let   iterated1 = 0;
        let   iterated2 = 0;
        let   freePos   = World.prototype.getFreePos;
        let   org1      = null;
        let   org2      = null;
        let   inc       = 0;
        let   doneInc   = 0;
        const destroy   = () => {
            man1.destroy(() => {
                man2.destroy(() => {
                    waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), () => {
                        World.prototype.getFreePos     = freePos;
                        Config.orgStartEnergy          = energy;
                        Config.orgClonePeriod          = clone;
                        Config.orgEnergySpendPeriod    = period1;
                        Config.orgCloneMutationPercent = percent;
                        Config.mutationPeriod          = period;
                        Config.orgStartAmount          = amount;
                        Config.worldHeight             = height;
                        done();
                    });
                });
            });
        };

        Config.orgStartAmount          = 1;
        Config.mutationPeriod          = 0;
        Config.orgCloneMutationPercent = 0;
        Config.orgEnergySpendPeriod    = 0;
        Config.orgClonePeriod          = 0;
        Config.worldHeight             = 400;
        Config.orgStartEnergy          = 10000;
        World.prototype.getFreePos     = () => {return inc++ === 0 && {x: 1, y: 399} || {x: 1, y: 0}};

        man1.on(EVENTS.ITERATION, () => {
            if (iterated1 > 0 && iterated2 > 0 && org1 === null && org2 !== null) {
                org1 = man1.organisms.first.val;
                org1.jsvm.code.push(0b00001101000000000000000000000000); // onStepDown()
                man1.on(EVENTS.STEP_OUT, () => {
                    expect(doneInc < 3).toBe(true);
                    ++doneInc;
                });
                man2.on(EVENTS.STEP_IN, () => {
                    ++doneInc;
                    expect(man1.organisms.size).toBe(1);
                    expect(man1.organisms.first.val.y).toBe(0);
                });
            } else if (org1 !== null && org2 !== null && doneInc === 2) {
                expect(man1.organisms.size).toBe(1);
                expect(man1.organisms.first.val.y).toBe(0);
                expect(man2.organisms.size).toBe(1);
                expect(man2.organisms.first.val.y).toBe(0);
                destroy();
                doneInc++;
            }
            if (iterated1 > 10000) {throw 'Error sending organism between Managers'}
            iterated1++;
        });
        man2.on(EVENTS.ITERATION, () => {
            !iterated2 && (org2 = man2.organisms.first.val);
            iterated2++;
        });

        server.run();
        man1.run(man2.run);
    });

    it("Testing ten managers and one server", (done) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000;
        const maxCons   = SConfig.maxConnections;
        const server    = new Server();
        const mans      = [];
        const CLIENTS   = 100;
        let   amount    = 0;
        let   waitObj   = {done: false};
        let   man;

        SConfig.maxConnections = CLIENTS;
        server.run();
        for (let i = 0; i < CLIENTS; i++) {
            mans.push(man = new Manager(false));
            man.run(() => ++amount === CLIENTS && (waitObj.done = true));
        }
        wait(waitObj, () => {
            amount = 0;
            server.on(server.EVENTS.CLOSE, () => ++amount === CLIENTS && (waitObj.done = true));
            for (let i = 0; i < CLIENTS; i++) {mans[i].destroy()}
            wait(waitObj, () => {
                waitEvent(server, server.EVENTS.DESTROY, () => server.destroy(), () => {
                    SConfig.maxConnections = maxCons;
                    done();
                });
            });
        }, 30000);
    });
    it("Testing run/stop/run manager and one server", (done) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000;
        const maxCons   = SConfig.maxConnections;
        const server    = new Server();
        const CLIENTS   = 100;
        let   amount    = 0;
        let   waitObj   = {done: false};
        let   count     = 0;
        let   man1;
        let   man2;
        let   oldId;

        SConfig.maxConnections = CLIENTS;
        man1 = new Manager(false);
        man2 = new Manager(false);

        server.run();
        man1.run(() => ++count === 2 && (waitObj.done = true));
        man2.run(() => ++count === 2 && (waitObj.done = true));
        wait(waitObj, () => {
            man1.stop(() => {
                expect(man1.clientId).toBe(null);
                oldId = man1.clientId;
                man1.run(() => {
                    expect(man1.clientId).not.toBe(null);
                    amount = 0;
                    server.on(server.EVENTS.CLOSE, () => ++amount === 2 && (waitObj.done = true));
                    man1.destroy();
                    man2.destroy();
                    wait(waitObj, () => {
                        waitEvent(server, server.EVENTS.DESTROY, () => server.destroy(), () => {
                            SConfig.maxConnections = maxCons;
                            done();
                        });
                    });
                });
            });
        });
    });
});