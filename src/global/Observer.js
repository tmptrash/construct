/**
 * Observer implementation. May fire, listen(on()) and clear all the event
 * handlers
 *
 * Usage:
 *   import Events from '.../Events.js'
 *   let bus = new Observer();
 *   bus.on(Events.EVENT, () => console.log(arguments));
 *   bus.fire(Events.EVENT, 1, 2, 3);
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
        let handlers = this._handlers[event];

        if (typeof(handlers) === 'undefined' || (index = this._handlers[event].indexOf(handler)) < 0) {return false;}
        this._handlers[event].splice(index, 1);
        if (this._handlers[event].length === 0) {delete this._handlers[event];}

        return true;
    }

    fire (event, ...args) {
        let handler;
        let handlers = this._handlers[event];
        if (typeof(handlers) === 'undefined') {return false;}

        for (handler of handlers) {handler(...args);}

        return true;
    }

    clear () {
        this._handlers = {};
    }
}