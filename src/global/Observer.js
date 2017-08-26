/**
 * Observer implementation. May fire, listen(on()) and clear all the event
 * handlers. This class is optimized for speed. This is why it works with
 * array of number as events instead of strings.
 *
 * Usage:
 *   import {EVENTS}       from '.../Events.js'
 *   import {EVENT_AMOUNT} from '.../Events.js'
 *
 *   let bus = new Observer();
 *   bus.on(EVENTS.EVENT, () => console.log(arguments));
 *   bus.fire(EVENTS.EVENT, 1, 2, 3);
 *
 * @author DeadbraiN
 */
export default class Observer {
    /**
     * Constructs handlers map
     * @param {Number} maxIndex Maximum event index, for current instance
     */
    constructor(maxIndex) {
        this._maxIndex = maxIndex;
        this._resetEvents();
    }

    on (event, handler) {
        this._handlers[event].push(handler);
    }

    off (event, handler) {
        let index;
        let handlers = this._handlers[event];

        if ((index = handlers.indexOf(handler)) < 0) {return false;}
        handlers.splice(index, 1);

        return true;
    }

    fire (event, ...args) {
        let handlers = this._handlers[event] || [];
        for (let handler of handlers) {handler(...args);}
    }

    clear () {
        this._resetEvents();
    }

    _resetEvents() {
        const handlers = this._handlers = new Array(this._maxIndex);
        const len      = handlers.length;
        for (let i = 0; i < len; i++) {handlers[i] = []}
    }
}