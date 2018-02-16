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
/**
 * {Function} Just a shortcuts
 */
const FOUR_BITS             = 4;
const CONDITION_BITS        = 2;
/**
 * {Array} Available conditions for if operator. Amount should be
 * the same like (1 << Num.BITS_PER_VAR)
 */
const CONDITIONS = [(a,b)=>a<b, (a,b)=>a>b, (a,b)=>a===b, (a,b)=>a!==b];
/**
 * {Array} Available operators for math calculations
 */
const OPERATORS = [
    (a,b) => {const v=a+b; return IS_FINITE(v)?v:0},
    (a,b) => {const v=a-b; return IS_FINITE(v)?v:0},
    (a,b) => {const v=a*b; return IS_FINITE(v)?v:0},
    (a,b) => {const v=a/b; return IS_FINITE(v)?v:0},
    (a,b) => {const v=a%b; return IS_FINITE(v)?v:0},
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

        this.BITS_AFTER_ONE_VAR    = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR;
        this.BITS_AFTER_TWO_VARS   = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 2;
        this.BITS_AFTER_THREE_VARS = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;
    }

    destroy() {
        super.destroy();
        this._OPERATORS_CB = null;
    }

    get operators() {return this._OPERATORS_CB}

    /**
     * Parses variable operator. Format: var = number|var. 'num' bits format:
     * TODO:
     *
     * @param {Number} num Packed into number vm line
     * @param {Number} line Current line in vm
     * @param {Organism} org Current organism
     * @return {Number} Parsed vm line string
     */
    onVar(num, line, org) {
        this.vars[Num.getVar0(num)] = this.vars[Num.getVar1(num)];
        org.energy -= OConfig.orgOperatorWeights[0];
        return ++line;
    }

    onConst(num, line, org) {
        this.vars[Num.getVar0(num)] = Num.getBits(num, this.BITS_AFTER_ONE_VAR, OConfig.codeConstBits);
        org.energy -= OConfig.orgOperatorWeights[1];
        return ++line;
    }

    onCondition(num, line, org) {
        const cond = Num.getBits(num, this.BITS_AFTER_TWO_VARS, CONDITION_BITS);
        const offs = this._getOffs(line, Num.getBits(num, this.BITS_AFTER_TWO_VARS + CONDITION_BITS, OConfig.codeBitsPerBlock));

        if (CONDITIONS[cond](this.vars[Num.getVar0(num)], this.vars[Num.getVar1(num)])) {
            this.offs.push(offs, offs);
            org.energy -= OConfig.orgOperatorWeights[2];
            return ++line;
        }

        org.energy -= OConfig.orgOperatorWeights[2];
        return offs;
    }

    /**
     * while(v0 op v2) goto offs
     */
    onLoop(num, line, org) {
        const cond = Num.getBits(num, this.BITS_AFTER_TWO_VARS, CONDITION_BITS);
        const offs = this._getOffs(line, Num.getBits(num, this.BITS_AFTER_TWO_VARS + CONDITION_BITS, OConfig.codeBitsPerBlock));

        if (CONDITIONS[cond](this.vars[Num.getVar0(num)], this.vars[Num.getVar1(num)])) {
            this.offs.push(line, offs);
            org.energy -= OConfig.orgOperatorWeights[3];
            return ++line;
        }

        org.energy -= OConfig.orgOperatorWeights[3];
        return offs;
    }

    onOperator(num, line, org) {
        const vars = this.vars;
        vars[Num.getVar0(num)] = OPERATORS[Num.getBits(num, this.BITS_AFTER_THREE_VARS, FOUR_BITS)](vars[Num.getVar1(num)], vars[Num.getVar2(num)]);
        org.energy -= OConfig.orgOperatorWeights[4];
        return ++line;
    }

    onLookAt(num, line, org) {
        const vars = this.vars;
        let   x    = vars[Num.getVar1(num)];
        let   y    = vars[Num.getVar2(num)];

        if (!IN_WORLD(x, y)) {
            const ret = this._ret;
            ret.ret = 0;
            this.obs.fire(EVENTS.GET_ENERGY, org, x, y, ret);
            vars[Num.getVar0(num)] = ret.ret;

            org.energy -= OConfig.orgOperatorWeights[5];
            return ++line;
        }

        vars[Num.getVar0(num)] = 0;
        org.energy -= OConfig.orgOperatorWeights[5];
        return ++line;
    }

    onEatLeft(num, line, org)   {this.vars[Num.getVar0(num)] = this._eat(org, num, org.x - 1, org.y); org.energy -= OConfig.orgOperatorWeights[6]; return ++line}
    onEatRight(num, line, org)  {this.vars[Num.getVar0(num)] = this._eat(org, num, org.x + 1, org.y); org.energy -= OConfig.orgOperatorWeights[7]; return ++line}
    onEatUp(num, line, org)     {this.vars[Num.getVar0(num)] = this._eat(org, num, org.x, org.y - 1); org.energy -= OConfig.orgOperatorWeights[8]; return ++line}
    onEatDown(num, line, org)   {this.vars[Num.getVar0(num)] = this._eat(org, num, org.x, org.y + 1); org.energy -= OConfig.orgOperatorWeights[9]; return ++line}

    onStepLeft(num, line, org)  {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x - 1, org.y).x; org.energy -= OConfig.orgOperatorWeights[10]; return ++line}
    onStepRight(num, line, org) {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x + 1, org.y).x; org.energy -= OConfig.orgOperatorWeights[11]; return ++line}
    onStepUp(num, line, org)    {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x, org.y - 1).y; org.energy -= OConfig.orgOperatorWeights[12]; return ++line}
    onStepDown(num, line, org)  {this.vars[Num.getVar0(num)] = this._step(org, org.x, org.y, org.x, org.y + 1).y; org.energy -= OConfig.orgOperatorWeights[13]; return ++line}

    onFromMem(num, line, org) {
        this.vars[Num.getVar0(num)] = org.mem[Num.getBits(num, this.BITS_AFTER_ONE_VAR, OConfig.orgMemBits)];
        org.energy -= OConfig.orgOperatorWeights[14];
        return ++line;
    }
    onToMem(num, line, org) {
        org.mem[Num.getBits(num, this.BITS_AFTER_ONE_VAR, OConfig.orgMemBits)] = this.vars[Num.getVar0(num)];
        org.energy -= OConfig.orgOperatorWeights[15];
        return ++line;
    }

    onMyX(num, line, org) {this.vars[Num.getVar0(num)] = org.x; org.energy -= OConfig.orgOperatorWeights[16]; return ++line}
    onMyY(num, line, org) {this.vars[Num.getVar0(num)] = org.y; org.energy -= OConfig.orgOperatorWeights[17]; return ++line}

    onCheckLeft(num, line, org)  {const energy = this._checkAt(num, line, org, org.x - 1, org.y); org.energy -= OConfig.orgOperatorWeights[18]; return energy}
    onCheckRight(num, line, org) {const energy = this._checkAt(num, line, org, org.x + 1, org.y); org.energy -= OConfig.orgOperatorWeights[19]; return energy}
    onCheckUp(num, line, org)    {const energy = this._checkAt(num, line, org, org.x, org.y - 1); org.energy -= OConfig.orgOperatorWeights[20]; return energy}
    onCheckDown(num, line, org)  {const energy = this._checkAt(num, line, org, org.x, org.y + 1); org.energy -= OConfig.orgOperatorWeights[21]; return energy}

    _checkAt(num, line, org, x, y) {
        const ret = this._ret;

        ret.ret = 0;
        this.obs.fire(EVENTS.CHECK_AT, x, y, ret);
        this.vars[Num.getVar0(num)] = ret.ret;
        return ++line;
    }

    _eat(org, num, x, y) {
        const amount = this.vars[Num.getVar1(num)];
        if (amount <= 0) {return 0}
        const ret    = this._ret;

        ret.ret = amount;
        this.obs.fire(EVENTS.EAT, org, x, y, ret);
        org.energy += ret.ret;

        return ret.ret;
    }

    _step(org, x1, y1, x2, y2) {
        const ret = this._ret;

        ret.ret = 0;
        this.obs.fire(EVENTS.STEP, org, x1, y1, x2, y2, ret);
        if (ret.ret > 0) {
            org.x = ret.x;
            org.y = ret.y;
        }

        return ret;
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
        const offsets = this.offs || [];
        return line + offs > offsets[offsets.length - 1] ? offsets[offsets.length - 1] : line + offs + 1;
    }
}

module.exports = OperatorsDos;