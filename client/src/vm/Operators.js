/**
 * This file contains interface for available operators for some special
 * task. You have to inherit your operators class from this one.
 *
 * @author flatline
 */
const OConfig         = require('./../manager/plugins/organisms/Config');
const Num             = require('./Num');

class Operators {
    /**
     * Compiles all variants of bite-code to speed up the execution.
     * @param {Number} operators Amount of operators
     */
    static compile(operators = 11) {
        const bitsPerOp         = OConfig.codeBitsPerOperator;
        const MAX_BITS          = 32;
        /**
         * {Object} Container for storing of dynamic operator handlers
         */
        this.global             = typeof window === 'undefined' ? global : window;
        /**
         * {Number} Bit related constants
         */
        this.FOUR_BITS          = 4;
        this.CONDITION_BITS     = 2;
        this.FUNC_NAME_BITS     = 10;
        /**
         * {Array} Available conditions for if operator
         */
        this._CONDITIONS        = ['<', '>', '===', '!=='];
        /**
         * {Array} Available operators for math calculations
         */
        this._OPERATORS         = [
            (a,b,c) => `const v=this.vars[${b}] + this.vars[${c}]; this.vars[${a}]=Number.isFinite(v) ? v : Number.MAX_VALUE`,
            (a,b,c) => `const v=this.vars[${b}] - this.vars[${c}]; this.vars[${a}]=Number.isFinite(v) ? v :-Number.MAX_VALUE`,
            (a,b,c) => `const v=this.vars[${b}] * this.vars[${c}]; this.vars[${a}]=Number.isFinite(v) ? v : Number.MAX_VALUE`,
            (a,b,c) => `const v=this.vars[${b}] / this.vars[${c}]; this.vars[${a}]=Number.isFinite(v) ? v : Number.MAX_VALUE`,
            (a,b,c) => `const v=this.vars[${b}] % this.vars[${c}]; this.vars[${a}]=Number.isNaN(v)    ? 0 : v`,
            (a,b,c) => `this.vars[${a}] =   this.vars[${b}] &   this.vars[${c}]`,
            (a,b,c) => `this.vars[${a}] =   this.vars[${b}] |   this.vars[${c}]`,
            (a,b,c) => `this.vars[${a}] =   this.vars[${b}] ^   this.vars[${c}]`,
            (a,b,c) => `this.vars[${a}] =   this.vars[${b}] >>  this.vars[${c}]`,
            (a,b,c) => `this.vars[${a}] =   this.vars[${b}] <<  this.vars[${c}]`,
            (a,b,c) => `this.vars[${a}] =   this.vars[${b}] >>> this.vars[${c}]`,
            (a,b,c) => `this.vars[${a}] = +(this.vars[${b}] <   this.vars[${c}])`,
            (a,b,c) => `this.vars[${a}] = +(this.vars[${b}] >   this.vars[${c}])`,
            (a,b,c) => `this.vars[${a}] = +(this.vars[${b}] === this.vars[${c}])`,
            (a,b,c) => `this.vars[${a}] = +(this.vars[${b}] !== this.vars[${c}])`,
            (a,b,c) => `this.vars[${a}] = +(this.vars[${b}] <=  this.vars[${c}])`
        ];
        /**
         * {Array} Array of lengths of commands. Every item of this array contains
         * length of operator's data, which follows after len bits in byte-code number.
         * The size of this array is equal to amount of operators. Child classes may
         * append items to it.
         */
        this.LENS               = [
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 2),                        // var
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar),                            // const
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 2 + this.CONDITION_BITS),  // if
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 2 + this.CONDITION_BITS),  // loop
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 3 + this.FOUR_BITS),       // math
            MAX_BITS - (bitsPerOp),                                                     // func
            MAX_BITS - (bitsPerOp),                                                     // func call
            MAX_BITS - (bitsPerOp),                                                     // return
            MAX_BITS - (bitsPerOp),                                                     // bracket
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 2),                        // toMem
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 2)                         // fromMem
        ];
        /**
         * {Object} Map for all available operator handlers
         */
        this._compiledOperators = {};
        //
        // IMPORTANT: don't change callbacks order
        // This section compiles all possible variants of operators and their
        // arguments. This is how we dramatically speed up byte-code interpretation
        //
        Num.init(operators);
        this._compileVar();
        this._compileConst();
        this._compileIf();
        this._compileLoop();
        this._compileOperator();
        this._compileFunc();
        this._compileFuncCall();
        this._compileReturn();
        this._compileBracket();
        this._compileToMem();
        this._compileFromMem();
    }

    /**
     * Converts string BIN number representation into number. Removes spaces.
     * @param {String} s BIN string. e.g.: 'aa bb cc' -> 0xaabbcc
     * @param {Number} width Amount of digits in binary number
     * @returns {Number}
     */
    static _toHexNum(s, width = 0) {
        return parseInt(s.split(' ').join('').padStart(width, '0'), 2)
    }

    /**
     * Converts number to binary string
     * @param {Number} n Number to convert
     * @param {Number} width Amount of digits in binary number
     * @return {String} Binary string
     */
    static _toBinStr(n, width = 0) {
        return n.toString(2).padStart(width, '0');
    }

    /**
     * Compiles all variants of var operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :     5     5  xx xx
     * number: 00000 xxxxx  00 01...
     * string: v0 = v1
     */
    static _compileVar() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = this._toHexNum;
        const b      = this._toBinStr;
        const vars   = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            for (let v1 = 0; v1 < vars; v1++) {
                eval(`Operators.global.fn = function (line) {
                    this.vars[${v0}] = this.vars[${v1}];
                    return ++line;
                }`);
                ops[h(`${'00000'}${b(v0, bpv)}${b(v1, bpv)}`)] = this.global.fn;
            }
        }
    }

    /**
     * Compiles all variants of const operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      5     5 xx xx
     * number: 000001 xxxxx 00 01...
     * string: v0 = 1
     */
    static _compileConst() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = this._toHexNum;
        const b        = this._toBinStr;
        const bits     = Num.MAX_BITS - OConfig.codeConstBits;
        const bits1var = Num.BITS_OF_VAR0;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function (line, num) {
                this.vars[${v0}] = num << ${bits1var} >>> ${bits};
                return ++line;
            }`);
            ops[h(`${'00001'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of if operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :     5     5 xx xx  2
     * number: 00010 xxxxx 00 01 00...
     * string: if (v0 < v1) {
     */
    static _compileIf() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = this._toHexNum;
        const b      = this._toBinStr;
        const vars   = Math.pow(2, bpv);

        for (let c = 0; c < Math.pow(2, this.CONDITION_BITS); c++) {
            for (let v0 = 0; v0 < vars; v0++) {
                for (let v1 = 0; v1 < vars; v1++) {
                    eval(`Operators.global.fn = function (line) {
                        if (this.vars[${v0}] ${this._CONDITIONS[c]} this.vars[${v1}]) {return ++line}
                        return this.offs[line];
                    }`);
                    ops[h(`${'00010'}${b(v0, bpv)}${b(v1, bpv)}${b(c, this.CONDITION_BITS)}`)] = this.global.fn;
                }
            }
        }
    }

    /**
     * Compiles all variants of while operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :     5     5 xx xx  2
     * number: 00011 xxxxx 00 01 00...
     * string: while (v0 < v1) {
     */
    static _compileLoop() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = this._toHexNum;
        const b      = this._toBinStr;
        const vars   = Math.pow(2, bpv);

        for (let c = 0; c < Math.pow(2, this.CONDITION_BITS); c++) {
            for (let v0 = 0; v0 < vars; v0++) {
                for (let v1 = 0; v1 < vars; v1++) {
                    eval(`Operators.global.fn = function (line) {
                        if (this.vars[${v0}] ${this._CONDITIONS[c]} this.vars[${v1}]) {return ++line}
                        return this.offs[line];
                    }`);
                    ops[h(`${'00011'}${b(v0, bpv)}${b(v1, bpv)}${b(c, this.CONDITION_BITS)}`)] = this.global.fn;
                }
            }
        }
    }

    /**
     * Compiles all variants of math operators and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :     5     5 xx xx xx  4
     * number: 00100 xxxxx 00 01 00 01...
     * string: v0 = v1 - v0
     */
    static _compileOperator() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = this._toHexNum;
        const b      = this._toBinStr;
        const vars   = Math.pow(2, bpv);

        for (let op = 0; op < Math.pow(2, this.FOUR_BITS); op++) {
            for (let v0 = 0; v0 < vars; v0++) {
                for (let v1 = 0; v1 < vars; v1++) {
                    for (let v2 = 0; v2 < vars; v2++) {
                        eval(`Operators.global.fn = function (line) {
                            ${this._OPERATORS[op](v0, v1, v2)}
                            return ++line;
                        }`);
                        ops[h(`${'00100'}${b(v0, bpv)}${b(v1, bpv)}${b(v2, bpv)}${b(op, this.FOUR_BITS)}`)] = this.global.fn;
                    }
                }
            }
        }
    }

    /**
     * Compiles all variants of function operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Function name consists of 10 bits. Example:
     *
     * bits  :     5     5         10
     * number: 00101 xxxxx 0000000001...
     * string: func n
     */
    static _compileFunc() {
        const ops    = this._compiledOperators;
        const h      = this._toHexNum;

        eval(`Operators.global.fn = function (line) {return this.offs[line]}`);
        ops[h(`${'00101'}`)] = this.global.fn;
    }

    /**
     * Compiles all variants of function call operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Function name consists of 10 bits. Example:
     *
     * bits  :     5     5         10
     * number: 00110 xxxxx 0000000001...
     * string: call n
     */
    static _compileFuncCall() {
        const ops    = this._compiledOperators;
        const h      = this._toHexNum;
        const bits   = Num.MAX_BITS - this.FUNC_NAME_BITS;
        const opBits = Num.BITS_PER_OPERATOR;

        eval(`Operators.global.fn = function (line, num) {
            const offs = this.funcs[num << ${opBits} >>> ${bits}];
            if (typeof offs !== 'undefined') {
                this.stack.push(line + 1);
                this.stack.push(this.vars.slice());
                return offs;
            }
            return ++line;
        }`);
        ops[h(`${'00110'}`)] = this.global.fn;
    }

    /**
     * Compiles all variants of return operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :     5     5
     * number: 00111 xxxxx...
     * string: return
     */
    static _compileReturn() {
        const ops     = this._compiledOperators;
        const h       = this._toHexNum;
        const vars    = Math.pow(2, OConfig.codeBitsPerVar);

        eval(`Operators.global.fn = function (line) {
            if (this.stack.length > 0) {
                const stackVars = this.stack.pop();
                const vars      = this.vars;
                for (let i = 0; i < ${vars}; i++) {vars[i] = stackVars[i]}
                return this.stack.pop();
            }
            return 0;
        }`);
        ops[h(`${'00111'}`)] = this.global.fn;
    }

    /**
     * Compiles all variants of } operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :     5     5
     * number: 01000 xxxxx...
     * string: }
     */
    static _compileBracket() {
        const ops     = this._compiledOperators;
        const h       = this._toHexNum;
        const vars    = Math.pow(2, OConfig.codeBitsPerVar);

        eval(`Operators.global.fn = function (line, num, org, lines) {
            const operator = lines[this.offs[line]] >>> Num.VAR_BITS_OFFS;
            if (operator === 0x3) {return this.offs[line]} // loop
            if (operator === 0x5) {                        // func
                const stackVars = this.stack.pop();
                const vars      = this.vars;
                for (let i = 0; i < ${vars}; i++) {vars[i] = stackVars[i]}
                return this.stack.pop();
            }
            return ++line;
        }`);
        ops[h(`${'01000'}`)] = this.global.fn;
    }

    /**
     * Compiles all variants of toMem operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :     5     5 xx xx
     * number: 01001 xxxxx 00 01...
     * string: toMem(v0, v1)
     */
    static _compileToMem() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = this._toHexNum;
        const b      = this._toBinStr;
        const vars   = Math.pow(2, bpv);
        const memLen = Math.pow(2, OConfig.orgMemBits);

        for (let v0 = 0; v0 < vars; v0++) {
            for (let v1 = 0; v1 < vars; v1++) {
                eval(`Operators.global.fn = function (line, num, org) {
                    const offs = ((this.vars[${v0}] + .5) << 0) >>> 0;
                    org.mem[offs >= ${memLen} ? ${memLen-1} : offs] = this.vars[${v1}];
                    return ++line;
                }`);
                ops[h(`${'01001'}${b(v0, bpv)}${b(v1, bpv)}`)] = this.global.fn;
            }
        }
    }

    /**
     * Compiles all variants of toMem operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :     5     5 xx xx
     * number: 01010 xxxxx 00 01...
     * string: v0 = fromMem(v1)
     */
    static _compileFromMem() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = this._toHexNum;
        const b      = this._toBinStr;
        const vars   = Math.pow(2, bpv);
        const memLen = Math.pow(2, OConfig.orgMemBits);

        for (let v0 = 0; v0 < vars; v0++) {
            for (let v1 = 0; v1 < vars; v1++) {
                eval(`Operators.global.fn = function (line, num, org) {
                    const offs = ((this.vars[${v1}] + .5) << 0) >>> 0;
                    this.vars[${v0}] = org.mem[offs >= ${memLen} ? ${memLen-1} : offs];
                    return ++line;
                }`);
                ops[h(`${'01010'}${b(v0, bpv)}${b(v1, bpv)}`)] = this.global.fn;
            }
        }
    }

    constructor(offs, vars) {
        /**
         * {Array} Array of offsets for closing braces. For 'for', 'if'
         * and other operators.
         */
        this.offs          = offs;
        /**
         * {Array} Available variables
         */
        this.vars          = vars;
        /**
         * {Object} Handlers map, which handle every variant of byte-code
         */
        this._OPERATORS_CB = Operators._compiledOperators;
        this.lens          = Operators.LENS;
        this.stack         = [];
        this.funcs         = [];
    }

    /**
     * Updates indexes of if, while, func,... in byte-code after any mutation
     * @param {Array} code Byte-code
     */
    updateIndexes(code) {
        const len     = code.length;
        const varOffs = Num.VAR_BITS_OFFS;
        const offs    = this.offs;
        const funcs   = this.funcs = [];
        const blocks  = [];

        for (let i = 0; i < len; i++) {
            const operator = code[i] >>> varOffs;
            if (operator === 0x2 || operator === 0x3) { // if, while
                offs[i] = i + 1;
                blocks.push(i);
                continue;
            }
            if (operator === 0x5) {                     // func
                offs[i] = i + 1;
                funcs.push(i + 1);
                blocks.push(i);
                continue;
            }
            if (operator === 0x8) {                     // bracket
                if (blocks.length > 0) {
                    offs[i] = blocks.pop();
                    offs[offs[i]] = i + 1;
                }
            }
        }
    }

    destroy() {
        this.funcs         = null;
        this.stack         = null;
        this._OPERATORS_CB = null;
        this.offs          = null;
        this.vars          = null;
    }

    /**
     * Returns operators array. Should be overridden in child class
     * @abstract
     */
    get operators() {return this._OPERATORS_CB}

    /**
     * Sets offsets array from outside
     * @param {Array} offs New offsets array
     */
    set offsets(offs) {this.offs = offs}
}

module.exports = Operators;