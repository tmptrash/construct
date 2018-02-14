/**
 * Observer implementation. May fire, listen(on()) and clear all the event
 * handlers. This class is optimized for speed. This is why it works with
 * array of numbers as events instead of frequent strings and uses Object
 * for storing event handlers. It fast on fire and slow on removing event
 * handlers (off() method).
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

    on(event, handler) {
        const eventObj = this._handlers[event];
        if (typeof(eventObj) === 'undefined') {return false}
        eventObj[eventObj.amount++] = handler;

        return true;
    }

    off(event, handler) {
        let index    = -1;
        let handlers = this._handlers[event];
        let len      = handlers && handlers.amount;

        if (handlers) {
            for (let i = 0; i < len; i++) {
                if (handlers[i] === handler) {
                    index = i;
                    handlers.amount = --len;
                }
                index > -1 && (handlers[i] = handlers[i+1]);
            }
            delete handlers[handlers.amount];
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
    fire(event, ...args) {
        const handlers = this._handlers[event];
        for (let i = 0, len = handlers.amount; i < len; i++) {
            handlers[i](...args);
        }
    }

    /**
     * Removes all the handlers from Observer. It's still possible
     * to use on()/off() methods for working with events, but max
     * event index set in constructor will be the same.
     */
    clear() {
        this._resetEvents();
    }

    destroy() {
        this._handlers = {};
    }

    _resetEvents() {
        const len      = this._maxIndex;
        const handlers = this._handlers = {};
        for (let i = 0; i < len; i++) {handlers[i] = {amount: 0}}
    }
}

module.exports = Observer;