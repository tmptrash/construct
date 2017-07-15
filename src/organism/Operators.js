/**
 * This file contains all available operators implementation. For example:
 * for, if, variable declaration, steps, eating etc... User may override
 * this class for own needs and change operator list to custom.
 *
 * @author DeadbraiN
 */
import Helper from './../global/Helper';
import Num    from './Num';

/**
 * {Function} Just a shortcuts
 */
const VAR0              = Num.getVar;
const VAR1              = (n) => Num.getVar(n, 1);
const VAR2              = (n) => Num.getVar(n, 2);
const VAR3              = (n) => Num.getVar(n, 3);
const VAR4              = (n) => Num.getVar(n, 4);
const BITS_OF_CONDITION = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;

export default class Operators {
    constructor(offsets) {
        /**
         * {Array} Array of offsets for closing braces. For 'for', 'if'
         * and all block operators.
         */
        this._offsets = offsets;
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
         * TODO: rewrite this to configuration, where callbacks and template functions will be
         * TODO: e.g.: _onPi: `v${VAR0(num)}=pi` (check speed of such strings)
         */
        this._OPERATORS_CB = {
            0 : this.onVar.bind(this),
            //1: this.onFunc.bind(this),
            1 : this.onCondition.bind(this),
            2 : this.onLoop.bind(this),
            3 : this.onOperator.bind(this),
            4 : this.not.bind(this),
            5 : this.onPi.bind(this),
            6 : this.onTrig.bind(this),
            7 : this.onLookAt.bind(this),
            8 : this.eatLeft.bind(this),
            9 : this.eatRight.bind(this),
            10: this.eatUp.bind(this),
            11: this.eatDown.bind(this),
            12: this.stepLeft.bind(this),
            13: this.stepRight.bind(this),
            14: this.stepUp.bind(this),
            15: this.stepDown.bind(this),
            16: this.fromMem.bind(this),
            17: this.toMem.bind(this),
            18: this.myX.bind(this),
            19: this.myY.bind(this)
        };
        this._OPERATORS_CB_LEN = Object.keys(this._OPERATORS_CB).length;
        /**
         * {Array} Available conditions for if operator. Amount should be
         * the same like (1 << BITS_PER_VAR)
         */
        this._CONDITIONS = ['<', '>', '==', '!='];
        /**
         * {Array} Available operators for math calculations
         */
        this._OPERATORS = [
            '+', '-', '*', '/', '%', '&', '|', '^', '>>', '<<', '>>>', '<', '>', '==', '!=', '<='
        ];
        this._TRIGS = ['sin', 'cos', 'tan', 'abs'];

        Num.setOperatorAmount(this._OPERATORS_CB_LEN);
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
     * @return {String} Parsed code line string
     */
    onVar(num) {
        const var1    = VAR1(num);
        const isConst = var1 >= Num.HALF_OF_VAR;

        return `v${VAR0(num)}=${isConst ? Helper.rand(Num.BITS_WITHOUT_2_VARS) : ('v' + var1)}`;
    }

    onFunc(num) {
        return '';
    }

    onCondition(num, line, lines) {
        const var3    = Num.getBits(num, BITS_OF_CONDITION, Num.BITS_OF_TWO_VARS);
        this._offsets.push(line + var3 < lines ? line + var3 : lines - 1);
        return `if(v${VAR0(num)}${this._CONDITIONS[VAR2(num)]}v${VAR1(num)}){`;
    }

    onLoop(num, line, lines) {
        const var0    = VAR0(num);
        const var3    = Num.getBits(num, BITS_OF_CONDITION, Num.BITS_OF_TWO_VARS);
        const index   = line + var3 < lines ? line + var3 : lines - 1;

        this._offsets.push(index);
        return `for(v${var0}=v${VAR1(num)};v${var0}<v${VAR2(num)};v${var0}++){yield`;
    }

    onOperator(num) {
        return `v${VAR0(num)}=v${VAR1(num)}${this._OPERATORS[Num.getBits(num, Num.BITS_OF_THREE_VARS, Num.BITS_OF_TWO_VARS)]}v${VAR2(num)}`;
    }

    not(num) {
        return `v${VAR0(num)}=!v${VAR1(num)}`;
    }

    onPi(num) {
        return `v${VAR0(num)}=pi`;
    }

    onTrig(num) {
        return `v${VAR0(num)}=Math.${this._TRIGS[VAR1(num)]}(v${VAR2(num)})`;
    }

    onLookAt(num) {
        return `v${VAR0(num)}=org.lookAt(v${VAR1(num)},v${VAR2(num)})`;
    }

    eatLeft(num) {
        return `v${VAR0(num)}=org.eatLeft(v${VAR1(num)})`;
    }

    eatRight(num) {
        return `v${VAR0(num)}=org.eatRight(v${VAR1(num)})`;
    }

    eatUp(num) {
        return `v${VAR0(num)}=org.eatUp(v${VAR1(num)})`;
    }

    eatDown(num) {
        return `v${VAR0(num)}=org.eatDown(v${VAR1(num)})`;
    }

    stepLeft(num) {
        return `v${VAR0(num)}=org.stepLeft()`;
    }

    stepRight(num) {
        return `v${VAR0(num)}=org.stepRight()`;
    }

    stepUp(num) {
        return `v${VAR0(num)}=org.stepUp()`;
    }

    stepDown(num) {
        return `v${VAR0(num)}=org.stepDown()`;
    }

    fromMem(num) {
        return `v${VAR0(num)}=org.fromMem()`;
    }

    toMem(num) {
        return `org.toMem(v${VAR0(num)})`;
    }

    myX(num) {
        return `v${VAR0(num)}=org.myX()`;
    }

    myY(num) {
        return `v${VAR0(num)}=org.myY()`;
    }
}