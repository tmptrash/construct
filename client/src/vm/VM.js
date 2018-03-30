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
        this._code         = parent && parent.code.slice() || [102010341,226191885,200109152,129239321,120230511,212700737,146086204,169006534,70810654,236109088,21009195,234433901,101041014,153424224,172525892,163739837,155055718,77473223,160792938,204092844,4306977,186406410,128227592,43980086,130041897,170032548,169377297,43538070,192001244,179556805,174174625,228493827,100127000,117130125,117350792,64579162,230088461,180523805,22716019,44503895,111912075,106541750,185900561,49424461,314484569,248020267,284600795,196179104,81616173,220252955,66643426,138471815,249522957,225747005,235973814,78136757,245329089,149223185,196325976,90216701,8462368,243745810,275565066,315780670,126426118,115017256,77957900,43382097,219086631,104748276,164034927,187161306,258273627,274605007,251246552,109875154,162762758,359649722,21631269,160939590,135635862,347922125,47028039,103268861,33481886,328856887,320791974,102564578,325584338,240155556,310956581,332262718,281115585,255416298,56526016,216202570,58797126,275216084,179188444,35510775,107078419,162372242,159561416,104749340,49147506,293127740,25086557,14592669,218266840,206369309,356664114,282757190,32154896,250704101,162011880,27817768,73719754,321995331,227372609,173701786,140441376,65150789,243661913,279503892,361150067,197003070,265075520,335490183,359239278,208746301,251849157,322961773,250102086,177132823,10844881,221170368,42612495,164266783,213415703,50989721,253159322,75201397,75251243,284287480,239248288,343706359,234422168,73881170,32873066,140694443,230224009,329578189,302029688,260641276,221145114,271848517,112587146,27508187,160255454,217141050,289882814,110551028,362065745,266639784,189905639,328721510,22595828,92652025,16331860,84397251,110717070,167809194,282893655,149087879,341641799,305877171,47949897,30226804,29326378,5264065,3678030,30424703,274541192,15582110,315125937,10197952,64891919,13488022,177812387,162546279,200029263,142513059,119173917,197197175,245368115,147431662,247202501,356282075,67619626,177488883,185579907,60773224,43475771,250230335,183756732,102482623,58855704,258031147,29380608,332941197,267519551,158300456,20657085,163286523,226819902,308407044,328653284,317906531,276205476,256029358,79858422,89507380,145382882,171365579,246648979,32492304,159618173,3495690,124775704,358284547,263102533,88173398,223264957,200192193,21895446,23743162,192632381,6808375,66977796,93933517,269180908,260451782,303919301,296916921,62045740,247446069,62373497,108595985,341153042,298156406,20044425,104442678,78640255,355434367,120774734,148331569,287988242,8160318,89074002,172314486,213954846,342087621,262752812,308777822,67506084,280464307,285708168,15893307,222003070,194495371,262797388,304341003,253569188,278781631,218966877,5287177,74769522,183066598,352253018,34275085,52652201,207034345,177281005,47776967,296444150,260109248,270954962,175777346,167008262,211047529,246835341,172653707,275430467,96022556,82811972,277058972,6631344,66068938,223872328,5351498];
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