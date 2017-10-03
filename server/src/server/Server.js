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
 *
 * @author flatline
 */
const Observer    = require('./../../../src/global/Observer');
const WebSocket   = require('./../../../node_modules/ws/index');
const Console     = require('./../global/Console');
const Connections = require('./../server/Connections');
const Config      = require('./../../../src/global/Config').Config;
const Api         = require('./plugins/Api');
const Request     = require('./../../../src/global/plugins/Request');
const STOC        = require('./../../../src/global/Requests').STOC;

const PLUGINS = {
    Api    : Api,
    Request: Request
};

const RUN      = 0;
const STOP     = 1;
const CONNECT  = 2;
const MSG      = 3;
const ERR      = 4;
const CLOSE    = 5;
const OVERFLOW = 6;

const EVENTS = {
    RUN     : RUN,
    STOP    : STOP,
    CONNECT : CONNECT,
    MSG     : MSG,
    ERR     : ERR,
    CLOSE   : CLOSE,
    OVERFLOW: OVERFLOW
};
const EVENTS_LEN = Object.keys(EVENTS).length;

class Server extends Observer {
    static version() {
        return '0.1';
    }

    /**
     * Sends data to the client. First two parameters are required. All
     * other parameters depend of special request and will be send to
     * the client as an array.
     * @param {WebSocket} sock
     * @param {Number} type Request type (see Requests.STOC|CTOS)
     * @param {*} params Array of parameters
     * @return {Number} Unique request id
     * @abstract
     */
    send(sock, type, ...params) {}

    /**
     * Is user for answering on requests. May not be called if answer
     * (response) don't needed.
     * @param {WebSocket} sock Socket where send the answer
     * @param {Number} type Request type (see Requests.STOC|CTOS)
     * @param {Number} reqId Unique request id, returned by send() method
     * @param {Array} params Custom parameters to send
     * @abstract
     */
    answer(sock, type, reqId, ...params) {}

    /**
     * Creates an instance of the server. Also creates regions map
     * with initially null values.
     * @param {Number} port
     */
    constructor(port) {
        super(EVENTS_LEN);
        this.EVENTS       = EVENTS;
        this._port        = port;
        this._running     = false;
        this._plugins     = {};
        this._server      = null;

        this.conns        = new Connections(Config.serMaxConnections);

        this._initPlugins();
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
        me._server.close(() => {
            delete Server.ports[me._port];
            me._running = false;
            this._server.removeAllListeners('connection');
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

    /**
     * @destructor
     */
    destroy() {
        const me        = this;
        const plugins   = this._plugins;
        const onDestroy = () => {
            for (let p in plugins) {if (plugins.hasOwnProperty(p) && plugins[p].destroy) {plugins[p].destroy()}}
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
            this.fire(EVENTS.OVERFLOW, sock);
            Console.warn('This server is overloaded by clients. Try another server to connect.');
            return;
        }

        sock.on('message', this.onMessage.bind(this, sock));
        sock.on('error', this.onError.bind(this, clientId, sock));
        sock.on('close', this.onClose.bind(this, clientId, sock));

        this.send(sock, STOC.REQ_GIVE_ID, clientId);
        this.conns.setData(region, 'sock', sock);
        this.fire(EVENTS.CONNECT, sock);
        Console.info(`Client ${clientId} has connected`);
    }

    onMessage(sock, event) {
        this.fire(EVENTS.MSG, sock, event.data);
    }

    onError(clientId, sock, err) {
        this.fire(EVENTS.ERR, sock, clientId, err);
        Console.info('Error: ', err.message, ' for client ', clientId);
    }

    onClose(clientId, sock) {
        const region = Connections.toRegion(clientId);
        this.conns.clearData(region);
        sock.removeAllListeners('message');
        sock.removeAllListeners('error');
        sock.removeAllListeners('close');
        this.fire(EVENTS.CLOSE, sock, clientId, region);
        Console.info(`Client ${clientId} has disconnected`);
    }

    _initPlugins() {
        let plugins = this._plugins;
        for (let p in PLUGINS) {
            plugins[p] = new PLUGINS[p](this);
        }
    }
}

/**
 * {Object} Map of currently used ports
 * @static
 */
Server.ports = {};

module.exports = {Server: Server, EVENTS: EVENTS};