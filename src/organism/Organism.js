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

export default class Organism extends Observer {
    constructor(id, x, y, alive) {
        super();
        this._id                   = id;
        this._x                    = x;
        this._y                    = y;
        this._alive                = alive;

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
        this._compiled             = this._compile(this._code);
        this._gen                  = this._compiled();
        this._events               = Events;
    }

    get alive()          {return this._alive;}
    get x()              {return this._x;}
    get y()              {return this._y;}
    get id()             {return this._id;}
    get age()            {return this._age;}
    get energy()         {return this._energy;}
    get mutationPeriod() {return this._mutationPeriod;}
    get mutations()      {return this._mutations;}

    /**
     * Runs one code iteration and returns
     */
    run() {
        this._gen.next();
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

    /**
     * Does simple preprocessing and final compilation of the code.
     * @private
     */
    _compile() {
        const header1 = 'this.__compiled=function* dna(){var endEvent=this._events.CODE_END;var rand=Math.random;';
        const vars    = this._getVars();
        const header2 = ';while(true){yield;';
        const footer  = ';this.fire(endEvent)}}';

        eval(header1 + vars + header2 + this._code.join(';') + footer);

        return this.__compiled;
    }
}
