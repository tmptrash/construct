/**
 * Base class for organism
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author flatline
 */
const Observer      = require('./../../../../../common/src/Observer');
const Helper        = require('./../../../../../common/src/Helper');
const OConfig       = require('./../../../manager/plugins/organisms/Config');
const EVENTS        = require('./../../../share/Events').EVENTS;
const EVENT_AMOUNT  = require('./../../../share/Events').EVENT_AMOUNT;
const VM            = require('./../../../vm/VM');

const IS_NUM = Helper.isNumeric;

class Organism extends Observer {
    /**
     * Is called before every run. Should return true, if everything
     * is okay and we don't need to interrupt running. If true, then
     * onRun() method will be called as well
     * @abstract
     */
    onBeforeRun() {}

    /**
     * Is called as a running body (main) method
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
     * @param {Function} onCodeEnd Callback, which is called at the
     * end of every code iteration.
     * @param {Function} operatorCls Class of operators
     * @param {Organism} parent Parent organism if cloning is needed
     */
    constructor(id, x, y, alive, item, onCodeEnd, operatorCls, parent = null) {
        super(EVENT_AMOUNT);

        this._onCodeEnd   = onCodeEnd;
        this._operatorCls = operatorCls;

        if (parent === null) {this._create()}
        else {this._clone(parent)}

        this._id          = id;
        this._x           = x;
        this._y           = y;
        this._iterations  = 0;
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
    get clonePeriod()           {return this._clonePeriod}
    get energy()                {return this._energy}
    get color()                 {return this._color}
    get mem()                   {return this._mem}
    get posId()                 {return Helper.posId(this._x, this._y)}

    set x(newX)                 {this._x = newX}
    set y(newY)                 {this._y = newY}
    set cloneMutationPercent(m) {this._cloneMutationPercent = m}
    set cloneEnergyPercent(p)   {this._cloneEnergyPercent = p}
    set clonePeriod(p)          {this._clonePeriod = p}
    set mutationPeriod(m)       {this._mutationPeriod = m}
    set mutationPercent(p)      {this._mutationPercent = p}
    set energy(e)               {this._energy = e}
    set changes(c) {
        this._changes = c;
        this._updateColor(c);
    }

    /**
     * Runs one code iteration (amount of lines set in Config.codeYieldPeriod) and returns
     * organism destroy state
     * @return {Boolean} false means that organism was destroyed
     */
    run() {
        this._iterations++;
        if (this.onBeforeRun() === false) {return true}
        this.onRun();

        if (this.alive) {
            this.vm.size === 0 && this._onCodeEnd(this, 0);
            this._updateClone();
            this.alive && this._updateDestroy();
            this.alive && this._updateEnergy();
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
            color               : this._color,
            mutationProbs       : this._mutationProbs,
            cloneMutationPercent: this._cloneMutationPercent,
            cloneEnergyPercent  : this._cloneEnergyPercent,
            clonePeriod         : this._clonePeriod,
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
        this._color                = json.color;
        this._mutationProbs        = json.mutationProbs;
        this._cloneMutationPercent = json.cloneMutationPercent;
        this._cloneEnergyPercent   = json.cloneEnergyPercent;
        this._clonePeriod          = json.clonePeriod;
        this._mutationPeriod       = json.mutationPeriod;
        this._mutationPercent      = json.mutationPercent;
        this._mem                  = json.mem.slice();
    }

    grabEnergy(amount) {
        if (!IS_NUM(amount)) {return true}
        const noEnergy = (this._energy -= amount) < 1;
        this.fire(EVENTS.GRAB_ENERGY, amount + (noEnergy ? -this._energy : 0));
        noEnergy && this.destroy();
        return !noEnergy;
    }

    fitness() {
        return (OConfig.codeMaxSize - this.vm.size) * this._energy * this._changes;
    }

    destroy() {
        this.fire(EVENTS.DESTROY, this);
        this._alive         = false;
        this._energy        = 0;
        this._item          = null;
        this._mem           = null;
        this._mutationProbs = null;
        this.vm && this.vm.destroy();
        this.vm             = null;
        this._onCodeEnd     = null;
        this._operatorCls   = null;

        super.destroy();
    }

    _updateColor(changes) {
        if ((this._color += changes) > OConfig.ORG_MAX_COLOR) {
            this._color = OConfig.ORG_FIRST_COLOR;
        }
    }

    _create() {
        this.vm                     = new VM(this._onCodeEnd.bind(this, this), this, this._operatorCls);
        this._energy                = OConfig.orgStartEnergy;
        this._color                 = OConfig.orgStartColor;
        this._mutationProbs         = OConfig.orgMutationProbs.slice();
        this._cloneMutationPercent  = OConfig.orgCloneMutationPercent;
        this._cloneEnergyPercent    = OConfig.orgCloneEnergyPercent;
        this._clonePeriod           = OConfig.orgClonePeriod;
        this._mutationPeriod        = OConfig.orgRainMutationPeriod;
        this._mutationPercent       = OConfig.orgRainMutationPercent;
        this._changes               = 1;
        this._mem                   = [];
    }

    _clone(parent) {
        this.vm                     = new VM(this._onCodeEnd.bind(this, this), this, this._operatorCls, parent.vm);
        this._energy                = parent.energy;
        this._color                 = parent.color;
        this._mutationProbs         = parent.mutationProbs.slice();
        this._cloneMutationPercent  = parent.cloneMutationPercent;
        this._cloneEnergyPercent    = parent.cloneEnergyPercent;
        this._clonePeriod           = parent.clonePeriod;
        this._mutationPeriod        = parent.mutationPeriod;
        this._mutationPercent       = parent.mutationPercent;
        this._changes               = parent.changes;
        this._mem                   = parent.mem.slice();
    }

    /**
     * Checks if organism need to be killed/destroyed, because of age or zero energy
     * @return {Boolean} false means that organism was destroyed.
     */
    _updateDestroy() {
        const alivePeriod = OConfig.orgAlivePeriod;
        const needDestroy = this._energy < 1 || this._iterations >= alivePeriod && alivePeriod > 0;

        needDestroy && this.destroy();

        return !needDestroy;
    }

    /**
     * This is how our system grabs an energy from organism every OConfig.orgEnergySpendPeriod
     * period.
     * @return {Boolean} false means that organism was destroyed.
     */
    _updateEnergy() {
        if (this._iterations % OConfig.orgEnergySpendPeriod !== 0 || OConfig.orgEnergySpendPeriod === 0) {return true}
        let grabSize = Math.floor(this.vm.size / OConfig.orgGarbagePeriod);
        if (grabSize < 1) {grabSize = 1}

        return this.grabEnergy(this._energy < grabSize ? this._energy : grabSize);
    }

    /**
     * Current organism wants to clone himself
     * @return {Boolean}
     */
    _updateClone() {
        if (this._iterations % OConfig.orgClonePeriod !== 0 || OConfig.orgClonePeriod === 0) {return true}
        this.fire(EVENTS.CLONE, this);
        return true;
    }
}

module.exports = Organism;