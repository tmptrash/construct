/**
 * Digital Organisms Script - (DOS) is a simple language for JSVM.
 * This file contains all available operators implementation. For example:
 * for, if, variable declaration, steps, eating etc... User may override
 * this class for own needs and change operator list to custom.
 *
 * @author DeadbraiN
 */
import {EVENTS}  from '../global/Events';
import {Config}  from '../global/Config';
import Helper    from '../global/Helper';
import Operators from './base/Operators';
import Num       from './Num';

/**
 * {Function} Just a shortcuts
 */
const VAR0                  = Num.getVar;
const VAR1                  = (n) => Num.getVar(n, 1);
const VAR2                  = (n) => Num.getVar(n, 2);
const BITS_AFTER_THREE_VARS = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;
const FOUR_BITS             = 4;
const BLOCK_MAX_LEN         = Config.codeBitsPerBlock;
const BITS_FOR_NUMBER       = 16;
const IS_NUM                = Helper.isNumeric;
const HALF_OF_VAR           = Num.MAX_VAR / 2;
const CONDITION_BITS        = 2;

export default class OperatorsDos extends Operators {
    static version() {
        return '0.1';
    }

    constructor(offs, vars, obs) {
        super(offs, vars, obs);
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
         */
        this._OPERATORS_CB = [
            this.onVar.bind(this),
            //this.onFunc.bind(this),
            this.onCondition.bind(this),
            this.onLoop.bind(this),
            this.onOperator.bind(this),
            this.onNot.bind(this),
            //this.onPi.bind(this),
            //this.onTrig.bind(this),
            this.onLookAt.bind(this),
            this.onEatLeft.bind(this),
            this.onEatRight.bind(this),
            this.onEatUp.bind(this),
            this.onEatDown.bind(this),
            this.onStepLeft.bind(this),
            this.onStepRight.bind(this),
            this.onStepUp.bind(this),
            this.onStepDown.bind(this),
            this.onFromMem.bind(this),
            this.onToMem.bind(this),
            this.onMyX.bind(this),
            this.onMyY.bind(this),
            this.onCheckLeft.bind(this),
            this.onCheckRight.bind(this),
            this.onCheckUp.bind(this),
            this.onCheckDown.bind(this)
        ];
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
        //
        // We have to set amount of available operators for correct
        // working of mutations of operators.
        //
        Num.setOperatorAmount(this._OPERATORS_CB.length);
    }

    destroy() {
        super.destroy();
        this._OPERATORS_CB = null;
        this._CONDITIONS   = null;
        this._OPERATORS    = null;
        //this._TRIGS        = null;
    }

    get operators() {return this._OPERATORS_CB}

    /**
     * Parses variable operator. Format: var = number|var. 'num' bits format:
     * TODO:
     *
     * @param {Num} num Packed into number jsvm line
     * @param {Number} line Current line in jsvm
     * @return {Number} Parsed jsvm line string
     */
    onVar(num, line) {
        const vars = this.vars;
        vars[VAR0(num)] = VAR2(num) < HALF_OF_VAR ? Num.getBits(num, BITS_AFTER_THREE_VARS, BITS_FOR_NUMBER) : vars[VAR1(num)];
        return line + 1;
    }

    //onFunc(num, line) {
    //    return line + 1;
    //}

    onCondition(num, line, org, lines) {
        const val3 = Num.getBits(num, BITS_AFTER_THREE_VARS, BLOCK_MAX_LEN);
        const offs = this._getOffs(line, lines, val3);
        const cond = VAR2(num) >>> (Config.codeBitsPerVar - CONDITION_BITS);

        if (this._CONDITIONS[cond](this.vars[VAR0(num)], this.vars[VAR1(num)])) {
            return line + 1;
        }

        return offs;
    }

    /**
     * for(v0=v1; v0<v2; v0++)
     */
    onLoop(num, line, org, lines, afterIteration = false) {
        const vars = this.vars;
        const var0 = VAR0(num);
        const val3 = Num.getBits(num, BITS_AFTER_THREE_VARS, BLOCK_MAX_LEN);
        const offs = this._getOffs(line, lines, val3);
        //
        // If last iteration has done and we've returned to the line,
        // where "for" operator is located
        //
        if (afterIteration === true) {
            if (++vars[var0] < vars[VAR2(num)]) {
                this.offs.push(line, offs);
                return line + 1;
            }
            return offs;
        }
        //
        // This is first time we are running "for" operator. No
        // iterations hav done, yet
        //
        vars[var0] = vars[VAR1(num)];
        if (vars[var0] < vars[VAR2(num)]) {
            this.offs.push(line, offs);
            return line + 1;
        }

        return offs;
    }

    onOperator(num, line) {
        const vars = this.vars;
        vars[VAR0(num)] = this._OPERATORS[Num.getBits(num, BITS_AFTER_THREE_VARS, FOUR_BITS)](vars[VAR1(num)], vars[VAR2(num)]);
        return line + 1;
    }

    onNot(num, line) {
        this.vars[VAR0(num)] = +!this.vars[VAR1(num)];
        return line + 1;
    }

    //onPi(num, line) {
    //    this.vars[VAR0(num)] = Math.PI;
    //    return line + 1;
    //}

    //onTrig(num, line) {
    //    this.vars[VAR0(num)] = this._TRIGS[VAR2(num)](this.vars[VAR1(num)]);
    //    return line + 1;
    //}

    onLookAt(num, line, org) {
        const vars = this.vars;
        let   x    = vars[VAR1(num)];
        let   y    = vars[VAR2(num)];
        if (!IS_NUM(x) || !IS_NUM(y) || x < 0 || y < 0 || x >= Config.worldWidth || y >= Config.worldHeight) {
            vars[VAR0(num)] = 0;
            return line + 1;
        }

        let ret = {ret: 0};
        this.obs.fire(EVENTS.GET_ENERGY, org, x, y, ret);
        vars[VAR0(num)] = ret.ret;

        return line + 1;
    }

    onEatLeft(num, line, org)   {this.vars[VAR0(num)] = this._eat(org, num, org.x - 1, org.y); return line + 1}
    onEatRight(num, line, org)  {this.vars[VAR0(num)] = this._eat(org, num, org.x + 1, org.y); return line + 1}
    onEatUp(num, line, org)     {this.vars[VAR0(num)] = this._eat(org, num, org.x, org.y - 1); return line + 1}
    onEatDown(num, line, org)   {this.vars[VAR0(num)] = this._eat(org, num, org.x, org.y + 1); return line + 1}

    onStepLeft(num, line, org)  {this.vars[VAR0(num)] = this._step(org, org.x, org.y, org.x - 1, org.y); return line + 1}
    onStepRight(num, line, org) {this.vars[VAR0(num)] = this._step(org, org.x, org.y, org.x + 1, org.y); return line + 1}
    onStepUp(num, line, org)    {this.vars[VAR0(num)] = this._step(org, org.x, org.y, org.x, org.y - 1); return line + 1}
    onStepDown(num, line, org)  {this.vars[VAR0(num)] = this._step(org, org.x, org.y, org.x, org.y + 1); return line + 1}

    onFromMem(num, line, org) {this.vars[VAR0(num)] = org.mem.pop() || 0; return line + 1}
    onToMem(num, line, org) {
        const val = this.vars[VAR1(num)];

        if (IS_NUM(val) && org.mem.length < Config.orgMemSize) {
            this.vars[VAR0(num)] = org.mem.push(val);
        } else {
            this.vars[VAR0(num)] = 0;
        }

        return line + 1;
    }

    onMyX(num, line, org) {this.vars[VAR0(num)] = org.x; return line + 1}
    onMyY(num, line, org) {this.vars[VAR0(num)] = org.y; return line + 1;}

    onCheckLeft(num, line, org)  {return this._checkAt(num, line, org, org.x - 1, org.y)}
    onCheckRight(num, line, org) {return this._checkAt(num, line, org, org.x + 1, org.y)}
    onCheckUp(num, line, org)    {return this._checkAt(num, line, org, org.x, org.y - 1)}
    onCheckDown(num, line, org)  {return this._checkAt(num, line, org, org.x, org.y + 1)}

    _checkAt(num, line, org, x, y) {
        const ret = {ret: 0};
        org.fire(EVENTS.CHECK_AT, x, y, ret);
        this.vars[VAR0(num)] = ret.ret;
        return line + 1;
    }

    _eat(org, num, x, y) {
        const vars   = this.vars;
        const amount = vars[VAR1(num)];
        if (!IS_NUM(amount) || amount === 0) {return 0}

        let ret = {ret: amount};
        this.obs.fire(EVENTS.EAT, org, x, y, ret);
        if (!IS_NUM(ret.ret)) {return 0}
        org.energy += ret.ret;

        return ret.ret;
    }

    _step(org, x1, y1, x2, y2) {
        let ret = {ret: 0};
        [x2, y2] = Helper.normalize(x2, y2);
        this.obs.fire(EVENTS.STEP, org, x1, y1, x2, y2, ret);
        if (ret.ret > 0) {
            org.x = x2;
            org.y = y2;
        }
        return ret.ret;
    }

    /**
     * Returns offset for closing bracket of blocked operators like
     * "if", "for" and so on. These operators shouldn't overlap each
     * other. for example:
     *
     *     for (...) {     // 0
     *         if (...) {  // 1
     *             ...     // 2
     *         }           // 3
     *     }               // 4
     *
     * Closing bracket in line 3 shouldn't be after bracket in line 4.
     * So it's possible to set it to one of  1...3. So we change it in
     * real time to fix the overlap problem.
     * @param {Number} line Current line index
     * @param {Number} lines Amount of lines
     * @param {Number} offs Local offset of closing bracket we want to set
     * @returns {Number}
     * @private
     */
    _getOffs(line, lines, offs) {
        let   offset  = line + offs < lines ? line + offs + 1 : lines;
        const offsets = this.offs;
        const length  = offsets.length;

        if (length > 0 && offset >= offsets[length - 1]) {
            return offsets[length - 1];
        }

        return offset;
    }
}