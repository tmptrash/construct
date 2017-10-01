/**
 * Plugin for Server class, which implement it's API. Is separated from Server to
 * have an ability to change API any time without changing server's code.
 *
 * @author flatline
 */
const Connections = require('./../Connections');
const Console     = require('./../../global/Console');
//const CTOS        = require('./../../../../src/global/Requests').CTOS;
//const STOC        = require('./../../../../src/global/Requests').STOC;

class Api {
    constructor(server) {
        this._EVENTS = server.EVENTS;
        /**
         * {Object} Mapping of API functions to associated id's. This map
         * is a map, which is used when client sends message to server
         * @constant
         */
        this._API = {
            0: this._setActive
        };

        this._server      = server;
        this._onMessageCb = this._onMessage.bind(this);

        server.on(server.EVENTS.MSG, this._onMessageCb);
    }

    destroy() {
        this._server.off(this._server.EVENTS.MSG, this._onMessageCb);
        this._onMessageCb = null;
        this._API         = null;
        this._server      = null;
    }

    /**
     * Is called on every message obtained from any client. Calls
     * API method to handle the message. msg[0] is always request
     * id. msg[1], msg[2],... are request related parameters.
     * @param {WebSocket} sock Client's socket
     * @param {String} clientId Unique client id
     * @param {*} msg Parameters obtained from the client
     * @private
     */
    _onMessage(sock, clientId, msg) {
        this._API[msg[0]] && this._API[msg[0]](...msg.slice(1));
    }

    /**
     * Sets client active. It means, that sibling active client may
     * transfer it's organisms to this client
     * @param {String} clientId
     * @param {Boolean} active
     * @api
     */
    _setActive(clientId, active) {
        const region = Connections.findRegion(clientId);
        this._server.conns.setData(region, 'active', active);
    }
}

module.exports = Api;