/**
 * Base class of plugin for Client or Server classes, which implement their API. It separated
 * from Client/Server to have an ability to change API any time without changing server's/client's
 * code. You have to inherit your class from this one to have special API for client/ or server.
 * Also, you have to set API map (see this.api map) to bind request types and their handlers
 * together. For example:
 *
 *     class ServerApi extends Api {
 *         constructor() {
 *             super();
 *             this.api[TYPES.XXX] = this._setXXX;
 *             ...
 *         }
 *         _setXXX() {
 *             ...
 *         }
 *     }
 *
 * @author flatline
 */
const Helper = require('./../../src/Helper');
const TYPES  = require('./../../src/net/Requests').TYPES;
const MASKS  = require('./../../src/net/Requests').MASKS;

class Api {
    constructor(parent) {
        /**
         * {Object} Mapping of API functions to associated id's. This map
         * is a map, which is used when client/server/server sends message
         * to server/client.
         */
        this.api          = {};
        this.parent       = parent;
        /**
         * {WebSocket} Currently active socket. It's available only during
         * message is received
         */
        this._sock        = null;
        this._onMessageCb = this._onMessage.bind(this);

        Helper.override(parent, 'onMessage', this._onMessageCb);
    }

    get sock() {return this._sock}

    destroy() {
        Helper.unoverride(this.parent, 'onMessage', this._onMessageCb);
        this._onMessageCb = null;
        this.parent       = null;
        this.api          = null;
    }

    /**
     * Is called on every message obtained from any client/server.
     * Calls API method to handle the message. data[0] is always request
     * type. data[1] - requestId. data[2], data[3],... are request related
     * parameters. Handlers are called only for requests and skipped for
     * answers.
     * @param {WebSocket} sock Communication socket
     * @param {Event} event Event with parameters obtained from the client
     * @private
     */
    _onMessage(sock, event) {
        const data  = JSON.parse(event.data || event);
        const reqId = data[1];
        const type  = data[0];

        this._sock = sock;
        if (((reqId & MASKS.REQ_MASK) >>> 31) === 1) {
            if (this.api[type]) {
                this.api[type](...[reqId].concat(data.slice(2)));
            } else {
                this.parent.response(sock, TYPES.RES_INVALID_TYPE, reqId, `Invalid request type ${type}`);
            }
        }
        this._sock = null;
    }
}

module.exports = Api;