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

const PLUGINS = {
    Request: Request,
    Api    : Api
};

class Client extends Connection {
    constructor(manager) {
        super(0);
        this._manager       = manager;
        this._client        = this._createWebSocket();
        this._closed        = true;
        this._plugins       = new Plugins(this, PLUGINS);
        this._onBeforeRunCb = this._onBeforeRun.bind(this);
        this._onMoveOutCb   = this._onMoveOut.bind(this);
        //
        // Client has no connection with server, so we have to start in
        // "separate instance" mode.
        //
        if (this._client === null || this._client.readyState === WebSocket.CLOSING || this._client.readyState === WebSocket.CLOSED) {return}
        Helper.override(manager, 'onBeforeRun', this._onBeforeRunCb);
        Helper.override(manager, 'onMoveOut', this._onMoveOutCb);
        this._client.onopen    = this._onOpen.bind(this);
        this._client.onmessage = this.onMessage.bind(this, this._client);
        this._client.onerror   = this.onError.bind(this);
        this._client.onclose   = this.onClose.bind(this);
    }

    /**
     * Is called on connection close with server. Close reason will be in
     * this.closeReason field after calling super.onClose() method
     * @param {Event} event
     */
    onClose(event) {
        super.onClose(event);
        this._closed = false;
        Console.info(`Client "${this._manager.clientId}" has disconnected by reason: ${this.closeReason}`);
    }

    /**
     * Is called when this client start to be activated on a server side.
     * It means, that this Manager may start evolution process.
     */
    onActivate() {
        this._manager.run();
    }

    onSetClientId(id) {
        this._manager.setClientId(id);
    }

    /**
     * Sends a request to the server. Wrapper around WebSocket.send()
     * method. Adds clientId to every request.
     * @param {Number} type Request type (see Requests.TYPES const)
     * @param {*} params Custom request parameters
     * @return {Number|null} Unique request id or null if answer is
     * not needed
     */
    request(type, ...params) {
        return this.send(this._client, type, ...[this._manager.clientId].concat(params));
    }

    destroy() {
        super.destroy();
        this._client.onclose   = null;
        this._client.onmessage = null;
        this._client.onerror   = null;
        this._client.onclose   = null;
        Helper.unoverride(this._manager, 'onBeforeRun', this._onBeforeRunCb);
        this._manager          = null;
        this._plugins          = null;
        this._onMoveOutCb      = null;
        this._onBeforeRunCb    = null;
    }

    /**
     * Is called before running of server. Before running we have to connect
     * this manager with the Server and activate it on a server side. Only after
     * that it have to be ran. Running manager means 'active' manager.
     * @override
     */
    _onBeforeRun() {
        if (this._manager.clientId === null && this._closed === false) {
            this._manager.stop();
        }
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
        this._closed = false;
        Console.info('Connection with Server has opened');
    }

    _onMoveOut(x1, y1, x2, y2, dir, org) {
        this.request(TYPES.REQ_MOVE_ORG, x1, y1, dir, org.serialize());
    }
}

module.exports = Client;