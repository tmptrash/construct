/**
 * Digital Organisms Script - (DOS) is a simple language for VM.
 * This file contains all available operators implementation. For example:
 * for, if, variable declaration, steps, eating etc... User may override
 * this class for own needs and change operator list to custom.
 *
 * @author flatline
 */
const Helper    = require('./../../../../../../common/src/Helper');
const EVENTS    = require('./../../../../../src/share/Events').EVENTS;
const OConfig   = require('./../Config');
const Operators = require('./../../../../vm/Operators');
const Num       = require('./../../../../vm/Num');

/**
 * {Function} Is created to speed up this function call. constants are run
 * much faster, then Helper.normalize()
 */
const IN_WORLD              = Helper.inWorld;
const IS_FINITE             = Number.isFinite;
const IS_NAN                = Number.isNaN;
/**
 * {Function} Just a shortcuts
 */
const FOUR_BITS             = 4;
const CONDITION_BITS        = 2;
const MAX_VAL               = Number.MAX_VALUE;
/**
 * {Array} Available conditions for if operator. Amount should be
 * the same like (1 << Num.BITS_PER_VAR)
 */
const CONDITIONS = [(a,b)=>a<b, (a,b)=>a>b, (a,b)=>a===b, (a,b)=>a!==b];
/**
 * {Array} Available operators for math calculations
 */
const OPERATORS = [
    (a,b) => {const v=a+b; return IS_FINITE(v)?v:MAX_VAL},
    (a,b) => {const v=a-b; return IS_FINITE(v)?v:-MAX_VAL},
    (a,b) => {const v=a*b; return IS_FINITE(v)?v:MAX_VAL},
    (a,b) => {const v=a/b; return IS_FINITE(v)?v:MAX_VAL},
    (a,b) => {const v=a%b; return IS_NAN(v)?0:v},
    (a,b) => a&b,
    (a,b) => a|b,
    (a,b) => a^b,
    (a,b) => a>>b,
    (a,b) => a<<b,
    (a,b) => a>>>b,
    (a,b) => +(a<b),
    (a,b) => +(a>b),
    (a,b) => +(a===b),
    (a,b) => +(a!==b),
    (a,b) => +(a<=b)
];

class OperatorsDos extends Operators {
    constructor(offs, vars, obs) {
        super(offs, vars, obs);
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
         */
        this._OPERATORS_CB = [
            this.onVar.bind(this),
            this.onConst.bind(this),
            this.onCondition.bind(this),
            this.onLoop.bind(this),
            this.onOperator.bind(this),
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
         * {Object} Reusable object to pass it as a parameter to this.fire(..., ret)
         */
        this._ret = {ret: 0, x: 0, y: 0};
        //
        // We have to set amount of available operators for correct
        // working of mutations of operators.
        //
        Num.init(this._OPERATORS_CB.length);

        this._BITS_AFTER_ONE_VAR    = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR;
        this._BITS_AFTER_TWO_VARS   = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 2;
        this._BITS_AFTER_THREE_VARS = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;
    }

    destroy() {
        super.destroy();
        this._OPERATORS_CB = null;
    }

    get operators() {return this._OPERATORS_CB}

    /**
     * Handler of variable assignment operator. 'xx' means, that amount of
     * bits depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     * bits  :        8 xx xx
     * number: 00000000 00 01...
     * desc  :      var  v0 v1
     * string: v0 = v1
     *
     * @param {Number} num One bit packed byte code row
     * @param {Number} line Current line in DOS code
     * @return {Number} Next line number to proceed
     */
    onVar(num, line) {
        this.vars[Num.getVar0(num)] = this.vars[Num.getVar1(num)];
        return ++line;
    }

    /**
     * Handler of numeric constant assignment operator. 'xx' means, that amount of
     * bits depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     * bits  :        8 xx xx
     * number: 00000001 00 01...
     * desc  :    const v0  1
     * string: v0 = 1
     *
     * @param {Number} num One bit packed byte code row
     * @param {Number} line Current line in DOS code
     * @return {Number} Next line number to proceed
     */
    onConst(num, line) {
        this.vars[Num.getVar0(num)] = Num.getBits(num, this._BITS_AFTER_ONE_VAR, OConfig.codeConstBits);
        return ++line;
    }

    /**
     * Handler of 'if' operator. 'xx' means, that amount of bits depends on
     * configuration. '...' means, that all other bits are
     * ignored. Offset of closing bracket means row number after, which this
     * bracket will be added. Offset of closing bracket is calculating using
     * formula: line + offs. Example:
     * bits  :        8 xx xx  2 xx
     * number: 00000010 00 01 00 00...
     * desc  :       if v0 v1  <  }
     * string: if (v0 < v1) {}
     *
     * @param {Number} num One bit packed byte code row
     * @param {Number} line Current line in DOS code
     * @return {Number} Next line number to proceed
     */
    onCondition(num, line) {
        const cond = Num.getBits(num, this._BITS_AFTER_TWO_VARS, CONDITION_BITS);
        const offs = this._getOffs(line, Num.getBits(num, this._BITS_AFTER_TWO_VARS + CONDITION_BITS, OConfig.codeBitsPerBlock));

        if (CONDITIONS[cond](this.vars[Num.getVar0(num)], this.vars[Num.getVar1(num)])) {
            this.offs.push(offs, offs);
            return ++line;
        }

        return offs;
    }

    /**
     * while(v0 op v1) goto offs
     */
    onLoop(num, line) {
        const cond = Num.getBits(num, this._BITS_AFTER_TWO_VARS, CONDITION_BITS);
        const offs = this._getOffs(line, Num.getBits(num, this._BITS_AFTER_TWO_VARS + CONDITION_BITS, OConfig.codeBitsPerBlock));

        if (CONDITIONS[cond](this.vars[Num.getVar0(num)], this.vars[Num.getVar1(num)])) {
            this.offs.push(line, offs);
            return ++line;
        }

        return offs;
    }

    onOperator(num, line) {
        const vars = this.vars;
        vars[Num.getVar0(num)] = OPERATORS[Num.getBits(num, this._BITS_AFTER_THREE_VARS, FOUR_BITS)](vars[Num.getVar1(num)], vars[Num.getVar2(num)]);
        return ++line;
    }

    onLookAt(num, line) {
        const vars = this.vars;
        const x    = (vars[Num.getVar1(num)] + .5) << 0;
        const y    = (vars[Num.getVar2(num)] + .5) << 0;

        if (IN_WORLD(x, y)) {
            this.obs.fire(EVENTS.GET_ENERGY, x, y, this._ret);
            vars[Num.getVar0(num)] = this._ret.ret;
            return ++line;
        }

        vars[Num.getVar0(num)] = 0;
        return ++line;
    }

    onEatLeft(num, line, org)   {this.vars[Num.getVar0(num)] = this._eat(org, num, org.x - 1, org.y); return ++line}
    onEatRight(num, line, org)  {this.vars[Num.getVar0(num)] = this._eat(org, num, org.x + 1, org.y); return ++line}
    onEatUp(num, line, org)     {this.vars[Num.getVar0(num)] = this._eat(org, num, org.x, org.y - 1); return ++line}
    onEatDown(num, line, org)   {this.vars[Num.getVar0(num)] = this._eat(org, num, org.x, org.y + 1); return ++line}

    onStepLeft(num, line, org)  {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x - 1, org.y); return ++line}
    onStepRight(num, line, org) {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x + 1, org.y); return ++line}
    onStepUp(num, line, org)    {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x, org.y - 1); return ++line}
    onStepDown(num, line, org)  {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x, org.y + 1); return ++line}

    onFromMem(num, line, org) {
        if (Num.getBits(num, this._BITS_AFTER_TWO_VARS, 1)) {
            const offs = (this.vars[Num.getVar1(num)] + .5) << 0;
            this.vars[Num.getVar0(num)] = org.mem[offs >= org.mem.length || offs < 0 ? 0 : offs];
            return ++line;
        }

        this.vars[Num.getVar0(num)] = org.mem[Num.getBits(num, this._BITS_AFTER_TWO_VARS + 1, OConfig.orgMemBits)];
        return ++line;
    }
    onToMem(num, line, org) {
        if (Num.getBits(num, this._BITS_AFTER_TWO_VARS, 1)) {
            const offs = (this.vars[Num.getVar0(num)] + .5) << 0;
            org.mem[offs >= org.mem.length || offs < 0 ? 0 : offs] = this.vars[Num.getVar1(num)];
            return ++line;
        }

        org.mem[Num.getBits(num, this._BITS_AFTER_TWO_VARS + 1, OConfig.orgMemBits)] = this.vars[Num.getVar0(num)];
        return ++line;
    }

    onMyX(num, line, org) {this.vars[Num.getVar0(num)] = org.x; return ++line}
    onMyY(num, line, org) {this.vars[Num.getVar0(num)] = org.y; return ++line}

    onCheckLeft(num, line, org)  {return this._checkAt(num, line, org.x - 1, org.y)}
    onCheckRight(num, line, org) {return this._checkAt(num, line, org.x + 1, org.y)}
    onCheckUp(num, line, org)    {return this._checkAt(num, line, org.x, org.y - 1)}
    onCheckDown(num, line, org)  {return this._checkAt(num, line, org.x, org.y + 1)}

    _checkAt(num, line, x, y) {
        this.obs.fire(EVENTS.CHECK_AT, x, y, this._ret);
        this.vars[Num.getVar0(num)] = this._ret.ret;
        return ++line;
    }

    _eat(org, num, x, y) {
        const amount = this.vars[Num.getVar1(num)];
        if (amount === 0) {return 0}
        const ret    = this._ret;

        ret.ret = amount;
        this.obs.fire(EVENTS.EAT, org, x, y, ret);
        org.energy += ret.ret;

        return ret.ret;
    }

    _step(org, x1, y1, x2, y2) {
        this.obs.fire(EVENTS.STEP, org, x1, y1, x2, y2);
        return +(org.energy > 0);
    }

    /**
     * Returns offset for closing bracket of block operators like
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
     * @param {Number} offs Local offset of closing bracket we want to set
     * @returns {Number}
     */
    _getOffs(line, offs) {
        const offsets = this.offs || [0];
        return line + offs > offsets[offsets.length - 1] ? offsets[offsets.length - 1] : line + offs + 1;
    }
}

module.exports = OperatorsDos;