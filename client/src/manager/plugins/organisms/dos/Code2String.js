/**
 * This class is used only for code visualization in readable human like form.
 * It converts numeric based byte code into JS string. This class must be
 * synchronized with 'Operators' one.
 *
 * @author flatline
 */
const Num     = require('./../../../../vm/Num');
const OConfig = require('./../Config');
/**
 * {Function} Just a shortcuts
 */
const FOUR_BITS             = 4;
const CONDITION_BITS        = 2;

class Code2String {
    constructor(manager) {
        this._manager = manager;
        /**
         * {Object} These operator handlers should return string representation
         * of numeric based byte vm.
         */
        this._OPERATORS_CB = [
            this._onVar.bind(this),
            this._onConst.bind(this),
            this._onCondition.bind(this),
            this._onLoop.bind(this),
            this._onOperator.bind(this),
            this._onLookAt.bind(this),
            this._onEatLeft.bind(this),
            this._onEatRight.bind(this),
            this._onEatUp.bind(this),
            this._onEatDown.bind(this),
            this._onStepLeft.bind(this),
            this._onStepRight.bind(this),
            this._onStepUp.bind(this),
            this._onStepDown.bind(this),
            this._onFromMem.bind(this),
            this._onToMem.bind(this),
            this._onMyX.bind(this),
            this._onMyY.bind(this),
            this._onCheckLeft.bind(this),
            this._onCheckRight.bind(this),
            this._onCheckUp.bind(this),
            this._onCheckDown.bind(this)
        ];
        this._OPERATORS_CB_LEN = this._OPERATORS_CB.length;
        /**
         * {Array} Available conditions for if operator. Amount should be
         * the same like (1 << Num.BITS_PER_VAR)
         */
        this._CONDITIONS = ['<', '>', '==', '!='];
        /**
         * {Array} Available operators for math calculations
         */
        this._OPERATORS = [
            '+', '-', '*', '/', '%', '&', '|', '^', '>>', '<<', '>>>', '<', '>', '==', '!=', '<='
        ];
        /**
         * {Array} Contains closing bracket offset for "if", "loop",... operators
         */
        this._offsets = [];

        Num.init(this._OPERATORS_CB_LEN);

        this.BITS_AFTER_ONE_VAR    = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR;
        this.BITS_AFTER_TWO_VARS   = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 2;
        this.BITS_AFTER_THREE_VARS = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;
        //
        // API of the Manager for accessing outside. (e.g. from Console)
        //
        manager.api.formatCode = (code) => this.format(code);
    }

    destroy() {
        this._OPERATORS_CB = null;
        this._CONDITIONS   = null;
        this._OPERATORS    = null;
        this._offsets      = null;
        delete this._manager.api.formatCode;
        this._manager      = null;
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
     *   Num.BITS_PER_OPERATOR bits - operator id
     *   Num.BITS_PER_VAR bits  - destination var index
     *   Num.BITS_PER_VAR bits  - assign type (const (half of bits) or variable (half of bits))
     *   Num.BITS_PER_VAR bits  - variable index or all bits till the end for constant
     *
     * @param {Num} num Packed into number vm line
     * @return {String} Parsed vm line string
     */
    _onVar(num) {
        return `v${Num.getVar0(num)}=${'v' + Num.getVar1(num)}`;
    }

    _onConst(num) {
        return `v${Num.getVar0(num)}=${Num.getBits(num, this.BITS_AFTER_THREE_VARS, OConfig.codeConstBits)}`;
    }

    _onCondition(num, line, lines) {
        const cond      = Num.getBits(num, this.BITS_AFTER_TWO_VARS, CONDITION_BITS);
        const blockOffs = Num.getBits(num, this.BITS_AFTER_TWO_VARS + CONDITION_BITS, OConfig.codeBitsPerBlock);

        this._offsets.push(this._getOffs(line, lines, blockOffs));
        return `if(v${Num.getVar0(num)}${this._CONDITIONS[cond]}v${Num.getVar1(num)}){`;
    }

    _onLoop(num, line, lines) {
        const cond      = Num.getBits(num, this.BITS_AFTER_TWO_VARS, CONDITION_BITS);
        const blockOffs = Num.getBits(num, this.BITS_AFTER_TWO_VARS + CONDITION_BITS, OConfig.codeBitsPerBlock);

        this._offsets.push(this._getOffs(line, lines, blockOffs));
        return `while(v${Num.getVar0(num)}${this._CONDITIONS[cond]}v${Num.getVar1(num)}){`;
    }

    _onOperator(num) {
        return `v${Num.getVar0(num)}=v${Num.getVar1(num)}${this._OPERATORS[Num.getBits(num, this.BITS_AFTER_THREE_VARS, FOUR_BITS)]}v${Num.getVar2(num)}`;
    }

    _onLookAt(num) {
        return `v${Num.getVar0(num)}=lookAt(v${Num.getVar1(num)},v${Num.getVar2(num)})`;
    }

    _onEatLeft(num) {
        return `v${Num.getVar0(num)}=eatLeft(v${Num.getVar1(num)})`;
    }

    _onEatRight(num) {
        return `v${Num.getVar0(num)}=eatRight(v${Num.getVar1(num)})`;
    }

    _onEatUp(num) {
        return `v${Num.getVar0(num)}=eatUp(v${Num.getVar1(num)})`;
    }

    _onEatDown(num) {
        return `v${Num.getVar0(num)}=eatDown(v${Num.getVar1(num)})`;
    }

    _onStepLeft(num) {
        return `v${Num.getVar0(num)}=stepLeft()`;
    }

    _onStepRight(num) {
        return `v${Num.getVar0(num)}=stepRight()`;
    }

    _onStepUp(num) {
        return `v${Num.getVar0(num)}=stepUp()`;
    }

    _onStepDown(num) {
        return `v${Num.getVar0(num)}=stepDown()`;
    }

    _onFromMem(num) {
        return `v${Num.getVar0(num)}=fromMem(${Num.getBits(num, this.BITS_AFTER_ONE_VAR, OConfig.orgMemBits)})`;
    }

    _onToMem(num) {
        return `toMem(v${Num.getVar0(num)},${Num.getBits(num, this.BITS_AFTER_ONE_VAR, OConfig.orgMemBits)})`;
    }

    _onMyX(num) {
        return `v${Num.getVar0(num)}=myX()`;
    }

    _onMyY(num) {
        return `v${Num.getVar0(num)}=myY()`;
    }

    _onCheckLeft(num) {
        return `v${Num.getVar0(num)}=checkLeft()`;
    }

    _onCheckRight(num) {
        return `v${Num.getVar0(num)}=checkRight()`;
    }

    _onCheckUp(num) {
        return `v${Num.getVar0(num)}=checkUp()`;
    }

    _onCheckDown(num) {
        return `v${Num.getVar0(num)}=checkDown()`;
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