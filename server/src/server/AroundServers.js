/**
 * This class stores logic of communication with nearest servers (up, right,
 * down and left), which are connected to current one. It keeps connections
 * to them and updates active status. There are two types of connection with
 * servers and saving their sockets:
 *   1. create local clients and connect them to remote servers
 *   2. catch input connection from remote client
 *
 * The type of connection depends on who was created first and last. First
 * created server A, which is above second created server B should do nothing.
 * Server B should create four clients and connect them to A and other nearest
 * servers, if they exist. For server A, input client connection from bottom
 * will be stored in this._socks[DIR.DOWN]. The same scenario for right, down
 * and left servers as well.
 *
 * @author flatline
 */
const DIR         = require('./../../../common/src/Directions').DIR;
const FLIP_DIR    = require('./../../../common/src/Directions').FLIP_DIR;
const NAMES       = require('./../../../common/src/Directions').NAMES;
const TYPES       = require('./../../../common/src/net/Requests').TYPES;
const AsyncParent = require('./../../../common/src/plugins/AsyncParent');
const Observer    = require('./../../../common/src/Observer');
const Console     = require('./../share/Console');
const Client      = require('./Client');
/**
 * Events of this class
 */
const OPEN        = 0;
const CLOSE       = 1;
const EVENTS      = {
    OPEN,
    CLOSE
};

// TODO: later here should be auto connect mechanism for this._clients
class AroundServers extends Observer {
    constructor(parent) {
        super(Object.keys(EVENTS).length);

        this.EVENTS = EVENTS;
        /**
         * {Connection} Connection instance of current Client or Server
         */
        this._parent  = parent;
        /**
         * {Object} Four sockets for sending messages to nearest servers.
         * They may be: clients created within current class or sockets
         * obtained after input client connection (created by remote server).
         */
        this._socks   = new Array(4);
        /**
         * {Object} Optional clients for connection with nearest servers.
         * This map may be empty ar partly empty if servers around make
         * connection first. Keys - directions, values - client instances.
         */
        this._clients = new Array(4);
        /**
         * {AsyncParent} Keep reference to AsyncParent class, which tracks
         * async running of classes through AsyncChild interface.
         */
        this._async   = null;
        //
        // Try to create clients map for connection with nearest servers
        //
        this._createClients();
    }

    run(done = () => {}) {
        this._clients.forEach(c => c.run());
        this._async.run(done);
        return true;
    }

    stop(done = () => {}) {
        this._clients.forEach(c => c.stop());
        this._async.stop(done);
        return true;
    }

    destroy(done = () => {}) {
        this.stop(() => {
            this._parent  = null;
            this._socks   = null;
            this._clients.forEach(c => c.destroy());
            this._clients = null;
            this._async.destroy(done);
            super.destroy();
        });
    }

    /**
     * Returns direction by socket
     * @param {WebSocket} sock
     * @return {Number} Direction DIR.NO is also available
     */
    getDirection(sock) {
        const index = this._socks.indexOf(sock);
        return index < 0 && DIR.NO || index;
    }

    hasSocket(dir) {
        return !!this._socks[dir];
    }

    getSocket(dir) {
        return this._socks[dir];
    }

    setSocket(sock, dir) {
        dir !== DIR.NO && (this._socks[dir] = sock);
    }

    _createClients() {
        const parent  = this._parent;
        const cfg     = parent.cfg;
        const clients = this._clients;

        clients[DIR.UP]    = new Client(parent, DIR.UP,    cfg.upHost,    cfg.upPort,    true);
        clients[DIR.RIGHT] = new Client(parent, DIR.RIGHT, cfg.rightHost, cfg.rightPort, true);
        clients[DIR.DOWN]  = new Client(parent, DIR.DOWN,  cfg.downHost,  cfg.downPort,  true);
        clients[DIR.LEFT]  = new Client(parent, DIR.LEFT,  cfg.leftHost,  cfg.leftPort,  true);

        this._addHandlers(clients);
        this._async = new AsyncParent(this, {classes: clients, isBrowser: false});
    }

    _addHandlers(clients) {
        clients.forEach((c, i) => {
            c.on(c.EVENTS.OPEN,  this._onOpen.bind(this, c, i));
            c.on(c.EVENTS.CLOSE, this._onClose.bind(this, i));
        });
    }
    /**
     * Sends a request to tell remote server, that this client is
     * for inter server communication only. dir parameter sets nearest
     * server location (up...left)
     * @param {WebSocket} client WebSocket client instance for connection
     * with nearest server
     * @param {Number} dir Direction of nearest server (up...left)
     */
    _onOpen(client, dir) {
        client.request(client.socket, TYPES.REQ_SET_NEAR_ACTIVE, FLIP_DIR[dir], (type) => {
            if (type !== TYPES.RES_SET_NEAR_ACTIVE_OK) {
                Console.error(`Unable update active status on [${NAMES[dir]}] server. Response type: ${type}`);
                return;
            }
            this._socks[dir] = client.socket;
            this.fire(OPEN, dir);
        });
    }

    _onClose(dir) {
        this._socks[dir] = null;
        this.fire(CLOSE, dir);
    }
}

module.exports = AroundServers;