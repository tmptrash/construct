/**
 * Manager's plugin. Implements WebSocket client logic. Work in pair with
 * server/src/server/Server class. Activates current manager on a server
 * side and run it.
 * TODO: this plugin should listen organisms movings outside of the world
 * TODO: and send appropriate requests
 *
 * @author flatline
 */
const WebSocket = require('./../../../../node_modules/ws/index');
const Helper    = require('./../../../../common/src/global/Helper');
const Config    = require('./../../../../common/src/global/Config');
const TYPES     = require('./../../../../common/src/global/Requests').TYPES;
const Request   = require('./../../../../common/src/net/plugins/Request');
const Api       = require('./Api');
const Console   = require('./../../global/Console');

class Client {
    static version() {
        return '0.1';
    }

    /**
     * Sends data to the client. First two parameters are required. All
     * other parameters depend of special request and will be send to
     * the client as an array.
     * @param {WebSocket} sock
     * @param {Number} type Request type (see Requests.TYPES)
     * @param {*} params Array of parameters
     * @return {Number} Unique request id
     * @abstract
     */
    send(sock, type, ...params) {}

    /**
     * Is user for answering on requests. May not be called if answer
     * (response) don't needed.
     * @param {WebSocket} sock Socket where send the answer
     * @param {Number} type Request type (see Requests.TYPES)
     * @param {Number} reqId Unique request id, returned by send() method
     * @param {Array} params Custom parameters to send
     * @abstract
     */
    answer(sock, type, reqId, ...params) {}

    /**
     * Is called every time if server sends us a request or answer (response)
     * us.
     * @param {WebSocket} sock Socket, received the message
     * @param {Event} event Message event. Data is in 'data' property
     * @abstract
     */
    onMessage(sock, event) {}

    constructor(manager) {
        this._manager       = manager;
        this._client        = new WebSocket(`${Config.serHost}:${Config.serPort}`);
        this._request       = new Request(this);
        this._api           = new Api(this);
        this._onBeforeRunCb = this._onBeforeRun.bind(this);

        Helper.override(manager, 'onBeforeRun', this._onBeforeRunCb);
        this._client.on('open',    this._onOpen.bind(this));
        this._client.on('message', this.onMessage.bind(this, this._client));
        this._client.on('error',   this._onError.bind(this));
        this._client.on('close',   this._onClose.bind(this));
    }

    destroy() {
        this._client.removeAllListeners('close');
        this._client.removeAllListeners('message');
        this._client.removeAllListeners('error');
        this._client.removeAllListeners('close');
        this._api.destroy();
        this._api           = null;
        this._request.destroy();
        this._request       = null;
        Helper.unoverride(this._manager, 'onBeforeRun', this._onBeforeRunCb);
        this._manager       = null;
        this._onBeforeRunCb = null;
    }

    /**
     * Is called before running of server. Before running we have to connect
     * this manager with the Server and activate it on a server side. Only after
     * that it have to be ran. Running manager means 'active' manager.
     * @override
     */
    _onBeforeRun() {
        this._manager.stop();
        const reqId = this.send(this._client, TYPES.REQ_SET_ACTIVE, true, (type) => {
            if (type === TYPES.RES_ACTIVE_OK) {
                this._manager.run();
            }
        });
    }

    _onOpen() {
        Console.info('Server connection has created');
    }

    _onError(err) {
        Console.error(`Communication error: ${err.message}`);
    }

    _onClose() {
        Console.info('Server connection has closed');
    }
}

module.exports = Client;