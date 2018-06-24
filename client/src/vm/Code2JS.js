/**
 * This class is used only for code translation from byte code to JavaScript
 * in readable human like form. It translates only base operators. Generally
 * all you need to do is create an instance and call format() method with a
 * byte code as a parameter.
 *
 * @author flatline
 */
const Num       = require('./../vm/Num');
const OConfig   = require('./../manager/plugins/organisms/Config');
const Operators = require('./Operators');

class Code2JS {
    constructor() {
        /**
         * @constant
         * {Array} Available condition operations for if, while and math operators. Amount
         * of operations should be 16 (4 bits).
         */
        this._CONDITIONS = ['+','-','*','/','%','&','|','^','>>','<<','>>>','<','>','==','!=','<='];
        /**
         * {Object} These operator handlers should return string representation
         * of numeric based byte vm.
         */
        this._operators = {
            0b100000: this._onVar.bind(this),
            0b100001: this._onConst.bind(this),
            0b100010: this._onIf.bind(this),
            0b100011: this._onLoop.bind(this),
            0b100100: this._onOperator.bind(this),
            0b100101: this._onFunc.bind(this),
            0b100110: this._onFuncCall.bind(this),
            0b100111: this._onReturn.bind(this),
            0b101000: this._onBracket.bind(this),
            0b101001: this._onToMem.bind(this),
            0b101010: this._onFromMem.bind(this),
            0b101011: this._onRand.bind(this)
        };
    }

    get operators() {
        return this._operators;
    }

    format(code, separator = '\n') {
        const len       = code.length;
        const operators = this._operators;
        let   jsCode    = new Array(len);
        const offs      = new Array(len);
        const vars      = new Array(Math.pow(2, OConfig.codeBitsPerVar));
        const ops       = new Operators(offs, vars);

        ops.updateIndexes(code);
        for (let line = 0; line < len; line++) {
            jsCode[line] = operators[Num.getOperator(code[line])](code[line], line, ops);
        }
        ops.destroy();

        return js_beautify(jsCode.join(separator), {indent_size: 4});
    }

    destroy() {
        this._operators  = null;
        this._CONDITIONS = null;
    }

    /**
     * Parses var operator. Format: var1 = var0.
     * @param {Num} num Packed into number vm line
     * @return {String} Parsed vm line string
     */
    _onVar(num) {
        return `v${Num.getVar0(num)}=v${Num.getVar1(num)}`;
    }

    _onConst(num) {
        return `v${Num.getVar0(num)}=${Num.getBits(num, Num.BITS_OF_VAR1, OConfig.codeConstBits)}`;
    }

    _onIf(num, line, ops) {
        const cond    = Num.getBits(num, Num.BITS_OF_VAR2, Operators.CONDITION_BITS);
        const bracket = ops.offs[line] === line ? '}' : '';
        return `if(v${Num.getVar0(num)}${this._CONDITIONS[cond]}v${Num.getVar1(num)}){${bracket}`;
    }

    _onLoop(num, line, ops) {
        const cond    = Num.getBits(num, Num.BITS_OF_VAR2, Operators.CONDITION_BITS);
        const bracket = ops.offs[line] === line ? '}' : '';
        return `while(v${Num.getVar0(num)}${this._CONDITIONS[cond]}v${Num.getVar1(num)}){${bracket}`;
    }

    _onOperator(num) {
        return `v${Num.getVar0(num)}=v${Num.getVar1(num)}${this._CONDITIONS[Num.getBits(num, Num.BITS_OF_VAR3, Operators.CONDITION_BITS)]}v${Num.getVar2(num)}`;
    }

    _onFunc(num, line, ops) {
        const bracket = ops.offs[line] === line ? '}' : '';
        return `function f${ops.funcs.indexOf(line + 1)}(){${bracket}`;
    }

    _onFuncCall(num, line, ops) {
        let fn;

        if (Num.getBits(num, Num.BITS_OF_VAR0, 1) === 1) {
            fn = `f${Num.getBits(num, Num.BITS_OF_VAR0 + 1, ops.FUNC_NAME_BITS) % ops.funcAmount}`;
        } else {
            fn = `v${Num.getBits(num, Num.BITS_OF_VAR0 + 1, OConfig.codeBitsPerVar) % ops.funcAmount}`;
        }
        return `${fn}()`;
    }

    _onReturn() {
        return 'return';
    }

    _onBracket(num, line, ops) {
        return ops.offs[line] === undefined ? '// }' : '}';
    }

    _onToMem(num) {
        return `toMem(v${Num.getVar0(num)},v${Num.getVar1(num)})`;
    }

    _onFromMem(num) {
        return `v${Num.getVar0(num)}=fromMem(v${Num.getVar1(num)})`;
    }

    _onRand(num) {
        return `v${Num.getVar0(num)}=rand(v${Num.getVar1(num)})`;
    }
}

module.exports = Code2JS;