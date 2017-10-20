describe("client/src/manager/plugins/Client", () => {
    let Helper       = require('./../../../../common/src/global/Helper');
    let Observer     = require('./../../../../common/src/global/Observer');
    let Config       = require('./../../../../common/src/global/Config').Config;
    let EVEN_AMOUNT  = require('./../../../../client/src/global/Events').EVENT_AMOUNT;
    let Modes        = require('./../../../../common/src/global/Config').Modes;
    let api          = require('./../../../../common/src/global/Config').api;
    let Console      = require('./../../../../client/src/global/Console').default;
    let type;
    let Client;

    let error;
    let warn;
    let info;

    beforeAll(() => {
        type   = Config.modeType;api.set('modeType', Modes.MODE_NODE);
        Client = require('./../../../../client/src/manager/plugins/Client');
        error  = Console.error;
        warn   = Console.warn;
        info   = Console.info;
        Console.error = () => {};
        Console.warn  = () => {};
        Console.info  = () => {};
    });
    afterAll(() => {
        api.set('modeType', type);
        Console.error = error;
        Console.warn  = warn;
        Console.info  = info;
    });

    it("Checking client creation", () => {
        const man    = new Observer(EVEN_AMOUNT);
        let   run    = false;
        man.run      = () => {run = true};
        const client = new Client(man);

        //expect(flag).toEqual(false);

        client.destroy();
        man.clear();
    });
});