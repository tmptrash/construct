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

const DESTROY        = 0;
const CLONE          = 1;
const KILL_NO_ENERGY = 2;
const KILL_AGE       = 3;
const ITERATION      = 4;
const ORG_EVENTS     = {
    DESTROY,
    CLONE,
    KILL_NO_ENERGY,
    KILL_AGE,
    ITERATION
};

const MAX_COLORS          = 4000;
const UPDATE_COLOR_PERIOD = 50;

class Organism extends Observer {
    /**
     * Returns color by index. Index may be increased without limit
     * @param {Number} index Color index. Starts from 0 till Number.MAX_VALUE
     * @returns {Number} RGB value
     */
    static getColor(index) {
        //
        // Maximum possible colors for this value is MAX_COLORS
        //
        const frequency = 0.0005;

        const r = Math.sin(frequency * index    ) * 127 + 128;
        const g = Math.sin(frequency * index + 2) * 127 + 128;
        const b = Math.sin(frequency * index + 4) * 127 + 128;

        return r << 16 | g << 8 | b;
    }

    static getMaxColors() {return MAX_COLORS}

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
     * @param {Number} item Reference to the item index, where
     * this organism is located
     * @param {Function} operatorCls Class of operators
     * @param {Organism} parent Parent organism if cloning is needed
     */
    constructor(id, x, y, item, operatorCls, parent = null) {
        super(EVENT_AMOUNT);

        this._operatorCls = operatorCls;

        if (parent === null) {this._create()}
        else {this._clone(parent)}
        this._id            = id;
        this._x             = x;
        this._y             = y;
        this._iterations    = -1;
        this._changes       = 0;
        this._item          = item;
        this._energyChanges = 0;
        this._fnId          = 0;
    }

    get id()                    {return this._id}
    get x()                     {return this._x}
    get y()                     {return this._y}
    get item()                  {return this._item}
    get iterations()            {return this._iterations}
    get changes()               {return this._changes}
    get mutationProbs()         {return this._mutationProbs}
    get mutationPeriod()        {return this._mutationPeriod}
    get mutationPercent()       {return this._mutationPercent}
    get energy()                {return this._energy}
    get startEnergy()           {return this._startEnergy}
    get color()                 {return this._color}
    get mem()                   {return this._mem}
    get posId()                 {return Helper.posId(this._x, this._y)}

    set x(newX)                 {this._x = newX}
    set y(newY)                 {this._y = newY}
    set mutationPeriod(m)       {this._mutationPeriod = m}
    set mutationPercent(p)      {this._mutationPercent = p}
    set energy(e)               {if (this.vm !== null) { this._energy = e; ++this._energyChanges % UPDATE_COLOR_PERIOD === 0 && this._updateColor()}}
    set startEnergy(e)          {this._startEnergy = e}
    set changes(c)              {this._changes = c}

    /**
     * Runs one code iteration (amount of lines set in Config.codeYieldPeriod) and returns
     * organism destroy state
     * @return {Boolean} false means that organism was destroyed
     */
    run() {
        this._iterations++;
        if (this.onBeforeRun() === false) {return true}
        const lines = this._energy > 0 ? this.onRun() : 0;
        this._updateEnergy();
        if (this._energy > 0) {
            this._updateClone();
            if (this._energy > 0) {
                this.fire(ITERATION, lines, this);
                this._energy > 0 && this._updateAge();
            }
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
            // 'item' will be added after insertion
            iterations          : this._iterations,
            fnId                : this._fnId,
            vm                  : this.vm.serialize(),
            energy              : this._energy,
            startEnergy         : this._startEnergy,
            color               : this._color,
            mutationProbs       : this._mutationProbs,
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
        // 'item' will be added after insertion
        this._iterations           = json.iterations;
        this._fnId                 = json.fnId;
        this.vm.unserialize(json.vm);
        this._energy               = json.energy;
        this._startEnergy          = json.startEnergy;
        this._color                = json.color;
        this._mutationProbs        = json.mutationProbs;
        this._mutationPeriod       = json.mutationPeriod;
        this._mutationPercent      = json.mutationPercent;
        this._mem                  = json.mem.slice();
    }

    // TODO: describe fitness in details
    fitness() {
        // TODO: check these variants
        //return (OConfig.codeMaxSize + 1 - this.vm.size) * (this._energy - this._startEnergy) * (this._changes || 1);
        //return (OConfig.codeMaxSize + 1 - this.vm.size) * (this._energy - this._startEnergy);
        //return (OConfig.codeMaxSize + 1 - this.vm.size) * ((this._energy - this._startEnergy) / this._iterations);
        return this._energy / (this.vm.size || 1);
    }

    destroy() {
        if (this.vm === null) {return}
        this.fire(DESTROY, this);
        this._energy        = 0;
        this._startEnergy   = 0;
        this._item          = null;
        this._mem           = null;
        this._mutationProbs = null;
        this.vm && this.vm.destroy();
        this.vm             = null;
        this._operatorCls   = null;
        this._iterations    = -1;

        super.destroy();
    }

    _create() {
        this.vm                     = new VM(this, this._operatorCls, OConfig.orgOperatorWeights);
        this._energy                = OConfig.orgStartEnergy;
        this._startEnergy           = OConfig.orgStartEnergy;
        this._color                 = Organism.getColor(MAX_COLORS);
        this._mutationProbs         = OConfig.orgMutationProbs.slice();
        this._mutationPeriod        = OConfig.orgRainMutationPeriod;
        this._mutationPercent       = OConfig.orgRainMutationPercent;
        this._mem                   = new Array(Math.pow(2, OConfig.orgMemBits));

        _fill(this._mem, 0);
    }

    _clone(parent) {
        this.vm                     = new VM(this, this._operatorCls, OConfig.orgOperatorWeights, parent.vm);
        this._energy                = parent.energy;
        this._startEnergy           = parent.energy;
        this._color                 = parent.color;
        this._mutationProbs         = parent.mutationProbs.slice();
        this._mutationPeriod        = parent.mutationPeriod;
        this._mutationPercent       = parent.mutationPercent;
        this._mem                   = parent.mem.slice();
    }

    _updateColor() {
        // TODO: implement organism update color logic here
        //this._color = Organism.getColor(MAX_COLORS);
    }

    _updateClone() {
        if (this._iterations > OConfig.orgCloneMinAge && this._energy > OConfig.orgCloneMinEnergy) {this.fire(CLONE, this)}
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
     * This method destroys organisms with zero energy
     * @return {Boolean} false means that organism was destroyed.
     */
    _updateEnergy() {
        //
        // this.vm === null means, that organism has already destroyed
        //
        if (this._energy < 1 && this.vm) {
            this.fire(KILL_NO_ENERGY, this);
            this.destroy();
        }

        return true;
    }
}

module.exports = {EVENTS: ORG_EVENTS, Organism};