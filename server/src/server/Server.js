/**
 * Tiny server for construct clients. Manages many browser clients. Main
 * goal of this server is to track/manage browser or phantom like based
 * clients as a distributed nodes. Server supports maxConnections
 * clients at the time. All connected clients/nodes create big virtual
 * map for digital organisms. So one client == one map. By map i mean a
 * planar area with specific width and height configured in global config
 * (see Config.js.worldWidth/worldHeight). If maxConnections + 1 client
 * try to connect, server deny the access. Every client in this system
 * has unique ID, which consists of X,Y coordinates of this client. Each
 * id is called region. So, for example, if we have maxConnections === 4,
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
 *
 * @author flatline
 */
const OS               = require('os');
const WebSocket        = require('./../../../node_modules/ws/index');
const Connection       = require('./../../../common/src/net/Connection').Connection;
const EVENTS           = require('./../../../common/src/net/Connection').EVENTS;
const AroundServers    = require('./AroundServers');
const Config           = require('./../share/Config').Config;
const Plugins          = require('./Plugins');
const Console          = require('./../share/Console');
const Connections      = require('./Connections');
const DIR              = require('./../../../common/src/Directions').DIR;
const NAMES            = require('./../../../common/src/Directions').NAMES;
/**
 * {Number} Amount of base events. Is used to extend them by server related
 */
const EVENTS_LEN  = Object.keys(EVENTS).length;
/**
 * {Number} Server related events
 */
const CONNECT     = EVENTS_LEN;
const RUN         = EVENTS_LEN + 1;
const STOP        = EVENTS_LEN + 2;
const OVERFLOW    = EVENTS_LEN + 3;
/**
 * {Object} Extends common Connection events by related to server
 */
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
     */
    constructor(port = Config.port) {
        super(SERVER_EVENTS_LEN);
        this.EVENTS         = SERVER_EVENTS;
        this.cfg            = Config;
        this.conns          = new Connections(Config.maxConnections);
        this.aroundServers  = Config.modeDistributed ? new AroundServers(this) : null;

        this._server        = null;
        this._port          = port;
        this._running       = false;
        this._stopping      = false;
        this._destroying    = false;
        this._plugins       = new Plugins(this, {plugins: Config.plugIncluded, noDestroy: true});
    }

    /**
     * Runs the server. It means that, clients may connect to this
     * server. Creates WebSocketServer instance, bind passed port
     * and start listening input connections. Fires RUN event on done.
     * If port is already in use, then returns false and prints warning.
     * @returns {Boolean} Running state
     */
    run() {
        if (this._running) {
            Console.warn(`Can not run server on port ${this._port}. It's already running.`);
            return false;
        }
        if (this._stopping) {
            Console.warn(`Can not run server on port ${this._port}. It's stopping right now.`);
            return false;
        }
        if (Server.ports[this._port]) {
            Console.warn(`Port ${this._port} is already used`);
            return false;
        }

        this._running = true;
        Server.ports[this._port] = true;
        try {
            this._server = new WebSocket.Server({port: this._port}, () => {
                const onDone = () => {
                    this._server.on('connection', this.onConnect.bind(this));
                    this.active = true;
                    this._running = false;
                    this.fire(RUN);
                    Console.info(`Server is ready on ${this._getIp()}:${this._port}`);
                };
                this.aroundServers && this.aroundServers.run(onDone) || onDone();
            });
            this._server.on('error', (e) => Console.error(`Can\'t run server on port ${this._port}. Error: '${e.message}'`));
        } catch (e) {
            Console.error(`Can\'t run server on port ${this._port}. Error: '${e.message}'`);
            return false;
        }

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

        if (!me._server || this._stopping) {
            Console.warn(`Can't stop already stopped server.`);
            return false;
        }
        if (me._running) {
            const onRun = () => {
                me.off(RUN, onRun);
                me.stop();
            };
            me.on(RUN, onRun);
            return true;
        }
        //
        // Server is ready to close all clients and itself
        //
        try {
            me._stopping = true;
            me._server.close(() => {
                const onDone = () => {
                    delete Server.ports[me._port];
                    me._server.removeAllListeners('connection');
                    me.active    = false;
                    me._stopping = false;
                    this._server = null;
                    me.fire(STOP);
                    Console.info('Server has stopped. All clients have disconnected');
                    if (me._destroying) {me.destroy()}
                };
                this.aroundServers && this.aroundServers.stop(onDone) || onDone();
            });
        } catch(e) {
            Console.error('Server.stop() failed: ', e);
        }

        return true;
    }

    /**
     * @destructor
     * @override
     */
    destroy() {
        if (this._server !== null) {
            this.stop();
            this._destroying = true;
            return;
        }
        this._plugins.onDestroy();
        this._plugins    = null;
        this.conns.destroy();
        this._server     = null;
        this.conns       = null;
        this._port       = null;
        this._destroying = false;

        super.destroy();
    }

    /**
     * Is called if client has connected to this server. If contains free
     * regions for new connections, then places current one in a connection
     * cub and sends unique id to the client.
     * @param {WebSocket} sock Client's socket
     * @param {Object} req Request info object
     */
    onConnect(sock, req) {
        const region   = this.conns.getFreeRegion();
        const clientId = Connections.toId(region);
        if (region === null && this._server.clients.length > Config.maxConnections + 4) { // 4 extra connections for near servers
            sock.terminate();
            this.fire(OVERFLOW, sock);
            Console.warn('This server is overloaded by clients. Try another server to connect.');
            return;
        }
        //
        // This is small hack. We have to bind remote client address and
        // it's socket. We use this info in a terminal to show remote
        // connected client address
        //
        sock.remoteAddr = req.connection.remoteAddress;

        sock.on('message', this.onMessage.bind(this, sock));
        sock.on('error', this.onError.bind(this, clientId, sock));
        sock.on('close', this.onClose.bind(this, clientId, sock));

        this.fire(CONNECT, sock);
    }

    /**
     * Handler of client's connection close
     * @param {String} clientId Unique client id
     * @param {WebSocket} sock Client WebSocket
     * @param {Object} event Close event
     * @override
     */
    onClose(clientId, sock, event) {
        super.onClose(event);
        const servers  = this.aroundServers;
        const region   = Connections.toRegion(clientId);
        const dir      = servers ? servers.getDirection(sock) : clientId;
        const isServer = dir < DIR.NO;

        !isServer && this.conns.clearData(region);
        sock.removeAllListeners('message');
        sock.removeAllListeners('error');
        sock.removeAllListeners('close');
        servers && servers.setSocket(sock, dir);
        clientId !== false && Console.warn(`Client [${isServer ? NAMES[dir] : clientId}] has disconnected by reason: ${this.closeReason}`);
    }

    /**
     * Returns local IP, which is used by clients to connect
     * @return {String}
     */
    _getIp() {
        const iFaces = OS.networkInterfaces();
        let   ip     = '127.0.0.1';

        Object.keys(iFaces).forEach(dev => {
            iFaces[dev].filter(details => {
                if (details.family === 'IPv4' && details.internal === false) {
                    ip = details.address;
                }
            });
        });

        return ip;
    }
}

/**
 * {Object} Map of currently used ports
 * @static
 */
Server.ports = {};

module.exports = {Server, EVENTS: SERVER_EVENTS};