/**
 * Implementation of two directional Queue.
 *
 * @author DeadbraiN
 */
export default class Queue {
    constructor() {
        this._first = {
            prev: null,
            next: null,
            val : null
        };
    }

    insertAfter(item, newItem) {
        newItem.next = item.next;
        item.next    = newItem;
        newItem.prev = item;
    }
}