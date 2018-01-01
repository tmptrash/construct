/**
 * Client, which created by server for connecting with nearest servers.
 *
 * @author flatline
 */
const NAMES       = require('./../../../common/src/Directions').NAMES;
const Console     = require('./../share/Console');
const BaseClient  = require('./../../../common/src/net/Client').Client;
const EVENTS      = require('./../../../common/src/net/Client').EVENTS;
const Plugins     = require('./Plugins');

const PLUGINS     = [
    'src/plugins/Request',
    {path: 'src/plugins/AsyncClient', cfg: {openEvent: EVENTS.OPEN}}
];

class Client extends BaseClient {
    constructor(server, dir, host, port) {
        super(host, port, true);
        /**
         * {Server} Parent server created current client for communication
         * with near servers.
         */
        this._server = server;
        this._dir    = dir;
        //
        // Plugins should be created at the end of constructor to
        // have an ability to access this class public fields
        //
        this._plugins = new Plugins(this, {plugins: PLUGINS});
    }

    destroy() {
        super.destroy();
        this._dir     = null;
        this._plugins = null;
    }

    /**
     * Is called if error occurred
     * @param {Object} event Error event object
     * @override
     */
    onError(event) {
        super.onError(event);
        Console.warn(`[${NAMES[this._dir]}] server error: ${event.message} on ${this.host}:${this.port}`);
    }

    /**
     * Is called every time if near server sends us a request. This is
     * a bridge between near server and current server
     * @param {WebSocket} sock Socket, received the message
     * @param {Event} event Message event. Data is in 'data' property
     * @override
     */
    onMessage(sock, event) {
        super.onMessage(sock, event);
        this._server.onMessage(sock, event);
    }

    /**
     * Is called on connection close with server. Close reason will be in
     * this.closeReason field after calling super.onClose() method
     * @param {Event} event
     * @override
     */
    onClose(event) {
        const active = this.active;
        super.onClose(event);
        //
        // We have to show message only if we had been active for some time
        //
        active && Console.warn(`[${NAMES[this._dir]}] server has disconnected by reason: '${this.closeReason}' on ${this.host}:${this.port}`);
    }

    /**
     * Is called after client has connected to the server
     * @param {Event} event
     * @override
     */
    onOpen(event) {
        super.onOpen(event);
        Console.info(`[${NAMES[this._dir]}] server has connected on ${this.host}:${this.port}`);
    }
}

module.exports = Client;