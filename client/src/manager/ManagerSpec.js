describe("client/src/manager/Manager", () => {
    const Config       = require('./../../../client/src/share/Config').Config;
    const SConfig      = require('./../share/Config').Config;
    const OLD_MODE     = Config.modeNodeJs;
    Config.modeNodeJs  = true;
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

    beforeAll(() => {
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
    });

    it("Checking manager creation", () => {
        const man = new Manager(false);
        man.destroy();
    });
});