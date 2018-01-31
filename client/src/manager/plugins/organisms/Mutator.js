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

const ADD_MUTAION_INDEX = 6;

class Mutator {
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
        org.changes += MAX_BITS;
    }

    static _onCopy(org) {
        org.changes += (org.vm.copyLines() * MAX_BITS);
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
        if (org.iterations % org.mutationPeriod !== 0 || OConfig.orgRainMutationPeriod === 0 || OConfig.orgRainMutationPercent === 0.0 || org.mutationPeriod === 0 || !org.alive) {return}
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
        let   mutations = Math.round(vm.size * org.mutationPercent) || 1;
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