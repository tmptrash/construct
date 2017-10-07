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

class Client extends Connection {
    constructor(manager) {
        super(0);
        this._manager       = manager;
        this._request       = new Request(this);
        this._api           = new Api(this);
        this._client        = this._createWebSocket();
        this._onBeforeRunCb = this._onBeforeRun.bind(this);

        if (this._client === null) {return}
        Helper.override(manager, 'onBeforeRun', this._onBeforeRunCb);
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
        Console.info(`Client "${this._api.clientId}" has disconnected by reason: ${this.closeReason}`);
    }

    /**
     * Is called when this client start to be activated on a server side.
     * It means, that this Manager may start evolution process.
     */
    onActivate() {
        this._manager.run();
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
        return this.send(this._client, type, ...[this._api.clientId].concat(params));
    }

    destroy() {
        super.destroy();
        this._client.onclose   = null;
        this._client.onmessage = null;
        this._client.onerror   = null;
        this._client.onclose   = null;
        this._api.destroy();
        this._api              = null;
        this._request.destroy();
        this._request          = null;
        Helper.unoverride(this._manager, 'onBeforeRun', this._onBeforeRunCb);
        this._manager          = null;
        this._onBeforeRunCb    = null;
    }

    /**
     * Is called before running of server. Before running we have to connect
     * this manager with the Server and activate it on a server side. Only after
     * that it have to be ran. Running manager means 'active' manager.
     * @override
     */
    _onBeforeRun() {
        if (this._api.clientId === null) {
            this._manager.stop();
        }
    }

    _createWebSocket() {
        let ws = null;
        try {
            ws = new WebSocket(`${Config.serHost}:${Config.serPort}`);
            if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
                Console.error('Connection to server has closed');
            }
        } catch (e) {
            Console.error(e.message);
        }

        return ws;
    }

    _onOpen() {
        Console.info('Connection with Server has opened');
    }
}

module.exports = Client;