describe("client/src/manager/Manager", () => {
    const Config       = require('./../../../client/src/share/Config').Config;
    const SConfig      = require('./../share/Config').Config;
    const OLD_MODE     = Config.modeNodeJs;
    Config.modeNodeJs  = true;
    const EVENTS       = require('./../../../client/src/share/Events').EVENTS;
    const CEVENTS      = require('./../../../client/src/manager/plugins/client/Client').EVENTS;
    const SEVENTS      = require('./../../../server/src/server/Server').EVENTS;
    const EVENT_AMOUNT = require('./../../../client/src/share/Events').EVENT_AMOUNT;
    const Console      = require('./../../../client/src/share/Console');
    const SConsole     = require('./../share/Console');
    const Manager      = require('./Manager');
    const emptyFn      = () => {};

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
        man.destroy(done);
    });
    it("Checking running manager", (done) => {
        const man = new Manager(false);
        man.run(() => {
            man.on(EVENTS.ITERATION, () => {
                man.destroy(done);
            });
        });

    });
});