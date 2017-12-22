/**
 * Base class for clients. Implements WebSocket client logic. Work in pair with
 * server/src/server/Server class. Work in browser and under Node.js.
 *
 * @author flatline
 */
const Connection  = require('./../../../common/src/net/Connection').Connection;
const EVENTS      = require('./../../../common/src/net/Connection').EVENTS;
const EVENTS_LEN  = Object.keys(EVENTS).length;
const OPEN        = EVENTS_LEN;

const CLIENT_EVENTS = Object.assign({
    OPEN
}, EVENTS);

class Client extends Connection {
    /**
     * @param {String} host Host of server
     * @param {Number} port Port number
     * @param {Boolean} nodeJs true if client is running under Node.js
     * @param {Object} events Events map
     */
    constructor(host, port, nodeJs, events = null) {
        super(Object.keys(events || CLIENT_EVENTS).length);
        this.EVENTS  = events || CLIENT_EVENTS;
        this.host    = host;
        this.port    = port;
        this._nodeJs = nodeJs;
    }

    run() {
        if (this.active) {return}
        this._client         = this._createWebSocket();
        this._client.onerror = this.onError.bind(this);
        this._client.onclose = this.onClose.bind(this);
        this._client.onopen  = this.onOpen.bind(this);
    }

    stop() {this.active && this._client.close()}

    get socket()  {return this._client}

    destroy() {
        this.stop();
        if (this._client) {
            this._client.onclose   = null;
            this._client.onmessage = null;
            this._client.onerror   = null;
        }

        super.destroy();
    }

    /**
     * Is called on connection close with server. Close reason will be in
     * this.closeReason field after calling super.onClose() method
     * @param {Event} event
     * @override
     */
    onClose(event) {
        super.onClose(event);
        this.active = false;
    }

    /**
     * Is called after client has connected to the server
     * @param {Event} event
     * @override
     */
    onOpen(event) {
        this.active = true;
        this._client.onmessage = this.onMessage.bind(this, this._client);
        this.fire(OPEN, event);
    }

    _createWebSocket() {
        //
        // In browser we use browser's native WS implementation. Under Node.js
        // we use implementation of 'ws' library
        //
        const WS     = this._nodeJs ? require('ws') : window.WebSocket;
        let   client = null;

        try {
            client = new WS(`${this.host}:${this.port}`);
			client.on('error', (e) => this.fire(this.EVENTS.ERR, e));
        } catch (e) {
            this.fire(this.EVENTS.ERR, e.message);
        }

        return client;
    }
}

module.exports = {Client, EVENTS: CLIENT_EVENTS};