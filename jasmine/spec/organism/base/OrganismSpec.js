describe("src/organism/Organism", () => {
    let Organism = require('../../../../src/organism/base/Organism').default;
    let Config   = require('../../../../src/global/Config').Config;
    let api      = require('../../../../src/global/Config').api;
    let THelper  = require('../../Helper').default;
    let cls;

    class OrganismTest extends Organism {
        onRun() {
            this.jsvm.run(this);
        }
    }

    beforeEach(() => {cls = Config.codeOperatorsCls;api.set('codeOperatorsCls', 'ops')});
    afterEach(() => api.set('codeOperatorsCls', cls));

    it("Checking organism creation", () => {
        const clss = {ops: ()=>{}};
        let   org  = new OrganismTest(0, 1, 2, true, null, ()=>{}, clss);

        expect(org.id).toEqual(0);
        expect(org.x).toEqual(1);
        expect(org.y).toEqual(2);
        expect(org.item).toEqual(null);
        expect(org.alive).toEqual(true);
        expect(THelper.compare(org.mutationProbs, Config.orgMutationProbs)).toEqual(true);
        expect(org.mutationPeriod === Config.orgRainMutationPeriod).toEqual(true);
        expect(org.mutationPercent === Config.orgRainMutationPercent).toEqual(true);
        expect(org.cloneMutationPercent === Config.orgCloneMutationPercent).toEqual(true);
        expect(org.changes === 1).toEqual(true);
        expect(org.energy === Config.orgStartEnergy).toEqual(true);
        expect(org.color === Config.orgStartColor).toEqual(true);
        expect(org.mem.length === 0).toEqual(true);
        expect(org.cloneEnergyPercent === Config.orgCloneEnergyPercent).toEqual(true);
        expect(org.iterations === 0).toEqual(true);

        org.destroy();
    });

    it("Checking organism creation from parent", () => {
        const clss   = {ops: ()=>{}};
        const parent = new OrganismTest(1, 3, 4, true, null, ()=>{}, clss);
        parent.jsvm.insertLine();
        parent.energy               = 123;
        parent.changes              = 0xaabbcc;
        parent._mutationProbs       = [5,8,1,10,1,2,32,7];
        parent.cloneMutationPercent = 0.1;
        parent.mutationPeriod       = 145;
        parent.mutationPercent      = 0.2;
        parent.cloneEnergyPercent   = 0.34;
        parent._mem                 = [1,2,4,3];

        let   org    = new OrganismTest(0, 1, 2, true, null, ()=>{}, clss, parent);

        expect(org.jsvm.code[0] === parent.jsvm.code[0]).toEqual(true);
        expect(org.jsvm.size === parent.jsvm.size).toEqual(true);
        expect(org.energy === parent.energy).toEqual(true);
        expect(org.color === parent.color).toEqual(true);
        expect(THelper.compare(org.mutationProbs, parent.mutationProbs)).toEqual(true);
        expect(org.cloneMutationPercent === parent.cloneMutationPercent).toEqual(true);
        expect(org.mutationPeriod === parent.mutationPeriod).toEqual(true);
        expect(org.mutationPercent === parent.mutationPercent).toEqual(true);
        expect(org.cloneEnergyPercent === parent.cloneEnergyPercent).toEqual(true);
        expect(THelper.compare(org.mem, parent.mem)).toEqual(true);
        expect(org.changes === 1).toEqual(true);
        expect(org.iterations === 0).toEqual(true);

        org.destroy();
    });

    it("Checking organism coordinates", () => {
        const clss = {ops: ()=>{}};
        let   org  = new OrganismTest(0, 1, 2, true, null, ()=>{}, clss);

        org.x = 4;
        org.y = 5;
        expect(org.x === 4 && org.y === 5).toEqual(true);
        org.x = 0;
        org.y = 0;
        expect(org.x === 0 && org.y === 0).toEqual(true);
        org.x = -1;
        org.y = -2;
        expect(org.x === -1 && org.y === -2).toEqual(true);

        org.destroy();
    });

    it("Checking if organism if alive", () => {
        const clss    = {ops: ()=>{}};
        let   org     = new OrganismTest(0, 1, 2, true, null, ()=>{}, clss);
        const period  = Config.orgAlivePeriod;
        const energy  = Config.orgStartEnergy;
        const speriod = Config.orgEnergySpendPeriod;

        api.set('orgAlivePeriod', 100);
        api.set('orgStartEnergy', 100);
        api.set('orgEnergySpendPeriod', 100);

        expect(org.alive).toEqual(true);
        org.run();
        expect(org.alive).toEqual(true);

        expect(org.alive).toEqual(true);
        api.set('orgAlivePeriod', period);
        api.set('orgStartEnergy', energy);
        api.set('orgEnergySpendPeriod', speriod);

        org.destroy();
    });

    it("Checking organism changes", () => {
        const clss    = {ops: ()=>{}};
        let   org     = new OrganismTest(0, 1, 2, true, null, ()=>{}, clss);

        expect(org.changes).toEqual(1);
        org.changes = 10;
        expect(org.changes).toEqual(10);
        org.changes += 12;
        expect(org.changes).toEqual(22);

        org.destroy();
    });

    it("Checking run() method", () => {
        const clss    = {ops: ()=>{}};
        let   org     = new OrganismTest(0, 1, 2, true, null, ()=>{}, clss);

        expect(org.iterations).toEqual(0);
        org.run();
        expect(org.iterations).toEqual(1);

        org.destroy();
    });

    it("Checking organism destroy because of age", () => {
        const clss = {ops: ()=>{}};
        let   org  = new OrganismTest(0, 1, 2, true, null, ()=>{}, clss);

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