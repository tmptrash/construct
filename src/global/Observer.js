/**
 * Observer implementation. May fire, listen(on()) and clear all the event
 * handlers
 *
 * Usage:
 *   let bus = new Observer();
 *   bus.on('event', () => console.log(arguments));
 *   bus.fire('event', 1, 2, 3);
 *
 * @author DeadbraiN
 */
export default class Observer {
    constructor() {
        this._handlers = {};
    }

    on (event, handler) {
        (this._handlers[event] || (this._handlers[event] = [])).push(handler);
    }

    off (event, handler) {
        let index;

        if (this._handlers[event] === undefined || (index = this._handlers[event].indexOf(handler)) < 0) {return false;}
        this._handlers[event].splice(index, 1);
        if (this._handlers[event].length === 0) {delete this._handlers[event];}

        return true;
    }

    fire (event, ...args) {
        if (this._handlers[event] === undefined) {return false;}

        for (let handler of this._handlers[event]) {handler(...args);}

        return true;
    }

    clear () {
        this._handlers = {};
    }
}