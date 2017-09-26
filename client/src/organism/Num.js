/**
 * Class - helper for working with with byte code numbers
 *
 * @author DeadbraiN
 */
import Helper   from '../global/Helper';
import {Config} from '../global/Config';

const BITS_PER_VAR        = Config.codeBitsPerVar;
const BITS_PER_OPERATOR   = Config.codeBitsPerOperator;
const NO_OPERATOR_MASK    = 0xffffffff >>> BITS_PER_OPERATOR;
const BITS_OF_TWO_VARS    = BITS_PER_VAR * 2;
const BITS_OF_FIRST_VAR   = 32 - BITS_PER_VAR;
const MAX_VAR             = 1 << BITS_PER_VAR;
const MAX_OPERATOR        = 1 << BITS_PER_OPERATOR;
const VAR_BITS_OFFS       = 32 - BITS_PER_OPERATOR;
const BITS_WITHOUT_2_VARS = 1 << (VAR_BITS_OFFS - BITS_PER_VAR * 2);

export default class Number {
    static get VAR_BITS_OFFS()       {return VAR_BITS_OFFS}
    static get BITS_PER_VAR()        {return BITS_PER_VAR}
    static get BITS_PER_OPERATOR()   {return BITS_PER_OPERATOR}
    static get VARS()                {return (32 - BITS_PER_OPERATOR) / BITS_PER_VAR}
    static get MAX_VAR()             {return MAX_VAR}
    static get BITS_OF_TWO_VARS()    {return BITS_OF_TWO_VARS}
    static get MAX_OPERATOR()        {return MAX_OPERATOR}
    static get BITS_WITHOUT_2_VARS() {return BITS_WITHOUT_2_VARS}

    /**
     * Sets amount of available operators for first bits
     * @param {Number} amount
     */
    static setOperatorAmount(amount) {
        this._operatorsAmount = amount;
    }

    /**
     * We have to use >>> 0 at the end, because << operator works
     * with signed 32bit numbers, but not with unsigned like we need
     * @returns {number}
     */
    static get() {
        const rand = Helper.rand;
        return (rand(this._operatorsAmount) << (VAR_BITS_OFFS) | rand(NO_OPERATOR_MASK)) >>> 0;
    }

    static getOperator(num) {
        return num >>> VAR_BITS_OFFS;
    }

    static setOperator(num, op) {
        return (op << VAR_BITS_OFFS | (num & NO_OPERATOR_MASK)) >>> 0;
    }

    static getVar(num, index = 0) {
        return num << (BITS_PER_OPERATOR + index * BITS_PER_VAR) >>> BITS_OF_FIRST_VAR;
    }

    /**
     * Sets variable bits into value 'val' and returns updated full number.
     * Example: _setVar(0xaabbccdd, 2, 0x3) -> 0x
     * @param {Number} num Original number
     * @param {Number} index Variable index
     * @param {Number} val New variable value
     * @returns {Number}
     */
    static setVar(num, index, val) {
        const bits  = index * BITS_PER_VAR;
        const lBits = VAR_BITS_OFFS - bits;
        const rBits = BITS_PER_OPERATOR + bits + BITS_PER_VAR;

        return (num >>> lBits << lBits | val << (VAR_BITS_OFFS - bits - BITS_PER_VAR) | num << rBits >>> rBits) >>> 0;
    }

    /**
     * Returns specified bits from 32bit number. e.g.: getBits(0b11001100, 3, 2) -> 01
     * @param {Number} num
     * @param {Number} start first bit offset
     * @param {Number} len Amount of bits to get
     * @return {Number} Cut bits (number)
     */
    static getBits(num, start, len) {
        return num << start >>> (32 - len);
    }
}