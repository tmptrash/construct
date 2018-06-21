/**
 * This file contains interface for available operators for some special
 * task. You have to inherit your operators class from this one.
 *
 * @author flatline
 */
const OConfig         = require('./../manager/plugins/organisms/Config');
const Num             = require('./Num');
const Helper          = require('./../../../common/src/Helper');

const OPERATOR_AMOUNT = 12;
const MAX_STACK_SIZE  = 30000;

class Operators {
    /**
     * Compiles all variants of bite-code to speed up the execution.
     * @param {Number} operators Amount of operators
     */
    static compile(operators = OPERATOR_AMOUNT) {
        const bitsPerOp         = OConfig.CODE_BITS_PER_OPERATOR;
        const MAX_BITS          = 32;
        /**
         * {Object} Container for storing of dynamic operator handlers
         */
        this.global             = typeof window === 'undefined' ? global : window;
        /**
         * {Number} Bit related constants
         */
        this.CONDITION_BITS     = 4;
        this.FUNC_NAME_BITS     = 8;
        /**
         * {Array} Available conditions for if operator
         */
        this._CONDITIONS        = ['+', '-', '*', '/', '%', '&', '|', '^', '>>', '<<', '>>>', '<', '>', '===', '!==', '<='];
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
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 3 + this.CONDITION_BITS),  // math
            MAX_BITS - (bitsPerOp),                                                     // func
            MAX_BITS - (bitsPerOp),                                                     // func call
            MAX_BITS - (bitsPerOp),                                                     // return
            MAX_BITS - (bitsPerOp),                                                     // bracket
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 2),                        // toMem
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 2),                        // fromMem
            MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 2)                         // rand
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
        this._compileVar();       // 0
        this._compileConst();     // 1
        this._compileIf();        // 2
        this._compileLoop();      // 3
        this._compileOperator();  // 4
        this._compileFunc();      // 5
        this._compileFuncCall();  // 6
        this._compileReturn();    // 7
        this._compileBracket();   // 8
        this._compileToMem();     // 9
        this._compileFromMem();   // 10
        this._compileRand();      // 11
    }

    /**
     * Compiles all variants of var operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6 xx xx
     * number: 100000 00 01...
     * string: v0 = v1
     */
    static _compileVar() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = Helper.toHexNum;
        const b      = Helper.toBinStr;
        const vars   = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            for (let v1 = 0; v1 < vars; v1++) {
                eval(`Operators.global.fn = function vars(line) {
                    this.vars[${v0}] = this.vars[${v1}];
                    return ++line;
                }`);
                ops[h(`${'100000'}${b(v0, bpv)}${b(v1, bpv)}`)] = this.global.fn;
            }
        }
    }

    /**
     * Compiles all variants of const operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6 xx xx
     * number: 100001 00 01...
     * string: v0 = 1
     */
    static _compileConst() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const bits     = Num.MAX_BITS - OConfig.codeConstBits;
        const bits1var = Num.BITS_OF_VAR1;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function consts(line, num) {
                this.vars[${v0}] = num << ${bits1var} >>> ${bits};
                return ++line;
            }`);
            ops[h(`${'100001'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of if operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6 xx xx    4
     * number: 100010 00 01 0000...
     * string: if (v0 + v1) {
     */
    static _compileIf() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = Helper.toHexNum;
        const b      = Helper.toBinStr;
        const vars   = Math.pow(2, bpv);

        for (let c = 0; c < Math.pow(2, this.CONDITION_BITS); c++) {
            for (let v0 = 0; v0 < vars; v0++) {
                for (let v1 = 0; v1 < vars; v1++) {
                    eval(`Operators.global.fn = function cond(line) {
                        if (this.vars[${v0}] ${this._CONDITIONS[c]} this.vars[${v1}]) {return ++line}
                        return this.offs[line] === line ? ++line : this.offs[line];
                    }`);
                    ops[h(`${'100010'}${b(v0, bpv)}${b(v1, bpv)}${b(c, this.CONDITION_BITS)}`)] = this.global.fn;
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
     * bits  :      6 xx xx  4
     * number: 100011 00 01 00...
     * string: while (v0 < v1) {
     */
    static _compileLoop() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = Helper.toHexNum;
        const b      = Helper.toBinStr;
        const vars   = Math.pow(2, bpv);

        for (let c = 0; c < Math.pow(2, this.CONDITION_BITS); c++) {
            for (let v0 = 0; v0 < vars; v0++) {
                for (let v1 = 0; v1 < vars; v1++) {
                    eval(`Operators.global.fn = function loop(line) {
                        if (this.vars[${v0}] ${this._CONDITIONS[c]} this.vars[${v1}]) {return ++line}
                        return this.offs[line] === line ? ++line : this.offs[line];
                    }`);
                    ops[h(`${'100011'}${b(v0, bpv)}${b(v1, bpv)}${b(c, this.CONDITION_BITS)}`)] = this.global.fn;
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
     * bits  :      6 xx xx xx    4
     * number: 100100 00 01 00 0001...
     * string: v0 = v1 - v0
     */
    static _compileOperator() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = Helper.toHexNum;
        const b      = Helper.toBinStr;
        const vars   = Math.pow(2, bpv);
        const opsLen = Math.pow(2, this.CONDITION_BITS);

        for (let op = 0; op < opsLen; op++) {
            for (let v0 = 0; v0 < vars; v0++) {
                for (let v1 = 0; v1 < vars; v1++) {
                    for (let v2 = 0; v2 < vars; v2++) {
                        eval(`Operators.global.fn = function math(line) {
                            ${this._OPERATORS[op](v0, v1, v2)}
                            return ++line;
                        }`);
                        ops[h(`${'100100'}${b(v0, bpv)}${b(v1, bpv)}${b(v2, bpv)}${b(op, this.CONDITION_BITS)}`)] = this.global.fn;
                    }
                }
            }
        }
    }

    /**
     * Compiles all variants of function operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Function name(index) consists of 8 bits. Example:
     *
     * bits  :      6
     * number: 100101...
     * string: func
     */
    static _compileFunc() {
        const ops    = this._compiledOperators;
        const h      = Helper.toHexNum;

        eval(`Operators.global.fn = function func(line) {return this.offs[line] === line ? ++line : this.offs[line]}`);
        ops[h(`${'100101'}`)] = this.global.fn;
    }

    /**
     * Compiles all variants of function call operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. If condition bit is set to 0, then variable value will be
     * used as function name. If 1 then hard coded functions name will be
     * get from byte-code. Function name consists of 10 bits. Example:
     *
     * bits  :      6 1        8
     * number: 100110 1 00000001...
     * string: call v1
     */
    static _compileFuncCall() {
        const ops     = this._compiledOperators;
        const h       = Helper.toHexNum;
        const ifBit   = Num.MAX_BITS - 1;
        const fnBits  = Num.MAX_BITS - this.FUNC_NAME_BITS;
        const funcs   = Math.pow(2, this.FUNC_NAME_BITS);
        const varBits = Num.MAX_BITS - OConfig.codeBitsPerVar;
        const opBits  = Num.BITS_PER_OPERATOR;

        eval(`Operators.global.fn = function call(line, num, org) {
            const data = num << ${opBits};
            const offs = this.funcs[data >>> ${ifBit} === 0 ? Math.round(this.vars[data << 1 >>> ${varBits}]) % ${funcs} : data << 1 >>> ${fnBits}];
            if (offs !== undefined) {
                if (this.stack.length > ${MAX_STACK_SIZE}) {
                    org.energy -= org.vm.size;
                    return ++line;
                }
                this.stack.push(line + 1, offs - 1, this.vars.slice());
                return offs;
            }
            return ++line;
        }`);
        ops[h(`${'100110'}`)] = this.global.fn;
    }

    /**
     * Compiles all variants of return operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Returns fro custom function. If returns appears outside
     * the function, then interpreter jumps into zero line. Example:
     *
     * bits  :      6
     * number: 100111 ...
     * string: return
     */
    static _compileReturn() {
        const ops     = this._compiledOperators;
        const h       = Helper.toHexNum;
        const vars    = Math.pow(2, OConfig.codeBitsPerVar);

        eval(`Operators.global.fn = function ret(line) {
            const stack = this.stack;
            if (stack.length > 0) {
                const stackVars = stack.pop();
                const vars      = this.vars;
                for (let i = 0; i < ${vars}; i++) {vars[i] = stackVars[i]}
                stack.pop();
                return stack.pop();
            }
            return 0;
        }`);
        ops[h(`${'100111'}`)] = this.global.fn;
    }

    /**
     * Compiles all variants of } operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6
     * number: 101000...
     * string: }
     */
    static _compileBracket() {
        const ops     = this._compiledOperators;
        const h       = Helper.toHexNum;
        const vars    = Math.pow(2, OConfig.codeBitsPerVar);

        eval(`Operators.global.fn = function bracket(line, num, org, lines) {
            const startLine = this.offs[line];
            const operator  = startLine === undefined ? -1 : lines[startLine] >>> Num.VAR_BITS_OFFS;
            if (operator === 0b100011) {return this.offs[line]} // loop
            if (operator === 0b100101) {                        // func
                const stack = this.stack;
                if (stack[stack.length - 2] === startLine) {
                    const stackVars = stack.pop();
                    const vars      = this.vars;
                    for (let i = 0; i < ${vars}; i++) {vars[i] = stackVars[i]}
                    stack.pop();
                    return this.stack.pop();
                }
            }
            return ++line;
        }`);
        ops[h(`${'101000'}`)] = this.global.fn;
    }

    /**
     * Compiles all variants of toMem operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6 xx xx
     * number: 101001 00 01...
     * string: toMem(v0, v1)
     */
    static _compileToMem() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = Helper.toHexNum;
        const b      = Helper.toBinStr;
        const vars   = Math.pow(2, bpv);
        const memLen = Math.pow(2, OConfig.orgMemBits) - 1;

        for (let v0 = 0; v0 < vars; v0++) {
            for (let v1 = 0; v1 < vars; v1++) {
                eval(`Operators.global.fn = function toMem(line, num, org) {
                    const offs = ((this.vars[${v0}] + .5) << 0) >>> 0;
                    org.mem[offs > ${memLen} ? ${memLen} : offs] = this.vars[${v1}];
                    return ++line;
                }`);
                ops[h(`${'101001'}${b(v0, bpv)}${b(v1, bpv)}`)] = this.global.fn;
            }
        }
    }

    /**
     * Compiles all variants of toMem operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6 xx xx
     * number: 101010 00 01...
     * string: v0 = fromMem(v1)
     */
    static _compileFromMem() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = Helper.toHexNum;
        const b      = Helper.toBinStr;
        const vars   = Math.pow(2, bpv);
        const memLen = Math.pow(2, OConfig.orgMemBits) - 1;

        for (let v0 = 0; v0 < vars; v0++) {
            for (let v1 = 0; v1 < vars; v1++) {
                eval(`Operators.global.fn = function fromMem(line, num, org) {
                    const offs = ((this.vars[${v1}] + .5) << 0) >>> 0;
                    this.vars[${v0}] = org.mem[offs > ${memLen} ? ${memLen} : offs];
                    return ++line;
                }`);
                ops[h(`${'101010'}${b(v0, bpv)}${b(v1, bpv)}`)] = this.global.fn;
            }
        }
    }

    /**
     * Compiles all variants of 'rand' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6 xx xx
     * number: 101011 01 11...
     * string: v1 = rand(v3)
     */
    static _compileRand() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            for (let v1 = 0; v1 < vars; v1++) {
                eval(`Operators.global.fn = function rand(line) {
                    this.vars[${v0}] = Helper.rand(((this.vars[${v1}] + .5) << 0 >>> 0));
                    return ++line;
                }`);
                ops[h(`${'101011'}${b(v0, bpv)}${b(v1, bpv)}`)] = this.global.fn;
            }
        }
    }

    constructor(offs, vars) {
        this._MAX_FUNC_AMOUNT = Math.pow(2, Operators.FUNC_NAME_BITS);
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
        this.stack         = [];
        this.funcs         = new Array(this._MAX_FUNC_AMOUNT);
    }

    /**
     * Updates indexes of if, while, func,... in byte-code after any mutation
     * @param {Array} code Byte-code
     */
    updateIndexes(code) {
        const len     = code.length;
        const varOffs = Num.VAR_BITS_OFFS;
        const offs    = this.offs;
        const funcs   = this.funcs = new Array(this._MAX_FUNC_AMOUNT);
        const blocks  = [];
        let   func    = 0;

        this.stack = [];
        for (let i = 0; i < len; i++) {
            const operator = code[i] >>> varOffs;
            if (operator === 0b100010 || operator === 0b100011) { // if, while
                offs[i] = i;
                blocks.push(i);
                continue;
            }
            if (operator === 0b100101) {                         // func
                offs[i] = i;
                funcs[func++] = i + 1;
                blocks.push(i);
                continue;
            }
            if (operator === 0b101000) {                         // bracket
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
    get length() {return OPERATOR_AMOUNT}

    get operators() {return this._OPERATORS_CB}

    /**
     * Sets offsets array from outside
     * @param {Array} offs New offsets array
     */
    set offsets(offs) {this.offs = offs}
}

module.exports = Operators;