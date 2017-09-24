/**
 * Tiny server for jevo.js clients. Manages many browser clients.
 * TODO: describe class
 * TODO: describe conns field
 * TODO: describe distributed mechanism and connection with other servers
 *
 * @author DeadbraiN
 */
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

class Server {
    constructor(port) {
        this._server = null;
        this._port   = port;
        this._conns  = new Connections(MAX_CONNECTIONS);
    }

    run() {
        if (this._server !== null) {return}
        this._server = new WebSocket.Server({port: this._port});
        this._server.on('connection', this._onConnect.bind(this));
        Console.info('Server is ready');
    }

    /**
     * Stops the server and terminates all clients
     */
    stop(cb = null) {
        if (this._server === null) {return}
        this._server.close(() => {
            cb && cb();
            Console.info('Server has stopped. All clients have disconnected');
        });
    }

    destroy() {
        if (this._server === null) {return this._onAfterDestroy()}
        this.stop(() => this._onAfterDestroy());
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

        console.log('Region: ', region);
        sock.on('message', this._onMessage.bind(this, region));
        sock.on('error', this._onError.bind(this, region));
        sock.on('close', this._onClose.bind(this, region));

        const clientId = Connections.toId(region);
        sock.send(clientId);
        this._conns.setSocket(sock, region);
        Console.info(`Client ${clientId} has connected`);
    }

    _onMessage(region, event) {
        Console.info('Received: ', JSON.stringify(event), ' for client ', region);
    }

    _onError(region, err) {
        Console.info('Error: ', err, ' for client ', Connections.toId(region));
    }

    _onClose(region) {
        this._conns.setSocket(null, region);
        Console.info(`Client ${Connections.toId(region)} has disconnected`);
    }
}

module.exports = Server;