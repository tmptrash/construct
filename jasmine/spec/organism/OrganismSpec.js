describe("src/organism/Organism", () => {
    let Organism = require('../../../src/organism/Organism').default;
    let Config   = require('../../../src/global/Config').Config;
    let api      = require('../../../src/global/Config').api;
    let cls;

    beforeEach(() => {cls = Config.codeOperatorsCls;api.set('codeOperatorsCls', 'ops')});
    afterEach(() => api.set('codeOperatorsCls', cls));

    it("Checking organism creation", () => {
        const clss = {ops: ()=>{}};
        let   org  = new Organism(0, 1, 2, true, null, ()=>{}, clss);

        expect(org.id).toEqual(0);
        expect(org.x).toEqual(1);
        expect(org.y).toEqual(2);
        expect(org.item).toEqual(null);
        expect(org.alive).toEqual(true);

        org.destroy();
    });

    it("Checking organism destroy because of age", () => {
        const clss = {ops: ()=>{}};
        let   org  = new Organism(0, 1, 2, true, null, ()=>{}, clss);

        for (let i = 0; i < Config.orgAlivePeriod; i++) {
            expect(org.alive).toEqual(true);
            org.run();
        }
        expect(org.alive).toEqual(false);
        // we don't need to call destroy, because organism
        // should be dead at this moment
    });
    //
    // it("Checking organism destroy because of zero energy", () => {
    //     Config.orgAlivePeriod       = Config.orgStartEnergy + 1;
    //     Config.orgEnergySpendPeriod = 1;
    //     let org = new Organism(0, 1, 2, true, null, ()=>{});
    //
    //     for (let i = 0; i < Config.orgStartEnergy; i++) {
    //         org.run();
    //     }
    //
    //     expect(org.alive).toEqual(false);
    // });
    //
    // it("Checking grabbing energy", () => {
    //     let energy = Config.orgStartEnergy;
    //     let org    = new Organism(0, 1, 2, true, null, ()=>{});
    //
    //     org.grabEnergy(10);
    //     expect(org.energy).toEqual(energy - 10);
    // });
    //
    // it("Checking destroy() method", () => {
    //     let org = new Organism(0, 1, 2, true, null, ()=>{});
    //
    //     expect(org.alive).toEqual(true);
    //     expect(org.energy > 0).toEqual(true);
    //     org.destroy();
    //     expect(org.alive).toEqual(false);
    //     expect(org.energy > 0).toEqual(false);
    // });
});