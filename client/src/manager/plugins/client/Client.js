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
const Config       = require('./../../../share/Config').Config;
const Helper       = require('./../../../../../common/src/Helper');
const ServerConfig = require('./../../../../../server/src/share/Config').Config;
const TYPES        = require('./../../../../../common/src/net/Requests').TYPES;
const Console      = require('./../../../share/Console');
const Connection   = require('./../../../../../common/src/net/Connection').Connection;
const EVENTS       = require('./../../../../../common/src/net/Connection').EVENTS;
const Plugins      = require('./Plugins');
const GEVENTS      = require('./../../../share/Events').EVENTS;
//
// In browser we use browser's native WS implementation. On node.js
// we use implementation of 'ws' library
//
const WS         = Config.modeNodeJs ? require('ws') : window.WebSocket;
// TODO: should be moved to local config
const PLUGINS = [
    'src/plugins/Request',
    'src/manager/plugins/client/plugins/Api',
    'src/manager/plugins/client/plugins/Async'
];

const EVENTS_LEN  = Object.keys(EVENTS).length;
const OPEN        = EVENTS_LEN;
const GET_ID      = EVENTS_LEN + 1;

const CLIENT_EVENTS = Object.assign({
    OPEN,
    GET_ID
}, EVENTS);
const CLIENT_EVENTS_LEN = Object.keys(CLIENT_EVENTS).length;

class Client extends Connection {
    constructor(manager) {
        super(CLIENT_EVENTS_LEN);
        this.EVENTS       = CLIENT_EVENTS;

        this._manager     = manager;
        this._onStepOutCb = this._onStepOut.bind(this);
        this._runCb       = this.run.bind(this);
        this._stopCb      = this.stop.bind(this);

        Helper.override(manager, 'run', this._runCb);
        Helper.override(manager, 'stop', this._stopCb);
        //
        // Plugins should be created at the end of constructor to
        // have an ability to access this class public fields
        //
        this._plugins     = new Plugins(this, {plugins: PLUGINS});
    }

    run() {
        if (this.active) {return}
        this._client         = this._createWebSocket();
        this._client.onerror = this.onError.bind(this);
        this._client.onclose = this.onClose.bind(this);
        this._client.onopen  = this.onOpen.bind(this);
        this._manager.on(GEVENTS.STEP_OUT, this._onStepOutCb);
    }

    stop() {
        this.active && this._client.close();
        this._manager.off(GEVENTS.STEP_OUT, this._onStepOutCb);
    }

    get manager() {return this._manager}
    get socket()  {return this._client}

    destroy() {
        this.stop();
        if (this._client) {
            this._client.onclose   = null;
            this._client.onmessage = null;
            this._client.onerror   = null;
        }
        Helper.unoverride(this._manager, 'run', this._runCb);
        Helper.unoverride(this._manager, 'stop', this._stopCb);
        this._runCb        = null;
        this._stopCb       = null;
        this._onStepOutCbs = null;
        this._manager      = null;
        this._plugins      = null;

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
        Console.warn(`Client "${this._manager.clientId}" has disconnected by reason: ${this.closeReason}`);
    }

    /**
     * Is called after client has connected to the server
     * @param {Event} event
     * @override
     */
    onOpen(event) {
        this.active = true;
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
            this._manager.clientId = clientId;
            this.fire(GET_ID, clientId);
            Console.info(`Client id "${clientId}" obtained from the server`);
        });
        this.fire(OPEN, event);
        Console.info('Connection with Server has opened');
    }

    _createWebSocket() {
        let ws = null;
        try {
            ws = new WS(`${ServerConfig.host}:${ServerConfig.port}`);
        } catch (e) {
            Console.error(e.message);
        }

        return ws;
    }

    _onStepOut(x, y, dir, org) {
        this.request(this._client, TYPES.REQ_MOVE_ORG, this._manager.clientId, x, y, dir, org.serialize());
    }
}

module.exports = {Client, EVENTS: CLIENT_EVENTS};
