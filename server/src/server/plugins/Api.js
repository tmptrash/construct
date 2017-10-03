/**
 * Plugin for Server class, which implement it's API. Is separated from Server to
 * have an ability to change API any time without changing server's code.
 *
 * @author flatline
 */
const Connections = require('./../Connections');
const Console     = require('./../../global/Console');
const Helper      = require('./../../../../src/global/Helper');
const CTOS        = require('./../../../../src/global/Requests').CTOS;
const STOC        = require('./../../../../src/global/Requests').STOC;
const DIR         = require('./../../../../src/global/Requests').DIR;

const REQ_MASK = 0x80000000;

class Api {
    constructor(server) {
        this._EVENTS = server.EVENTS;
        /**
         * {Object} Mapping of API functions to associated id's. This map
         * is a map, which is used when client sends message to server
         * @constant
         */
        let api = this._API = {};
        api[CTOS.REQ_SET_ACTIVE] = this._setActive;
        api[CTOS.REQ_MOVE_ORG]   = this._moveOrg;

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
     * type. msg[1] - requestId. msg[2], msg[3],... are request
     * related parameters.
     * @param {WebSocket} sock Client's socket
     * @param {*} msg Parameters obtained from the client
     * @private
     */
    _onMessage(sock, msg) {
        if (msg[1] & REQ_MASK > 0) {
            this._API[msg[0]] && this._API[msg[0]](...[msg[2], msg[1]].concat(msg.slice(2)));
        }
    }

    /**
     * Sets client active. It means, that sibling active client may
     * transfer it's organisms to this client
     * @param {String} clientId
     * @param {Number} reqId Unique request id. Needed for response
     * @param {Boolean} active
     * @api
     */
    _setActive(clientId, reqId, active) {
        const region = Connections.toRegion(clientId);
        const server = this._server;
        const con    = server.conns.getConnection(region);

        server.conns.setData(region, 'active', active);
        server.answer(con.sock, STOC.RES_ACTIVE_OK, reqId);
    }

    /**
     * Moves organism from one client to another
     * @param {String} clientId Unique client id
     * @param {Number} reqId Unique request id. Needed for response
     * @param {Number} dir Moving direction
     * @param {Object} org Organism's serialized json
     * @api
     */
    _moveOrg(clientId, reqId, dir, org) {
        const region = Connections.toRegion(clientId);

        if      (dir === DIR.UP)    {region[1]--}
        else if (dir === DIR.RIGHT) {region[0]++}
        else if (dir === DIR.DOWN)  {region[1]++}
        else if (dir === DIR.LEFT)  {region[0]--}

        const con = this._server.conns.getConnection(region);
        if (con.active) {
            this._server.send(con.sock, STOC.REQ_MOVE_ORG, Helper.getId(), dir, org);
        } else {
            const backRegion = Connections.toRegion(clientId);
            const backCon    = this._server.conns.getConnection(backRegion);
            this._server.send(backCon.sock, STOC.RES_MOVE_ERR, reqId, dir, org, `Region ${region} is not active`);
        }
    }
}

module.exports = Api;