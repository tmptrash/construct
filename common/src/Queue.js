/**
 * Implementation of two directional Queue. Queue is a list of connected
 * items, where you may iterate back and forward using internal references
 * (next, prev). Every item of the queue contains custom value (in
 * 'val' field). This queue is used for speeding up organisms iteration.
 * Removing of Queue element is done at the moment and not affects items
 * iteration in comparison with an array or an object. Also removing of
 * element from the Queue is very fast.
 *
 * @author flatline
 */
class Queue {
    /**
     * At least one object should exist to exclude check
     * of empty queue in add/del methods
     */
    constructor() {
        this._last = this._first = {
            prev: null,
            next: null,
            val : null
        };
        this._size = 0;
    }

    destroy() {
        this._first = null;
        this._last  = null;
        this._size  = 0;
    }

    get first() {return this._first}
    get last()  {return this._last}
    get size()  {return this._size}

    /**
     * Wraps the value into item object and adds it to the end of the queue
     * @param {*} val Value for adding
     */
    add(val) {
        if (this._size++ > 0) {
            this._last = this._last.next = {
                prev: this._last,
                next: null,
                val
            };
            return;
        }

        this._first.val = val;
    }

    /**
     * The same like add(), but inserts after specified item in a queue
     * @param {Object} item Item, after which val will be inserted
     * @param {*} val Value to insert
     * @return {Object} Inserted item
     */
    addAfter(item, val) {
        if (item === this._last) {this.add(val); return this._last}
        if (this._size++ > 0) {
            const newItem = {
                prev: item,
                next: item.next,
                val
            };
            item.next.prev = newItem;
            item.next      = newItem;
            return newItem;
        }
        this._first.val = val;

        return this._first;
    }

    /**
     * Removes specified item from the queue. 'item' parameter is not
     * the same as value inside this item. Remember remove position may
     * be any in a queue.
     * @param {Object} item Item to remove
     */
    del(item) {
        if (--this._size < 1) {
            this._first.val = null;
            this._size = 0;
            return;
        }

        if (item.prev !== null) {item.prev.next = item.next}
        else {this._first = item.next}

        if (item.next !== null) {item.next.prev = item.prev}
        else {this._last = item.prev}
    }

    /**
     * Possibly slow method, because we have to iterate index times
     * in a loop.
     * @param {Number} index Index of element in a Queue
     * @returns {null|Object} Item or null if index is incorrect
     */
    get(index) {
        let item = this._first;
        while (--index > -1 && item) {item = item.next}
        return item;
    }
}

module.exports = Queue;