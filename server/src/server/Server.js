/**
 * Tiny server for jevo.js clients. Manages many browser clients. Main
 * goal of this server is to track/manage browser or phantom like based
 * clients as a distributed nodes. Server supports MAX_CONNECTIONS
 * clients at the time. All connected clients/nodes create big virtual
 * map for digital organisms. So one client == one map. By map i mean a
 * planar area with specific width and height configured in global config
 * (see Config.js.worldWidth/worldHeight). If MAX_CONNECTIONS + 1 client
 * try to connect, server deny the access. Every client in this system
 * has unique ID, which consists of X,Y coordinates of this client. Each
 * id is called region. So, for example, if we have MAX_CONNECTIONS === 4,
 * we will have square of 16 cells (4 inside and 12 outside):
 *
 *     0:0  1:0  2:0  3:0
 *     0:1  1:1  2:1  3:1
 *     0:2  1:2  2:2  3:2
 *     0:3  1:3  2:3  3:3
 *
 * Cells 1:1, 2:1, 1:2, 2:2 are client connections (WebSockets). All other
 * cells are pointers to connections (also WebSockets) of sibling servers.
 * Every time, when new client connects, the server sends him back region
 * or unique id and inserts it into big map according to coordinates.
 * Connection between different clients and between sibling servers should
 * be the same (using WebSockets).
 *
 * @author DeadbraiN
 */
const Observer    = require('./../../../src/global/Observer').default;
const WebSocket   = require('./../../../node_modules/ws/index');
const Console     = require('./../global/Console');
const Connections = require('./../server/Connections');

/**
 * {Number} Maximum amount of connections for current server. Should
 * be quadratic (x^2) e.g.: 4, 9, 16,... This value will be extended
 * with additional "around" rows and columns for connecting with sibling
 * servers. So, result amount will be e.g.: 100 + 2 rows + 2 columns.
 */
const MAX_CONNECTIONS = 100;

const RUN     = 0;
const STOP    = 1;
const CONNECT = 2;
const MSG     = 3;
const ERR     = 4;
const CLOSE   = 5;

const EVENTS = {
    RUN    : RUN,
    STOP   : STOP,
    CONNECT: CONNECT,
    MSG    : MSG,
    ERR    : ERR,
    CLOSE  : CLOSE
};
const EVENTS_LEN = Object.keys(EVENTS).length;

class Server extends Observer {
    /**
     * Creates an instance of the server. Also creates regions map
     * with initially null values.
     * @param {Number} port
     */
    constructor(port) {
        super(EVENTS_LEN);
        this._server  = null;
        this._port    = port;
        this._running = false;
        this._conns   = new Connections(MAX_CONNECTIONS);
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
            this.fire(RUN);
            Console.info('Server is ready');
        });
        this._server.on('connection', this._onConnect.bind(this));

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
        if (!this._server) {return false}
        //
        // Server was ran, but not ready yet. stop() method
        // will be called later after RUN event fired
        //
        if (Server.ports[this._port] && this._running === false) {
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
        me._server.close(() => {
            delete Server.ports[me._port];
            me._running = false;
            me.fire(STOP);
            Console.info('Server has stopped. All clients have disconnected');
        });

        return true;
    }

    /**
     * Returns running state. It's true only between run() and stop() calls
     * @returns {Boolean}
     */
    isRunning() {
        return this._running;
    }

    destroy() {
        const me = this;
        const onDestroy = () => {
            me._server = me._port = me._conns = null;
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
     * @private
     */
    _onConnect(sock) {
        const region = this._conns.getFreeRegion();
        if (region === false) {
            sock.terminate();
            Console.warn('This server is overloaded by clients. Try another server to connect.');
            return;
        }

        sock.on('message', this._onMessage.bind(this, region, sock));
        sock.on('error', this._onError.bind(this, region, sock));
        sock.on('close', this._onClose.bind(this, region, sock));

        const clientId = Connections.toId(region);
        sock.send(clientId);
        this._conns.setSocket(sock, region);
        this.fire(CONNECT, sock);
        Console.info(`Client ${clientId} has connected`);
    }

    _onMessage(region, sock, event) {
        this.fire(MSG, region, sock);
        Console.info('Received: ', JSON.stringify(event), ' for client ', region);
    }

    _onError(region, sock, err) {
        this.fire(ERR, region, sock);
        Console.info('Error: ', err, ' for client ', Connections.toId(region));
    }

    _onClose(region, sock) {
        this._conns.setSocket(null, region);
        this.fire(CLOSE, region, sock);
        Console.info(`Client ${Connections.toId(region)} has disconnected`);
    }
}

/**
 * {Object} Map of currently used ports
 * @static
 */
Server.ports = {};

module.exports = {Server: Server, EVENTS: EVENTS};