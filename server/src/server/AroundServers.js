/**
 * This class stores logic of communication with nearest servers (up, right,
 * down and left), which are connected to current one. It keeps connections
 * to them and updates active status.
 *
 * @author flatline
 */
const DIR   = require('./../../../common/src/Directions').DIR;
const TYPES = require('./../../../common/src/net/Requests').TYPES;

class AroundServers {
    constructor(parent) {
        /**
         * {Connection} Connection instance of current Client or Server
         */
        this._parent = parent;
        /**
         * {Object} All nearest servers by direction
         */
        // TODO: rename to _clients. It should be a map of Client instances
        this._socks = {};
        this._socks[DIR.UP]    = null;
        this._socks[DIR.RIGHT] = null;
        this._socks[DIR.DOWN]  = null;
        this._socks[DIR.LEFT]  = null;
    }

    destroy() {
        this._parent = null;
        this._socks  = null;
    }

    setSocket(sock, dir) {
        this._socks[dir] = sock;
    }

    activate(activate = true) {
        const socks  = this._socks;
        const parent = this._parent;
        const UP     = DIR.UP;
        const RIGHT  = DIR.RIGHT;
        const DOWN   = DIR.DOWN;
        const LEFT   = DIR.LEFT;
        const ACTIVE = TYPES.REQ_SET_NEAR_ACTIVE;

        socks[UP]    && parent.request(socks[UP],    ACTIVE, DOWN,  activate);
        socks[RIGHT] && parent.request(socks[RIGHT], ACTIVE, LEFT,  activate);
        socks[DOWN]  && parent.request(socks[DOWN],  ACTIVE, UP,    activate);
        socks[LEFT]  && parent.request(socks[LEFT],  ACTIVE, RIGHT, activate);
    }
}

module.exports = AroundServers;