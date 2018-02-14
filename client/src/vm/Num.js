/**
 * Class - helper for working with with byte code numbers
 *
 * @author flatline
 */
const Helper  = require('./../../../common/src/Helper');
const OConfig = require('./../manager/plugins/organisms/Config');

class Num {
    /**
     * Analog of constructor. Initializes all internal constants for
     * working with byte code numbers. May be called many times
     * @param {Number} operatorAmount Amount of operators in current
     * script implementation
     */
    static init(operatorAmount) {
        this.setOperatorAmount(operatorAmount);

        this.MAX_BITS            = 32;
        this.BITS_PER_VAR        = OConfig.codeBitsPerVar;
        this.BITS_PER_OPERATOR   = OConfig.codeBitsPerOperator;
        this.NO_OPERATOR_MASK    = 0xffffffff >>> this.BITS_PER_OPERATOR;
        this.BITS_OF_TWO_VARS    = this.BITS_PER_VAR * 2;
        this.BITS_OF_FIRST_VAR   = this.MAX_BITS - this.BITS_PER_VAR;
        this.MAX_VAR             = 1 << this.BITS_PER_VAR;
        this.VAR_BITS_OFFS       = this.MAX_BITS - this.BITS_PER_OPERATOR;

        this.BITS_OF_VAR0        = this.BITS_PER_OPERATOR;
        this.BITS_OF_VAR1        = this.BITS_PER_OPERATOR +     this.BITS_PER_VAR;
        this.BITS_OF_VAR2        = this.BITS_PER_OPERATOR + 2 * this.BITS_PER_VAR;
        this.BITS_OF_VAR3        = this.BITS_PER_OPERATOR + 3 * this.BITS_PER_VAR;
    }

    static get VARS() {return (this.MAX_BITS - this.BITS_PER_OPERATOR) / this.BITS_PER_VAR}

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
        return (rand(this._operatorsAmount) << (this.VAR_BITS_OFFS) | rand(this.NO_OPERATOR_MASK)) >>> 0;
    }

    static getOperator(num) {
        return num >>> this.VAR_BITS_OFFS;
    }

    static setOperator(num, op) {
        return (op << this.VAR_BITS_OFFS | (num & this.NO_OPERATOR_MASK)) >>> 0;
    }

    static getVar(num, index = 0) {
        return num << (this.BITS_PER_OPERATOR + index * this.BITS_PER_VAR) >>> this.BITS_OF_FIRST_VAR;
    }

    static getVar0(num) {
        return num << this.BITS_OF_VAR0 >>> this.BITS_OF_FIRST_VAR;
    }

    static getVar1(num) {
        return num << this.BITS_OF_VAR1 >>> this.BITS_OF_FIRST_VAR;
    }

    static getVar2(num) {
        return num << this.BITS_OF_VAR2 >>> this.BITS_OF_FIRST_VAR;
    }

    static getVar3(num) {
        return num << this.BITS_OF_VAR3 >>> this.BITS_OF_FIRST_VAR;
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
        const bits  = index * this.BITS_PER_VAR;
        const lBits = this.VAR_BITS_OFFS - bits;
        const rBits = this.BITS_PER_OPERATOR + bits + this.BITS_PER_VAR;

        return (num >>> lBits << lBits | val << (this.VAR_BITS_OFFS - bits - this.BITS_PER_VAR) | num << rBits >>> rBits) >>> 0;
    }

    /**
     * Returns specified bits from 32bit number. e.g.: getBits(0b11001100, 3, 2) -> 01
     * @param {Number} num
     * @param {Number} start first bit offset
     * @param {Number} len Amount of bits to get
     * @return {Number} Cut bits (number)
     */
    static getBits(num, start, len) {
        return num << start >>> (this.MAX_BITS - len);
    }
}

module.exports = Num;