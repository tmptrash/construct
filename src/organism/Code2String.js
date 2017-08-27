/**
 * This class is used only for code visualization in readable human like form.
 * It converts numeric based byte code into JS string. This class must be
 * synchronized with 'Operators' one.
 *
 * @author DeadbraiN
 */
import Num    from './Num';

/**
 * {Function} Just a shortcuts
 */
const VAR0                  = Num.getVar;
const VAR1                  = (n) => Num.getVar(n, 1);
const VAR2                  = (n) => Num.getVar(n, 2);
const BITS_AFTER_THREE_VARS = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;
const HALF_OF_VAR           = Num.MAX_VAR / 2;

export default class Code2String {
    constructor() {
        /**
         * {Object} These operator handlers should return string representation
         * of numeric based byte code.
         */
        this._OPERATORS_CB = {
            0 : this._onVar.bind(this),
            //1: this._onFunc.bind(this),
            1 : this._onCondition.bind(this),
            2 : this._onLoop.bind(this),
            3 : this._onOperator.bind(this),
            4 : this._onNot.bind(this),
            //5 : this._onPi.bind(this),
            //6 : this._onTrig.bind(this),
            5 : this._onLookAt.bind(this),
            6 : this._onEatLeft.bind(this),
            7 : this._onEatRight.bind(this),
            8 : this._onEatUp.bind(this),
            9 : this._onEatDown.bind(this),
            10: this._onStepLeft.bind(this),
            11: this._onStepRight.bind(this),
            12: this._onStepUp.bind(this),
            13: this._onStepDown.bind(this),
            14: this._onFromMem.bind(this),
            15: this._onToMem.bind(this),
            16: this._onMyX.bind(this),
            17: this._onMyY.bind(this),
            18: this._onCheckLeft.bind(this),
            19: this._onCheckRight.bind(this),
            20: this._onCheckUp.bind(this),
            21: this._onCheckDown.bind(this)
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
        //this._TRIGS = ['sin', 'cos', 'tan', 'abs'];

        Num.setOperatorAmount(this._OPERATORS_CB_LEN);
    }

    destroy() {
    }

    format(code, separator = '\n') {
        const len       = code.length;
        const operators = this._OPERATORS_CB;
        let   codeArr   = new Array(len);

        for (let i = 0; i < len; i++) {
            codeArr[i] = operators[Num.getOperator(code[i])](code[i], i, len);
        }

        return js_beautify(codeArr.join(separator), {indent_size: 4});
    }

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
    _onVar(num) {
        const var1    = VAR1(num);
        const isConst = var1 >= HALF_OF_VAR;

        return `v${VAR0(num)}=${isConst ? Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS) : ('v' + var1)}`;
    }

    _onFunc(num) {
        return '';
    }

    _onCondition(num, line, lines) {
        const var3    = Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
        let   offs    = line + var3 < lines ? line + var3 + 1: lines;

        return `if(v${VAR0(num)}${this._CONDITIONS[VAR2(num)]}v${VAR1(num)}) goto(${offs})`;
    }

    _onLoop(num, line, lines) {
        const var0    = VAR0(num);
        const var3    = Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
        const offs    = line + var3 < lines ? line + var3 : lines - 1;

        return `for(v${var0}=v${VAR1(num)};v${var0}<v${VAR2(num)};v${var0}++) until(${offs})`;
    }

    _onOperator(num) {
        return `v${VAR0(num)}=v${VAR1(num)}${this._OPERATORS[Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS)]}v${VAR2(num)}`;
    }

    _onNot(num) {
        return `v${VAR0(num)}=+!v${VAR1(num)}`;
    }

    //_onPi(num) {
    //    return `v${VAR0(num)}=Math.PI`;
    //}

    //_onTrig(num) {
    //    return `v${VAR0(num)}=Math.${this._TRIGS[VAR2(num)]}(v${VAR1(num)})`;
    //}

    _onLookAt(num) {
        return `v${VAR0(num)}=lookAt(v${VAR1(num)},v${VAR2(num)})`;
    }

    _onEatLeft(num) {
        return `v${VAR0(num)}=eatLeft(v${VAR1(num)})`;
    }

    _onEatRight(num) {
        return `v${VAR0(num)}=eatRight(v${VAR1(num)})`;
    }

    _onEatUp(num) {
        return `v${VAR0(num)}=eatUp(v${VAR1(num)})`;
    }

    _onEatDown(num) {
        return `v${VAR0(num)}=eatDown(v${VAR1(num)})`;
    }

    _onStepLeft(num) {
        return `v${VAR0(num)}=stepLeft()`;
    }

    _onStepRight(num) {
        return `v${VAR0(num)}=stepRight()`;
    }

    _onStepUp(num) {
        return `v${VAR0(num)}=stepUp()`;
    }

    _onStepDown(num) {
        return `v${VAR0(num)}=stepDown()`;
    }

    _onFromMem(num) {
        return `v${VAR0(num)}=fromMem()`;
    }

    _onToMem(num) {
        return `v${VAR0(num)}=toMem(v${VAR1(num)})`;
    }

    _onMyX(num) {
        return `v${VAR0(num)}=myX()`;
    }

    _onMyY(num) {
        return `v${VAR0(num)}=myY()`;
    }

    _onCheckLeft(num) {
        return `v${VAR0(num)}=checkLeft()`;
    }

    _onCheckRight(num) {
        return `v${VAR0(num)}=checkRight()`;
    }

    _onCheckUp(num) {
        return `v${VAR0(num)}=checkUp()`;
    }

    _onCheckDown(num) {
        return `v${VAR0(num)}=checkDown()`;
    }
}