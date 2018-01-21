/**
 * Base class for organism
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author flatline
 */
const _fill          = require('lodash/fill');
const Observer       = require('./../../../../../common/src/Observer');
const Helper         = require('./../../../../../common/src/Helper');
const OConfig        = require('./../../../manager/plugins/organisms/Config');
const EVENT_AMOUNT   = require('./../../../share/Events').EVENT_AMOUNT;
const VM             = require('./../../../vm/VM');
const Num            = require('./../../../vm/Num');

const MAX_BITS       = Num.MAX_BITS;

const GRAB_ENERGY    = 0;
const DESTROY        = 1;
const CLONE          = 2;
const KILL_NO_ENERGY = 3;
const KILL_AGE       = 4;
const ITERATION      = 5;
const ORG_EVENTS     = {
    GRAB_ENERGY,
    DESTROY,
    CLONE,
    KILL_NO_ENERGY,
    KILL_AGE,
    ITERATION
};

const IS_NUM = Helper.isNumeric;

class Organism extends Observer {
    /**
     * Returns color by index. Index may be increased without limit
     * @param {Number} index Color index. Starts from 0 till Number.MAX_VALUE
     * @returns {Number} RGB value
     */
    static _getColor(index) {
        const frequency = 0.1;

        const r = Math.sin(frequency * index    ) * 127 + 128;
        const g = Math.sin(frequency * index + 2) * 127 + 128;
        const b = Math.sin(frequency * index + 4) * 127 + 128;

        return r << 16 | g << 8 | b;
    }

    /**
     * Is called before every run. Should return true, if everything
     * is okay and we don't need to interrupt running. If true, then
     * onRun() method will be called as well
     * @abstract
     */
    onBeforeRun() {}

    /**
     * Is called as a running body (main) method
     * @return {Number} Amount of run lines
     * @abstract
     */
    onRun() {}

    /**
     * Creates organism instance. If parent parameter is set, then
     * a clone of parent organism will be created.
     * @param {String} id Unique identifier of organism
     * @param {Number} x Unique X coordinate
     * @param {Number} y Unique Y coordinate
     * @param {Boolean} alive true if organism is alive
     * @param {Object} item Reference to the Queue item, where
     * this organism is located
     * @param {Function} operatorCls Class of operators
     * @param {Organism} parent Parent organism if cloning is needed
     */
    constructor(id, x, y, alive, item, operatorCls, parent = null) {
        super(EVENT_AMOUNT);

        this._operatorCls = operatorCls;

        if (parent === null) {this._create()}
        else {this._clone(parent)}

        this._id          = id;
        this._x           = x;
        this._y           = y;
        this._iterations  = 0;
        this._changes     = 0;
        this._alive       = alive;
        this._item        = item;
        this._fnId        = 0;
    }

    get id()                    {return this._id}
    get x()                     {return this._x}
    get y()                     {return this._y}
    get alive()                 {return this._alive}
    get item()                  {return this._item}
    get iterations()            {return this._iterations}
    get changes()               {return this._changes}
    get mutationProbs()         {return this._mutationProbs}
    get mutationPeriod()        {return this._mutationPeriod}
    get mutationPercent()       {return this._mutationPercent}
    get cloneMutationPercent()  {return this._cloneMutationPercent}
    get cloneEnergyPercent()    {return this._cloneEnergyPercent}
    get energy()                {return this._energy}
    get startEnergy()           {return this._startEnergy}
    get color()                 {return this._color}
    get colorIndex()            {return this._colorIndex}
    get mem()                   {return this._mem}
    get posId()                 {return Helper.posId(this._x, this._y)}

    set x(newX)                 {this._x = newX}
    set y(newY)                 {this._y = newY}
    set cloneMutationPercent(m) {this._cloneMutationPercent = m}
    set cloneEnergyPercent(p)   {this._cloneEnergyPercent = p}
    set mutationPeriod(m)       {this._mutationPeriod = m}
    set mutationPercent(p)      {this._mutationPercent = p}
    set energy(e)               {this._energy = e}
    set startEnergy(e)          {this._startEnergy = e}
    set changes(c)              {this._updateColor(c); this._changes = c}

    /**
     * Runs one code iteration (amount of lines set in Config.codeYieldPeriod) and returns
     * organism destroy state
     * @return {Boolean} false means that organism was destroyed
     */
    run() {
        this._iterations++;
        if (this.onBeforeRun() === false) {return true}
        const lines = this.onRun();

        this.fire(ITERATION, lines, this);
        if (this._alive) {
            this._alive && this._updateAge();
            this._alive && this._updateEnergy();
        }

        return true;
    }

    /**
     * Serializes an organism into the JSON string
     * @return {String} JSON string
     */
    serialize() {
        let json = {
            id                  : this._id,
            x                   : this._x,
            y                   : this._y,
            changes             : this._changes,
            alive               : this._alive,
            // 'item' will be added after insertion
            iterations          : this._iterations,
            fnId                : this._fnId,
            vm                  : this.vm.serialize(),
            energy              : this._energy,
            startEnergy         : this._startEnergy,
            color               : this._color,
            colorIndex          : this._colorIndex,
            mutationProbs       : this._mutationProbs,
            cloneMutationPercent: this._cloneMutationPercent,
            cloneEnergyPercent  : this._cloneEnergyPercent,
            mutationPeriod      : this._mutationPeriod,
            mutationPercent     : this._mutationPercent,
            mem                 : this.mem.slice()
        };

        return JSON.stringify(json);
    }

    /**
     * Opposite to serialize(). Parses provided JSON string and fill
     * current instance by passed values.
     * @param {String} str JSON string
     */
    unserialize(str) {
        const json = JSON.parse(str);

        // 'id' will be added after insertion
        this._x                    = json.x;
        this._y                    = json.y;
        this._changes              = json.changes;
        this._alive                = json.alive;
        // 'item' will be added after insertion
        this._iterations           = json.iterations;
        this._fnId                 = json.fnId;
        this.vm.unserialize(json.vm);
        this._energy               = json.energy;
        this._startEnergy          = json.startEnergy;
        this._color                = json.color;
        this._colorIndex           = json.colorIndex;
        this._mutationProbs        = json.mutationProbs;
        this._cloneMutationPercent = json.cloneMutationPercent;
        this._cloneEnergyPercent   = json.cloneEnergyPercent;
        this._mutationPeriod       = json.mutationPeriod;
        this._mutationPercent      = json.mutationPercent;
        this._mem                  = json.mem.slice();
    }

    grabEnergy(amount) {
        if (!IS_NUM(amount)) {return true}
        const noEnergy = (this._energy -= amount) < 1;
        this.fire(GRAB_ENERGY, amount + (noEnergy ? -this._energy : 0));
        noEnergy && this.destroy();
        return !noEnergy;
    }

    // TODO: describe fitness in details
    fitness() {
        // TODO: check these variants
        //return (OConfig.codeMaxSize + 1 - this.vm.size) * (this._energy - this._startEnergy) * (this._changes || 1);
        //return (OConfig.codeMaxSize + 1 - this.vm.size) * (this._energy - this._startEnergy);
        //return (OConfig.codeMaxSize + 1 - this.vm.size) * ((this._energy - this._startEnergy) / this._iterations);
        return this._energy;
    }

    destroy() {
        this.fire(DESTROY, this);
        this._alive         = false;
        this._energy        = 0;
        this._startEnergy   = 0;
        this._item          = null;
        this._mem           = null;
        this._mutationProbs = null;
        this.vm && this.vm.destroy();
        this.vm             = null;
        this._operatorCls   = null;

        super.destroy();
    }

    _create() {
        this.vm                     = new VM(this, this._operatorCls);
        this._energy                = OConfig.orgStartEnergy;
        this._startEnergy           = OConfig.orgStartEnergy;
        this._colorIndex            = OConfig.orgStartColor;
        this._color                 = Organism._getColor(0);
        this._mutationProbs         = OConfig.orgMutationProbs.slice();
        this._cloneMutationPercent  = OConfig.orgCloneMutationPercent;
        this._cloneEnergyPercent    = OConfig.orgCloneEnergyPercent;
        this._mutationPeriod        = OConfig.orgRainMutationPeriod;
        this._mutationPercent       = OConfig.orgRainMutationPercent;
        this._mem                   = new Array(Math.pow(2, OConfig.orgMemBits));

        _fill(this._mem, 0);
    }

    _clone(parent) {
        this.vm                     = new VM(this, this._operatorCls, parent.vm);
        this._energy                = parent.energy;
        this._startEnergy           = parent.energy;
        this._color                 = parent.color;
        this._colorIndex            = parent.colorIndex;
        this._mutationProbs         = parent.mutationProbs.slice();
        this._cloneMutationPercent  = parent.cloneMutationPercent;
        this._cloneEnergyPercent    = parent.cloneEnergyPercent;
        this._mutationPeriod        = parent.mutationPeriod;
        this._mutationPercent       = parent.mutationPercent;
        this._mem                   = parent.mem.slice();
    }

    _updateColor(changes) {
        this._colorIndex += (changes - this._changes);
        this._color       = Organism._getColor(Math.round(this._colorIndex / MAX_BITS));
    }

    /**
     * Checks if organism need to be killed, because of age
     * @return {Boolean} false means that organism was killed.
     */
    _updateAge() {
        const alivePeriod = OConfig.orgAlivePeriod;
        const needDestroy = this._iterations >= alivePeriod && alivePeriod > 0;

        if (needDestroy) {
            this.fire(KILL_AGE, this);
            this.destroy();
        }

        return !needDestroy;
    }

    /**
     * This is how our system grabs an energy from organism every OConfig.orgEnergySpendPeriod
     * period. If organism has zero energy, it will be killed also.
     * @return {Boolean} false means that organism was destroyed.
     */
    _updateEnergy() {
        if (this._energy < 1) {
            this.fire(KILL_NO_ENERGY, this);
            this.destroy();
            return true;
        }
        if (this._iterations % OConfig.orgEnergySpendPeriod !== 0 || OConfig.orgEnergySpendPeriod === 0) {return true}
        //let grabSize = this.vm.size;
        let grabSize = 1;
        if (grabSize < 1) {grabSize = 1}

        (this._energy <= grabSize) && this.fire(KILL_NO_ENERGY, this);
        return this.grabEnergy(this._energy < grabSize ? this._energy : grabSize);
    }
}

module.exports = {EVENTS: ORG_EVENTS, Organism};