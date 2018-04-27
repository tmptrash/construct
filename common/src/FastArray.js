/**
 * Implementation of fast array. This class uses fixed array size. Second that
 * get() method will be called must of the time, then set() or del() or resize().
 * Resize is possible, but should be rare to keep it fast. Is used for storing
 * organisms population. Removing element means setting null to specified index.
 *
 * @author flatline
 */
class FastArray {
    constructor(size) {
        /**
         * {Array} Source container for custom objects
         */
        this._arr         = new Array(size);
        /**
         * {Array} Array of free indexes in _arr. Every time
         * user calls del() method _arr obtains hole in it.
         * Index of this hole wil be stored in this array
         */
        this._freeIndexes = new Array(size);
        /**
         * {Number} Index of last free index in _freeIndexes array
         */
        this._index       = size - 1;
        /**
         * {Number} Allocated size of array. This is maximum amount
         * of elements, which may be stored in FastArray
         */
        this._size        = size;

        for (let i = 0; i < size; i++) {
            this._freeIndexes[i] = i;
            this._arr[i]         = null;
        }
    }

    destroy() {
        this._arr         = null;
        this._freeIndexes = null;
        this._size        = null;
    }

    /**
     * Analog of Array.length
     * @returns {Number} Amount of not empty elements in  FastArray.
     * Not all cells in an array may be filled by values.
     */
    get length() {return this._size - this._index - 1}

    /**
     * Returns allocated size
     * @returns {Number}
     */
    get size() {return this._size}

    /**
     * Returns next free index in FastArray
     * @returns {Number}
     */
    get freeIndex() {
        return this._freeIndexes[this._index];
    }

    /**
     * Sets value to FastArray. You can't set value index due to
     * optimization reason. Only a value
     * @param {*} v Any value except number
     */
    add(v) {this._index > -1 && (this._arr[this._freeIndexes[this._index--]] = v)}

    /**
     * Returns a value by index
     * @param {Number} i Value index
     * @returns {null|undefined|*} null - if cell is empty, undefined - if index out of bounds, * - value
     */
    get(i) {return this._arr[i]}

    /**
     * Removes a value by index
     * @param {Number} i Value index
     */
    del(i) {
        if (this._arr[i] !== null) {
            this._arr[i] = null;
            this._freeIndexes[++this._index] = i;
        }
    }

    /**
     * Returns last added value by set() method
     * @returns {*} Value
     */
    last() {
        return this._arr[this._freeIndexes[this._index + 1]];
    }

    /**
     * Resizes an array. Values will not be removed during resize.
     * This method is very slow and should be called not often.
     * @param {Number} size New array size
     */
    resize(size) {
        const indexes = this._freeIndexes;
        const arr     = this._arr;
        this._index   = -1;
        arr.length    = indexes.length = (this._size = size);
        for (let i = 0; i < size; i++) {
            typeof arr[i] === 'undefined' && (arr[i] = null);
            arr[i] === null && (indexes[++this._index] = i);
        }
    }
}

module.exports = FastArray;