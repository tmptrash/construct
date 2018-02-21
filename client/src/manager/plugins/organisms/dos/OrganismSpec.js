//
// This spec covers two classes "Organism" and "OrganismDos"
//
describe("client/src/organism/OrganismDos", () => {
    const _fill       = require('lodash/fill');
    const OrganismDos = require('./Organism');
    const OConfig     = require('./../../../../manager/plugins/organisms/Config');

    let org;

    beforeEach(() => org = new OrganismDos('0', 1, 2, null));
    afterEach (() => org.destroy());

    describe('Organism creation', () => {
        it("Checking organism creation", () => {
            expect(org.id).toEqual('0');
            expect(org.x).toEqual(1);
            expect(org.y).toEqual(2);
            expect(org.item).toEqual(null);
            expect(org.energy > 0).toEqual(true);
            expect(org.mutationProbs).toEqual(OConfig.orgMutationProbs);
            expect(org.mutationProbs !== OConfig.orgMutationProbs).toEqual(true);
            expect(org.mutationPeriod === OConfig.orgRainMutationPeriod).toEqual(true);
            expect(org.mutationPercent === OConfig.orgRainMutationPercent).toEqual(true);
            expect(org.mem.length).toBe(Math.pow(2, OConfig.orgMemBits));
            expect(org.mem).toEqual(_fill(new Array(Math.pow(2, OConfig.orgMemBits)), 0));
            expect(org.changes).toBe(0);
            expect(org.energy).toBe(OConfig.orgStartEnergy);
            expect(org.iterations).toBe(-1);
        });

        it("Checking organism creation from parent", () => {
            const memSize = OConfig.orgMemBits;
            const parent  = new OrganismDos('1', 3, 4, null);

            OConfig.orgMemBits = 2;
            parent.vm.insertLine();
            parent.energy               = 123;
            parent.changes              = 0xaabbcc;
            parent.mutationProbs.splice(0, parent.mutationProbs.length, ...[5,8,1,10,1,2,32,7]);
            parent.mutationPeriod       = 145;
            parent.mutationPercent      = 0.2;
            parent.mem.splice(0, parent.mem.length, ...[1,2,4,3]);

            let org1 = new OrganismDos('0', 1, 2, null, parent);

            expect(org1.vm.code).toEqual(parent.vm.code);
            expect(org1.vm.size).toEqual(parent.vm.size);
            expect(org1.energy).toEqual(parent.energy);
            expect(org1.color).toEqual(parent.color);
            expect(org1.mutationProbs).toEqual(parent.mutationProbs);
            expect(org1.mutationPeriod).toEqual(parent.mutationPeriod);
            expect(org1.mutationPercent).toEqual(parent.mutationPercent);
            expect(org1.mem).toEqual(parent.mem);
            expect(org1.changes).toEqual(0);
            expect(org1.iterations).toEqual(-1);
            expect(org1.energy > 0).toEqual(true);
            expect(org1.item).toEqual(null);

            org1.destroy();
            OConfig.orgMemBits = memSize;
        });
    });

    describe('Checking organism alive', () => {
        it("Organism should not be dead it he doesn't contain code", () => {
            const period  = OConfig.orgAlivePeriod;
            const energy  = OConfig.orgStartEnergy;
            OConfig.orgAlivePeriod = 100;
            OConfig.orgStartEnergy = 100;
            const org1    = new OrganismDos('0', 1, 2, null);

            expect(org1.energy).toBe(100);
            org1.run();
            expect(org1.energy).toBe(100);
            org1.destroy();
            expect(org1.energy < 1).toBe(true);

            OConfig.orgAlivePeriod = period;
            OConfig.orgStartEnergy = energy;
        });


        it("Organism should not be dead after loosing some energy", () => {
            const period      = OConfig.orgAlivePeriod;
            const energy      = OConfig.orgStartEnergy;
            const weights     = OConfig.orgOperatorWeights.slice();
            const yieldPeriod = OConfig.codeYieldPeriod;
            const newWeights = [.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1];
            OConfig.orgAlivePeriod       = 100;
            OConfig.orgStartEnergy       = 100;
            OConfig.orgOperatorWeights.splice(0, OConfig.orgOperatorWeights.length, ...newWeights);
            OConfig.codeYieldPeriod      = 1;
            const org1    = new OrganismDos('0', 1, 2, null);
            org1.vm.insertLine();

            expect(org1.energy).toBe(100);
            org1.run();
            expect(org1.energy).toBe(89);   // 100 - 100 * .1 - 1 = 89
            org1.run();
            expect(org1.energy).toBe(79.1); // 89 - 89 * .1 - 1 = 79.1
            org1.destroy();
            expect(org1.energy < 1).toBe(true);

            OConfig.orgAlivePeriod       = period;
            OConfig.orgStartEnergy       = energy;
            OConfig.orgOperatorWeights.splice(0, OConfig.orgOperatorWeights.length, ...weights);
            OConfig.codeYieldPeriod      = yieldPeriod;
        });

        it("Organism should not be dead if loosing energy is turned off", () => {
            const period  = OConfig.orgAlivePeriod;
            const energy  = OConfig.orgStartEnergy;
            const speriod = OConfig.orgEnergySpendPeriod;
            OConfig.orgAlivePeriod       = 100;
            OConfig.orgStartEnergy       = 100;
            OConfig.orgEnergySpendPeriod = 0;
            const org1    = new OrganismDos('0', 1, 2, null);

            expect(org1.energy).toBe(100);
            org1.run();
            expect(org1.energy).toBe(100);
            org1.run();
            expect(org1.energy).toBe(100);
            org1.destroy();
            expect(org1.energy < 1).toBe(true);

            OConfig.orgAlivePeriod       = period;
            OConfig.orgStartEnergy       = energy;
            OConfig.orgEnergySpendPeriod = speriod;
        });

        it("Organism should be destroyed on run if energy is set to zero", () => {
            const period  = OConfig.orgAlivePeriod;
            const energy  = OConfig.orgStartEnergy;
            const speriod = OConfig.orgEnergySpendPeriod;
            OConfig.orgAlivePeriod       = 100;
            OConfig.orgStartEnergy       = 100;
            OConfig.orgEnergySpendPeriod = 0;
            const org1    = new OrganismDos('0', 1, 2, null);

            expect(org1.energy).toBe(100);
            org1.energy = 0;
            org1.run();
            expect(org1.vm).toBe(null);
            org1.run();

            OConfig.orgAlivePeriod       = period;
            OConfig.orgStartEnergy       = energy;
            OConfig.orgEnergySpendPeriod = speriod;
        });
    });

    describe('Changes check', () => {
        it("Checking organism changes", () => {
            expect(org.changes).toBe(0);
            org.changes = 10;
            expect(org.changes).toBe(10);
            org.changes += 12;
            expect(org.changes).toBe(22);
        });

        it("Checking if changes affects color", () => {
            const color      = org.color;
            const colorIndex = org.colorIndex;
            expect(org.changes).toBe(0);
            org.changes = 10;
            expect(org.color).not.toBe(color);
            expect(org.colorIndex).not.toBe(colorIndex);
        });
    });

    it("Checking run() method", () => {
        let   org     = new OrganismDos(0, 1, 2, null, () => {});

        expect(org.iterations).toEqual(0);
        org.run();
        expect(org.iterations).toEqual(1);
        org.run();
        expect(org.iterations).toEqual(2);

        org.destroy();
    });

    it("Checking organism destroy because of age", () => {
        const period = OConfig.orgAlivePeriod;
        let   org    = new OrganismDos(0, 1, 2, null, () => {});

        OConfig.orgAlivePeriod = 30000;
        for (let i = 0; i < OConfig.orgAlivePeriod; i++) {
            expect(org.energy > 0).toEqual(true);
            org.run();
        }
        expect(org.energy > 0).toEqual(false);
        // we don't need to call destroy, because organism
        // should be dead at this moment
        OConfig.orgAlivePeriod = period;
    });

    it("Checking organism destroy because of zero energy", () => {
        const period = OConfig.orgAlivePeriod;
        let   org    = new OrganismDos(0, 1, 2, null, () => {});

        OConfig.orgAlivePeriod = 30000;
        expect(org.energy).toEqual(OConfig.orgStartEnergy);
        org.energy = 0;
        expect(org.energy > 0).toEqual(true);
        org.run();
        expect(org.energy > 0).toEqual(false);
        // we don't need to call destroy, because organism
        // should be dead at this moment
        OConfig.orgAlivePeriod = period;
    });

    it("Checking organism destroy because of grab energy", () => {
        const period = OConfig.orgEnergySpendPeriod;
        let   org    = new OrganismDos(0, 1, 2, null, () => {});

        OConfig.orgEnergySpendPeriod = 1;
        org.energy = 1;
        expect(org.energy > 0).toEqual(true);
        org.run();
        expect(org.energy > 0).toEqual(false);
        //
        // we don't need to call destroy, because organism
        // should be dead at this moment
        //
        OConfig.orgEnergySpendPeriod = period;
    });

    it("Checking grabbing energy", () => {
        let   org    = new OrganismDos(0, 1, 2, null, () => {});
        const energy = org.energy;

        org.energy -= 10;
        expect(org.energy).toEqual(energy - 10);

        org.destroy();
    });

    it("Checking organism color change", () => {
        let   org    = new OrganismDos(0, 1, 2, null, () => {});
        const color  = org.color;

        org.changes = 10;
        expect(org.color).toEqual(color + 10);

        org.destroy();
    });

    it("Checking destroy() method", () => {
        let   org    = new OrganismDos(0, 1, 2, null, () => {});

        expect(org.energy > 0).toEqual(true);
        org.destroy();
        expect(org.energy > 0).toEqual(false);
    });
});