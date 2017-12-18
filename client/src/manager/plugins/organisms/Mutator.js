/**
 * Plugin for Manager class, which is tracks when and how many mutations
 * should be added to special organism's code at special moment of it's
 * life.
 *
 * Depends on:
 *   manager/Manager
 *   manager/plugins/Organisms
 *
 * @author flatline
 */
const EVENTS   = require('./../../../share/Events').EVENTS;
const OConfig  = require('./../../../manager/plugins/organisms/Config');
const Helper   = require('./../../../../../common/src/Helper');
const Num      = require('./../../../vm/Num');

const VAR_BITS_OFFS = Num.VAR_BITS_OFFS - 1;
const VARS          = Num.VARS;
const MAX_VAR       = Num.MAX_VAR;
const MAX_BITS      = Num.MAX_BITS;
const BITS_PER_VAR  = Num.BITS_PER_VAR;

class Mutator {
    static _onAdd(org) {
        org.vm.insertLine();
        org.changes += MAX_BITS;
    }

    static _onChange(org) {
        const vm = org.vm;
        vm.updateLine(Helper.rand(vm.size), Num.get());
        org.changes += MAX_BITS;
    }

    static _onDel(org) {
        org.vm.removeLine();
        org.changes += MAX_BITS;
    }

    /**
     * Operator type or one variable may mutate
     * @param {Organism} org
     * @private
     */
    static _onSmallChange(org) {
        const rand  = Helper.rand;
        const vm  = org.vm;
        const index = rand(vm.size);
        const rnd   = rand(3);

        if (rnd === 0) {
            vm.updateLine(index, Num.setOperator(vm.getLine(index), rand(vm.operators.operators.length)));
            org.changes += MAX_BITS;
        } else if (rnd === 1) {
            vm.updateLine(index, Num.setVar(vm.getLine(index), rand(VARS), rand(MAX_VAR)));
            org.changes += BITS_PER_VAR;
        } else {
            // toggle specified bit
            vm.updateLine(index, vm.getLine(index) ^ (1 << rand(VAR_BITS_OFFS)));
            org.changes++;
        }
    }

    static _onClone(org) {
        org.cloneMutationPercent = Math.random();
        org.changes++;
    }

    static _onCopy(org) {
        org.changes += (org.vm.copyLines() * MAX_BITS);

    }

    static _onPeriod(org) {
        org.mutationPeriod = Helper.rand(OConfig.ORG_MAX_MUTATION_PERIOD);
        org.changes++;
    }

    static _onAmount(org) {
        org.mutationPercent = Math.random();
        org.changes++;
    }

    static _onProbs(org) {
        org.mutationProbs[Helper.rand(org.mutationProbs.length)] = Helper.rand(OConfig.orgMutationProbsMaxValue) || 1;
        org.changes++;
    }

    static _onCloneEnergyPercent(org) {
        org.cloneEnergyPercent = Math.random();
        org.changes++;
    }

    constructor(manager) {
        this._manager = manager;
        this._MUTATION_TYPES = [
            Mutator._onAdd,
            Mutator._onChange,
            Mutator._onDel,
            Mutator._onSmallChange,
            Mutator._onClone,
            Mutator._onCopy,
            Mutator._onPeriod,
            Mutator._onAmount,
            Mutator._onProbs,
            Mutator._onCloneEnergyPercent
        ];
        
        manager.on(EVENTS.ORGANISM, this._onOrganism.bind(this));
        manager.on(EVENTS.CLONE, this._onCloneOrg.bind(this));
    }

    destroy() {
        this._manager        = null;
        this._MUTATION_TYPES = null;
    }

    _onOrganism(org) {
        if (org.iterations % org.mutationPeriod === 0 && OConfig.orgRainMutationPeriod > 0 && org.mutationPeriod > 0 && org.alive) {
            this._mutate(org, false);
        }
    }

    _onCloneOrg(parent, child) {
        if (child.energy > 0 && OConfig.orgCloneMutationPercent > 0) {this._mutate(child)}
    }

    _mutate(org, clone = true) {
        const vm      = org.vm;
        const probIndex = Helper.probIndex;
        const mTypes    = this._MUTATION_TYPES;
        const maxSize   = OConfig.codeMaxSize;
        let   mutations = Math.round(vm.size * (clone ? org.cloneMutationPercent : org.mutationPercent)) || 1;
        let   type;

        for (let i = 0; i < mutations; i++) {
            if (vm.size > maxSize) {mutations = i; break}
            type = vm.size < 1 ? 0 : probIndex(org.mutationProbs);
            mTypes[type](org);
        }
        this._manager.fire(EVENTS.MUTATIONS, org, mutations, clone);
    }
}

module.exports = Mutator;