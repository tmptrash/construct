/**
 * Fast stack implementation. Uses array inside, which is immutable
 * and the position pointer for stack position.
 *
 * @author DeadbraiN
 * TODO: use Uint32Array for id's. It should be faster
 */
export default class Stack {
    /**
     * Creates Stack instance of specified size. Internal pointer
     * will be set to the bottom of stack.
     * @param {Number} size Stack size (amount of elements)
     * @param {Array} arr Array of elements for clonning
     * @param {Number} pos Starting position (if arr !null)
     */
    constructor(size, arr = null, pos = -1) {
        this._size = size;
        this._arr  = arr === null ? new Array(size) : arr;
        this._pos  = pos;
    }

    /**
     * Adds value at the top of the stack. If stack is full,
     * then false will be returned.
     * @param {*} val
     * @returns {boolean} true means, that value was added
     */
    push(val) {
        if (this._pos + 1 === this._size) {return false;}
        this._arr[++this._pos] = val;
        return true;
    }

    /**
     * Returns one value from the top of the stack
     * @return {*|null} null in case of mistake
     */
    pop() {
        if (this._pos < 0) {return null;}
        return this._arr[this._pos--];
    }

    size() {
        return this._pos + 1;
    }

    /**
     * Returns full clone of current stack instance
     * @return {Stack} Clonned Stack instance
     */
    clone() {
        return new Stack(this._size, this._arr.slice(), this._pos);
    }
}