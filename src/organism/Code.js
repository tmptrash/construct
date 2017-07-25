/**
 * Implements organism's code logic.
 * TODO: explain here code one number format,...
 *
 * @author DeadbraiN
 * TODO: may be this module is redundant
 * TODO: think about custom operators callbacks from outside. This is how
 * TODO: we may solve custom tasks
 */
import Config      from './../global/Config';
import Helper      from './../global/Helper';
import Observer    from './../global/Observer'
import Num         from './Num';

export default class Code extends Observer {
    constructor(codeEndCb, operatorsCls, org, vars = null) {
        super();

        /**
         * {Function} Callback, which is called on every organism
         * code iteration. On it's end.
         */
        this._onCodeEnd = codeEndCb;
        /**
         * {Array} Array of two numbers. first - line number where we have
         * to return if first line appears. second - line number, where ends
         * closing block '}' of for or if operator.
         */
        this._offsets   = [];
        this._vars      = vars || this._getVars();
        /**
         * {Array} Array of offsets for closing braces. For 'for', 'if'
         * and all block operators.
         */
        this._operators = new operatorsCls(this._offsets, this._vars, org);
        this._code      = [];
        this._line      = 0;
    }

    get code() {return this._code;}
    get size() {return this._code.length;}
    get operators() {return this._operators.size;};
    get vars() {return this._vars;}

    run(param) {
        let line  = this._line;
        let len   = Config.codeYieldPeriod;
        let ops   = this._operators.operators;
        let code  = this._code;
        let lines = code.length;
        let getOp = Num.getOperator;
        let ret   = false;
        let offs  = this._offsets;

        while (lines > 0 && len-- > 0) {
            line = ops[getOp(code[line])](code[line], line, param, lines, ret);

            if (ret = (offs.length > 0 && line === offs[offs.length - 1])) {
                offs.pop();
                line = offs.pop();
                continue;
            }
            if (line >= lines) {
                line = 0;
                this._offsets.length = 0;
                this._onCodeEnd();
            }
        }

        this._line = line;
    }

    destroy() {
        this._operators.destroy();
        this._operators = null;
        this._vars      = null;
        this._code      = null;
        this._onCodeEnd = null;
        this.clear();
    }

    /**
     * Clones both byte and string code from 'code' argument
     * @param {Code} code Source code, from which we will copy
     */
    // TODO: do we need this?
    clone(code) {
        this._code = code.cloneCode();
    }

    crossover(code) {
        const rand   = Helper.rand;
        const len    = this._code.length;
        const len1   = code.code.length;
        let   start  = rand(len);
        let   end    = rand(len);
        let   start1 = rand(len1);
        let   end1   = rand(len1);

        if (start > end) {[start, end] = [end, start];}
        if (start1 > end1) {[start1, end1] = [end1, start1];}

        this._code.splice.apply(this._code, [start, end - start].concat(code.code.slice(start1, end1)));
        this._reset();

        return end1 - start1 - end + start;
    }

    /**
     * Is used for cloning byte code only. This is how you
     * can get separate copy of the byte code.
     * @return {Array} Array of 32bit numbers
     */
    cloneCode() {
        return this._code.slice();
    }

    /**
     * Inserts random generated number into the byte code at random position
     */
    insertLine() {
        this._code.splice(Helper.rand(this._code.length), 0, Num.get());
        this._reset();
    }

    updateLine(index, number) {
        this._code[index] = number;
        this._reset();
    }

    /**
     * Removes random generated number into byte code at random position
     */
    removeLine() {
        this._code.splice(Helper.rand(this._code.length), 1);
        this._reset();
    }

    getLine(index) {
        return this._code[index];
    }

    _reset() {
        this._line           = 0;
        this._offsets.length = 0;
    }

    /**
     * Generates default variables code. It should be in ES5 version, because
     * speed is important. Amount of vars depends on Config.codeVarAmount config.
     * @returns {Array} vars code
     * @private
     */
    _getVars() {
        if (this._vars && this._vars.length > 0) {return this._vars;}

        const len    = Config.codeVarAmount;
        let   vars   = new Array(len);
        const range  = Config.codeVarInitRange;
        const range2 = range / 2;
        const rand   = Helper.rand;

        for (let i = 0; i < len; i++) {
            vars[i] = rand(range) - range2;
        }

        return (this._vars = vars);
    }
}