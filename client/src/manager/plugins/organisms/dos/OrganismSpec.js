//
// This spec covers two classes "Organism" and "OrganismDos"
//
describe("client/src/organism/OrganismDos", () => {
    const _fill       = require('lodash/fill');
    const OrganismDos = require('./Organism');
    const OEvents     = require('./../Organism').EVENTS;
    const OConfig     = require('./../../../../manager/plugins/organisms/Config');
    const Helper      = require('./../../../../../../common/src/Helper');

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
            _fill(org1.vm.vars, 0);
            org1.vm.insertLine();

            expect(org1.energy).toBe(100);
            org1.run();
            expect(org1.energy).toBe(90); // 100 - 100 * .1 = 90
            org1.run();
            expect(org1.energy).toBe(81); // 90 - 90 * .1 = 81
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
            OConfig.orgAlivePeriod = 100;
            OConfig.orgStartEnergy = 100;
            const org1    = new OrganismDos('0', 1, 2, null);

            expect(org1.energy).toBe(100);
            org1.run();
            expect(org1.energy).toBe(100);
            org1.run();
            expect(org1.energy).toBe(100);
            org1.destroy();
            expect(org1.energy < 1).toBe(true);

            OConfig.orgAlivePeriod = period;
            OConfig.orgStartEnergy = energy;
        });

        it("Organism should be destroyed on run if energy is set to zero", () => {
            const period  = OConfig.orgAlivePeriod;
            const energy  = OConfig.orgStartEnergy;
            OConfig.orgAlivePeriod = 100;
            OConfig.orgStartEnergy = 100;
            const org1    = new OrganismDos('0', 1, 2, null);

            expect(org1.energy).toBe(100);
            org1.energy = 0;
            org1.run();
            expect(org1.vm).toBe(null);
            org1.run();

            OConfig.orgAlivePeriod = period;
            OConfig.orgStartEnergy = energy;
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
            const color = org.color;
            expect(org.color).toBe(color);
            org.energy++;
            expect(org.color).not.toBe(color);
        });
    });

    describe('Checks coordinates', () => {
        it('posId() should return unique hash', () => {
            org.x = 2;
            org.y = 3;
            expect(org.posId).toBe(Helper.posId(2, 3));
            org.x = 0;
            org.y = 3;
            expect(org.posId).toBe(Helper.posId(0, 3));
        });

        it('Checks coordinates setters getters', () => {
            org.x = 1;
            org.y = 2;
            expect(org.x).toBe(1);
            expect(org.y).toBe(2);
            org.x = 0;
            org.y = 0;
            expect(org.x).toBe(0);
            expect(org.y).toBe(0);
            org.x = -1;
            org.y = -2;
            expect(org.x).toBe(-1);
            expect(org.y).toBe(-2);
        })
    });

    describe('run() method', () => {
        it("Organism's age should be changed through iterations", () => {
            const period  = OConfig.orgAlivePeriod;
            const energy  = OConfig.orgStartEnergy;
            OConfig.orgAlivePeriod = 100;
            OConfig.orgStartEnergy = 100;

            expect(org.iterations).toEqual(-1);
            org.run();
            expect(org.iterations).toEqual(0);
            org.run();
            expect(org.iterations).toEqual(1);

            OConfig.orgAlivePeriod = period;
            OConfig.orgStartEnergy = energy;
        });

        it("Checking organism destroy because of age", () => {
            const period = OConfig.orgAlivePeriod;

            OConfig.orgAlivePeriod = 3000;
            for (let i = 0; i < OConfig.orgAlivePeriod + 1; i++) {
                expect(org.energy > 0).toBe(true);
                org.run();
            }
            expect(org.energy < 1).toEqual(true);
            // we don't need to call destroy, because organism
            // should be dead at this moment
            OConfig.orgAlivePeriod = period;
        });
    });

    describe('Clonning', () => {
        it('Organism should fire CLONE event if enough energy', () => {
            let   flag        = false;
            const minEnergy   = OConfig.orgCloneMinEnergy;
            const yieldPeriod = OConfig.codeYieldPeriod;
            const weights     = OConfig.orgOperatorWeights.slice();
            const newWeights  = [.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1];
            OConfig.orgCloneMinEnergy = 100;
            OConfig.codeYieldPeriod   = 1;
            OConfig.orgOperatorWeights.splice(0, OConfig.orgOperatorWeights.length, ...newWeights);
            const org1 = new OrganismDos('0', 1, 2, null);

            _fill(org1.vm.vars, 0);
            org1.vm.insertLine();
            org1.energy = OConfig.orgCloneMinEnergy * 2;
            org1.on(OEvents.CLONE, () => flag = true);
            org1.run();
            expect(flag).toBe(true);

            org1.destroy();
            OConfig.orgCloneMinEnergy = minEnergy;
            OConfig.codeYieldPeriod   = yieldPeriod;
            OConfig.orgOperatorWeights.splice(0, OConfig.orgOperatorWeights.length, ...weights);
        })
    });

    it("Checking destroy() method", () => {
        const org1 = new OrganismDos('0', 1, 2, null);

        expect(org1.energy > 0).toEqual(true);
        org1.destroy();
        expect(org1.vm).toBe(null);
        expect(org1.energy).toBe(0);
        expect(org1.item).toBe(null);
        expect(org1.mem).toBe(null);
        expect(org1.mutationProbs).toBe(null);
        expect(org1.iterations).toBe(-1);
    });
});