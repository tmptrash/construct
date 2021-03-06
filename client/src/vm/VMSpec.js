describe("client/src/organism/VM", () => {
    const Observer     = require('./../../../common/src/Observer');
    const EVENT_AMOUNT = require('./../../../client/src/share/Events').EVENT_AMOUNT;
    const OrganismDos  = require('./../manager/plugins/organisms/dos/Organism');
    const Helper       = require('./../../../common/src/Helper');
    const THelper      = require('./../../../common/tests/Helper');
    const OConfig      = require('./../manager/plugins/organisms/Config');
    const VM           = require('./VM');
    const Num          = require('./Num');
    const Operators    = require('./Operators');
    const OperatorsDos = require('./../manager/plugins/organisms/dos/Operators');
    let   obs;

    beforeEach(() => obs = new Observer(10));
    afterEach (() => obs.destroy());

    describe('Checking creation and destroy', () => {
        it("Checking vm creation", () => {
            let   flag = false;
            const vm   = new VM(obs, () => flag = true, []);

            expect(flag).toEqual(true);
            expect(vm.size).toEqual(0);
            expect(vm.line).toEqual(0);

            vm.destroy();
        });

        it("Checking parent argument and 'cloning' mode", () => {
            const parent = new VM(obs, () => {}, []);

            parent.insertLine();
            const vm     = new VM(obs, () => {}, [], parent);

            expect(vm.code).toEqual(parent.code);
            expect(vm.size).toEqual(parent.size);
            expect(vm.vars).toEqual(parent.vars);
            expect(vm.line).toEqual(parent.line);

            parent.destroy();
            vm.destroy();
        });

        it("Checking 'vars' getter for non 'cloning' mode", () => {
            const vm  = new VM(obs, () => {}, []);

            expect(vm.vars.length === Math.pow(2, OConfig.codeBitsPerVar)).toEqual(true);

            vm.destroy();
        });

        it("Checking no code size", () => {
            const vm  = new VM(obs, () => {}, []);

            expect(vm.size).toEqual(0);
            vm.run();
            expect(vm.size).toEqual(0);

            vm.destroy();
        });

        it("Checking destroy", () => {
            const vm  = new VM(obs, () => {}, []);

            vm.destroy();
            expect(vm.code).toEqual(null);
        });
    });

    describe('Checking properties and getters', () => {
        it("Checking 'code' and 'size' properties", () => {
            const vm  = new VM(obs, () => {}, []);

            expect(vm.code instanceof Array).toEqual(true);
            expect(vm.size).toEqual(0);

            vm.insertLine();
            expect(vm.code instanceof Array).toEqual(true);
            expect(vm.size).toEqual(1);

            vm.insertLine();
            expect(vm.size).toEqual(2);
            vm.removeLine();
            expect(vm.size).toEqual(1);
            vm.removeLine();
            expect(vm.size).toEqual(0);

            vm.destroy();
        });

        it("Checking 'operators' property", () => {
            const vm  = new VM(obs, Operators, []);

            expect(vm.operators instanceof Operators).toEqual(true);

            vm.destroy();
        });
    });

    describe('Checking serialization/deserialization', () => {
        it('Checks serialization', () => {
            const vm  = new VM(obs, () => {}, []);

            vm.vars.splice(0, vm.vars.length, ...[0,1,2,3]);
            expect(vm.serialize()).toEqual({
                offsets: [0],
                vars   : [0,1,2,3],
                code   : [],
                line   : 0
            });

            vm.destroy();
        });
        it('Checks serialization 2', () => {
            const vm  = new VM(obs, () => {}, []);

            vm.vars.splice(0, vm.vars.length, ...[4,3,2,1]);
            vm.insertLine();
            expect(vm.serialize()).toEqual({
                offsets: [1],
                vars   : [4,3,2,1],
                code   : [vm.code[0]],
                line   : 0
            });

            vm.destroy();
        });

        it('Checks deserialization', () => {
            const vm  = new VM(obs, Operators, []);

            vm.unserialize({
                offsets: [0],
                vars   : [0,1,2,3],
                code   : [],
                line   : 1
            });
            expect(vm.operators.offs).toEqual([0]);
            expect(vm.vars).toEqual([0,1,2,3]);
            expect(vm.code).toEqual([]);
            expect(vm.line).toEqual(1);

            vm.destroy();
        });
        it('Checks deserialization 2', () => {
            const vm  = new VM(obs, Operators, []);

            vm.unserialize({
                offsets: [3],
                vars   : [4,1,2,3],
                code   : [0xaabbccdd],
                line   : 0
            });
            expect(vm.operators.offs).toEqual([3]);
            expect(vm.vars).toEqual([4,1,2,3]);
            expect(vm.code).toEqual([0xaabbccdd]);
            expect(vm.line).toEqual(0);

            vm.destroy();
        });
    });

    describe('run() method', () => {
        it('Shouldn\'t work if code size is 0', () => {
            const vm     = new VM(obs, Operators, []);
            const org    = new OrganismDos('0', 0, 0, {});
            const energy = org.energy;

            vm.run(org);
            expect(vm.line).toEqual(0);
            expect(org.energy).toEqual(energy);

            org.destroy();
            vm.destroy();
        });
        it('Shouldn\'t work if no energy', () => {
            const vm     = new VM(obs, Operators, []);
            const org    = new OrganismDos('0', 0, 0, {});
            const energy = -1;

            org.energy = energy;
            vm.insertLine();
            vm.run(org);
            expect(vm.line).toEqual(0);
            expect(org.energy).toEqual(energy);

            org.destroy();
            vm.destroy();
        });
        it('Should run correct operator callbacks', () => {
            const period = OConfig.codeYieldPeriod;
            OConfig.codeYieldPeriod = 1;
            const vm   = new VM(obs, OperatorsDos, []);
            const org  = new OrganismDos('0', 0, 0, {});
            let   flag = false;

            vm.insertLine();
            vm.updateLine(0, 0x00000000);
            vm.operators.operators[0] = () => flag = true;
            vm.run(org);
            expect(flag).toEqual(true);

            org.destroy();
            vm.destroy();
            OConfig.codeYieldPeriod = period;
        });
        it('Should run the same amount as codeYieldPeriod', () => {
            const period = OConfig.codeYieldPeriod;
            OConfig.codeYieldPeriod = 3;
            const vm     = new VM(obs, OperatorsDos, OConfig.orgOperatorWeights);
            const org    = new OrganismDos('0', 0, 0, {});
            let   flag   = 0;

            vm.insertLine();
            vm.updateLine(0, 0x00000000);
            vm.operators.operators[0] = () => {flag++; return 1};
            vm.run(org);
            expect(flag).toEqual(3);

            org.destroy();
            vm.destroy();
            OConfig.codeYieldPeriod = period;
        });
        it('Should decrease energy', () => {
            const alive      = OConfig.orgAlivePeriod;
            const period     = OConfig.codeYieldPeriod;
            const energy     = OConfig.orgStartEnergy;
            const weights    = OConfig.orgOperatorWeights.slice();
            const newWeights = [.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1];
            OConfig.orgOperatorWeights.splice(0, OConfig.orgOperatorWeights.length, ...newWeights);
            OConfig.codeYieldPeriod = 1;
            OConfig.orgStartEnergy  = 100;
            OConfig.orgAlivePeriod  = 100;
            const vm   = new VM(obs, OperatorsDos, OConfig.orgOperatorWeights);
            const org  = new OrganismDos('0', 0, 0, {});

            vm.insertLine();
            vm.updateLine(0, 0x00000000);
            expect(org.energy).toEqual(100);
            vm.run(org);
            expect(org.energy).toEqual(99.9); // 100 - .1 = 99.9

            org.destroy();
            vm.destroy();
            OConfig.orgStartEnergy  = energy;
            OConfig.codeYieldPeriod = period;
            OConfig.orgAlivePeriod  = alive;
            OConfig.orgOperatorWeights.splice(0, OConfig.orgOperatorWeights.length, ...weights);
        });
        it('Should return correct amount of run lines', () => {
            const obs    = new Observer(EVENT_AMOUNT);
            const vm     = new VM(obs, OperatorsDos, OConfig.orgOperatorWeights);
            const org    = new OrganismDos('0', 0, 0, {});
            const period = OConfig.codeYieldPeriod;

            OConfig.codeYieldPeriod = 2;
            vm.insertLine();
            expect(vm.run(org)).toEqual(2);

            org.destroy();
            vm.destroy();
            obs.destroy();
            OConfig.codeYieldPeriod = period;
        });
    });

    describe('Crossover', () => {
        it("Checking crossover with increasing child code", () => {
            const vm1   = new VM(obs, OperatorsDos, []);
            const vm2   = new VM(obs, OperatorsDos, []);
            const rand  = Helper.rand;
            let   i     = -1;

            Helper.rand = () => {
                i++;
                if (i === 0) {return 1}
                if (i === 1) {return 2}
                if (i === 2) {return 1}
                if (i === 3) {return 3}
            };

            THelper.script(vm1, [16000000, 16000001, 16000002, 16000003, 16000004]);
            THelper.script(vm2, [17000000, 17000001, 17000002, 17000003, 17000004]);

            i = -1;
            vm1.crossover(vm2);
            expect(vm1.code).toEqual([16000000, 17000001, 17000002, 17000003, 16000003, 16000004]);

            Helper.rand = rand;
            vm1.destroy();
            vm2.destroy();
        });
        it("Checking crossover with decreasing child code", () => {
            const vm1  = new VM(obs, OperatorsDos, []);
            const vm2  = new VM(obs, OperatorsDos, []);
            const rand = Helper.rand;
            let   i    = -1;

            Helper.rand = () => {
                i++;
                if (i === 0) {return 1}
                if (i === 1) {return 2}
                if (i === 2) {return 1}
                if (i === 3) {return 1}
            };

            THelper.script(vm1, [16000000, 16000001, 16000002, 16000003, 16000004]);
            THelper.script(vm2, [17000000, 17000001, 17000002, 17000003, 17000004]);

            i = -1;
            vm1.crossover(vm2);
            expect(vm1.code).toEqual([16000000, 17000001, 16000003, 16000004]);

            Helper.rand = rand;
            vm1.destroy();
            vm2.destroy();
        });
        it("Checking crossover with the same child code size", () => {
            const vm1   = new VM(obs, OperatorsDos, []);
            const vm2   = new VM(obs, OperatorsDos, []);
            const rand  = Helper.rand;
            let   i     = -1;

            Helper.rand = () => {
                i++;
                if (i === 0) {return 1}
                if (i === 1) {return 3}
                if (i === 2) {return 1}
                if (i === 3) {return 3}
            };

            THelper.script(vm1, [16000000, 16000001, 16000002, 16000003, 16000004]);
            THelper.script(vm2, [17000000, 17000001, 17000002, 17000003, 17000004]);

            i = -1;
            vm1.crossover(vm2);
            expect(vm1.code).toEqual([16000000, 17000001, 17000002, 17000003, 16000004]);
            Helper.rand = rand;
            vm1.destroy();
            vm2.destroy();
        });
        it("Checking crossover with no code size in parents", () => {
            const vm1 = new VM(obs, OperatorsDos, []);
            const vm2 = new VM(obs, OperatorsDos, []);

            vm1.crossover(vm2);
            expect(vm1.size).toEqual(0);
            expect(vm2.size).toEqual(0);

            vm1.destroy();
            vm2.destroy();
        });
        it("Checking crossover with no code size for one parent and twp lines of code for other", () => {
            const vm1   = new VM(obs, OperatorsDos, []);
            const vm2   = new VM(obs, OperatorsDos, []);
            const rand  = Helper.rand;
            let   i     = -1;

            Helper.rand = () => {
                i++;
                if (i === 0) {return 0}
                if (i === 1) {return 0}
                if (i === 2) {return 1}
                if (i === 3) {return 2}
            };

            THelper.script(vm2, [17000000, 17000001, 17000002, 17000003]);

            i = -1;
            vm1.crossover(vm2);
            expect(vm1.code).toEqual([17000001, 17000002]);

            Helper.rand = rand;
            vm1.destroy();
            vm2.destroy();
        });
        it("Checking crossover with no code size for one parent and twp lines of code for other 2", () => {
            const vm1   = new VM(obs, OperatorsDos, []);
            const vm2   = new VM(obs, OperatorsDos, []);
            const rand  = Helper.rand;
            let   i     = -1;

            Helper.rand = () => {
                i++;
                if (i === 0) {return 1}
                if (i === 1) {return 2}
                if (i === 2) {return 0}
                if (i === 3) {return 0}
            };

            THelper.script(vm1, [16000000, 16000001, 16000002, 16000003]);

            i = -1;
            vm1.crossover(vm2);
            expect(vm1.code).toEqual([16000000, 16000003]);
            expect(vm2.size).toEqual(0);

            Helper.rand = rand;
            vm1.destroy();
            vm2.destroy();
        });
    });

    describe('copyLines() method', () => {
        it('Checking copyLines() method', () => {
            const vm   = new VM(obs, OperatorsDos, []);
            let   rand = Helper.rand;
            let   i    = -1;

            vm.insertLine();
            vm.insertLine();
            vm.insertLine();
            vm.insertLine();
            Helper.rand = function () {
                i++;
                if (i === 0) {        // start
                    return 1;
                } else if (i === 1) { // end
                    return 2;
                } else if (i === 2) { // rand(2)
                    return 0;
                } else if (i === 3) { // rand(start)
                    return 0;
                }
            };
            i = -1;
            expect(vm.size).toEqual(4);
            vm.copyLines();
            expect(vm.size).toEqual(6);
            expect(vm.code[0]).toEqual(vm.code[3]);
            expect(vm.code[1]).toEqual(vm.code[4]);

            Helper.rand = rand;
            vm.destroy();
        });
        it('Checking copyLines() method 2', () => {
            const vm   = new VM(obs, OperatorsDos, []);
            let   rand = Helper.rand;
            let   i    = -1;

            vm.insertLine();
            vm.insertLine();
            vm.insertLine();
            vm.insertLine();
            Helper.rand = function () {
                i++;
                if (i === 0) {        // start
                    return 1;
                } else if (i === 1) { // end
                    return 2;
                } else if (i === 2) { // rand(2)
                    return 1;
                } else if (i === 3) { // rand(codeLen - end)
                    return 0;
                }
            };
            i = -1;
            expect(vm.size).toEqual(4);
            vm.copyLines();
            expect(vm.size).toEqual(6);
            expect(vm.code[1]).toEqual(vm.code[3]);
            expect(vm.code[2]).toEqual(vm.code[4]);

            Helper.rand = rand;
            vm.destroy();
        });
        it('Checking copyLines() method 3', () => {
            const vm   = new VM(obs, OperatorsDos, []);
            let   rand = Helper.rand;
            let   i    = -1;

            vm.insertLine();
            vm.insertLine();
            vm.insertLine();
            vm.insertLine();
            Helper.rand = function () {
                i++;
                if (i === 0) {        // start
                    return 1;
                } else if (i === 1) { // end
                    return 2;
                } else if (i === 2) { // rand(2)
                    return 1;
                } else if (i === 3) { // rand(codeLen - end)
                    return 1;
                }
            };
            i = -1;
            expect(vm.size).toEqual(4);
            vm.copyLines();
            expect(vm.size).toEqual(6);
            expect(vm.code[1]).toEqual(vm.code[4]);
            expect(vm.code[2]).toEqual(vm.code[5]);

            Helper.rand = rand;
            vm.destroy();
        });
        it('Checking copyLines() method with no code', () => {
            const vm   = new VM(obs, OperatorsDos, []);
            let   rand = Helper.rand;

            Helper.rand = () => 0;
            expect(vm.size).toEqual(0);
            vm.copyLines();
            expect(vm.size).toEqual(0);

            Helper.rand = rand;
            vm.destroy();
        });
    });

    describe('insertLine() method', () => {
        it('Checking insertLine() method', () => {
            const vm  = new VM(obs, OperatorsDos, []);

            expect(vm.size).toEqual(0);
            vm.insertLine();
            expect(vm.size).toEqual(1);
            vm.insertLine();
            expect(vm.size).toEqual(2);

            vm.destroy();
        });
        it('Checking insertLine() method 2', () => {
            const vm   = new VM(obs, OperatorsDos, []);
            let   rand = Num.rand;

            Num.rand = () => 0xabcdefff;
            expect(vm.size).toEqual(0);
            vm.insertLine();
            expect(vm.size).toEqual(1);

            expect(vm.code[0]).toEqual(0xabcdefff);

            Num.rand = rand;
            vm.destroy();
        });
    });

    describe('updateLine() method', () => {
        it('Checking updateLine() method', () => {
            const vm   = new VM(obs, OperatorsDos, []);
            let   rand = Num.rand;

            Num.rand = () => 0xabcdefff;
            vm.insertLine();
            expect(vm.code[0]).toEqual(0xabcdefff);

            vm.updateLine(0, 0xffffffff);
            expect(vm.code[0]).toEqual(0xffffffff);

            vm.updateLine(0, 0x12345678);
            expect(vm.code[0]).toEqual(0x12345678);

            Num.rand = rand;
            vm.destroy();
        });
    });

    describe('removeLine() method', () => {
        it('Checking removeLine() method', () => {
            const vm  = new VM(obs, OperatorsDos, []);

            vm.insertLine();
            expect(vm.size).toEqual(1);
            vm.removeLine();
            expect(vm.size).toEqual(0);

            vm.destroy();
        });
        it('Checking removeLine() for empty code', () => {
            const vm  = new VM(obs, OperatorsDos, []);

            expect(vm.size).toEqual(0);
            vm.removeLine();
            expect(vm.size).toEqual(0);
            vm.removeLine();
            expect(vm.size).toEqual(0);

            vm.destroy();
        });
    });

    describe('getLine() method', () => {
        it('Checking getLine()', () => {
            const vm  = new VM(obs, OperatorsDos, []);
            let   get = Num.rand;

            Num.rand = () => 0xabcdefff;
            expect(vm.size).toEqual(0);
            expect(vm.getLine(0)).toEqual(undefined);
            expect(vm.getLine(1)).toEqual(undefined);
            vm.insertLine();
            expect(vm.size).toEqual(1);
            expect(vm.getLine(0)).toEqual(0xabcdefff);

            vm.removeLine();
            expect(vm.size).toEqual(0);
            expect(vm.getLine(0)).toEqual(undefined);
            expect(vm.getLine(1)).toEqual(undefined);
            expect(vm.getLine(9)).toEqual(undefined);

            Num.rand = get;
            vm.destroy();
        });
    });
});