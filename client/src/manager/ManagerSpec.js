describe("client/src/manager/Manager", () => {
    const SERVER_HOST  = 'ws://127.0.0.1';
    const Config       = require('./../../../client/src/share/Config').Config;
    const OConfig      = require('./../manager/plugins/organisms/Config');
    const SConfig      = require('./../../../server/src/share/Config').Config;
    const Server       = require('./../../../server/src/server/Server').Server;
    const EVENTS       = require('./../../../client/src/share/Events').EVENTS;
    const SEVENTS      = require('./../../../server/src/server/Server').EVENTS;
    const Console      = require('./../../../client/src/share/Console');
    const SConsole     = require('./../../../server/src/share/Console');
    const THelper      = require('./../../../common/tests/Helper');
    const ConfigHelper = require('./../../../common/tests/Config');
    const World        = require('./../../../client/src/view/World').World;
    const Manager      = require('./Manager');
    const emptyFn      = () => {};
    const waitEvent    = THelper.waitEvent;
    const wait         = THelper.wait;
    const testQ        = THelper.testQ;
    const host         = Config.serverHost;
    const port         = SConfig.port;
    const maxConns     = SConfig.maxConnections;
    const startOrgs    = OConfig.orgStartAmount;
    const energyCheck  = Config.worldEnergyCheckPeriod;

    let error;
    let warn;
    let info;
    let serror;
    let swarn;
    let sinfo;
    let dist;
    let timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

    function deletePluginConfigs() {
        delete Config.ips;
        delete Config.organisms;
        delete Config.status;
        delete Config.charts;
        delete Config.console;
    }

    beforeEach(() => deletePluginConfigs());
    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        Config.serverHost = SERVER_HOST;
        Config.plugIncluded.splice(Config.plugIncluded.indexOf('ips/Ips'));
        dist = SConfig.modeDistributed;
        SConfig.modeDistributed = false;
        SConfig.port = Config.serverPort;
        SConfig.maxConnections = 100;
        OConfig.orgStartAmount = 0;
        Config.worldEnergyCheckPeriod = 0;

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
        Config.plugIncluded.push('ips/Ips');
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
        Config.serverHost = host;
        SConfig.modeDistributed = dist;
        SConfig.port = port;
        SConfig.maxConnections = maxConns;
        OConfig.orgStartAmount = startOrgs;
        Config.worldEnergyCheckPeriod = energyCheck;
    });

    describe('Manager creation', () => {
        it("Checking manager creation without view", (done) => {
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
            expect(man.canvas).toBe(null);
            expect(man.active).toBe(false);
            expect(man.world instanceof World).toBe(true);
            expect(man.activeAround).toEqual([false, false, false, false]);
            man.destroy(done);
        });
        it("Checking creation of two managers", (done) => {
            const man1 = new Manager(false);
            deletePluginConfigs();
            const man2 = new Manager(false);

            testQ(done,
                [man1, EVENTS.DESTROY, () => man1.destroy(), () => {}],
                [man2, EVENTS.DESTROY, () => man2.destroy(), () => {}]
            );
        });
    });

//     it("Checking creation 100 managers", (done) => {
//         const mans      = [];
//         const amount    = 100;
//         const width     = Config.worldWidth;
//         const height    = Config.worldHeight;
//         let   destroyed = 0;
//         let   waitObj   = {done: false};
//
//         Config.worldWidth  = 10;
//         Config.worldHeight = 10;
//         for (let i = 0; i < amount; i++) {deletePluginConfigs(); mans.push(new Manager(false))}
//         for (let i = 0; i < amount; i++) {mans[i].destroy(() => ++destroyed === amount && (waitObj.done = true))}
//
//         if (waitObj.done) {
//             Config.worldWidth  = width;
//             Config.worldHeight = height;
//             done();
//             return;
//         }
//         wait(waitObj, () => {
//             Config.worldWidth  = width;
//             Config.worldHeight = height;
//             done();
//         }, 31000);
//     });
//
//     it("Checking running manager", (done) => {
//         const man = new Manager(false);
//         man.run(() => man.on(EVENTS.ITERATION, () => man.destroy(done)));
//     });
//     it("Checking if manager runs main loop", (done) => {
//         const man   = new Manager(false);
//         let   count = 0;
//         man.run(() => man.on(EVENTS.ITERATION, () => {
//             ++count === 100 && man.destroy(done);
//         }));
//     });
//
//     it("Checking RUN event", (done) => {
//         const man = new Manager(false);
//         waitEvent(man, EVENTS.RUN, () => man.run(), () => man.destroy(done));
//     });
//     it("Checking STOP event", (done) => {
//         const man = new Manager(false);
//         waitEvent(man, EVENTS.RUN, () => man.run(), () => {
//             waitEvent(man, EVENTS.STOP, () => man.stop(), () => man.destroy(done));
//         });
//     });
//     it("Checking DESTROY event", (done) => {
//         const man = new Manager(false);
//         waitEvent(man, EVENTS.RUN, () => man.run(), () => {
//             waitEvent(man, EVENTS.STOP, () => man.stop(), () => {
//                 waitEvent(man, EVENTS.DESTROY, () => man.destroy(), done);
//             });
//         });
//     });
//     it("Checking ITERATION event", (done) => {
//         const man = new Manager(false);
//         let   ok  = false;
//
//         man.on(EVENTS.ITERATION, () => ok = true);
//         waitEvent(man, EVENTS.RUN, () => man.run(), () => {
//             expect(ok).toBe(true);
//             waitEvent(man, EVENTS.STOP, () => man.stop(), () => man.destroy(done));
//         });
//     });
//
//     it("Checking isDistributed() method", (done) => {
//         const man = new Manager(false);
//
//         expect(man.isDistributed()).toBe(false);
//         waitEvent(man, EVENTS.RUN, () => man.run(), () => {
//             expect(man.isDistributed()).toBe(false);
//             waitEvent(man, EVENTS.STOP, () => man.stop(), () => {
//                 expect(man.isDistributed()).toBe(false);
//                 man.destroy(done);
//             });
//         });
//     });
//     it("Checking 'codeRuns' property", (done) => {
//         const man = new Manager(false);
//         let   ok  = false;
//
//         man.on(EVENTS.ITERATION, () => ok = true);
//         expect(man.codeRuns).toBe(0);
//         waitEvent(man, EVENTS.RUN, () => man.run(), () => {
//             // codeRuns should be 0, because there is no code lines
//             expect(man.codeRuns).toBe(0);
//             waitEvent(man, EVENTS.STOP, () => man.stop(), () => man.destroy(done));
//         });
//     });
//
//     it("Checking running of manager with a server", (done) => {
//         const server = new Server();
//         const man    = new Manager(false);
//
//         expect(man.clientId).toBe(null);
//         waitEvent(server, SEVENTS.RUN, () => server.run(), () => {
//             man.run(() => {
//                 expect(man.active).toBe(true);
//                 expect(man.clientId !== null).toBe(true);
//                 man.destroy(() => {
//                     waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), done);
//                 });
//             });
//         });
//     });
//
//     it("Checking one organism creation in a manager", (done) => {
//         const man      = new Manager(false);
//         const amount   = OConfig.orgStartAmount;
//         const period   = OConfig.orgRainMutationPeriod;
//         const percent  = OConfig.orgCloneMutationPercent;
//         const clone    = OConfig.orgClonePeriod;
//         let   iterated = false;
//
//         OConfig.orgStartAmount          = 1;
//         OConfig.orgRainMutationPeriod   = 0;
//         OConfig.orgCloneMutationPercent = 0;
//         OConfig.orgClonePeriod          = 0;
//         expect(man.organisms.size).toBe(0);
//         man.on(EVENTS.LOOP, () => {
//             if (iterated) {return}
//             expect(man.organisms.size).toBe(1);
//             man.stop(() => {
//                 man.destroy(() => {
//                     OConfig.orgClonePeriod          = clone;
//                     OConfig.orgCloneMutationPercent = percent;
//                     OConfig.orgRainMutationPeriod   = period;
//                     OConfig.orgStartAmount          = amount;
//                     done();
//                 });
//             });
//             iterated = true;
//         });
//         man.run();
//     });
//     it("Checking two managers with a server", (done) => {
//         const amount    = OConfig.orgStartAmount;
//         const period    = OConfig.orgRainMutationPeriod;
//         const percent   = OConfig.orgCloneMutationPercent;
//         const period1   = OConfig.orgEnergySpendPeriod;
//         const clone     = OConfig.orgClonePeriod;
//         const max       = OConfig.orgMaxOrgs;
//         const server    = new Server();
//         const man1      = new Manager(false);
//         deletePluginConfigs();
//         const man2      = new Manager(false);
//         let   iterated1 = false;
//         let   iterated2 = false;
//         let   blocked   = false;
//         const destroy   = () => {
//             blocked = true;
//             man1.destroy(() => {
//                 man2.destroy(() => {
//                     waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), () => {
//                         OConfig.orgClonePeriod          = clone;
//                         OConfig.orgEnergySpendPeriod    = period1;
//                         OConfig.orgCloneMutationPercent = percent;
//                         OConfig.orgRainMutationPeriod   = period;
//                         OConfig.orgStartAmount          = amount;
//                         OConfig.orgMaxOrgs              = max;
//                         done();
//                     });
//                 });
//             });
//         };
//
//         OConfig.orgStartAmount          = 1;
//         OConfig.orgRainMutationPeriod   = 0;
//         OConfig.orgCloneMutationPercent = 0;
//         OConfig.orgEnergySpendPeriod    = 0;
//         OConfig.orgClonePeriod          = 0;
//         OConfig.orgMaxOrgs              = 1;
//         expect(man1.clientId).toBe(null);
//         expect(man2.clientId).toBe(null);
//         expect(man1.organisms.size).toBe(0);
//         expect(man2.organisms.size).toBe(0);
//
//         man1.on(EVENTS.LOOP, () => {
//             if (blocked) {return}
//             expect(man1.organisms.size).toBe(1);
//             if (iterated1 && iterated2) {destroy(); return}
//             iterated1 = true;
//         });
//         man2.on(EVENTS.LOOP, () => {
//             if (blocked) {return}
//             expect(man2.organisms.size).toBe(1);
//             if (iterated2 && iterated1) {destroy(); return}
//             iterated2 = true;
//         });
//
//         waitEvent(server, server.EVENTS.RUN, () => server.run(), () => {
//             man1.run(() => {
//                 expect(man1.active).toBe(true);
//                 expect(man1.clientId !== null).toBe(true);
//                 man2.run(() => {
//                     expect(man2.active).toBe(true);
//                     expect(man2.clientId !== null).toBe(true);
//                 });
//             });
//         });
//     });
//
//     it("Checking moving of organism from one Manager to another", (done) => {
//         const amount    = OConfig.orgStartAmount;
//         const period    = OConfig.orgRainMutationPeriod;
//         const percent   = OConfig.orgCloneMutationPercent;
//         const period1   = OConfig.orgEnergySpendPeriod;
//         const clone     = OConfig.orgClonePeriod;
//         const width     = Config.worldWidth;
//         const height    = Config.worldHeight;
//         const energy    = OConfig.orgStartEnergy;
//         const max       = OConfig.orgMaxOrgs;
//         const server    = new Server();
//         Config.worldWidth               = 400;
//         Config.worldHeight              = 400;
//         const man1      = new Manager(false);
//         deletePluginConfigs();
//         const man2      = new Manager(false);
//         let   iterated1 = 0;
//         let   iterated2 = 0;
//         let   freePos   = World.prototype.getFreePos;
//         let   org1      = null;
//         const destroy   = () => {
//             man1.destroy(() => {
//                 man2.destroy(() => {
//                     waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), () => {
//                         World.prototype.getFreePos      = freePos;
//                         OConfig.orgStartEnergy          = energy;
//                         OConfig.orgClonePeriod          = clone;
//                         OConfig.orgEnergySpendPeriod    = period1;
//                         OConfig.orgCloneMutationPercent = percent;
//                         OConfig.orgRainMutationPeriod   = period;
//                         OConfig.orgStartAmount          = amount;
//                         Config.worldWidth               = width;
//                         Config.worldHeight              = height;
//                         OConfig.orgMaxOrgs              = max;
//                         done();
//                     });
//                 });
//             });
//         };
//
//         OConfig.orgStartAmount          = 1;
//         OConfig.orgRainMutationPeriod   = 0;
//         OConfig.orgCloneMutationPercent = 0;
//         OConfig.orgEnergySpendPeriod    = 0;
//         OConfig.orgClonePeriod          = 0;
//         OConfig.orgStartEnergy          = 10000;
//         OConfig.orgMaxOrgs              = 2;
//         World.prototype.getFreePos      = () => {return {x: 399, y: 1}};
//
//         man1.on(EVENTS.LOOP, () => {
//             if (iterated1 > 0 && iterated2 > 0 && org1 === null) {
//                 org1 = man1.organisms.first.val;
//                 org1.vm.code.push(0b00001011000000000000000000000000); // onStepRight()
//             } else if (man2.organisms.size === 2) {
//                 destroy();
//             }
//             if (iterated1 > 10000) {throw 'Error sending organism between Managers'}
//             iterated1++;
//         });
//         man2.on(EVENTS.LOOP, () => iterated2++);
//
//         waitEvent(server, server.EVENTS.RUN, () => server.run(), () => man1.run(() => man2.run()));
//     });
//     /**
//      * The meaning of this test is in checking if one organism from up manager
//      * will go into the down manager, but there will be another organism. First
//      * organism should die in this case.
//      */
//     it("Checking moving of organism from one Manager to another 2", (done) => {
//         const amount    = OConfig.orgStartAmount;
//         const period    = OConfig.orgRainMutationPeriod;
//         const percent   = OConfig.orgCloneMutationPercent;
//         const period1   = OConfig.orgEnergySpendPeriod;
//         const clone     = OConfig.orgClonePeriod;
//         const height    = Config.worldHeight;
//         const energy    = OConfig.orgStartEnergy;
//         const max       = OConfig.orgMaxOrgs;
//         const server    = new Server();
//         Config.worldHeight = 400;
//         Config.worldWidth  = 400;
//         const man1      = new Manager(false);
//         deletePluginConfigs();
//         const man2      = new Manager(false);
//         let   iterated1 = 0;
//         let   iterated2 = 0;
//         let   freePos   = World.prototype.getFreePos;
//         let   org1      = null;
//         let   org2      = null;
//         let   inc       = 0;
//         let   doneInc   = 0;
//         const destroy   = () => {
//             man1.destroy(() => {
//                 man2.destroy(() => {
//                     waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), () => {
//                         World.prototype.getFreePos      = freePos;
//                         OConfig.orgStartEnergy          = energy;
//                         OConfig.orgClonePeriod          = clone;
//                         OConfig.orgEnergySpendPeriod    = period1;
//                         OConfig.orgCloneMutationPercent = percent;
//                         OConfig.orgRainMutationPeriod   = period;
//                         OConfig.orgStartAmount          = amount;
//                         Config.worldHeight              = height;
//                         OConfig.orgMaxOrgs              = max;
//                         done();
//                     });
//                 });
//             });
//         };
//
//         OConfig.orgStartAmount          = 1;
//         OConfig.orgRainMutationPeriod   = 0;
//         OConfig.orgCloneMutationPercent = 0;
//         OConfig.orgEnergySpendPeriod    = 0;
//         OConfig.orgClonePeriod          = 0;
//         OConfig.orgStartEnergy          = 10000;
//         OConfig.orgMaxOrgs              = 1;
//         World.prototype.getFreePos      = () => {return inc++ === 0 && {x: 399, y: 1} || {x: 0, y: 1}};
//
//         man1.on(EVENTS.LOOP, () => {
//             if (iterated1 > 0 && iterated2 > 0 && org1 === null && org2 !== null) {
//                 org1 = man1.organisms.first.val;
//                 org1.vm.code.push(0b00001011000000000000000000000000); // onStepRight()
//                 man1.on(EVENTS.STEP_OUT, () => {
//                     expect(doneInc < 3).toBe(true);
//                     ++doneInc;
//                 });
//                 man2.on(EVENTS.STEP_IN, () => {
//                     ++doneInc;
//                     expect(man1.organisms.size).toBe(1);
//                     expect(man1.organisms.first.val.x).toBe(0);
//                 });
//             } else if (org1 !== null && org2 !== null && doneInc === 2) {
//                 expect(man1.organisms.size).toBe(1);
//                 expect(man1.organisms.first.val.x).toBe(0);
//                 expect(man2.organisms.size).toBe(1);
//                 expect(man2.organisms.first.val.x).toBe(0);
//                 destroy();
//                 doneInc++;
//             }
//             if (iterated1 > 10000) {throw 'Error sending organism between Managers'}
//             iterated1++;
//         });
//         man2.on(EVENTS.LOOP, () => {
//             !iterated2 && (org2 = man2.organisms.first.val);
//             iterated2++;
//         });
//
//         waitEvent(server, server.EVENTS.RUN, () => server.run(), () => man1.run(() => man2.run()));
//     });
//
//     it("Testing hundred managers and one server", (done) => {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000;
//         const maxCons   = SConfig.maxConnections;
//         const server    = new Server();
//         const mans      = [];
//         const CLIENTS   = 100;
//         const width     = Config.worldWidth;
//         const height    = Config.worldHeight;
//         let   amount    = 0;
//         let   waitObj   = {done: false};
//         let   man;
//
//         Config.worldWidth      = 100;
//         Config.worldHeight     = 100;
//         SConfig.maxConnections = CLIENTS;
//
//         waitEvent(server, server.EVENTS.RUN, () => server.run(), () => {
//             for (let i = 0; i < CLIENTS; i++) {
//                 deletePluginConfigs();
//                 mans.push(man = new Manager(false));
//                 man.run(() => ++amount === CLIENTS && (waitObj.done = true));
//             }
//             wait(waitObj, () => {
//                 amount = 0;
//                 server.on(server.EVENTS.CLOSE, () => ++amount === CLIENTS && (waitObj.done = true));
//                 for (let i = 0; i < CLIENTS; i++) {mans[i].destroy()}
//                 wait(waitObj, () => {
//                     waitEvent(server, server.EVENTS.DESTROY, () => server.destroy(), () => {
//                         SConfig.maxConnections = maxCons;
//                         Config.worldWidth      = width;
//                         Config.worldHeight     = height;
//                         done();
//                     });
//                 });
//             }, 31000);
//         });
//     });
//     it("Testing run/stop/run manager and one server", (done) => {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000;
//         const maxCons   = SConfig.maxConnections;
//         const server    = new Server();
//         const CLIENTS   = 100;
//         const width     = Config.worldWidth;
//         const height    = Config.worldHeight;
//         let   amount    = 0;
//         let   waitObj   = {done: false};
//         let   count     = 0;
//         const onDone    = () => ++count === 2 && (waitObj.done = true);
//         let   man1;
//         let   man2;
//         let   oldId;
//
//         Config.worldWidth      = 100;
//         Config.worldHeight     = 100;
//         SConfig.maxConnections = CLIENTS;
//         man1 = new Manager(false);
//         deletePluginConfigs();
//         man2 = new Manager(false);
//
//         testQ(done,
//             [server, SEVENTS.RUN,     () => server.run(),     () => {man1.run(onDone); man2.run(onDone)}],
//             [waitObj],
//             [man1,   EVENTS.STOP,     () => man1.stop(),      () => {expect(man1.clientId).toBe(null); oldId = man1.clientId}],
//             [man1,   EVENTS.RUN,      () => man1.run(),       () => {expect(man1.clientId).not.toBe(null); amount = 0; waitObj.done = false}],
//             [server, SEVENTS.CLOSE,   () => man1.destroy(),   () => {}],
//             [server, SEVENTS.CLOSE,   () => man2.destroy(),   () => {}],
//             [server, SEVENTS.DESTROY, () => server.destroy(), () => {
//                 SConfig.maxConnections = maxCons;
//                 Config.worldWidth      = width;
//                 Config.worldHeight     = height;
//             }]
//         );
//     });
//
//     it("Tests many connections/disconnections of Manager to the server", (done) => {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000;
//         const maxCons   = SConfig.maxConnections;
//         const server    = new Server();
//         const CLIENTS   = 16;
//         const width     = Config.worldWidth;
//         const height    = Config.worldHeight;
//         let   waitObj   = {done: false};
//         let   amount    = 0;
//         let   count     = 0;
//         let   man1;
//         let   man2;
//         const cb        = () => {
//             man1.stop(() => {
//                 expect(man1.clientId).toBe(null);
//                 man1.run(() => {
//                     expect(man1.clientId).not.toBe(null);
//                     if (++amount < 10) {
//                         cb();
//                         return;
//                     }
//                     man1.destroy();
//                     man2.destroy();
//                     amount = 0;
//                     server.on(server.EVENTS.CLOSE, () => ++amount === 2 && (waitObj.done = true));
//                     wait(waitObj, () => {
//                         waitEvent(server, server.EVENTS.DESTROY, () => server.destroy(), () => {
//                             SConfig.maxConnections = maxCons;
//                             Config.worldWidth      = width;
//                             Config.worldHeight     = height;
//                             done();
//                         });
//                     });
//                 });
//             });
//         };
//
//         Config.worldWidth      = 10;
//         Config.worldHeight     = 10;
//         SConfig.maxConnections = CLIENTS;
//         man1 = new Manager(false);
//         deletePluginConfigs();
//         man2 = new Manager(false);
//
//         waitEvent(server, server.EVENTS.RUN, () => server.run(), () => {
//             man1.run(() => ++count === 2 && (waitObj.done = true));
//             man2.run(() => ++count === 2 && (waitObj.done = true));
//             wait(waitObj, cb);
//         });
//     });
//
//     it('Tests organism moving from client of one server to client of other server', (done) => {
//         const ocfg                      = new ConfigHelper(OConfig);
//         const cfg                       = new ConfigHelper(Config);
//         const scfg                      = new ConfigHelper(SConfig);
//         const freePos                   = World.prototype.getFreePos;
//         let   iterated1                 = 0;
//         let   iterated2                 = 0;
//         let   org1                      = null;
//         const destroy                   = () => {
//             man1.destroy(() => {
//                 man2.destroy(() => {
//                     waitEvent(server1, SEVENTS.DESTROY, () => server1.destroy(), () => {
//                         waitEvent(server2, SEVENTS.DESTROY, () => server2.destroy(), () => {
//                             World.prototype.getFreePos = freePos;
//                             ocfg.reset();
//                             scfg.reset();
//                             cfg.reset();
//                             done();
//                         });
//                     });
//                 });
//             });
//         };
//
//         scfg.set('upHost',                SERVER_HOST);
//         scfg.set('rightHost',             SERVER_HOST);
//         scfg.set('downHost',              SERVER_HOST);
//         scfg.set('leftHost',              SERVER_HOST);
//         ocfg.set('codeIterationsPerOnce', 1);
//         scfg.set('modeDistributed',       true);
//         scfg.set('maxConnections',        1);
//         scfg.set('port',                  3000);
//         scfg.set('rightPort',             3001);
//         const server1                   = new Server(); // up server
//         scfg.set('port',                  3001);
//         scfg.set('leftPort',              3000);
//         scfg.set('rightPort',             1001);
//         const server2                   = new Server(); // down server
//         cfg.set('worldWidth',             10);
//         cfg.set('worldHeight',            10);
//         cfg.set('serverPort',             3000);
//         cfg.set('serverHost',             SERVER_HOST);
//         const man1                      = new Manager(false);
//         deletePluginConfigs();
//         cfg.set('serverPort',             3001);
//         const man2                      = new Manager(false);
//         ocfg.set('orgStartAmount',        1);
//         ocfg.set('orgRainMutationPeriod', 0);
//         ocfg.set('orgCloneMutationPercent',0);
//         ocfg.set('orgEnergySpendPeriod',  0);
//         ocfg.set('orgClonePeriod',        0);
//         ocfg.set('orgStartEnergy',        10000);
//         cfg.set('worldCyclical',          false);
//         World.prototype.getFreePos      = () => {return {x: 1, y: 9}};
//
//         man1.on(EVENTS.LOOP, () => {
//             if (iterated1 > 0 && iterated2 > 0 && org1 === null) {
//                 expect(man2.organisms.size).toBe(1);
//                 org1 = man1.organisms.first.val;
//                 org1.vm.code.push(0b00001011000000000000000000000000); // onStepRight()
//             } else if (man2.organisms.size === 2) {
//                 destroy();
//             }
//             if (iterated1 > 10000) {throw 'Error sending organism between Servers'}
//             iterated1++;
//         });
//         man2.on(EVENTS.LOOP, () => iterated2++);
//
//         waitEvent(server1, server1.EVENTS.RUN, () => server1.run(), () => {
//             waitEvent(server2, server2.EVENTS.RUN, () => server2.run(), () => {
//                 man1.run(man2.run);
//             });
//         });
//     });
//
//     it('Tests organism moving back from client of near server', (done) => {
//         const ocfg                      = new ConfigHelper(OConfig);
//         const cfg                       = new ConfigHelper(Config);
//         const scfg                      = new ConfigHelper(SConfig);
//         const freePos                   = World.prototype.getFreePos;
//         let   iterated1                 = 0;
//         let   iterated2                 = 0;
//         let   org1                      = null;
//         let   destroyFlag               = false;
//         let   stepInFlag                = false;
//         let   stepInBack                = false;
//         const destroy                   = () => {
//             man1.destroy(() => {
//                 man2.destroy(() => {
//                     waitEvent(server1, SEVENTS.DESTROY, () => server1.destroy(), () => {
//                         waitEvent(server2, SEVENTS.DESTROY, () => server2.destroy(), () => {
//                             World.prototype.getFreePos = freePos;
//                             ocfg.reset();
//                             scfg.reset();
//                             cfg.reset();
//                             done();
//                         });
//                     });
//                 });
//             });
//         };
//
//         scfg.set('upHost',                SERVER_HOST);
//         scfg.set('rightHost',             SERVER_HOST);
//         scfg.set('downHost',              SERVER_HOST);
//         scfg.set('leftHost',              SERVER_HOST);
//         ocfg.set('codeIterationsPerOnce', 1);
//         scfg.set('modeDistributed',       true);
//         scfg.set('maxConnections',        1);
//         scfg.set('port',                  3000);
//         scfg.set('rightPort',             3001);
//         const server1                   = new Server(); // up server
//         scfg.set('port',                  3001);
//         scfg.set('leftPort',              3000);
//         scfg.set('rightPort',             1001);
//         const server2                   = new Server(); // down server
//         cfg.set('worldWidth',             10);
//         cfg.set('worldHeight',            10);
//         cfg.set('serverPort',             3000);
//         cfg.set('serverHost',             SERVER_HOST);
//         const man1                      = new Manager(false);
//         deletePluginConfigs();
//         cfg.set('serverPort',             3001);
//         const man2                      = new Manager(false);
//         ocfg.set('orgStartAmount',        1);
//         ocfg.set('orgRainMutationPeriod', 0);
//         ocfg.set('orgCloneMutationPercent',0);
//         ocfg.set('orgEnergySpendPeriod',  0);
//         ocfg.set('orgClonePeriod',        0);
//         ocfg.set('orgStartEnergy',        10000);
//         cfg.set('worldCyclical',          false);
//         World.prototype.getFreePos      = () => {return {x: 0, y: 1}};
//
//         man1.on(EVENTS.LOOP, () => {
//             if (iterated1 > 0 && iterated2 > 0 && org1 === null) {
//                 expect(man2.organisms.size).toBe(1);
//                 org1 = man1.organisms.first.val;
//                 org1.vm.code.push(0b00001011000000000000000000000000); // onStepRight()
//                 man1.on(EVENTS.KILL, () => destroyFlag = true);
//                 man1.on(EVENTS.STEP_IN,       () => stepInBack  = true);
//                 man2.on(EVENTS.STEP_IN,       () => stepInFlag  = true);
//             } else if (destroyFlag && stepInFlag && stepInBack) {
//                 destroyFlag = false;
//                 destroy();
//             }
//             if (iterated1 > 10000) {throw 'Error sending organism between Servers'}
//             iterated1++;
//         });
//         man2.on(EVENTS.LOOP, () => iterated2++);
//
//         waitEvent(server1, server1.EVENTS.RUN, () => server1.run(), () => {
//             waitEvent(server2, server2.EVENTS.RUN, () => server2.run(), () => {
//                 man1.run(man2.run);
//             });
//         });
//     });
//
//     it('Tests organism moving back from client of near server (with no clients)', (done) => {
//         const ocfg                      = new ConfigHelper(OConfig);
//         const cfg                       = new ConfigHelper(Config);
//         const scfg                      = new ConfigHelper(SConfig);
//         const freePos                   = World.prototype.getFreePos;
//         let   iterated1                 = 0;
//         let   org1                      = null;
//         let   destroyFlag               = false;
//         let   stepInBack                = false;
//         const destroy                   = () => {
//             man1.destroy(() => {
//                 waitEvent(server1, SEVENTS.DESTROY, () => server1.destroy(), () => {
//                     waitEvent(server2, SEVENTS.DESTROY, () => server2.destroy(), () => {
//                         World.prototype.getFreePos = freePos;
//                         ocfg.reset();
//                         scfg.reset();
//                         cfg.reset();
//                         done();
//                     });
//                 });
//             });
//         };
//
//         scfg.set('upHost',                SERVER_HOST);
//         scfg.set('rightHost',             SERVER_HOST);
//         scfg.set('downHost',              SERVER_HOST);
//         scfg.set('leftHost',              SERVER_HOST);
//         ocfg.set('codeIterationsPerOnce', 1);
//         scfg.set('modeDistributed',       true);
//         scfg.set('maxConnections',        1);
//         scfg.set('port',                  3000);
//         scfg.set('rightPort',             3001);
//         const server1                   = new Server(); // up server
//         scfg.set('port',                  3001);
//         scfg.set('leftPort',              3000);
//         scfg.set('rightPort',             1001);
//         const server2                   = new Server(); // down server
//         cfg.set('worldWidth',             10);
//         cfg.set('worldHeight',            10);
//         cfg.set('serverPort',             3000);
//         cfg.set('serverHost',             SERVER_HOST);
//         const man1                      = new Manager(false);
//         ocfg.set('orgStartAmount',        1);
//         ocfg.set('orgMaxOrgs',            1);
//         ocfg.set('orgRainMutationPeriod', 0);
//         ocfg.set('orgCloneMutationPercent',0);
//         ocfg.set('orgEnergySpendPeriod',  0);
//         ocfg.set('orgClonePeriod',        0);
//         ocfg.set('orgStartEnergy',        10000);
//         cfg.set('worldCyclical',          false);
//         World.prototype.getFreePos      = () => {return {x: 5, y: 1}};
//
//         man1.on(EVENTS.LOOP, () => {
//             if (iterated1 > 0 && org1 === null) {
//                 org1 = man1.organisms.first.val;
//                 org1.vm.code.push(0b00001011000000000000000000000000); // onStepRight()
//                 man1.on(EVENTS.KILL, () => destroyFlag = true);
//                 man1.on(EVENTS.STEP_IN,       () => stepInBack  = true);
//             } else if (destroyFlag && stepInBack) {
//                 stepInBack = false;
//                 expect(man1.organisms.size).toBe(1);
//                 destroy();
//             }
//             if (iterated1 > 10000) {throw 'Error sending organism between Servers'}
//             iterated1++;
//         });
//
//         waitEvent(server1, server1.EVENTS.RUN, () => server1.run(), () => {
//             waitEvent(server2, server2.EVENTS.RUN, () => server2.run(), () => man1.run());
//         });
//     });
//
//     it("Checking moving of organism through three Managers", (done) => {
//         const ocfg      = new ConfigHelper(OConfig);
//         const cfg       = new ConfigHelper(Config);
//         const server    = new Server();
//         cfg.set('worldWidth',   10);
//         cfg.set('worldHeight',  10);
//         const man1      = new Manager(false);
//         deletePluginConfigs();
//         const man2      = new Manager(false);
//         deletePluginConfigs();
//         const man3      = new Manager(false);
//         let   freePos   = World.prototype.getFreePos;
//         let   waitObj   = {done: false};
//         let   i         = 0;
//         const destroy   = () => {
//             man1.destroy(() => {
//                 man2.destroy(() => {
//                     man3.destroy(() => {
//                         waitEvent(server, SEVENTS.DESTROY, () => server.destroy(), () => {
//                             World.prototype.getFreePos = freePos;
//                             ocfg.reset();
//                             cfg.reset();
//                             done();
//                         });
//                     });
//                 });
//             });
//         };
//
//         ocfg.set('orgStartAmount',          1);
//         ocfg.set('orgRainMutationPeriod',   0);
//         ocfg.set('orgCloneMutationPercent', 0);
//         ocfg.set('orgEnergySpendPeriod',    0);
//         ocfg.set('orgClonePeriod',          0);
//         ocfg.set('orgStartEnergy',          10000);
//         World.prototype.getFreePos = () => {return {x: 5, y: ++i === 1 ? 1 : 2}};
//
//         testQ(done,
//             [server, SEVENTS.RUN, () => server.run(), () => {man1.run(() => man2.run(() => man3.run(() => waitObj.done = true)))}],
//             [waitObj],
//             [man1, EVENTS.LOOP, () => {}, () => man1.organisms.first.val.vm.code.push(0b00001011000000000000000000000000)], // onStepRight()
//             [man3, EVENTS.STEP_IN, () => {}, () => destroy()]
//         );
//     });
});