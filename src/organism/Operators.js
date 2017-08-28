/**
 * This file contains all available operators implementation. For example:
 * for, if, variable declaration, steps, eating etc... User may override
 * this class for own needs and change operator list to custom.
 *
 * @author DeadbraiN
 */
import Helper from './../global/Helper';
import Events from './../global/Events';
import Config from './../global/Config';
import Num    from './Num';

/**
 * {Function} Just a shortcuts
 */
const VAR0                  = Num.getVar;
const VAR1                  = (n) => Num.getVar(n, 1);
const VAR2                  = (n) => Num.getVar(n, 2);
const BITS_AFTER_THREE_VARS = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;
const BITS_WITHOUT_2_VARS   = Num.BITS_WITHOUT_2_VARS;
const BITS_OF_TWO_VARS      = Num.BITS_OF_TWO_VARS;
const IS_NUM                = $.isNumeric;
const HALF_OF_VAR           = Num.MAX_VAR / 2;

export default class Operators {
    constructor(offsets, vars, obs) {
        /**
         * {Array} Array of offsets for closing braces. For 'for', 'if'
         * and all block operators.
         */
        this._offsets = offsets;
        /**
         * {Array} Available variables
         */
        this._vars = vars;
        /**
         * {Observer} Observer for sending events outside of the code
         */
        this._obs = obs;
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
         */
        this._OPERATORS_CB = {
            0 : this.onVar.bind(this),
            //1: this.onFunc.bind(this),
            1 : this.onCondition.bind(this),
            2 : this.onLoop.bind(this),
            3 : this.onOperator.bind(this),
            4 : this.onNot.bind(this),
            //5 : this.onPi.bind(this),
            //6 : this.onTrig.bind(this),
            5 : this.onLookAt.bind(this),
            6 : this.onEatLeft.bind(this),
            7 : this.onEatRight.bind(this),
            8 : this.onEatUp.bind(this),
            9 : this.onEatDown.bind(this),
            10: this.onStepLeft.bind(this),
            11: this.onStepRight.bind(this),
            12: this.onStepUp.bind(this),
            13: this.onStepDown.bind(this),
            14: this.onFromMem.bind(this),
            15: this.onToMem.bind(this),
            16: this.onMyX.bind(this),
            17: this.onMyY.bind(this),
            18: this.onCheckLeft.bind(this),
            19: this.onCheckRight.bind(this),
            20: this.onCheckUp.bind(this),
            21: this.onCheckDown.bind(this)
        };
        this._OPERATORS_CB_LEN = Object.keys(this._OPERATORS_CB).length;
        /**
         * {Array} Available conditions for if operator. Amount should be
         * the same like (1 << BITS_PER_VAR)
         */
        this._CONDITIONS = [(a,b)=>a<b, (a,b)=>a>b, (a,b)=>a==b, (a,b)=>a!=b];
        /**
         * {Array} Available operators for math calculations
         */
        this._OPERATORS = [
            (a,b)=>a+b, (a,b)=>a-b, (a,b)=>a*b, (a,b)=>a/b, (a,b)=>a%b, (a,b)=>a&b, (a,b)=>a|b, (a,b)=>a^b, (a,b)=>a>>b, (a,b)=>a<<b, (a,b)=>a>>>b, (a,b)=>+(a<b), (a,b)=>+(a>b), (a,b)=>+(a==b), (a,b)=>+(a!=b), (a,b)=>+(a<=b)
        ];
        //this._TRIGS = [(a)=>Math.sin(a), (a)=>Math.cos(a), (a)=>Math.tan(a), (a)=>Math.abs(a)];

        Num.setOperatorAmount(this._OPERATORS_CB_LEN);
    }

    destroy() {
        this._offsets      = null;
        this._OPERATORS_CB = null;
        this._CONDITIONS   = null;
        this._OPERATORS    = null;
        //this._TRIGS        = null;
    }

    get operators() {return this._OPERATORS_CB;}
    get size()      {return this._OPERATORS_CB_LEN;}

    /**
     * Parses variable operator. Format: let = const|number. Num bits format:
     *   BITS_PER_OPERATOR bits - operator id
     *   BITS_PER_VAR bits  - destination var index
     *   BITS_PER_VAR bits  - assign type (const (half of bits) or variable (half of bits))
     *   BITS_PER_VAR bits  - variable index or all bits till the end for constant
     *
     * @param {Num} num Packed into number code line
     * @param {Number} line Current line in code
     * @return {Number} Parsed code line string
     */
    onVar(num, line) {
        const vars = this._vars;
        const var1 = VAR1(num);
        vars[VAR0(num)] = var1 >= HALF_OF_VAR ? Num.getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS) : vars[var1];

        return line + 1;
    }

    //onFunc(num, line) {
    //    return line + 1;
    //}

    onCondition(num, line, org, lines) {
        const val3 = Num.getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS);
        const offs = line + val3 < lines ? line + val3 + 1 : lines;

        if (this._CONDITIONS[VAR2(num)](this._vars[VAR0(num)], this._vars[VAR1(num)])) {
            return line + 1;
        }

        return offs;
    }

    onLoop(num, line, org, lines, ret) {
        const vars = this._vars;
        const var0 = VAR0(num);
        const val3 = Num.getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS);
        const offs = line + val3 < lines ? line + val3 + 1 : lines;

        if (ret) {
            if (++vars[var0] < vars[VAR2(num)]) {
                this._offsets.push(line, offs);
                return line + 1;
            }
            return offs;
        }

        vars[var0] = vars[VAR1(num)];
        if (vars[var0] < vars[VAR2(num)]) {
            this._offsets.push(line, offs);
            return line + 1;
        }

        return offs;
    }

    onOperator(num, line) {
        const vars = this._vars;
        vars[VAR0(num)] = this._OPERATORS[Num.getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS)](vars[VAR1(num)], vars[VAR2(num)]);
        return line + 1;
    }

    onNot(num, line) {
        this._vars[VAR0(num)] = +!this._vars[VAR1(num)];
        return line + 1;
    }

    //onPi(num, line) {
    //    this._vars[VAR0(num)] = Math.PI;
    //    return line + 1;
    //}

    //onTrig(num, line) {
    //    this._vars[VAR0(num)] = this._TRIGS[VAR2(num)](this._vars[VAR1(num)]);
    //    return line + 1;
    //}

    onLookAt(num, line, org) {
        const vars = this._vars;
        let   x    = vars[VAR1(num)];
        let   y    = vars[VAR2(num)];
        if (!IS_NUM(x) || !IS_NUM(y) || x < 0 || y < 0 || x >= Config.worldWidth || y >= Config.worldHeight) {
            vars[VAR0(num)] = 0;
            return line + 1;
        }

        let ret = {ret: 0};
        this._obs.fire(Events.GET_ENERGY, org, x, y, ret);
        vars[VAR0(num)] = ret.ret;

        return line + 1;
    }

    onEatLeft(num, line, org)   {this._vars[VAR0(num)] = this._eat(org, num, org.x - 1, org.y); return line + 1}
    onEatRight(num, line, org)  {this._vars[VAR0(num)] = this._eat(org, num, org.x + 1, org.y); return line + 1}
    onEatUp(num, line, org)     {this._vars[VAR0(num)] = this._eat(org, num, org.x, org.y - 1); return line + 1}
    onEatDown(num, line, org)   {this._vars[VAR0(num)] = this._eat(org, num, org.x, org.y + 1); return line + 1}

    onStepLeft(num, line, org)  {this._vars[VAR0(num)] = this._step(org, org.x, org.y, org.x - 1, org.y); return line + 1}
    onStepRight(num, line, org) {this._vars[VAR0(num)] = this._step(org, org.x, org.y, org.x + 1, org.y); return line + 1}
    onStepUp(num, line, org)    {this._vars[VAR0(num)] = this._step(org, org.x, org.y, org.x, org.y - 1); return line + 1}
    onStepDown(num, line, org)  {this._vars[VAR0(num)] = this._step(org, org.x, org.y, org.x, org.y + 1); return line + 1}

    onFromMem(num, line, org) {this._vars[VAR0(num)] = org.mem.pop() || 0; return line + 1}
    onToMem(num, line, org) {
        const val = this._vars[VAR1(num)];

        if (IS_NUM(val) && org.mem.length < Config.orgMemSize) {
            this._vars[VAR0(num)] = org.mem.push(val);
        } else {
            this._vars[VAR0(num)] = 0;
        }

        return line + 1;
    }

    onMyX(num, line, org) {this._vars[VAR0(num)] = org.x; return line + 1}
    onMyY(num, line, org) {this._vars[VAR0(num)] = org.y; return line + 1;}

    onCheckLeft(num, line, org)  {return this._checkAt(num, line, org, org.x - 1, org.y)}
    onCheckRight(num, line, org) {return this._checkAt(num, line, org, org.x + 1, org.y)}
    onCheckUp(num, line, org)    {return this._checkAt(num, line, org, org.x, org.y - 1)}
    onCheckDown(num, line, org)  {return this._checkAt(num, line, org, org.x, org.y + 1)}

    _checkAt(num, line, org, x, y) {
        const ret = {ret: 0};
        org.fire(Events.CHECK_AT, x, y, ret);
        this._vars[VAR0(num)] = ret.ret;
        return line + 1;
    }

    _eat(org, num, x, y) {
        const vars   = this._vars;
        const amount = vars[VAR1(num)];
        if (!IS_NUM(amount) || amount === 0) {return 0}

        let ret = {ret: amount};
        this._obs.fire(Events.EAT, org, x, y, ret);
        if (!IS_NUM(ret.ret)) {return 0}
        org.energy += ret.ret;

        return ret.ret;
    }

    _step(org, x1, y1, x2, y2) {
        let ret = {ret: 0};
        this._obs.fire(Events.STEP, org, x1, y1, x2, y2, ret);
        return ret.ret;
    }
}