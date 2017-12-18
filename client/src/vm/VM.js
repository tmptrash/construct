/**
 * Simple Virtual Machine for DOS language. Runs code line by line till the
 * last and calls operators associated callbacks.
 * TODO: explain here code one number format,...
 *
 * @author flatline
 * TODO: may be this module is redundant
 * TODO: think about custom operators callbacks from outside. This is how
 * TODO: we may solve custom tasks
 */
const Helper       = require('./../../../common/src/Helper');
const Observer     = require('./../../../common/src/Observer');
const OConfig      = require('./../manager/plugins/organisms/Config');
const EVENTS       = require('./../../src/share/Events').EVENTS;
const EVENT_AMOUNT = require('./../../src/share/Events').EVENT_AMOUNT;
const Num          = require('./Num');
/**
 * {Number} Maximum stack size, which may be used for recursion or function parameters
 */
const MAX_STACK_SIZE = 30000;
/**
 * {Number} Index of first bit after operator bits
 */
const VAR_BITS_OFFS  = Num.VAR_BITS_OFFS;

class VM extends Observer {
    /**
     * Creates VM instance. codeEndCb will be called after last code line is run.
     * parent is used if VM instance is in a cloning mode and we have to create
     * a copy of it.
     * @param {Function} codeEndCb
     * @param {Observer} obs Observer instance for Operators class
     * @param {Function} operatorCls Class of operators
     * @param {VM} parent Parent VM instance in case of cloning
     */
    constructor(codeEndCb, obs, operatorCls, parent = null) {
        super(EVENT_AMOUNT);

        this._obs         = obs;
        /**
         * {Function} Class of operators, with implementation of all available
         * script parts for current VM instance
         */
        this._operatorCls = operatorCls;
        /**
         * {Function} Callback, which is called on every organism
         * vm iteration. On it's end.
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
        this._operators   = new operatorCls(this._offsets, this._vars, obs);
        this._ops         = this._operators.operators;
        this._code        = parent && parent.code.slice() || [];
        this._line        = 0;
        this._linesRun    = 0;
    }

    get code()      {return this._code}
    get size()      {return this._code.length}
    get operators() {return this._operators}
    get vars()      {return this._vars}
    get offsets()   {return this._offsets}
    get line()      {return this._line}

    serialize() {
        return {
            offsets: this._offsets.slice(),
            vars   : this._vars.slice(),
            // 'operators' field will be added after insertion
            code   : this._code.slice(),
            line   : this._line
        };
    }

    unserialize(json) {
        this._offsets   = json.offsets;
        this._vars      = json.vars;
        this._code      = json.code;
        this._line      = json.line;
        this._operators = new this._operatorCls(this._offsets, this._vars, this._obs);
    }

    /**
     * Walks through code lines (32bit numbers) one by one and runs associated
     * with line type callback. These callbacks interpret one line of code like:
     * condition, loop, function call etc...
     * @param {Organism} org Current organism
     */
    run(org) {
        const code  = this._code;
        const lines = code.length;
        const ops   = this._ops;
        const offs  = this._offsets;
        const len2  = lines === 0 ? 0 : OConfig.codeYieldPeriod || lines;
        let   len   = len2;
        let   line  = this._line;
        let   ret   = false;

        while (len-- > 0 && org.alive) {
            line = ops[code[line] >>> VAR_BITS_OFFS](code[line], line, org, lines, ret);
            //
            // We found closing bracket '}' of some loop and have to return
            // to the beginning of operator (e.g.: for)
            //
            if ((ret = (offs.length > 0 && line === offs[offs.length - 1]))) {
                offs.pop();
                line = offs.pop();
                continue;
            }
            if (line >= lines) {
                line = 0;
                org.alive && (this._operators.offsets = (this._offsets = []));
                this._onCodeEnd(this._linesRun + (len2 - len));
                this._linesRun = -(len2 - len);
                break;
            }
        }

        this._linesRun += (len2 - len);
        this._line      = line;
    }

    destroy() {
        this._operators.destroy && this._operators.destroy();
        this._operators = null;
        this._vars      = null;
        this._code      = null;
        this._onCodeEnd = null;

        super.destroy();
    }

    /**
     * Does crossover between two parent byte codes. Takes second vm's code part
     * (from start1 to end1 offset) and inserts it instead first vm code part (start...end).
     * For example:
     *   code1 : [1,2,3]
     *   code2 : [4,5,6]
     *   start : 1
     *   end   : 2
     *   start1: 0
     *   end1  : 2
     *   jsvm1.crossover(jsvm2) // [4,5,6] instead [2,3] ->, jsvm1 === [1,4,5,6]
     *
     * @param {VM} vm VM instance, from where we have to cut code part
     * @returns {Number} Amount of changes in current (this) vm
     */
    crossover(vm) {
        const rand   = Helper.rand;
        const len    = this._code.length;
        const len1   = vm.code.length;
        let   start  = rand(len);
        let   end    = rand(len);
        let   start1 = rand(len1);
        let   end1   = rand(len1);
        let   adds;

        if (start > end) {
            [start, end] = [end, start]
        }
        if (start1 > end1) {
            [start1, end1] = [end1, start1]
        }

        adds = Math.abs(end1 - start1 - end + start);
        if (this._code.length + adds >= OConfig.codeMaxSize) {
            return 0
        }
        this._code.splice.apply(this._code, [start, end - start + 1].concat(vm.code.slice(start1, end1 + 1)));
        this._reset();

        return adds;
    }

    /**
     * Takes few lines from itself and makes a copy of them. After that inserts
     * them before or after copied part. All positions are random
     * @return {Number} Amount of added/copied lines
     */
    copyLines() {
        const rand    = Helper.rand;
        const code    = this._code;
        const codeLen = code.length;
        const start   = rand(codeLen);
        const end     = start + rand(codeLen - start);
        //
        // Because we use spread (...) operator stack size is important
        // for amount of parameters and we shouldn't exceed it
        //
        if (end - start > MAX_STACK_SIZE) {
            return 0;
        }
        //
        // Organism size should be less them codeMaxSize
        //
        if (code.length + end - start >= OConfig.codeMaxSize) {return 0}
        //
        // We may insert copied piece before "start" (0) or after "end" (1)
        //
        if (rand(2) === 0) {
            code.splice(rand(start), 0, ...code.slice(start, end));
            return end - start;
        }

        code.splice(end + rand(codeLen - end + 1), 0, ...code.slice(start, end));

        return end - start;
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
     * Removes random generated number into byte vm at random position
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
        this._line = 0;
        this._operators.offsets = (this._offsets = []);
    }

    /**
     * Generates default variables vm. It should be in ES5 version, because
     * speed is important. Amount of vars depends on OConfig.codeBitsPerVar config.
     * @returns {Array} vars vm
     * @private
     */
    _getVars() {
        if (this._vars && this._vars.length > 0) {return this._vars}

        const len    = Math.pow(2, OConfig.codeBitsPerVar);
        const range  = OConfig.codeVarInitRange;
        const range2 = range / 2;
        const rand   = Helper.rand;
        let   vars   = new Array(len);

        for (let i = 0; i < len; i++) {
            vars[i] = rand(range) - range2;
        }

        return (this._vars = vars);
    }
}

module.exports = VM;