//
// This spec covers two classes "Organism" and "OrganismDos"
//
describe("client/src/organism/OrganismDos", () => {
    const _fill       = require('lodash/fill');
    const OrganismDos = require('./Organism');
    const OConfig     = require('./../../../../manager/plugins/organisms/Config');

    it("Checking organism creation", () => {
        let org = new OrganismDos('0', 1, 2, true, null);

        expect(org.id).toEqual('0');
        expect(org.x).toEqual(1);
        expect(org.y).toEqual(2);
        expect(org.item).toEqual(null);
        expect(org.alive).toEqual(true);
        expect(org.mutationProbs).toEqual(OConfig.orgMutationProbs);
        expect(org.mutationProbs !== OConfig.orgMutationProbs).toEqual(true);
        expect(org.mutationPeriod === OConfig.orgRainMutationPeriod).toEqual(true);
        expect(org.mutationPercent === OConfig.orgRainMutationPercent).toEqual(true);
        expect(org.mem.length).toBe(Math.pow(2, OConfig.orgMemBits));
        expect(org.mem).toEqual(_fill(new Array(Math.pow(2, OConfig.orgMemBits)), 0));
        expect(org.changes).toBe(0);
        expect(org.energy).toBe(OConfig.orgStartEnergy);
        expect(org.iterations).toBe(-1);

        org.destroy();
    });

    it("Checking organism creation from parent", () => {
        const memSize = OConfig.orgMemBits;
        const parent  = new OrganismDos('1', 3, 4, true, null);

        OConfig.orgMemBits = 2;
        parent.vm.insertLine();
        parent.energy               = 123;
        parent.changes              = 0xaabbcc;
        parent.mutationProbs.splice(0, parent.mutationProbs.length, ...[5,8,1,10,1,2,32,7]);
        parent.mutationPeriod       = 145;
        parent.mutationPercent      = 0.2;
        parent.mem.splice(0, parent.mem.length, ...[1,2,4,3]);

        let org = new OrganismDos('0', 1, 2, true, null, parent);

        expect(org.vm.code).toEqual(parent.vm.code);
        expect(org.vm.size).toEqual(parent.vm.size);
        expect(org.energy).toEqual(parent.energy);
        expect(org.color).toEqual(parent.color);
        expect(org.mutationProbs).toEqual(parent.mutationProbs);
        expect(org.mutationPeriod).toEqual(parent.mutationPeriod);
        expect(org.mutationPercent).toEqual(parent.mutationPercent);
        expect(org.mem).toEqual(parent.mem);
        expect(org.changes).toEqual(0);
        expect(org.iterations).toEqual(-1);
        expect(org.alive).toEqual(true);
        expect(org.item).toEqual(null);

        org.destroy();
        OConfig.orgMemBits = memSize;
    });

    it("Checking organism coordinates", () => {
        let   org  = new OrganismDos(0, 1, 2, true, null, () => {});

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
        let   org     = new OrganismDos(0, 1, 2, true, null, () => {});
        const period  = OConfig.orgAlivePeriod;
        const energy  = OConfig.orgStartEnergy;
        const speriod = OConfig.orgEnergySpendPeriod;

        OConfig.orgAlivePeriod = 100;
        OConfig.orgStartEnergy = 100;
        OConfig.orgEnergySpendPeriod = 100;

        expect(org.alive).toEqual(true);
        org.run();
        expect(org.alive).toEqual(true);

        expect(org.alive).toEqual(true);
        OConfig.orgAlivePeriod = period;
        OConfig.orgStartEnergy = energy;
        OConfig.orgEnergySpendPeriod = speriod;

        org.destroy();
    });

    it("Checking organism changes", () => {
        let   org     = new OrganismDos(0, 1, 2, true, null, () => {});

        expect(org.changes).toEqual(1);
        org.changes = 10;
        expect(org.changes).toEqual(10);
        org.changes += 12;
        expect(org.changes).toEqual(22);

        org.destroy();
    });

    it("Checking run() method", () => {
        let   org     = new OrganismDos(0, 1, 2, true, null, () => {});

        expect(org.iterations).toEqual(0);
        org.run();
        expect(org.iterations).toEqual(1);
        org.run();
        expect(org.iterations).toEqual(2);

        org.destroy();
    });

    it("Checking organism destroy because of age", () => {
        const period = OConfig.orgAlivePeriod;
        let   org    = new OrganismDos(0, 1, 2, true, null, () => {});

        OConfig.orgAlivePeriod = 30000;
        for (let i = 0; i < OConfig.orgAlivePeriod; i++) {
            expect(org.alive).toEqual(true);
            org.run();
        }
        expect(org.alive).toEqual(false);
        // we don't need to call destroy, because organism
        // should be dead at this moment
        OConfig.orgAlivePeriod = period;
    });

    it("Checking organism destroy because of zero energy", () => {
        const period = OConfig.orgAlivePeriod;
        let   org    = new OrganismDos(0, 1, 2, true, null, () => {});

        OConfig.orgAlivePeriod = 30000;
        expect(org.energy).toEqual(OConfig.orgStartEnergy);
        org.energy = 0;
        expect(org.alive).toEqual(true);
        org.run();
        expect(org.alive).toEqual(false);
        // we don't need to call destroy, because organism
        // should be dead at this moment
        OConfig.orgAlivePeriod = period;
    });

    it("Checking organism destroy because of grab energy", () => {
        const period = OConfig.orgEnergySpendPeriod;
        let   org    = new OrganismDos(0, 1, 2, true, null, () => {});

        OConfig.orgEnergySpendPeriod = 1;
        org.energy = 1;
        expect(org.alive).toEqual(true);
        org.run();
        expect(org.alive).toEqual(false);
        //
        // we don't need to call destroy, because organism
        // should be dead at this moment
        //
        OConfig.orgEnergySpendPeriod = period;
    });

    it("Checking grabbing energy", () => {
        let   org    = new OrganismDos(0, 1, 2, true, null, () => {});
        const energy = org.energy;

        org.energy -= 10;
        expect(org.energy).toEqual(energy - 10);

        org.destroy();
    });

    it("Checking organism color change", () => {
        let   org    = new OrganismDos(0, 1, 2, true, null, () => {});
        const color  = org.color;

        org.changes = 10;
        expect(org.color).toEqual(color + 10);

        org.destroy();
    });

    it("Checking destroy() method", () => {
        let   org    = new OrganismDos(0, 1, 2, true, null, () => {});

        expect(org.alive).toEqual(true);
        expect(org.energy > 0).toEqual(true);
        org.destroy();
        expect(org.alive).toEqual(false);
        expect(org.energy > 0).toEqual(false);
    });
});