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

export default class Code2StringGarmin {
    constructor() {
        /**
         * {Array} Array of offsets for closing braces. For 'for', 'if'
         * and all block operators.
         */
        this._offsets = [];
        /**
         * {Object} These operator handlers should return string representation
         * of numeric based byte code.
         */
        this._OPERATORS_CB = {
            0 : this._onVar.bind(this),
            1 : this._onCondition.bind(this),
            //2 : this._onLoop.bind(this),
            2 : this._onOperator.bind(this),
            3 : this._onNot.bind(this),
            //4 : this._onPi.bind(this),
            //5 : this._onTrig.bind(this),
            4 : this._onFromMem.bind(this),
            5 : this._onToMem.bind(this)
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
        this._offsets = null;
    }

    format(code, separator = '\n') {
        const len       = code.length;
        const operators = this._OPERATORS_CB;
        let   codeArr   = new Array(len);
        let   offsets   = this._offsets;
        let   operator;

        for (let i = 0; i < len; i++) {
            operator = operators[Num.getOperator(code[i])](code[i], i, len);
            //
            // This code is used for closing blocks for if, for and other
            // blocked operators.
            //
            if (offsets[offsets.length - 1] === i && offsets.length > 0) {
                operator = operator + '}';
                offsets.pop();
            }
            codeArr[i] = operator;
        }
        if (offsets.length > 0) {
            codeArr[codeArr.length - 1] += ('}'.repeat(offsets.length));
            offsets.length = 0;
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

    _onCondition(num, line, lines) {
        const var3    = Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
        let   offs    = line + var3 < lines ? line + var3 + 1: lines;
        return `if(v${VAR0(num)}${this._CONDITIONS[VAR2(num)]}v${VAR1(num)}) goto(${offs})`;
    }

//    _onLoop(num, line, lines) {
//        const var0    = VAR0(num);
//        const var3    = Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
//        const index   = line + var3 < lines ? line + var3 : lines - 1;
//
//        this._offsets.push(index);
//        return `for(v${var0}=v${VAR1(num)};v${var0}<v${VAR2(num)};v${var0}++){`;
//    }

    _onOperator(num) {
        return `v${VAR0(num)}=v${VAR1(num)}${this._OPERATORS[Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS)]}v${VAR2(num)}`;
    }

    _onNot(num) {
        return `v${VAR0(num)}=+!v${VAR1(num)}`;
    }

//    _onPi(num) {
//        return `v${VAR0(num)}=Math.PI`;
//    }
//
//    _onTrig(num) {
//        return `v${VAR0(num)}=Math.${this._TRIGS[VAR2(num)]}(v${VAR1(num)})`;
//    }

    _onFromMem(num) {
        return `v${VAR0(num)}=org.fromMem()`;
    }

    _onToMem(num) {
        return `v${VAR0(num)}=org.toMem(v${VAR1(num)})`;
    }
}