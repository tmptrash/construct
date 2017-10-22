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
const Modes      = require('./../../../../common/src/global/Config').Modes;
const TYPES      = require('./../../../../common/src/global/Requests').TYPES;
const Request    = require('./../../../../common/src/net/plugins/Request');
const Api        = require('./Api');
const Console    = require('./../../global/Console').default;
const Connection = require('./../../../../common/src/net/Connection').Connection;
const Plugins    = require('./../../../../common/src/global/Plugins');
const EVENTS     = require('./../../global/Events').EVENTS;
//
// In browser we use browser's native WS implementation. On node.js
// we use implementation of 'ws' library
//
const WS         = Config.modeType === Modes.MODE_NODE ? require('ws') : window.WebSocket;
// TODO: should be moved to global config #
const PLUGINS = {
    Request,
    Api
};

class Client extends Connection {
    constructor(manager) {
        super(0);
        this._manager        = manager;
        this._closed         = true;
        this._client         = this._createWebSocket();
        this._plugins        = new Plugins(this, PLUGINS);
        this._onStepOutCb    = this._onStepOut.bind(this);

        this._manager.on(EVENTS.STEP_OUT, this._onStepOutCb);
        this._client.onerror = this.onError.bind(this);
        this._client.onclose = this.onClose.bind(this);
        this._client.onopen  = this.onOpen.bind(this);
    }

    get manager() {return this._manager}
    get socket()  {return this._client}

    destroy() {
        super.destroy();
        this._client.close();
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
     * @override
     */
    onClose(event) {
        super.onClose(event);
        //
        // Client has no connection with server, so we have to start in
        // "separate instance" mode.
        //
        if (this._closed) {this._manager.run()}
        this._closed = true;
        Console.warn(`Client "${this._manager.clientId}" has disconnected by reason: ${this.closeReason}`);
    }

    /**
     * Is called after client has connected to the server
     * @param {Event} event
     * @override
     */
    onOpen(event) {
        this._closed = false;
        this._client.onmessage = this.onMessage.bind(this, this._client);
        //
        // First we send request to get unique clientId from server. It
        // also means that this client is active and ready to run
        //
        this.request(this._client, TYPES.REQ_GET_ID, (type, clientId) => {
            if (type !== TYPES.RES_GET_ID_OK) {
                Console.error(`Unable to get unique client id from server. Response type: ${type}`);
                return;
            }
            this.manager.setClientId(clientId);
            this.manager.run();
            Console.info(`Client id "${clientId}" obtained from the server`);
        });
        Console.info('Connection with Server has opened');
    }

    _createWebSocket() {
        let ws = null;
        try {
            ws = new WS(`${Config.serHost}:${Config.serPort}`);
        } catch (e) {
            Console.error(e.message);
        }

        return ws;
    }

    _onStepOut(x, y, dir, org) {
        this.request(this._client, TYPES.REQ_MOVE_ORG, this._manager.clientId, x, y, dir, org.serialize());
    }
}

module.exports = Client;