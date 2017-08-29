/**
 * Implements organism's code logic.
 * TODO: explain here code one number format,...
 *
 * @author DeadbraiN
 * TODO: may be this module is redundant
 * TODO: think about custom operators callbacks from outside. This is how
 * TODO: we may solve custom tasks
 */
import {Config}       from './../global/Config';
import Helper         from './../global/Helper';
import Observer       from './../global/Observer'
import {EVENTS}       from './../global/Events';
import {EVENT_AMOUNT} from './../global/Events';
import Num            from './Num';

export default class JSVM extends Observer {
    /**
     * Creates JSVM instance. codeEndCb will be called after last code line is run. classMap
     * is a map of classes. We need only one - Operators class. We use this approach, because
     * it's impossible to set class in a Config module. parent is used if JSVM instance is
     * in a cloning mode and we have to create a copy of it.
     * @param {Function} codeEndCb
     * @param {Observer} obs Observer instance for Operators class
     * @param {Array} classMap
     * @param {JSVM} parent Parent JSVM instance in case of cloning
     */
    constructor(codeEndCb, obs, classMap, parent = null) {
        super(EVENT_AMOUNT);

        /**
         * {Function} Callback, which is called on every organism
         * jsvm iteration. On it's end.
         */
        this._onCodeEnd   = codeEndCb;
        /**
         * {Array} Array of two numbers. first - line number where we have
         * to return if first line appears. second - line number, where ends
         * closing block '}' of block operator (e.g. for, if,...).
         */
        this._offsets     = [];
        this._vars        = parent && parent.vars && parent.vars.slice() || this._getVars();
        /**
         * {Function} Class, which implement all supported operators
         */
        this._operators   = new classMap[Config.codeOperatorsCls](this._offsets, this._vars, obs);
        this._code        = parent && parent.code || [];
        this._line        = 0;
        this._fitnessMode = Config.codeFitnessCls !== null;
    }

    get code()      {return this._code}
    get size()      {return this._code.length}
    get operators() {return this._operators};
    get vars()      {return this._vars}

    run(org) {
        let line    = this._line;
        let code    = this._code;
        let lines   = code.length;
        let len     = Config.codeYieldPeriod || lines;
        let fitMode = this._fitnessMode;
        let ops     = this._operators.operators;
        let getOp   = Num.getOperator;
        let ret     = false;
        let offs    = this._offsets;

        while (lines > 0 && len-- > 0 && org.alive) {
            line = ops[getOp(code[line])](code[line], line, org, lines, ret);

            if (ret = (offs.length > 0 && line === offs[offs.length - 1])) {
                offs.pop();
                line = offs.pop();
                continue;
            }
            if (line >= lines) {
                line = 0;
                offs.length = 0;
                if (this._onCodeEnd) {
                    this._onCodeEnd();
                }
                if (fitMode) {break}
            }
        }

        this._line = line;
    }

    destroy() {
        this._operators.destroy && this._operators.destroy();
        this._operators = null;
        this._vars      = null;
        this._code      = null;
        this._onCodeEnd = null;
        this.clear();
    }

    crossover(jsvm) {
        const rand    = Helper.rand;
        const len     = this._code.length;
        const len1    = jsvm.code.length;
        let   start   = rand(len);
        let   end     = rand(len);
        let   start1  = rand(len1);
        let   end1    = rand(len1);
        let   adds;

        if (start > end) {[start, end] = [end, start];}
        if (start1 > end1) {[start1, end1] = [end1, start1];}

        adds = Math.abs(end1 - start1 - end + start);
        if (this._fitnessMode && this._code.length + adds >= Config.codeMaxSize) {return 0}
        this._code.splice.apply(this._code, [start, end - start].concat(jsvm.code.slice(start1, end1)));
        this._reset();

        return adds;
    }

    /**
     * Inserts random generated number into the byte jsvm at random position
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
     * Removes random generated number into byte jsvm at random position
     */
    removeLine() {
        this._code.splice(Helper.rand(this._code.length), 1);
        this._reset();
    }

    getLine(index) {
        return this._code[index];
    }

    _reset() {
        this.fire(EVENTS.RESET_CODE);
        this._line           = 0;
        this._offsets.length = 0;
    }

    /**
     * Generates default variables jsvm. It should be in ES5 version, because
     * speed is important. Amount of vars depends on Config.codeVarAmount config.
     * @returns {Array} vars jsvm
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