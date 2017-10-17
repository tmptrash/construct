/**
 * Manager's plugin. Implements WebSocket client logic. Work in pair with
 * server/src/server/Server class. Activates current manager on a server
 * side and run it.
 * TODO: this plugin should listen organisms moves outside of the world
 * TODO: and send appropriate requests
 * TODO: we have to use events in this class
 *
 * @author flatline
 */
const Helper     = require('./../../../../common/src/global/Helper');
const Config     = require('./../../../../common/src/global/Config').Config;
const TYPES      = require('./../../../../common/src/global/Requests').TYPES;
const Request    = require('./../../../../common/src/net/plugins/Request');
const Api        = require('./Api');
const Console    = require('./../../global/Console').default;
const Connection = require('./../../../../common/src/net/Connection');
const Plugins    = require('./../../../../common/src/global/Plugins');
const EVENTS     = require('./../../global/Events').EVENTS;

const PLUGINS = {
    Request: Request,
    Api    : Api
};

class Client extends Connection {
    constructor(manager) {
        super(0);
        this._manager       = manager;
        this._client        = this._createWebSocket();
        this._plugins       = new Plugins(this, PLUGINS);
        this._onMoveOutCb   = this._onMoveOut.bind(this);
        //
        // Client has no connection with server, so we have to start in
        // "separate instance" mode.
        //
        if (this._client === null || this._client.readyState === WebSocket.CLOSING || this._client.readyState === WebSocket.CLOSED) {
            this._manager.run();
            return;
        }
        manager.on(EVENTS.STEP_OUT, this._onMoveOutCb);
        this._client.onopen    = this._onOpen.bind(this);
        this._client.onmessage = this.onMessage.bind(this, this._client);
        this._client.onerror   = this.onError.bind(this);
        this._client.onclose   = this.onClose.bind(this);
    }

    get manager() {return this._manager}
    get socket()  {return this._client}

    destroy() {
        super.destroy();
        this._client.onclose   = null;
        this._client.onmessage = null;
        this._client.onerror   = null;
        this._client.onclose   = null;
        this._manager.off(EVENTS.STEP_OUT, this._onMoveOutCb);
        this._manager          = null;
        this._plugins          = null;
        this._onMoveOutCb      = null;
    }

    /**
     * Is called on connection close with server. Close reason will be in
     * this.closeReason field after calling super.onClose() method
     * @param {Event} event
     */
    onClose(event) {
        super.onClose(event);
        Console.warn(`Client "${this._manager.clientId}" has disconnected by reason: ${this.closeReason}`);
    }

    _createWebSocket() {
        let ws = null;
        try {
            ws = new WebSocket(`${Config.serHost}:${Config.serPort}`);
        } catch (e) {
            Console.error(e.message);
        }

        return ws;
    }

    _onOpen() {
        Console.info('Connection with Server has opened');
    }

    _onMoveOut(x1, y1, x2, y2, dir, org) {
        this.request(this._client, TYPES.REQ_MOVE_ORG, this._manager.clientId, x1, y1, dir, org.serialize());
    }
}

module.exports = Client;