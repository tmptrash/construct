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
import {EVENTS}  from '../../global/Events';
import {Config}  from '../../../../common/src/global/Config';
import Helper    from '../../../../common/src/global/Helper';
import Organism  from '../../organism/OrganismDos';
import Num       from '../../organism/Num';

const VAR_BITS_OFFS = Num.VAR_BITS_OFFS - 1;
const VARS          = Num.VARS;
const MAX_VAR       = Num.MAX_VAR;

export default class Mutator {
    constructor(manager) {
        this.manager = manager;
        this._MUTATION_TYPES = [
            this._onAdd,
            this._onChange,
            this._onDel,
            this._onSmallChange,
            this._onClone,
            this._onCopy,
            this._onPeriod,
            this._onAmount,
            this._onProbs,
            this._onCloneEnergyPercent
        ];
        
        manager.on(EVENTS.ORGANISM, this._onOrganism.bind(this));
        manager.on(EVENTS.CLONE, this._onCloneOrg.bind(this));
    }

    destroy() {
        this.manager         = null;
        this._MUTATION_TYPES = null;
    }

    _onOrganism(org) {
        if (org.iterations % org.mutationPeriod === 0 && Config.orgRainMutationPeriod > 0 && org.mutationPeriod > 0 && org.alive) {
            this._mutate(org, false);
        }
    }

    _onCloneOrg(parent, child) {
        if (child.energy > 0 && Config.orgCloneMutationPercent > 0) {this._mutate(child)}
    }

    _mutate(org, clone = true) {
        const jsvm      = org.jsvm;
        const probIndex = Helper.probIndex;
        const mTypes    = this._MUTATION_TYPES;
        const maxSize   = Config.codeMaxSize;
        let   mutations = Math.round(jsvm.size * (clone ? org.cloneMutationPercent : org.mutationPercent)) || 1;
        let   type;

        for (let i = 0; i < mutations; i++) {
            if (jsvm.size > maxSize) {
                mutations = i;
                break;
            }
            type = jsvm.size < 1 ? 0 : probIndex(org.mutationProbs);
            mTypes[type](org);
        }
        org.changes += mutations;
        this.manager.fire(EVENTS.MUTATIONS, org, mutations, clone);

        return mutations;
    }

    _onAdd(org) {
        if (Config.codeFitnessCls !== null && org.jsvm.size >= Config.codeMaxSize) {return}
        org.jsvm.insertLine();
    }

    _onChange(org) {
        const jsvm = org.jsvm;
        jsvm.updateLine(Helper.rand(jsvm.size), Num.get());
    }

    _onDel(org) {
        org.jsvm.removeLine();
    }

    /**
     * Operator type or one variable may mutate
     * @param {Organism} org
     * @private
     */
    _onSmallChange(org) {
        const rand  = Helper.rand;
        const jsvm  = org.jsvm;
        const index = rand(jsvm.size);
        const rnd   = rand(3);

        if (rnd === 0) {
            jsvm.updateLine(index, Num.setOperator(jsvm.getLine(index), rand(jsvm.operators.operators.length)));
        } else if (rnd === 1) {
            jsvm.updateLine(index, Num.setVar(jsvm.getLine(index), rand(VARS), rand(MAX_VAR)));
        } else {
            // toggle specified bit
            jsvm.updateLine(index, jsvm.getLine(index) ^ (1 << rand(VAR_BITS_OFFS)));
        }
    }

    _onClone(org) {
        org.cloneMutationPercent = Math.random();
    }

    _onCopy(org) {
        org.jsvm.copyLines();
    }

    _onPeriod(org) {
        org.mutationPeriod = Helper.rand(Config.ORG_MAX_MUTATION_PERIOD);
    }

    _onAmount(org) {
        org.mutationPercent = Math.random();
    }

    _onProbs(org) {
        org.mutationProbs[Helper.rand(org.mutationProbs.length)] = Helper.rand(Config.orgMutationProbsMaxValue) || 1;
    }

    _onCloneEnergyPercent(org) {
        org.cloneEnergyPercent = Math.random();
    }
}