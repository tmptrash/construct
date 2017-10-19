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
        this._manager        = manager;
        this._closed         = true;
        this._client         = this._createWebSocket();
        this._plugins        = new Plugins(this, PLUGINS);
        this._onStepOutCb    = this._onStepOut.bind(this);

        this._client.onerror = this.onError.bind(this);
        this._client.onclose = this.onClose.bind(this);
        this._client.onopen  = this._onOpen.bind(this);
    }

    get manager() {return this._manager}
    get socket()  {return this._client}

    destroy() {
        super.destroy();
        this._client.onclose   = null;
        this._client.onmessage = null;
        this._client.onerror   = null;
        this._client.onclose   = null;
        this._manager.off(EVENTS.STEP_OUT, this._onStepOutCb);
        this._manager          = null;
        this._plugins          = null;
        this._onStepOutCb      = null;
    }

    /**
     * Is called on connection close with server. Close reason will be in
     * this.closeReason field after calling super.onClose() method
     * @param {Event} event
     */
    onClose(event) {
        const client = this._client;
        super.onClose(event);
        //
        // Client has no connection with server, so we have to start in
        // "separate instance" mode.
        //
        if (this._closed && client === null || client.readyState === WebSocket.CLOSING || client.readyState === WebSocket.CLOSED) {
            this._manager.run();
        }
        this._closed = true;
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
        const client = this._client;

        this._closed = false;
        this._manager.on(EVENTS.STEP_OUT, this._onStepOutCb);
        client.onmessage = this.onMessage.bind(this, client);
        Console.info('Connection with Server has opened');
    }

    _onStepOut(x, y, dir, org) {
        this.request(this._client, TYPES.REQ_MOVE_ORG, this._manager.clientId, x, y, dir, org.serialize());
    }
}

module.exports = Client;