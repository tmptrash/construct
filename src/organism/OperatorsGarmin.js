/**
 * This file contains all available operators implementation. For example:
 * for, if, variable declaration, steps, eating etc... User may override
 * this class for own needs and change operator list to custom. These
 * operators are used to obtain type of training saved by Garmin watches.
 *
 * @author DeadbraiN
 */
import Helper from './../global/Helper';
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

export default class OperatorsGarmin {
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
            1 : this.onCondition.bind(this),
            //2 : this.onLoop.bind(this),
            2 : this.onOperator.bind(this),
            3 : this.onNot.bind(this),
            4 : this.onPi.bind(this),
            5 : this.onTrig.bind(this),
            6 : this.onFromMem.bind(this),
            7 : this.onToMem.bind(this)
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
        this._TRIGS = [(a)=>Math.sin(a), (a)=>Math.cos(a), (a)=>Math.tan(a), (a)=>Math.abs(a)];

        Num.setOperatorAmount(this._OPERATORS_CB_LEN);
    }

    destroy() {
        this._offsets      = null;
        this._OPERATORS_CB = null;
        this._CONDITIONS   = null;
        this._OPERATORS    = null;
        this._TRIGS        = null;
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
        vars[VAR0(num)] = var1 >= HALF_OF_VAR ? Helper.rand(BITS_WITHOUT_2_VARS) : vars[var1];

        return line + 1;
    }

    onCondition(num, line, org, lines) {
        const val3 = Num.getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS);
        const offs = line + val3 < lines ? line + val3 + 1 : lines;

        if (this._CONDITIONS[VAR2(num)](this._vars[VAR0(num)], this._vars[VAR1(num)])) {
            return line + 1;
        }

        return offs;
    }

//    onLoop(num, line, org, lines, ret) {
//        const vars = this._vars;
//        const var0 = VAR0(num);
//        const val3 = Num.getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS);
//        const offs = line + val3 < lines ? line + val3 + 1 : lines;
//
//        if (ret) {
//            if (++vars[var0] < vars[VAR2(num)]) {
//                this._offsets.push(line, offs);
//                return line + 1;
//            }
//            return offs;
//        }
//
//        vars[var0] = vars[VAR1(num)];
//        if (vars[var0] < vars[VAR2(num)]) {
//            this._offsets.push(line, offs);
//            return line + 1;
//        }
//
//        return offs;
//    }

    onOperator(num, line) {
        const vars = this._vars;
        vars[VAR0(num)] = this._OPERATORS[Num.getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS)](vars[VAR1(num)], vars[VAR2(num)]);
        return line + 1;
    }

    onNot(num, line) {
        this._vars[VAR0(num)] = +!this._vars[VAR1(num)];
        return line + 1;
    }

    onPi(num, line) {
        this._vars[VAR0(num)] = Math.PI;
        return line + 1;
    }

    onTrig(num, line) {
        this._vars[VAR0(num)] = this._TRIGS[VAR2(num)](this._vars[VAR1(num)]);
        return line + 1;
    }

    onFromMem(num, line, org) {this._vars[VAR0(num)] = org.mem.pop() || 0; return line + 1}

    onToMem(num, line, org) {
        const val = this._vars[VAR1(num)];

        if (IS_NUM(val) && org.mem.length < Config.orgMemSize) {
            org.mem.push(val);
            this._vars[VAR0(num)] = val;
        } else {
            this._vars[VAR0(num)] = org.mem[org.mem.length - 1];
        }

        return line + 1;
    }
}