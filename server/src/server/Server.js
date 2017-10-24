/**
 * Tiny server for jevo.js clients. Manages many browser clients. Main
 * goal of this server is to track/manage browser or phantom like based
 * clients as a distributed nodes. Server supports serMaxConnections
 * clients at the time. All connected clients/nodes create big virtual
 * map for digital organisms. So one client == one map. By map i mean a
 * planar area with specific width and height configured in global config
 * (see Config.js.worldWidth/worldHeight). If serMaxConnections + 1 client
 * try to connect, server deny the access. Every client in this system
 * has unique ID, which consists of X,Y coordinates of this client. Each
 * id is called region. So, for example, if we have serMaxConnections === 4,
 * we will have square of 16 cells (4 inside and 12 outside):
 *
 *     0:0  1:0  2:0  3:0
 *     0:1  1:1  2:1  3:1
 *     0:2  1:2  2:2  3:2
 *     0:3  1:3  2:3  3:3
 *
 * Table above shows Connections instance data. Every cell is a coordinate
 * based value, which contain WebSocket reference or null . Cells 1:1, 2:1,
 * 1:2, 2:2 are client connections (WebSockets). All other cells are pointers
 * to connections (also WebSockets) of sibling servers. Every time, when new
 * client connects, the server sends him back region or unique id and inserts
 * it into big map according to coordinates. Connection between different
 * clients and between sibling servers should be the same (using WebSockets).
 * If there are no sibling servers, then cells 0:0...3:0, 3:0...3:3, 3:3...0:3,
 * 0:3...0:0 will be set to null. Corner cells (0:0, 3:0, 3:3, 0:3) are always
 * null.
 * TODO: all clients should be notified if near client stay active
 *
 * @author flatline
 */
const WebSocket   = require('./../../../node_modules/ws/index');
const Connection  = require('./../../../common/src/net/Connection').Connection;
const EVENTS      = require('./../../../common/src/net/Connection').EVENTS;
const Config      = require('./../../../common/src/global/Config').Config;
const TYPES       = require('./../../../common/src/global/Requests').TYPES;
const Plugins     = require('./../../../common/src/global/Plugins');
const Console     = require('./../global/Console');
const Connections = require('./../server/Connections');

const EVENTS_LEN  = Object.keys(EVENTS).length;
const CONNECT     = EVENTS_LEN;
const RUN         = EVENTS_LEN + 1;
const STOP        = EVENTS_LEN + 2;
const OVERFLOW    = EVENTS_LEN + 3;

const SERVER_EVENTS = Object.assign({
    CONNECT,
    RUN,
    STOP,
    OVERFLOW
}, EVENTS);
const SERVER_EVENTS_LEN = Object.keys(SERVER_EVENTS).length;

class Server extends Connection {
    /**
     * Creates an instance of the server. Also creates regions map
     * with initially null values.
     * @param {Number} port
     * @param {Object} plugins Map of plugins. key: name, val: Class
     */
    constructor(port, plugins) {
        super(SERVER_EVENTS_LEN);
        this.EVENTS        = SERVER_EVENTS;
        this.conns         = new Connections(Config.serMaxConnections);

        /**
         * {Array} Array of four bool elements (four sides), which stores sockets
         * of up, right, down and left near servers.
         */
        this._activeAround = [false, false, false, false];
        this._server       = null;
        this._port         = port;
        this._running      = false;
        this._plugins      = new Plugins(this, plugins, false);
    }

    /**
     * Runs the server. It means that, clients may connect to this
     * server. Creates WebSocketServer instance, bind passed port
     * and start listening input connections. Fires RUN event on done.
     * If port is already in use, then returns false and prints warning.
     * @returns {Boolean} Running state
     */
    run() {
        if (this._server !== null) {
            Console.warn('Server has already ran on port ${this._port}');
            return false;
        }
        if (Server.ports[this._port]) {
            this.stop();
            Console.warn(`Port ${this._port} is already used`);
            return false;
        }

        Server.ports[this._port] = true;
        this._server = new WebSocket.Server({port: this._port}, () => {
            this._running = true;
            this._server.on('connection', this.onConnect.bind(this));
            this.fire(RUN);
            Console.info('Server is ready');
        });

        return true;
    }

    /**
     * Stops the server and terminates all clients. Fires STOP event
     * on done. Stopping doesn't mean destroying. You may stop and
     * start it again and again.
     * @return {Boolean} Stopping success
     */
    stop() {
        const me = this;
        //
        // Server wasn't ran before
        //
        if (!me._server) {return false}
        //
        // Server was ran, but not ready yet. stop() method
        // will be called later after RUN event fired
        //
        if (Server.ports[me._port] && me._running === false) {
            const onRun = () => {
                me.stop();
                me.off(RUN, onRun);
            };
            me.on(RUN, onRun);
            return false;
        }
        //
        // Server is ready to close all clients and itself
        //
        try {
            me._server.close(() => {
                delete Server.ports[me._port];
                me._running = false;
                this._server.removeAllListeners('connection');
                me.fire(STOP);
                Console.info('Server has stopped. All clients have disconnected');
            });
        } catch(e) {
            Console.error('Server.stop() failed: ', e);
        }

        return true;
    }

    /**
     * Returns running state. It's true only between run() and stop() calls
     * @returns {Boolean}
     */
    isRunning() {
        return this._running;
    }

    /**
     * @destructor
     * @override
     */
    destroy() {
        super.destroy();
        const me        = this;
        const onDestroy = () => {
            this._plugins.onDestroy();
            me.conns.destroy();
            me._server = me.conns = me._port = me._plugins = null;
            me.clear();
        };

        if (me._server === null) {return onDestroy()}
        me.on(STOP, onDestroy);
        me.stop();
    }

    /**
     * Is called if client has connected to this server. If contains free
     * regions for new connections, then places current one in a connection
     * cub and sends unique id to the client.
     * @param {WebSocket} sock Client's socket
     */
    onConnect(sock) {
        const region   = this.conns.getFreeRegion();
        const clientId = Connections.toId(region);
        if (region === null) {
            sock.terminate();
            this.fire(SERVER_EVENTS.OVERFLOW, sock);
            Console.warn('This server is overloaded by clients. Try another server to connect.');
            return;
        }

        sock.on('message', this.onMessage.bind(this, sock));
        sock.on('error', this.onError.bind(this, clientId, sock));
        sock.on('close', this.onClose.bind(this, clientId, sock));

        this.fire(SERVER_EVENTS.CONNECT, sock);
        Console.info(`Client ${clientId} has connected`);
    }

    /**
     * @override
     */
    onClose(clientId, sock, event) {
        super.onClose(event);
        const region = Connections.toRegion(clientId);
        this.conns.clearData(region);
        sock.removeAllListeners('message');
        sock.removeAllListeners('error');
        sock.removeAllListeners('close');
        Console.warn(`Client ${clientId} has disconnected by reason: ${this.closeReason}`);
    }
}

/**
 * {Object} Map of currently used ports
 * @static
 */
Server.ports = {};

module.exports = {Server, EVENTS: SERVER_EVENTS};