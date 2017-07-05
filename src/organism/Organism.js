/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author DeadbraiN
 */
import Config   from './../global/Config';
import Stack    from './../global/Stack';
import Observer from './../global/Observer';
import Events   from './../global/Events';
import Helper   from './../global/Helper';
import Code     from './Code';

export default class Organism extends Observer {
    /**
     * Creates organism instance. If parent parameter is set, then
     * a clone of parent organism will be created.
     * @param {String} id Unique identifier of organism
     * @param {Number} x Unique X coordinate
     * @param {Number} y Unique Y coordinate
     * @param {Boolean} alive true if organism is alive
     * @param {Object} item Reference to the Queue item, where
     * this organism is located
	 * @param {Function} codeEndCb Callback, which is called at the 
     * end of every code iteration.
     * @param {Organism} parent Parent organism if cloning is needed
     */
    constructor(id, x, y, alive, item, codeEndCb, parent = null) {
        super();

        this._code                  = new Code(this._onCodeEnd.bind(this));

        if (parent === null) {this._create();}
        else {this._clone(parent);}

        this._id                    = id;
        this._x                     = x;
        this._y                     = y;
        this._alive                 = alive;
        this._item                  = item;

        this._mutationProbs         = Config.orgMutationProbs;
        this._mutationClonePercent  = Config.orgCloneMutation;
        this._mutationPeriod        = Config.orgRainMutationPeriod;
        this._mutationPercent       = Config.orgRainMutationPercent;
        this._mutations             = 1;
        this._energy                = Config.orgStartEnergy;
        this._color                 = Config.orgStartColor;
        this._age                   = 0;
        this._cloneEnergyPercent    = Config.orgCloneEnergyPercent;
        this._fnId                  = 0;
        this._codeEndCb             = codeEndCb;
    }

    get id()                    {return this._id;}
    get x()                     {return this._x;}
    get y()                     {return this._y;}
    get alive()                 {return this._alive;}
    get item()                  {return this._item;}
    get mutationProbs()         {return this._mutationProbs;}
    get mutationPeriod()        {return this._mutationPeriod;}
    get mutationPercent()       {return this._mutationPercent;}
    get mutationClonePercent()  {return this._mutationClonePercent;}
    get mutations()             {return this._mutations;}
    get energy()                {return this._energy;}
    get color()                 {return this._color;}
    get mem()                   {return this._mem;}
    get age()                   {return this._age;}
    get cloneEnergyPercent()    {return this._cloneEnergyPercent;}
    get code()                  {return this._code;}
    get posId()                 {return Helper.posId(this._x, this._y);}

    set mutationClonePercent(m) {this._mutationClonePercent = m;}
    set mutationPeriod(m)       {this._mutationPeriod = m;}
    set mutationPercent(p)      {this._mutationPercent = p;}
    set cloneEnergyPercent(p)   {this._cloneEnergyPercent = p;}
    set mutations(m)            {
        this._mutations = m;
        this._updateColor(m);
    }

    /**
     * Runs one code iteration and returns
     * @return {Boolean} false means that organism was destroyed
     */
    run() {
        this._code.run();
        return this._updateDestroy() && this._updateEnergy();
    }

    _onCodeEnd() {
		this._age++;
		this._codeEndCb(this);
	}

    _updateColor(mutAmount) {
        const mutations = this._mutations;
        const colPeriod = Config.orgColorPeriod;
        const colIndex  = mutations - (mutations % colPeriod);

        if (mutations > colPeriod && colIndex >= mutations - mutAmount && colIndex <= mutations) {
            if (++this._color > Config.ORG_MAX_COLOR) {this._color = Config.ORG_FIRST_COLOR;}
        }
    }

    grabEnergy(amount) {
        const noEnergy = (this._energy -= amount) < 1;
        noEnergy && this.destroy();
        return !noEnergy;
    }

    destroy() {
        this.fire(Events.DESTROY, this);
        this._alive    = false;
        this._energy   = 0;
        this._item     = null;
        this._mem      = null;
        this._code     = null;
        this.clear();
    }

    getEnergy() {}
    eatLeft() {}
    eatRight() {}
    eatUp() {}
    eatDown() {}
    stepLeft() {}
    stepRight() {}
    stepUp() {}
    stepDown() {}
    energyLeft() {}
    energyRight() {}
    energyUp() {}
    energyDown() {}
    getId() {}

    _create() {
        this._mem = new Stack(Config.orgMemSize);
    }

    _clone(parent) {
        this._mem = parent.mem.clone();
        this._code.clone(parent.code);
    }

    /**
     * Checks if organism need to be killed/destroyed, because of age or zero energy
     * @return {Boolean} false means that organism was destroyed.
     * @private
     */
    _updateDestroy() {
        const alivePeriod = Config.orgAlivePeriod;
        const needDestroy = this._energy < 1 || alivePeriod > 0 && this._age >= alivePeriod;

        needDestroy && this.destroy();

        return !needDestroy;
    }

    /**
     * This is how our system grabs an energy from organism if it's age is
     * divided into Config.orgEnergySpendPeriod.
     * @return {Boolean} false means that organism was destroyed.
     * @private
     */
    _updateEnergy() {
        if (Config.orgEnergySpendPeriod === 0 || this._age % Config.orgEnergySpendPeriod !== 0) {return true;}
        const codeSize = this._code.size;
        let   grabSize = (((codeSize / Config.orgGarbagePeriod) + 0.5) << 1) >> 1; // analog of Math.round()

        if (codeSize > Config.codeMaxSize) {grabSize = codeSize * Config.codeSizeCoef;}
        if (grabSize < 1) {grabSize = 1;}
        grabSize = Math.min(this._energy, grabSize);
        this.fire(Events.GRAB_ENERGY, grabSize);

        return this.grabEnergy(grabSize);
    }
}