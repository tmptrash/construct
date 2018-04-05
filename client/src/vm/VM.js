/**
 * Simple Virtual Machine for DOS language. Runs code line by line till the
 * last and calls operators associated callbacks.
 * TODO: explain here code one number format,...
 *
 * @author flatline
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

class VM extends Observer {
    /**
     * Creates VM instance. parent is used if VM instance is in a
     * cloning mode and we have to create a copy of it.
     * @param {Observer} obs observer for external events firing
     * @param {Function} operatorCls Class of operators
     * @param {Array} weights Weights of operations
     * @param {VM} parent Parent VM instance in case of cloning
     */
    constructor(obs, operatorCls, weights, parent = null) {
        super(EVENT_AMOUNT);

        this._obs          = obs;
        this._weights      = weights;
        /**
         * {Function} Class of operators, with implementation of all available
         * script parts for current VM instance
         */
        this._operatorCls  = operatorCls;
        this._vars         = parent && parent.vars && parent.vars.slice() || this._getVars();
        this._code         = parent && parent.code.slice() || [248239118,260479783,290420886,180023848,29570522,354779824,220958594,315264606,231705066,47430264,290627113,366052124,159023662,55933308,219407615,41245567,259537331,120719242,284333530,113456602,354779824,35757647,276608152,211558321,285599842,264825877,76874876,263341538,292918152,78259025,143343650,22767412,330225150,284643353,231705066,47430264,290627113,366052124,142246446,55933308,219407615,41245567,259537331,120719242,284333530,113456602,354779824,35757647,315264606,276608152,211558321,285599842,277256487,171806725,12565195,149897134,226925351,322983007,35522715,175339998,262541555,276608144,161226673,285599842,226924839,289247237,355581321,71025539,265895966];
        this._line         = parent && parent.line || 0;
        /**
         * {Array} Array of two numbers. first - line number where we have
         * to return if first line appears. second - line number, where ends
         * closing block '}' of block operator (e.g. for, if,...).
         */
        this._offsets      = [this._code.length];
        /**
         * {Function} Class, which implement all supported operators
         */
        this._operators    = new operatorCls(this._offsets, this._vars, obs);
        this._ops          = this._operators.operators;
    }

    get code()      {return this._code}
    get size()      {return this._code.length}
    get operators() {return this._operators}
    get vars()      {return this._vars}
    get line()      {return this._line}

    serialize() {
        return {
            // 'obs' field will be added after deserialization
            // 'operatorsCls' field will be added after deserialization
            // 'operators' field will be added after deserialization
            // 'weights' field will be added after deserialization
            offsets: this._offsets.slice(),
            vars   : this._vars.slice(),
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
     * @return {Number} Amount of run lines
     */
    run(org) {
        const code     = this._code;
        const lines    = code.length;
        if (lines < 1) {return 0}
        const ops      = this._ops;
        const offs     = this._offsets;
        const period   = OConfig.codeYieldPeriod;
        const OFFS     = Num.VAR_BITS_OFFS;
        const WEIGHTS  = this._weights;
        let   len      = period;
        let   line     = this._line;
        let   operator;

        while (len > 0 && org.energy > 0) {
            operator    = code[line] >>> OFFS;
            line        = ops[operator](code[line], line, org, lines);
            //
            // This is very important peace of logic. As big the organism is
            // as more energy he spends
            //
            org.energy -= WEIGHTS[operator];
            //
            // We found closing bracket '}' of some loop and have to return
            // to the beginning of operator (e.g.: for)
            //
            while (offs.length > 1 && line === offs[offs.length - 1]) {
                offs.pop();
                line = offs.pop();
            }
            //
            // We reach the end of the script and have to run it from the beginning
            //
            if (line >= lines && org.energy > 0) {
                line = 0;
                this._operators.offsets = this._offsets = [code.length];
            }
            len--;
        }
        this._line = line;

        return period - len;
    }

    destroy() {
        this._ops         = null;
        this._operators.destroy && this._operators.destroy();
        this._operators   = null;
        this._offsets     = [];
        this._code        = null;
        this._vars        = null;
        this._operatorCls = null;
        this._weights     = null;
        this._obs         = null;

        super.destroy();
    }

    /**
     * Does crossover between two parent byte codes. Takes second vm's code part
     * (from start1 to end1 offset) and inserts it into first vm code part (start...end).
     * For example:
     *   code1 : [1,2,3]
     *   code2 : [4,5,6]
     *   start : 1
     *   end   : 2
     *   start1: 0
     *   end1  : 2
     *   vm1.crossover(vm2) // [4,5,6] instead [2,3] ->, vm1 === [1,4,5,6]
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

        if (start > end)   {[start, end]   = [end, start]}
        if (start1 > end1) {[start1, end1] = [end1, start1]}

        adds = end1 - start1 - end + start;
        if (this._code.length + adds >= OConfig.codeMaxSize) {
            return 0
        }
        this._code.splice(...[start, end - start + 1].concat(vm.code.slice(start1, end1 + 1)));
        this._reset();

        return adds;
    }

    /**
     * Takes few lines from itself and inserts them before or after copied
     * part. All positions are random.
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
        if (codeLen + end - start >= OConfig.codeMaxSize) {return 0}
        //
        // We may insert copied piece before "start" (0) or after "end" (1)
        //
        if (rand(2) === 0) {
            code.splice(rand(start), 0, ...code.slice(start, end));
            this._reset();
            return end - start;
        }

        code.splice(end + rand(codeLen - end + 1), 0, ...code.slice(start, end));
        this._reset();

        return end - start;
    }

    /**
     * Inserts random generated number into the byte code at random position
     */
    insertLine() {
        this._code.splice(Helper.rand(this._code.length), 0, Num.rand());
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

    /**
     * Generates random code and inserts it starting from 'pos'. The
     * length of generated code is 'size'. Final code length shouldn't
     * be greater then original size.
     * @param {Number} pos Insert position
     * @param {Number} size generated code size
     */
    generate(pos, size) {
        const orgCode = this._code;

        size = pos + size;
        while (pos < size) {orgCode[pos++] = Num.rand()}
        this._reset();
    }

    _reset() {
        this.fire(EVENTS.RESET_CODE);
        this._line = 0;
        this._operators.offsets = (this._offsets = [this._code.length]);
    }

    /**
     * Generates default variables vm. It should be in ES5 version, because
     * speed is important. Amount of vars depends on OConfig.codeBitsPerVar config.
     * @returns {Array} Filled variable array
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