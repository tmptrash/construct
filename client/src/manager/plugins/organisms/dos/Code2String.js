/**
 * This class is used only for code visualization in readable human like form.
 * It converts numeric based byte code into JS string. This class must be
 * synchronized with 'Operators' one.
 *
 * @author flatline
 */
const Num = require('./../../../../jsvm/Num');

/**
 * {Function} Just a shortcuts
 */
const VAR0                  = Num.getVar;
const VAR1                  = (n) => Num.getVar(n, 1);
const VAR2                  = (n) => Num.getVar(n, 2);
const BITS_AFTER_THREE_VARS = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;
const BITS_FOR_NUMBER       = 16;
const HALF_OF_VAR           = Num.MAX_VAR / 2;

class Code2String {
    constructor(manager) {
        this._manager = manager;
        /**
         * {Object} These operator handlers should return string representation
         * of numeric based byte jsvm.
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
        /**
         * {Array} Contains closing bracket offset for "if", "loop",... operators
         */
        this._offsets = [];

        Num.setOperatorAmount(this._OPERATORS_CB_LEN);
        //
        // API of the Manager for accessing outside. (e.g. from Console)
        //
        manager.api.formatCode = (code) => this.format(code);
    }

    destroy() {
        this._OPERATORS_CB = null;
        this._CONDITIONS   = null;
        this._OPERATORS    = null;
    }

    format(code, separator = '\n') {
        const len       = code.length;
        const operators = this._OPERATORS_CB;
        const offs      = this._offsets;
        let   lines     = new Array(len);
        let   needClose = 0;

        for (let line = 0; line < len; line++) {
            //
            // We found closing bracket '}' of some loop and have to add
            // it to output code array
            //
            if (line === offs[offs.length - 1]) {
                while (offs.length > 0 && offs[offs.length - 1] === line) {
                    offs.pop();
                    needClose++;
                }
            }
            lines[line] = operators[Num.getOperator(code[line])](code[line], line, len);
            if (needClose > 0) {
                for (let i = 0; i < needClose; i++) {
                    lines[line] = '}' + lines[line];
                }
                needClose = 0;
            }
        }
        //
        // All closing brackets st the end of JS script
        //
        const length = lines.length - 1;
        for (let i = 0; i < offs.length; i++) {
            lines[length] += '}';
        }
        offs.length = 0;

        return js_beautify(lines.join(separator), {indent_size: 4});
    }

    /**
     * Parses variable operator. Format: let = const|number. Num bits format:
     *   BITS_PER_OPERATOR bits - operator id
     *   BITS_PER_VAR bits  - destination var index
     *   BITS_PER_VAR bits  - assign type (const (half of bits) or variable (half of bits))
     *   BITS_PER_VAR bits  - variable index or all bits till the end for constant
     *
     * @param {Num} num Packed into number jsvm line
     * @return {String} Parsed jsvm line string
     */
    _onVar(num) {
        const var1    = VAR1(num);
        const isConst = VAR2(num) >= HALF_OF_VAR;

        return `v${VAR0(num)}=${isConst ? Num.getBits(num, BITS_AFTER_THREE_VARS, BITS_FOR_NUMBER) : ('v' + var1)}`;
    }

    _onFunc(num) {
        return '';
    }

    _onCondition(num, line, lines) {
        const val3    = Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
        this._offsets.push(this._getOffs(line, lines, val3));
        return `if(v${VAR0(num)}${this._CONDITIONS[VAR2(num)]}v${VAR1(num)}){`;
    }

    _onLoop(num, line, lines) {
        const var0    = VAR0(num);
        const val3    = Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
        this._offsets.push(this._getOffs(line, lines, val3));
        return `for(v${var0}=v${VAR1(num)};v${var0}<v${VAR2(num)};v${var0}++){`;
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
        const offsets = this._offsets;
        const length  = offsets.length;

        if (length > 0 && offset >= offsets[length - 1]) {
            return offsets[length - 1];
        }

        return offset;
    }
}

module.exports = Code2String;