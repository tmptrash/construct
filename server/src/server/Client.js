/**
 * Client, which created by server for connecting with nearest servers.
 *
 * @author flatline
 */
const Config      = require('./../../../client/src/share/Config').Config;
const Helper      = require('./../../../common/src/Helper');
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
    constructor(dir, host, port) {
        super(host, port, true);
        this._dir = dir;
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
     * Is called on connection close with server. Close reason will be in
     * this.closeReason field after calling super.onClose() method
     * @param {Event} event
     * @override
     */
    onClose(event) {
        super.onClose(event);
        Console.warn(`Client "${NAMES[this._dir]}" has disconnected by reason: ${this.closeReason}`);
    }

    /**
     * Is called after client has connected to the server
     * @param {Event} event
     * @override
     */
    onOpen(event) {
        super.onOpen(event);
        Console.info(`Client ${NAMES[this._dir]} has connected with Server`);
    }
}

module.exports = Client;