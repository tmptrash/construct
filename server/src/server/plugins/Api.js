/**
 * Plugin for Server class, which implement it's API. Is separated from Server to
 * have an ability to change API any time without changing server's code.
 *
 * @author flatline
 */
const Connections = require('./../Connections');
const Console     = require('./../../global/Console');
const CTOS        = require('./../../../../src/global/Requests').CTOS;
const STOC        = require('./../../../../src/global/Requests').STOC;

class Api {
    /**
     * Sends data to the client
     * @param {WebSocket} sock
     * @param {Number} reqId Request id
     * @param {*} params Array of parameters
     * @private
     */
    static _send(sock, reqId, ...params) {
        sock.send([reqId].concat(params));
    }

    constructor(server) {
        this._EVENTS = server.EVENTS;
        /**
         * {Object} Mapping of API functions to associated id's. This map
         * is a map, which is used when client sends message to server
         */
        this._API = {
            0: this._setActive
        };

        this._server      = server;
        this._onConnectCb = this._onConnect.bind(this);
        this._onRunCb     = this._onRun.bind(this);

        server.on(server.EVENTS.RUN, this._onRunCb);
    }

    destroy() {
        this._server.off(this._server.EVENTS.RUN, this._onRunCb);
        this._server.server && this._server.server.removeListener('connection', this._onConnectCb);
        this._onConnectCb = null;
        this._onRunCb     = null;
        this._server      = null;
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

    _onRun() {
        this._server.server.on('connection', this._onConnectCb);
    }

    /**
     * Is called if client has connected to this server. If contains free
     * regions for new connections, then places current one in a connection
     * cub and sends unique id to the client.
     * @param {WebSocket} sock Client's socket
     * @private
     */
    _onConnect(sock) {
        const region   = this._server.conns.getFreeRegion();
        const clientId = Connections.toId(region);
        if (region === null) {
            sock.terminate();
            this._server.fire(this._EVENTS.OVERFLOW, sock);
            Console.warn('This server is overloaded by clients. Try another server to connect.');
            return;
        }

        sock.on('message', this._onMessage.bind(this, clientId, sock));
        sock.on('error', this._onError.bind(this, clientId, sock));
        sock.on('close', this._onClose.bind(this, clientId, sock));

        Api._send(sock, STOC.REQ_GIVE_ID, clientId);
        this._server.conns.setData(region, 'sock', sock);
        this._server.fire(this._EVENTS.CONNECT, sock);
        Console.info(`Client ${clientId} has connected`);
    }

    _onMessage(clientId, sock, event) {
        const requestId = event.data[0];
        if (api[requestId]) {
            this._server.fire(this._EVENTS.MSG, sock, clientId, event.data);
            api[requestId](...event.data.slice(1));
        }
    }

    _onError(clientId, sock, err) {
        this._server.fire(this._EVENTS.ERR, sock, clientId, err);
        Console.info('Error: ', err.message, ' for client ', clientId);
    }

    _onClose(clientId, sock) {
        const region = Connections.findRegion(clientId);
        this._server.conns.clearData(region);
        this._server.fire(this._EVENTS.CLOSE, region, sock, clientId);
        sock.removeAllListeners('message');
        sock.removeAllListeners('error');
        sock.removeAllListeners('close');
        Console.info(`Client ${clientId} has disconnected`);
    }
}

module.exports = Api;