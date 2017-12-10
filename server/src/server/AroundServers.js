/**
 * This class stores logic of communication with nearest servers (up, right,
 * down and left), which are connected to current one. It keeps connections
 * to them and updates active status. There are two types of connection with
 * servers ans saving their sockets:
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
const TYPES       = require('./../../../common/src/net/Requests').TYPES;
const AsyncParent = require('./../../../common/src/plugins/AsyncParent');
const Client      = require('./Client');

// TODO: later here should be auto connect mechanism for this._clients
class AroundServers {
    constructor(parent) {
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
        });
    }

    setSocket(sock, dir) {
        this._socks[dir] = sock;
    }

    activate(activate = true) {
        const socks  = this._socks;
        const parent = this._parent;
        const UP     = DIR.UP;
        const RIGHT  = DIR.RIGHT;
        const DOWN   = DIR.DOWN;
        const LEFT   = DIR.LEFT;
        const ACTIVE = TYPES.REQ_SET_NEAR_ACTIVE;

        socks[UP]    && parent.request(socks[UP],    ACTIVE, DOWN,  activate);
        socks[RIGHT] && parent.request(socks[RIGHT], ACTIVE, LEFT,  activate);
        socks[DOWN]  && parent.request(socks[DOWN],  ACTIVE, UP,    activate);
        socks[LEFT]  && parent.request(socks[LEFT],  ACTIVE, RIGHT, activate);
    }

    _createClients() {
        const cfg     = this._parent.cfg;
        const clients = this._clients;

        clients[DIR.UP]    = new Client(DIR.UP,    cfg.upHost,    cfg.upPort,    true);
        clients[DIR.RIGHT] = new Client(DIR.RIGHT, cfg.rightHost, cfg.rightPort, true);
        clients[DIR.DOWN]  = new Client(DIR.DOWN,  cfg.downHost,  cfg.downPort,  true);
        clients[DIR.LEFT]  = new Client(DIR.LEFT,  cfg.leftHost,  cfg.leftPort,  true);

        this._addHandlers(clients);
        this._async = new AsyncParent(this, {classes: clients, isBrowser: false});
    }

    _addHandlers(clients) {
        const socks = this._socks;

        clients.forEach((c, i) => {
            c.on(c.EVENTS.OPEN,  () => socks[i] = c.socket);
            c.on(c.EVENTS.CLOSE, () => socks[i] = null);
        });
    }
}

module.exports = AroundServers;