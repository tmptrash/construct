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

    let error;
    let warn;
    let info;
    let serror;
    let swarn;
    let sinfo;


    beforeEach(() => delete Config.Ips);
    beforeAll(() => {
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
    it("Checking running manager", (done) => {
        const man = new Manager(false);
        man.run(() => man.on(EVENTS.ITERATION, () => man.destroy(done)));
    });

    it("Checking running of manager with a server", (done) => {
        const server = new Server(SConfig.port);
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
        const server    = new Server(SConfig.port);
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
        const server    = new Server(SConfig.port);
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
});