/**
 * Implements organism's code logic.
 * TODO: explain here code, byteCode, one number format,...
 *
 * @author DeadbraiN
 * TODO: may be this module is redundant
 */
import Config   from './../global/Config';
import Helper   from './../global/Helper';
import Events   from './../global/Events';
import Observer from './../global/Observer';

const BITS_PER_VAR  = 2;
const OPERATOR_BITS = 8;

export default class Code extends Observer {
    static get BITS_PER_VAR()  {return BITS_PER_VAR;}
    static get VARS()          {return (32 - OPERATOR_BITS) / BITS_PER_VAR;}

    constructor() {
        super();
        // TODO: think about custom operators set from outside
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
         */
        this._OPERATORS = {
            0: this._onVar.bind(this),
            1: this._onFunc.bind(this),
            2: this._onCondition.bind(this),
            3: this._onLoop.bind(this),
            4: this._onOperator.bind(this), // + - / * or xor etc...
            5: this._onPi.bind(this)
        };
        this._VAR_BITS  = 32 - OPERATOR_BITS;

        this._byteCode  = [];
        this._code      = [];
        this._gen       = null;
        this._events    = Events;
        this.compile();
    }

    get code() {return this._code;}
    get size() {return this._byteCode.length;}
    get byteCode() {return this._byteCode;}

    clone(code) {
        this._code     = code.code.slice();
        this._buteCode = code.byteCode.slice();
    }

    destroy() {
        this._byteCode = null;
        this._code     = null;
        this._compiled = null;
        this._gen      = null;
    }

    compile() {
        this._compiled = this._compileByteCode();
        this._gen      = this._compiled();
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
        return (rand(0xff) << (this._VAR_BITS) | rand(0xffffff)) >>> 0;
    }

    getOperator(num) {
        return num >>> this._VAR_BITS;
    }

    setOperator(num, op) {
        return (num & (op << this._VAR_BITS) | 0x00ffffff) >>> 0;
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
        const lBits = this._VAR_BITS - bits;
        const rBits = OPERATOR_BITS + bits + BITS_PER_VAR;

        return (num >>> lBits << lBits | val << (lBits - BITS) | num << rBits >>> rBits) >>> 0;
    }

    getVar(num, index) {
        return (num << OPERATOR_BITS >>> OPERATOR_BITS) << (OPERATOR_BITS + index * BITS_PER_VAR) >>> 0;
    }

    _onEnd() {
        this.fire(Events.CODE_END);
    }

    /**
     * Does simple pre processing and final compilation of the code.
     */
    _compileByteCode() {
        const header1 = 'this.__compiled=function* dna(){var rand=Math.random;';
        const vars    = this._getVars();
        const header2 = ';while(true){yield;';
        const footer  = ';this._age++;this._onEnd()}}';

        eval(header1 + vars + header2 + this._code.join(';') + footer);

        return this.__compiled;
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
        const var0    = this._getVar(num, 0);
        const var1    = this._getVar(num, 1);
        const isConst = var1 > ((1 << BITS_PER_VAR) / 2);

        return 'v'+ var0 + '=' + (isConst ? Helper.rand(1 << (this._VAR_BITS - BITS_PER_VAR)) : ('v' + var1));
    }

    _onFunc(num) {

    }

    _onCondition(num) {

    }

    _onLoop(num) {

    }

    _onOperator(num) {

    }

    _onPi() {

    }
}