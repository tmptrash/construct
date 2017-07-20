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
const VAR0 = Num.getVar;
const VAR1 = (n) => Num.getVar(n, 1);
const VAR2 = (n) => Num.getVar(n, 2);
const BITS_AFTER_THREE_VARS = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;

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
            4 : this.onNot.bind(this),
            5 : this.onPi.bind(this),
            6 : this.onTrig.bind(this),
            7 : this.onLookAt.bind(this),
            8 : this.onEatLeft.bind(this),
            9 : this.onEatRight.bind(this),
            10: this.onEatUp.bind(this),
            11: this.onEatDown.bind(this),
            12: this.onStepLeft.bind(this),
            13: this.onStepRight.bind(this),
            14: this.onStepUp.bind(this),
            15: this.onStepDown.bind(this),
            16: this.onFromMem.bind(this),
            17: this.onToMem.bind(this),
            18: this.onMyX.bind(this),
            19: this.onMyY.bind(this)
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

	destroy() {
		this._offsets      = null;
		this._OPERATORS_CB = null;
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
        const var3    = Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
        this._offsets.push(line + var3 < lines ? line + var3 : lines - 1);
        return `yield;if(v${VAR0(num)}${this._CONDITIONS[VAR2(num)]}v${VAR1(num)}){`;
    }

    onLoop(num, line, lines) {
        const var0    = VAR0(num);
        const var3    = Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
        const index   = line + var3 < lines ? line + var3 : lines - 1;

        this._offsets.push(index);
        return `for(v${var0}=v${VAR1(num)};v${var0}<v${VAR2(num)};v${var0}++){yield`;
    }

    onOperator(num) {
        return `v${VAR0(num)}=v${VAR1(num)}${this._OPERATORS[Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS)]}v${VAR2(num)}`;
    }

    onNot(num) {
        return `v${VAR0(num)}=!v${VAR1(num)}`;
    }

    onPi(num) {
        return `v${VAR0(num)}=pi`;
    }

    onTrig(num) {
        return `v${VAR0(num)}=Math.${this._TRIGS[VAR2(num)]}(v${VAR1(num)})`;
    }

    onLookAt(num) {
        return `v${VAR0(num)}=org.lookAt(v${VAR1(num)},v${VAR2(num)})`;
    }

    onEatLeft(num) {
        return `v${VAR0(num)}=org.eatLeft(v${VAR1(num)})`;
    }

    onEatRight(num) {
        return `v${VAR0(num)}=org.eatRight(v${VAR1(num)})`;
    }

    onEatUp(num) {
        return `v${VAR0(num)}=org.eatUp(v${VAR1(num)})`;
    }

    onEatDown(num) {
        return `v${VAR0(num)}=org.eatDown(v${VAR1(num)})`;
    }

    onStepLeft(num) {
        return `v${VAR0(num)}=org.stepLeft()`;
    }

    onStepRight(num) {
        return `v${VAR0(num)}=org.stepRight()`;
    }

    onStepUp(num) {
        return `v${VAR0(num)}=org.stepUp()`;
    }

    onStepDown(num) {
        return `v${VAR0(num)}=org.stepDown()`;
    }

    onFromMem(num) {
        return `v${VAR0(num)}=org.fromMem()`;
    }

    onToMem(num) {
        return `org.toMem(v${VAR0(num)})`;
    }

    onMyX(num) {
        return `v${VAR0(num)}=org.myX()`;
    }

    onMyY(num) {
        return `v${VAR0(num)}=org.myY()`;
    }
}