/**
 * Plugin for Manager class, which is tracks when and how many mutations
 * should be added to special organism's code at special moment of it's
 * life.
 *
 * Depends on:
 *   manager/Manager
 *   manager/plugins/Organisms
 *
 * @author DeadbraiN
 */
import Events from './../../global/Events';
import Config from './../../global/Config';
import Helper from './../../global/Helper';
import Code   from './../../organism/Code';

export default class Mutator {
    constructor(manager) {
        this._manager = manager;
        this._BITS_PER_VAR = 2;
        this._VARS = 24 / this._BITS_PER_VAR;
        this._MUTATION_TYPES = [
            this._onAdd.bind(this),
            this._onChange.bind(this),
            this._onDel.bind(this),
            this._onSmallChange.bind(this),
            this._onClone.bind(this),
            this._onPeriod.bind(this),
            this._onAmount.bind(this),
            this._onProbs.bind(this),
            this._onCloneEnergyPercent.bind(this)
        ]

        manager.on(Events.ORGANISM, this._onOrganism.bind(this));
        manager.on(Events.CLONE, this._onCloneOrg.bind(this));
    }

    destroy() {
    }

    _onOrganism(org) {
        if (Config.orgRainMutationPeriod > 0 && org.mutationPeriod > 0 && org.age % org.mutationPeriod === 0) {
            this._mutate(org, false);
        }
    }

    _onCloneOrg(parent, child) {
        if (child.energy > 0) {this._mutate(child);}
    }

    _mutate(org, clone = true) {
        const bCode     = org.byteCode;
        let   mutations = Math.round(bCode.length * org.mutationPercent) || 1;
        const probIndex = Helper.probIndex;
        const mTypes    = this._MUTATION_TYPES;

        for (let i = 0; i < mutations; i++) {
            mTypes[bCode.length < 1 ? 0 : probIndex(org.mutationProbs)](org);
        }
        org.mutations += mutations;
        this._changeColor(org, mutations);
        org.compile();
        this._manager.fire(Events.MUTATIONS, org, mutations, clone);

        return mutations;
    }

    _changeColor(org, mutAmount) {
        const mutations = org.mutations;
        const colPeriod = Config.orgColorPeriod;
        const colIndex  = mutations - (mutations % colPeriod);

        if (mutations > colPeriod && colIndex >= mutations - mutAmount && colIndex <= mutations) {
            if (++org.color > Config.ORG_MAX_COLOR) {org.color = Config.ORG_FIRST_COLOR;}
        }
    }

    /**
     * We have to use >>> 0 at the end, because << operator works
     * with signed 32bit numbers, but not with unsigned like we need
     * @returns {number}
     */
    _number() {
        return Helper.rand(0xff) << 24 & Helper.rand(0xffffff) >>> 0;
    }

    _operator(num) {
        return num >>> 24;
    }

    _setOperator(num, op) {
        return (num & (op << 24 | 0x00ffffff)) >>> 0;
    }

    /**
     * Sets variable bits into value 'val' and returns updated full number.
     * Example: _setVar(0xaabbccdd, 2, 0x3) -> 0x
     * @param {Number} num Original number
     * @param {Number} index Variable index
     * @param {Number} val New variable value
     * @returns {Number}
     * @private
     */
    _setVar(num, index, val) {
        const BITS  = this._BITS_PER_VAR;
        const bits  = index * BITS;
        const lBits = 24 - bits;
        const rBits = 8 + bits + BITS;

        return (num >>> lBits << lBits | val << (lBits - BITS) | num << rBits >>> rBits) >>> 0;
    }

    _getVar(num, index) {
        return (num << 8 >>> 8) << (8 + index * this._BITS_PER_VAR) >>> 30;
    }

    _onAdd(org) {
        org.byteCode.splice(Helper.rand(org.byteCode.length), 0, this._number());
    }

    _onChange(org) {
        org.byteCode[Helper.rand(org.byteCode.length)] = this._number();
    }

    _onDel(org) {
        org.byteCode.splice(Helper.rand(org.byteCode.length), 1);
    }

    /**
     * Operator type or one variable may mutate
     * @param {Organism} org
     * @private
     */
    _onSmallChange(org) {
        let pos = Helper.rand(org.byteCode.length);
        if (Helper.rand(1) === 0) {
            org.byteCode[pos] = this._setOperator(org.byteCode[pos], Helper.rand(256));
        } else {
            org.byteCode[pos] = this._setVar(org.byteCode[pos], Helper.rand(this._VARS), Helper.rand(1 << this._BITS_PER_VAR));
        }
    }

    _onClone(org) {
        org.mutationClonePercent = Math.random();
    }

    _onPeriod(org) {
        org.mutationPeriod = Helper.rand(Config.ORG_MAX_MUTATION_PERIOD);
    }

    _onAmount(org) {
        org.mutationPercent = Math.random();
    }

    _onProbs(org) {
        org.mutationProbs[Helper.rand(org.mutationProbs.length)] = Helper.rand(Config.orgMutationProbsMaxValue);
    }

    _onCloneEnergyPercent(org) {
        org.cloneEnergyPercent = Math.random();
    }
}