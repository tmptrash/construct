/**
 * Tiny server for jevo.js clients. Manages many browser clients.
 * TODO: describe class
 * TODO: describe conns field
 * TODO: describe distributed mechanism and connection with other servers
 * TODO: should use Observer
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

const INIT    = 0;
const RUN     = 1;
const STOP    = 2;
const CONNECT = 3;
const MSG     = 4;
const ERR     = 5;
const CLOSE   = 6;

const EVENTS = {
    INIT   : INIT,
    RUN    : RUN,
    STOP   : STOP,
    CONNECT: CONNECT,
    MSG    : MSG,
    ERR    : ERR,
    CLOSE  : CLOSE
};
const EVENTS_LEN = Object.keys(EVENTS).length;

class Server extends Observer {
    constructor(port) {
        super(EVENTS_LEN);
        this._server = null;
        this._port   = port;
        this._conns  = new Connections(MAX_CONNECTIONS);
        this.fire(INIT);
    }

    run() {
        if (this._server !== null) {return false}
        this._server = new WebSocket.Server({port: this._port}, () => {
            this.fire(RUN);
            Console.info('Server is ready');
        });
        this._server.on('connection', this._onConnect.bind(this));

        return true;
    }

    /**
     * Stops the server and terminates all clients
     */
    stop() {
        if (this._server === null) {return}
        this._server.close(() => {
            this.fire(STOP);
            Console.info('Server has stopped. All clients have disconnected');
        });
    }

    destroy() {
        if (this._server === null) {return this._onAfterDestroy()}
        this.stop(() => this._onAfterDestroy());
        this.clear();
    }

    _onAfterDestroy() {
        this._server = null;
        this._port   = null;
        this._conns  = null;
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

module.exports = {Server: Server, EVENTS: EVENTS};