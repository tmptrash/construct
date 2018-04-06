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

class OperatorsDos extends Operators {
    static compile() {
        const bitsPerOp = OConfig.codeBitsPerOperator;
        this.OPERATOR_AMOUNT = 12;
        //
        // IMPORTANT: don't use super here, because it breaks Operators
        // IMPORTANT: class internal logic. Operators.global will be point
        // IMPORTANT: to the Window
        //
        Operators.compile(this.OPERATOR_AMOUNT);

        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 3));

        this._compileLookAt();
    }

    /**
     * Compiles all variants of lookAt operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6 xx xx xx  4
     * number: 101011 00 01 00 01...
     * string: v0 = lookAt(v1, v0)
     */
    static _compileLookAt() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = this._toHexNum;
        const b      = this._toBinStr;
        const vars   = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            for (let v1 = 0; v1 < vars; v1++) {
                for (let v2 = 0; v2 < vars; v2++) {
                    eval(`OperatorsDos.global.fn = function (line) {
                        const vars  = this.vars;
                        const x     = (vars[${v1}] + .5) << 0;
                        const y     = (vars[${v2}] + .5) << 0;
                        vars[${v0}] = (IN_WORLD(x, y) ? (this._positions[x][y] <= 0 ? this._world.data[x][y] : this._positions[x][y].energy) : 0);
                        return ++line;
                    }`);
                    ops[h(`${'101011'}${b(v0, bpv)}${b(v1, bpv)}${b(v2, bpv)}`)] = this.global.fn;
                }
            }
        }
    }

    constructor(offs, vars, obs) {
        super(offs, vars, obs);
        /**
         * {Object} These operator handlers should return next script line
         * number VM should step to
         * TODO: will be removed
         */
        // this._OPERATORS_CB = [
        //     this.onVar.bind(this),
        //     this.onConst.bind(this),
        //     this.onCondition.bind(this),
        //     this.onLoop.bind(this),
        //     this.onOperator.bind(this),
        //     this.onLookAt.bind(this),
        //     this.onEatLeft.bind(this),
        //     this.onEatRight.bind(this),
        //     this.onEatUp.bind(this),
        //     this.onEatDown.bind(this),
        //     this.onStepLeft.bind(this),
        //     this.onStepRight.bind(this),
        //     this.onStepUp.bind(this),
        //     this.onStepDown.bind(this),
        //     this.onFromMem.bind(this),
        //     this.onToMem.bind(this),
        //     this.onMyX.bind(this),
        //     this.onMyY.bind(this),
        //     this.onCheckLeft.bind(this),
        //     this.onCheckRight.bind(this),
        //     this.onCheckUp.bind(this),
        //     this.onCheckDown.bind(this)
        // ];
        /**
         * {Object} Reusable object to pass it as a parameter to this.fire(..., ret)
         * TODO: should be removed, because this class should have references to world, organisms, positions,...
         */
        this._ret          = {ret: 0};
        /**
         * {Observer} Observer for sending external events
         */
        this._obs          = obs;
        this._world        = man.world;
        this._organisms    = man.organisms;
        this._positions    = man.positions;
    }

    /**
     * Returns operators array. Should be overridden in child class
     * @abstract
     */
    get length() {return OperatorsDos.OPERATOR_AMOUNT}

    destroy() {
        super.destroy();

        this._world        = null;
        this._organisms    = null;
        this._positions    = null;
        this._obs          = null;
        this._ret          = null;
    }

    /**
     * Handler of variable assignment operator. 'xx' means, that amount of
     * bits depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     * bits  :        8 xx xx
     * number: 00000000 00 01...
     * desc  :      var v0 v1
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
     * Handler of 'while' operator. 'xx' means, that amount of bits depends on
     * configuration. '...' means, that all other bits are
     * ignored. Offset of closing bracket means row number after, which this
     * bracket will be added. Offset of closing bracket is calculating using
     * formula: line + offs. Example:
     * bits  :        8 xx xx  2 xx
     * number: 00000011 00 01 00 00...
     * desc  :    while v0 v1  <  }
     * string: while (v0 < v1) {}
     *
     * @param {Number} num One bit packed byte code row
     * @param {Number} line Current line in DOS code
     * @return {Number} Next line number to proceed
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
            this._obs.fire(EVENTS.GET_ENERGY, x, y, this._ret);
            vars[Num.getVar0(num)] = this._ret.ret;
            return ++line;
        }

        vars[Num.getVar0(num)] = 0;
        return ++line;
    }

    onEatLeft(num, line, org) {
        const amount = this.vars[Num.getVar1(num)];
        if (amount === 0) {this.vars[Num.getVar0(num)] = 0; return ++line}
        const ret    = this._ret;

        ret.ret = amount;
        this._obs.fire(EVENTS.EAT, org, org.x - 1, org.y, ret);
        org.energy += ret.ret;
        this.vars[Num.getVar0(num)] = ret.ret;

        return ++line;
    }
    onEatRight(num, line, org) {
        const amount = this.vars[Num.getVar1(num)];
        if (amount === 0) {this.vars[Num.getVar0(num)] = 0; return ++line}
        const ret    = this._ret;

        ret.ret = amount;
        this._obs.fire(EVENTS.EAT, org, org.x + 1, org.y, ret);
        org.energy += ret.ret;
        this.vars[Num.getVar0(num)] = ret.ret;

        return ++line;
    }
    onEatUp(num, line, org) {
        const amount = this.vars[Num.getVar1(num)];
        if (amount === 0) {this.vars[Num.getVar0(num)] = 0; return ++line}
        const ret    = this._ret;

        ret.ret = amount;
        this._obs.fire(EVENTS.EAT, org, org.x, org.y - 1, ret);
        org.energy += ret.ret;
        this.vars[Num.getVar0(num)] = ret.ret;

        return ++line;
    }
    onEatDown(num, line, org) {
        const amount = this.vars[Num.getVar1(num)];
        if (amount === 0) {this.vars[Num.getVar0(num)] = 0; return ++line}
        const ret    = this._ret;

        ret.ret = amount;
        this._obs.fire(EVENTS.EAT, org, org.x, org.y + 1, ret);
        org.energy += ret.ret;
        this.vars[Num.getVar0(num)] = ret.ret;

        return ++line;
    }

    onStepLeft(num, line, org)  {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x - 1, org.y, org.x - 1); return ++line}
    onStepRight(num, line, org) {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x + 1, org.y, org.x + 1); return ++line}
    onStepUp(num, line, org)    {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x, org.y - 1, org.y - 1); return ++line}
    onStepDown(num, line, org)  {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x, org.y + 1, org.y + 1); return ++line}

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

    onCheckLeft(num, line, org)  {
        this._obs.fire(EVENTS.CHECK_AT, org.x - 1, org.y, this._ret);
        this.vars[Num.getVar0(num)] = this._ret.ret;
        return ++line;
    }
    onCheckRight(num, line, org) {
        this._obs.fire(EVENTS.CHECK_AT, org.x + 1, org.y, this._ret);
        this.vars[Num.getVar0(num)] = this._ret.ret;
        return ++line;
    }
    onCheckUp(num, line, org)    {
        this._obs.fire(EVENTS.CHECK_AT, org.x, org.y - 1, this._ret);
        this.vars[Num.getVar0(num)] = this._ret.ret;
        return ++line;
    }
    onCheckDown(num, line, org)  {
        this._obs.fire(EVENTS.CHECK_AT, org.x, org.y + 1, this._ret);
        this.vars[Num.getVar0(num)] = this._ret.ret;
        return ++line;
    }

    _step(org, x1, y1, x2, y2, step) {
        this._obs.fire(EVENTS.STEP, org, x1, y1, x2, y2);
        return org.x === x2 && org.y === y2 ? step : 0;
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

OperatorsDos.compile();

module.exports = OperatorsDos;