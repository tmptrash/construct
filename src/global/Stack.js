/**
 * Fast stack implementation. Uses array inside, which is immutable
 * and the position pointer for stack position.
 *
 * @author DeadbraiN
 */
class Stack {
    /**
     * Creates Stack instance of specified size. Internal pointer
     * will be set to the bottom of stack.
     * @param {Number} size Stack size (amount of elements)
     */
    constructor (size) {
        this._size = size;
        this._arr  = new Array(size);
        this._pos  = -1;
    }

    /**
     * Adds value at the top of the stack. If stack is full,
     * then false will be returned.
     * @param {*} val
     * @returns {boolean} true means, that value was added
     */
    push (val) {
        if (this._pos + 1 === this._size) {return false;}
        this._arr[++this._pos] = val;
        return true;
    }

    /**
     * Returns one value from the top of the stack
     * @return {*|null} null in case of mistake
     */
    pop () {
        if (this._pos < 0) {return null;}
        return this._arr[this._pos--];
    }
}