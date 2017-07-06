/**
 * Implements organism's code logic.
 * TODO: explain here code, byteCode, one number format,...
 *
 * @author DeadbraiN
 * TODO: may be this module is redundant
 */
import Config   from './../global/Config';
import Helper   from './../global/Helper';
import Observer from './../global/Observer';

const BITS_PER_VAR        = 2;
const BITS_OF_FIRST_VAR   = 32 - BITS_PER_VAR;
const OPERATOR_BITS       = 8;
const MAX_VAR             = 1 << BITS_PER_VAR;
const MAX_OPERATOR        = 1 << OPERATOR_BITS;
const VAR_BITS_OFFS       = 32 - OPERATOR_BITS;
const BITS_WITHOUT_2_VARS = 1 << (VAR_BITS_OFFS - BITS_PER_VAR * 2);
const HALF_OF_VAR         = MAX_VAR / 2;

export default class Code extends Observer {
    static get VARS()          {return (32 - OPERATOR_BITS) / BITS_PER_VAR;}
    static get MAX_VAR()       {return MAX_VAR;}
    static get MAX_OPERATOR()  {return MAX_OPERATOR;}

    constructor(codeEndCb) {
        super();
		/**
		 * {Function} Callback, which is called on every organism 
		 * code iteration. On it's end.
		 */
		this._onCodeEnd = codeEndCb;
        // TODO: think about custom operators set from outside
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
         */
        this._OPERATORS = {
            0: this._onVar.bind(this),
            //1: this._onFunc.bind(this),
            1: this._onCondition.bind(this),
            2: this._onLoop.bind(this),
            3: this._onOperator.bind(this), // + - / * or xor etc...
            4: this._onPi.bind(this)
        };
        this._OPERATORS_LEN = Object.keys(this._OPERATORS).length;
        this._CONDITIONS = ['<', '>', '==', '!='];
        this._offsets = [];

        this._byteCode  = [];
        this._code      = [];
        this._gen       = null;
        this.compile();
    }

    get size() {return this._byteCode.length;}

    clone(code) {
        this._code     = code.cloneCode();
        this._byteCode = code.cloneByteCode();
    }

    cloneCode() {
        return this._code.slice();
    }

    cloneByteCode() {
        return this._byteCode.slice();
    }

    insertLine() {
        this._byteCode.splice(Helper.rand(this._byteCode.length), 0, this.number());
    }

    updateLine(index, number) {
        this._byteCode[index] = number;
    }

    removeLine() {
        this._byteCode.splice(Helper.rand(this._byteCode.length), 1);
    }

    getLine(index) {
        return this._byteCode[index];
    }

    destroy() {
        this._byteCode = null;
        this._code     = null;
        this._gen      = null;
    }

    compile() {
        const header1 = 'this.__compiled=function* dna(){var rand=Math.random,pi=Math.PI;';
        const vars    = this._getVars();
        const header2 = ';while(true){yield;';
        const footer  = ';this._onCodeEnd()}}';

        this._code = this._compileByteCode(this._byteCode);
        eval(header1 + vars + header2 + this._code.join(';') + footer);

        this._gen = this.__compiled();
    }

    run() {
        this._gen.next();
    }

    /**
     * We have to use >>> 0 at the end, because << operator works
     * with signed 32bit numbers, but not with unsigned like we need
     * @returns {number}
     */
    number() {
        const rand = Helper.rand;
        return (rand(this._OPERATORS_LEN) << (VAR_BITS_OFFS) | rand(0xffffff)) >>> 0;
    }

    getOperator(num) {
        return num >>> VAR_BITS_OFFS;
    }

    setOperator(num, op) {
        return (num & (op << VAR_BITS_OFFS) | 0x00ffffff) >>> 0;
    }

    /**
     * Sets variable bits into value 'val' and returns updated full number.
     * Example: _setVar(0xaabbccdd, 2, 0x3) -> 0x
     * @param {Number} num Original number
     * @param {Number} index Variable index
     * @param {Number} val New variable value
     * @returns {Number}
     * @private
     */
    setVar(num, index, val) {
        const bits  = index * BITS_PER_VAR;
        const lBits = VAR_BITS_OFFS - bits;
        const rBits = OPERATOR_BITS + bits + BITS_PER_VAR;

        return (num >>> lBits << lBits | val << (lBits - BITS) | num << rBits >>> rBits) >>> 0;
    }

    getVar(num, index) {
        return (num << OPERATOR_BITS >>> OPERATOR_BITS) << (OPERATOR_BITS + index * BITS_PER_VAR) >>> BITS_OF_FIRST_VAR;
    }

    _compileByteCode(byteCode) {
        const len       = byteCode.length;
        const operators = this._OPERATORS;
        let   code      = new Array(len);
        let   offsets   = this._offsets;
        let   operator;

        for (let i = 0; i < len; i++) {
            operator = operators[this.getOperator(byteCode[i])](byteCode[i], i, len);
            //
            // This code is used for closing blocks for if, for and other
            // blocked operators.
            //
            if (offsets[offsets.length - 1] === i && offsets.length > 0) {
                operator = operator + '}';
                offsets.pop();
            }
            code[i] = operator;
        }
        if (offsets.length > 0) {
		    code[code.length - 1] += ('}'.repeat(offsets.length));
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
        const vars  = Config.codeVarAmount;
        let   code  = new Array(vars);
        const range = Config.codeVarInitRange;
        const half  = range / 2;
        const rand  = '=rand()*' + range + '-' + half;

        for (let i = 0; i < vars; i++) {
            code[i] = 'var v' + i + rand;
        }

        return code.join(';');
    }

    /**
     * Parses variable operator. Format: var = const|number. Number bits format:
     *   OPERATOR_BITS bits - operator id
     *   BITS_PER_VAR bits  - destination var index
     *   BITS_PER_VAR bits  - assign type (const (half of bits) or variable (half of bits))
     *   BITS_PER_VAR bits  - variable index or all bits till the end for constant
     *
     * @param {Number} num Packed into number code line
     * @return {String} Parsed code line string
     */
    _onVar(num) {
        const var0    = this.getVar(num, 0);
        const var1    = this.getVar(num, 1);
        const isConst = var1 > HALF_OF_VAR;

        return 'v' + var0 + '=' + (isConst ? Helper.rand(BITS_WITHOUT_2_VARS) : ('v' + var1));
    }

    _onFunc(num) {
        return '';
    }

    _onCondition(num, line, lines) {
        const var0    = this.getVar(num, 0);
        const var1    = this.getVar(num, 1);
        const var2    = this.getVar(num, 2);
        const var3    = this.getVar(num, 3);
        const index   = line + var3 < lines ? line + var3 : lines - 1;

        this._offsets.push(index);
        return 'if(v' + var0 + this._CONDITIONS[var2] + 'v' + var1 + '){';
    }

    _onLoop(num) {
        return '';
    }

    _onOperator(num) {
        return '';
    }

    _onPi(num) {
        return 'v' + this.getVar(num, 0) + '=pi';
    }
}