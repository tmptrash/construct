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

export default class Organism extends Observer {
    constructor(id, x, y, alive) {
        super();
        this._EXCLUDE_ON_CLONE     = {
            '_id'       : true,
            '_x'        : true,
            '_y'        : true,
            '_item'     : true,
            '_mutations': true,
            '_age'      : true,
            '_varId'    : true,
            '_fnId'     : true
        };
        this._id                   = id;
        this._x                    = x;
        this._y                    = y;
        this._alive                = alive;
        this._item                 = null;

        this._mutationProbs        = Config.orgMutationProbs;
        this._mutationClonePercent = Config.orgCloneMutation;
        this._mutationPeriod       = Config.orgRainMutationPeriod;
        this._mutationPercent      = Config.orgRainMutationPercent;
        this._mutations            = 1;
        this._energy               = Config.orgStartEnergy;
        this._color                = Config.orgStartColor;
        this._mem                  = new Stack(Config.orgMemSize);
        this._age                  = 0;
        this._cloneEnergyPercent   = Config.orgCloneEnergyPercent;
        this._varId                = 0;
        this._fnId                 = 0;
        this._code                 = [];
        this._compiled             = this.compile(this._code);
        this._gen                  = this._compiled();
        this._events               = Events;
    }

    get alive()              {return this._alive;}
    get x()                  {return this._x;}
    get y()                  {return this._y;}
    get id()                 {return this._id;}
    get age()                {return this._age;}
    get energy()             {return this._energy;}
    get mutationPeriod()     {return this._mutationPeriod;}
    get mutations()          {return this._mutations;}
    get posId()              {return Helper.posId(this._y, this._x);}
    get item()               {return this._item;}
    get cloneEnergyPercent() {return this._cloneEnergyPercent;}
    get color()              {return this._color;}

    set item(it)             {this._item = it;}
    set mem(m)               {this._mem = m;}
    set code(c)              {this._code = c;}
    set compiled(c)          {this._compiled = c;}
    set gen(g)               {this._gen = g;}

    /**
     * Runs one code iteration and returns
     * @return {Boolean} false means that organism was destroyed
     */
    run() {
        this._gen.next();
        return this._updateDestroy() && this._updateEnergy();
    }

    /**
     * Does the clone of this organism to the child
     * @param {Organism} child Destination organism
     */
    clone(child) {
        const exclude = this._EXCLUDE_ON_CLONE;

        for (let p in this) {
            if (this.hasOwnProperty(p) && exclude[p] === undefined) {child[p] = this[p];}
        }
        child.mem      = this._mem.clone();
        child.code     = this._code.splice();
        child.compiled = child.compile(this._code);
        child.gen      = child._compiled();
    }

    /**
     * Does simple pre processing and final compilation of the code.
     */
    compile() {
        const header1 = 'this.__compiled=function* dna(){if (!this) {debugger;}; var endEvent=this._events.CODE_END;var rand=Math.random;';
        const vars    = this._getVars();
        const header2 = ';while(true){yield;';
        const footer  = ';this._age++;this.fire(endEvent)}}';

        eval(header1 + vars + header2 + this._code.join(';') + footer);

        return this.__compiled;
    }

    grabEnergy(amount) {
        if ((this._energy -= amount) < 1) {
            this.destroy();
            return false;
        }

        return true;
    }

    destroy() {
        this.fire(Events.DESTROY, this);
        this._mem      = null;
        this._code     = null;
        this._gen      = null;
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

    /**
     * Checks if organism need to be killed/destroyed, because of age or zero energy
     * @return {Boolean} false means that organism was destroyed.
     * @private
     */
    _updateDestroy() {
        const alivePeriod = Config.orgAlivePeriod;

        if (this._energy < 1 || alivePeriod > 0 && this._age > alivePeriod) {
            this.destroy();
            return false;
        }

        return true;
    }

    /**
     * This is how our system grabs an energy from organism if it's age is
     * divided into Config.orgEnergySpendPeriod.
     * @return {Boolean} false means that organism was destroyed.
     * @private
     */
    _updateEnergy() {
        if (Config.orgEnergySpendPeriod === 0 || this._age % Config.orgEnergySpendPeriod !== 0) {return true;}
        let codeSize = this._code.length;
        let decrease = Math.round(codeSize / Config.orgGarbagePeriod);
        let grabSize;

        if (codeSize > Config.codeMaxSize) {grabSize = codeSize * Config.codeSizeCoef;}
        else {grabSize = decrease;}
        if (grabSize < 1) {grabSize = 1;}
        grabSize = Math.min(this._energy, grabSize);
        this.fire(Events.GRAB_ENERGY, grabSize);

        return this.grabEnergy(grabSize);
    }

    /**
     * Generates default variables code. It should be in ES5 version, because
     * speed is important. Amount of vars depends on Config.codeVarAmount config.
     * @returns {String} vars code
     * @private
     */
    _getVars() {
        const vars  = Config.codeVarAmount;
        let   code  = new Array(vars);
        const range = Config.codeVarInitRange;
        const half  = range / 2;
        const rand  = '=rand()*' + range + '-' + half;

        for (let i = 0; i < vars; i++) {
            code[i] = 'var v' + (++this._varId) + rand;
        }

        return code.join(';');
    }
}
