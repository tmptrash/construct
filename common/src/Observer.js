/**
 * Observer implementation. May fire, listen(on()) and clear all the event
 * handlers. This class is optimized for speed. This is why it works with
 * array of numbers as events instead of frequent strings.
 *
 * Usage:
 *   import {EVENTS}       from '.../Events.js'
 *   import {EVENT_AMOUNT} from '.../Events.js'
 *
 *   let bus = new Observer();
 *   bus.on(EVENTS.EVENT, () => console.log(arguments));
 *   bus.fire(EVENTS.EVENT, 1, 2, 3);
 *
 * @author flatline
 */
class Observer {
    /**
     * Constructs handlers map. maxIndex means maximum event value
     * for entire Observer instance life.
     * @param {Number} maxIndex Maximum event index, for current instance
     */
    constructor(maxIndex) {
        this._maxIndex = +maxIndex || 0;
        this._resetEvents();
    }

    on (event, handler) {
        if (typeof(this._handlers[event]) === 'undefined') {return false}
        this._handlers[event].push(handler);

        return true;
    }

    off (event, handler) {
        let index;
        let handlers = this._handlers[event];

        if (handlers) {
            if ((index = handlers.indexOf(handler)) < 0) {return false}
            handlers.splice(index, 1);
        }

        return true;
    }

    /**
     * This method is a most frequently called one. So we have to
     * optimize it as much as possible
     * @param {Number} event Event number
     * @param {*} args List of arguments
     * @param args
     */
    fire (event, ...args) {
        let handlers = this._handlers[event] || [];
        for (let handler of handlers) {handler(...args)}
    }

    /**
     * Removes all the handlers from Observer. It's still possible
     * to use on()/off() methods for working with events, but max
     * event index set in constructor will be the same.
     */
    clear () {
        this._resetEvents();
    }

    destroy() {
        this._handlers = {};
    }

    _resetEvents() {
        const len      = this._maxIndex;
        const handlers = this._handlers = new Array(len);
        for (let i = 0; i < len; i++) {handlers[i] = []}
    }
}

module.exports = Observer;