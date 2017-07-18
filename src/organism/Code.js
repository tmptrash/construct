/**
 * Implements organism's code logic.
 * TODO: explain here code, byteCode, one number format,...
 *
 * @author DeadbraiN
 * TODO: may be this module is redundant
 * TODO: think about custom operators callbacks from outside. This is how
 * TODO: we may solve custom tasks
 */
import Config    from './../global/Config';
import Helper    from './../global/Helper';
import Observer  from './../global/Observer'
import Operators from './Operators';
import Num       from './Num';

export default class Code extends Observer {
    constructor(codeEndCb, vars = '') {
        super();

        /**
         * {Function} Callback, which is called on every organism
         * code iteration. On it's end.
         */
        this._onCodeEnd = codeEndCb;
        /**
         * {Array} Array of offsets for closing braces. For 'for', 'if'
         * and all block operators.
         */
        this._offsets   = [];
        this._operators = new Operators(this._offsets);
        this._vars      = vars;
        this._byteCode  = [];
        this._code      = [];
        this._gen       = null;
        this.compile();
    }

    get size() {return this._byteCode.length;}
    get operators() {return this._operators.size;};
    get byteCode() {return this._byteCode;}
    get vars() {return this._vars;}

    /**
     * Assembles all code parts together: header + byteCode + footer. Creates generator
     * function and stores it in this.__compiled field. It also prepossesses byte code:
     * inserts yield operator closes braces for 'if' and 'for' operators.
     * @param {Organism} org Parent organism of current code
     */
    compile(org) {
        this._code = this._compileByteCode(this._byteCode);
        eval(`this.__compiled=function* dna(org){const rand=Math.random,pi=Math.PI;${this._getVars()};while(true){yield;${this._code.join(';')};this._onCodeEnd()}}`);
        this._gen = this.__compiled(org);
    }

    run() {
        this._gen.next();
    }

    destroy() {
        this._vars      = '';
        this._byteCode  = [];
        this._code      = [];
        this._offsets   = [];
        this._gen       = {next: () => {}};
        this.__compiled = null;
    }

    /**
     * Clones both byte and string code from 'code' argument
     * @param {Code} code Source code, from which we will copy
     */
    clone(code) {
        this._code     = code.cloneCode();
        this._byteCode = code.cloneByteCode();
    }

    crossover(code) {
        const rand   = Helper.rand;
        const len    = this._byteCode.length;
        const len1   = code.byteCode.length;
        let   start  = rand(len);
        let   end    = rand(len);
        let   start1 = rand(len1);
        let   end1   = rand(len1);

        if (start > end) {[start, end] = [end, start];}
        if (start1 > end1) {[start1, end1] = [end1, start1];}

        this._byteCode.splice.apply(this._byteCode, [start, end - start].concat(code.byteCode.slice(start1, end1)));
    }

    /**
     * Is used for clonning string code only. This is how you
     * can get separate copy of the code.
     * @return {Array} Array of strings
     */
    cloneCode() {
        return this._code.slice();
    }

    /**
     * Is used for clonning byte code only. This is how you
     * can get separate copy of the byte code.
     * @return {Array} Array of 32bit numbers
     */
    cloneByteCode() {
        return this._byteCode.slice();
    }

    /**
     * Inserts random generated number into the byte code at random position
     */
    insertLine() {
        this._byteCode.splice(Helper.rand(this._byteCode.length), 0, Num.get());
    }

    updateLine(index, number = Num.get()) {
        this._byteCode[index] = number;
    }

    /**
     * Removes random generated number into byte code at random position
     */
    removeLine() {
        this._byteCode.splice(Helper.rand(this._byteCode.length), 1);
    }

    getLine(index) {
        return this._byteCode[index];
    }

    _compileByteCode(byteCode) {
        const len         = byteCode.length;
        const yieldPeriod = Config.codeYieldPeriod;
        const operators   = this._operators.operators;
        let   code        = new Array(len);
        let   offsets     = this._offsets;
        let   operator;

        for (let i = 0; i < len; i++) {
            operator = operators[Num.getOperator(byteCode[i])](byteCode[i], i, len);
            //
            // This code is used for closing blocks for if, for and other
            // blocked operators.
            //
            if (offsets[offsets.length - 1] === i && offsets.length > 0) {
                operator = operator + '}';
                offsets.pop();
            }
            //
            // Every yieldPeriod 'yield' operator will be inserted into the code
            //
            if (i % yieldPeriod === 0 && i > 0) {operator = operator + ';yield';}
            code[i] = operator;
        }
        if (offsets.length > 0) {
            code[code.length - 1] += ('}'.repeat(offsets.length));
            offsets.length = 0;
        }

        return code;
    }

    /**
     * Generates default variables code. It should be in ES5 version, because
     * speed is important. Amount of vars depends on Config.codeVarAmount config.
     * @returns {String} vars code
     * @private
     */
    _getVars() {
        if (this._vars.length > 0) {return this._vars;}

        const vars  = Config.codeVarAmount;
        let   code  = new Array(vars);
        const range = Config.codeVarInitRange;
        const rand  = Helper.rand;

        for (let i = 0; i < vars; i++) {
            code[i] = `let v${i}=${rand(range)-range/2}`;
        }

        return (this._vars = code.join(';'));
    }
}