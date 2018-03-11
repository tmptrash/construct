/**
 * Manager's plugin. Implements WebSocket client logic. Work in pair with
 * server/src/server/Server class. Activates current manager on a server
 * side and run it.
 *
 * @author flatline
 */
const Config      = require('./../../../share/Config').Config;
const Helper      = require('./../../../../../common/src/Helper');
const TYPES       = require('./../../../../../common/src/net/Requests').TYPES;
const Console     = require('./../../../share/Console');
const BaseClient  = require('./../../../../../common/src/net/Client').Client;
const EVENTS      = require('./../../../../../common/src/net/Client').EVENTS;
const Plugins     = require('./Plugins');
const GEVENTS     = require('./../../../share/Events').EVENTS;

const PLUGINS     = [
    'src/plugins/Request',
    'src/manager/plugins/client/plugins/Api',
    'src/plugins/AsyncClient'
];

const EVENTS_LEN  = Object.keys(EVENTS).length;
const GET_ID      = EVENTS_LEN;

const CLIENT_EVENTS = Object.assign({
    GET_ID
}, EVENTS);

class Client extends BaseClient {
    constructor(manager) {
        super(Config.serverHost, Config.serverPort, Config.MODE_NODE_JS, CLIENT_EVENTS);
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
        super.run();
        this._manager.on(GEVENTS.STEP_OUT, this._onStepOutCb);
    }

    stop() {
        super.stop();
        this._manager.off(GEVENTS.STEP_OUT, this._onStepOutCb);
    }

    get manager() {return this._manager}

    destroy() {
        super.destroy();

        Helper.unoverride(this._manager, 'run', this._runCb);
        Helper.unoverride(this._manager, 'stop', this._stopCb);
        this._runCb   = null;
        this._stopCb  = null;
        this._manager = null;
        this._plugins = null;
    }

    /**
     * Is called on connection close with server. Close reason will be in
     * this.closeReason field after calling super.onClose() method
     * @param {Event} event
     * @override
     */
    onClose(event) {
        super.onClose(event);
        Console.warn(`Client "${this._manager.clientId}" has disconnected by reason: ${this.closeReason}`);
        this._manager.clientId = null;
        this._manager.resetActive();
    }

    /**
     * Is called after client has connected to the server
     * @param {Event} event
     * @override
     */
    onOpen(event) {
        super.onOpen(event);
        //
        // First we send request to get unique clientId from server. It
        // also means that this client is active and ready to run
        //
        this.request(this.socket, TYPES.REQ_GET_ID, (type, clientId) => {
            if (type !== TYPES.RES_GET_ID_OK) {
                Console.error(`Unable to get unique client id from server. Response type: ${type}`);
                return;
            }
            this._manager.clientId = clientId;
            this.fire(GET_ID, clientId);
            Console.info(`Client id "${clientId}" obtained from the server`);
        });
        Console.info('Connection with Server has opened');
    }

    _onStepOut(x, y, dir, org) {
        this.request(this.socket, TYPES.REQ_MOVE_ORG, this._manager.clientId, x, y, dir, org.serialize());
    }
}

module.exports = {Client, EVENTS: CLIENT_EVENTS};