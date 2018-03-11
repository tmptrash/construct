/**
 * This file contains all available operators implementation. For example:
 * for, if, variable declaration, steps, eating etc... User may override
 * this class for own needs and change operator list to custom. These
 * operators are used to obtain type of training saved by Garmin watches.
 *
 * @author flatline
 */
const Helper    = require('./../../../../../../common/src/Helper');
const Operators = require('./../../../../vm/Operators');
const Num       = require('./../../../../vm/Num');
const OConfig   = require('./../Config');

/**
 * {Function} Just a shortcuts
 */
const VAR0                  = Num.getVar;
const VAR1                  = (n) => Num.getVar(n, 1);
const VAR2                  = (n) => Num.getVar(n, 2);
const BITS_AFTER_THREE_VARS = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;
const IS_NUM                = Helper.isNumeric;
const HALF_OF_VAR           = Num.MAX_VAR / 2;
const CONDITION_BITS        = 2;

class OperatorsGarmin extends  Operators {
    constructor(offs, vars, obs) {
        super(offs, vars, obs);
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
         */
        this._OPERATORS_CB = [
            this.onVar.bind(this),
            this.onCondition.bind(this),
            //this.onLoop.bind(this),
            this.onOperator.bind(this),
            this.onNot.bind(this),
            //this.onPi.bind(this),
            //this.onTrig.bind(this),
            this.onFromMem.bind(this),
            this.onToMem.bind(this)
        ];
        /**
         * {Array} Available conditions for if operator. Amount should be
         * the same like (1 << Num.BITS_PER_VAR)
         */
        this._CONDITIONS = [(a,b)=>a<b, (a,b)=>a>b, (a,b)=>a===b, (a,b)=>a!==b];
        /**
         * {Array} Available operators for math calculations
         */
        this._OPERATORS = [
            (a,b)=>a+b, (a,b)=>a-b, (a,b)=>a*b, (a,b)=>a/(b||1), (a,b)=>a%(b||1), (a,b)=>a&b, (a,b)=>a|b, (a,b)=>a^b, (a,b)=>a>>b, (a,b)=>a<<b, (a,b)=>a>>>b, (a,b)=>+(a<b), (a,b)=>+(a>b), (a,b)=>+(a===b), (a,b)=>+(a!==b), (a,b)=>+(a<=b)
        ];
        //
        // We have to set amount of available operators for correct
        // working of mutations of operators.
        //
        Num.init(this._OPERATORS_CB.length);
    }

    destroy() {
        this._OPERATORS_CB = null;
        this._CONDITIONS   = null;
        this._OPERATORS    = null;

        super.destroy();
    }

    get operators() {return this._OPERATORS_CB}

    /**
     * Parses variable operator. Format: let = const|number. Num bits format:
     *   Num.BITS_PER_OPERATOR bits - operator id
     *   Num.BITS_PER_VAR bits  - destination var index
     *   Num.BITS_PER_VAR bits  - assign type (const (half of bits) or variable (half of bits))
     *   Num.BITS_PER_VAR bits  - variable index or all bits till the end for constant
     *
     * @param {Num} num Packed into number vm line
     * @param {Number} line Current line in vm
     * @return {Number} Parsed vm line string
     */
    onVar(num, line) {
        const vars = this.vars;
        const var1 = VAR1(num);
        vars[VAR0(num)] = var1 >= HALF_OF_VAR ? Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS) : vars[var1];

        return line + 1;
    }

    onCondition(num, line, org, lines) {
        const val3 = Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
        const offs = line + val3 < lines ? line + val3 + 1 : lines;
        const cond = VAR2(num) >>> (OConfig.codeBitsPerVar - CONDITION_BITS);

        if (this._CONDITIONS[cond](this.vars[VAR0(num)], this.vars[VAR1(num)])) {
            return line + 1;
        }

        return offs;
    }

//    onLoop(num, line, org, lines, ret) {
//        const vars = this.vars;
//        const var0 = VAR0(num);
//        const val3 = Num.getBits(num, _BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
//        const offs = line + val3 < lines ? line + val3 + 1 : lines;
//
//        if (ret) {
//            if (++vars[var0] < vars[VAR2(num)]) {
//                this.offs.push(line, offs);
//                return line + 1;
//            }
//            return offs;
//        }
//
//        vars[var0] = vars[VAR1(num)];
//        if (vars[var0] < vars[VAR2(num)]) {
//            this.offs.push(line, offs);
//            return line + 1;
//        }
//
//        return offs;
//    }

    onOperator(num, line) {
        const vars = this.vars;
        vars[VAR0(num)] = this._OPERATORS[Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS)](vars[VAR1(num)], vars[VAR2(num)]);
        return line + 1;
    }

    onNot(num, line) {
        this.vars[VAR0(num)] = +!this.vars[VAR1(num)];
        return line + 1;
    }

    onFromMem(num, line, org) {this.vars[VAR0(num)] = org.mem.pop() || 0; return line + 1}

    onToMem(num, line, org) {
        const val = this.vars[VAR1(num)];

        if (IS_NUM(val) && org.mem.length < OConfig.orgMemSize) {
            org.mem.push(val);
            this.vars[VAR0(num)] = val;
        } else {
            this.vars[VAR0(num)] = org.mem[org.mem.length - 1];
        }

        return line + 1;
    }
}

module.exports = OperatorsGarmin;