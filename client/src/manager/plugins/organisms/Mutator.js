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

const ADD_MUTAION_INDEX = 6;

class Mutator {
    static _onChange(org) {
        const vm = org.vm;
        vm.updateLine(Helper.rand(vm.size), Num.rand());
        org.changes += Num.MAX_BITS;
    }

    static _onDel(org) {
        org.vm.removeLine();
        org.changes += Num.MAX_BITS;
    }

    /**
     * Operator type or one variable may mutate
     * @param {Organism} org
     */
    static _onSmallChange(org) {
        const rand  = Helper.rand;
        const vm  = org.vm;
        const index = rand(vm.size);
        const rnd   = rand(2);
        //
        // Toggles operator bits only
        //
        if (rnd === 0) {
            vm.updateLine(index, Num.setOperator(vm.getLine(index), rand(vm.operators.operators.length)));
            org.changes += Num.BITS_PER_OPERATOR;
        //
        // Toggles specified bit, except operator bits
        //
        } else {
            vm.updateLine(index, vm.getLine(index) ^ (1 << rand(Num.VAR_BITS_OFFS - 1)));
            org.changes++;
        }
    }

    static _onMutationPeriod(org) {
        if (!OConfig.orgRainPerOrg) {return}
        org.mutationPeriod = Helper.rand(OConfig.orgAlivePeriod);
        org.changes++;
    }

    static _onMutationPercent(org) {
        if (!OConfig.orgRainPerOrg) {return}
        org.mutationPercent = Math.random();
        org.changes++;
    }

    static _onProbs(org) {
        if (!OConfig.orgMutationPerOrg) {return}
        org.mutationProbs[Helper.rand(org.mutationProbs.length)] = Helper.rand(OConfig.ORG_MUTATION_PROBS_MAX_VAL) || 1;
        org.changes++;
    }

    static _onAdd(org) {
        org.vm.insertLine();
        org.changes += Num.MAX_BITS;
    }

    static _onCopy(org) {
        org.changes += (org.vm.copyLines() * Num.MAX_BITS);
    }

    constructor(manager, owner) {
        this._manager = manager;
        this._owner   = owner;
        this._MUTATION_TYPES = [
            Mutator._onChange,
            Mutator._onDel,
            Mutator._onSmallChange,
            Mutator._onMutationPeriod,
            Mutator._onMutationPercent,
            Mutator._onProbs,
            Mutator._onAdd,
            Mutator._onCopy
        ];

        this._onOrganismCb = this._onOrganism.bind(this);

        Helper.override(owner, 'onOrganism', this._onOrganismCb);
    }

    destroy() {
        Helper.unoverride(this._owner, 'onOrganism', this._onOrganismCb);
        this._onOrganismCb   = null;
        this._manager        = null;
        this._owner          = null;
        this._MUTATION_TYPES = null;
    }

    _onOrganism(org) {
        if (org.iterations % org.mutationPeriod !== 0 || org.iterations < 1 || OConfig.orgRainMutationPeriod === 0 || OConfig.orgRainMutationPercent === 0.0 || org.mutationPeriod === 0 || org.energy < 1) {return}
        this._mutate(org);
    }

    /**
     * IMPORTANT: mutations should be applied only after last line of organism's code
     * has interpreted
     * @param {Organism} org Current organism
     */
    _mutate(org) {
        const vm        = org.vm;
        const probIndex = Helper.probIndex;
        const mTypes    = this._MUTATION_TYPES;
        const maxSize   = OConfig.codeMaxSize;
        let   mutations = ((vm.size * org.mutationPercent + .5) << 0) || 1;
        let   type;

        for (let i = 0; i < mutations; i++) {
            //
            // If we reach code size maximum, then only change and delete
            // mutations may be applied to organism's code
            //
            type = vm.size < 1 ? ADD_MUTAION_INDEX : probIndex(org.mutationProbs);
            if (vm.size >= maxSize && type >= ADD_MUTAION_INDEX) {mutations = i; break}
            mTypes[type](org);
        }
        this._manager.fire(EVENTS.MUTATIONS, org, mutations);
    }
}

module.exports = Mutator;