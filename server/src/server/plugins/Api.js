/**
 * Plugin for Server class, which implement it's API. Is separated from Server to
 * have an ability to change API any time without changing server's code. @api
 * annotation means that specified method is a part of Server API and available
 * from clients requests.
 *
 * @author flatline
 */
const _get        = require('lodash/get');
const Helper      = require('./../../../../common/src/Helper');
const TYPES       = require('./../../../../common/src/net/Requests').TYPES;
const Console     = require('./../../share/Console');
const Connections = require('./../Connections');

const DIR         = require('./../../../../common/src/Directions').DIR;
const NAMES       = require('./../../../../common/src/Directions').NAMES;
const BaseApi     = require('./../../../../common/src/net/Api');
class Api extends BaseApi {
    constructor(parent) {
        super(parent);
        const servers = parent.aroundServers;

        this.api[TYPES.REQ_MOVE_ORG]        = this._moveOrg.bind(this);
        this.api[TYPES.REQ_GET_ID]          = this._getId.bind(this);
        this.api[TYPES.REQ_SET_NEAR_ACTIVE] = this._setNearServer.bind(this);

        this._onCloseCb       = this._onClose.bind(this);
        this._onServerOpenCb  = this._onServerOpen.bind(this);
        this._onServerCloseCb = this._onServerClose.bind(this);

        Helper.override(parent, 'onClose', this._onCloseCb);
        servers && servers.on(servers.EVENTS.OPEN, this._onServerOpenCb);
        servers && servers.on(servers.EVENTS.CLOSE, this._onServerCloseCb);
    }

    destroy() {
        const servers = this.parent.aroundServers;

        Helper.unoverride(this.parent, 'onClose', this._onCloseCb);
        servers && servers.off(servers.EVENTS.CLOSE, this._onServerCloseCb);
        servers && servers.off(servers.EVENTS.OPEN, this._onServerOpenCb);

        this._onCloseCb       = null;
        this._onServerCloseCb = null;
        this._onServerOpenCb  = null;

        super.destroy();
    }

    /**
     * Moves organism from one client to another or to nearest server if
     * it's connected to current one
     * @param {Number} reqId Unique request id. Needed for response
     * @param {String} clientId Unique client id
     * @param {Number} x Current org X position
     * @param {Number} y Current org Y position
     * @param {Number} dir Moving direction
     * @param {String} orgJson Organism's serialized json
     * @api
     */
    _moveOrg(reqId, clientId, x, y, dir, orgJson) {
        const reg  = Connections.toRegion(clientId);
        const side = this.parent.conns.side - 1;

        if (dir === DIR.UP   && reg[1] > 0    || dir === DIR.RIGHT && reg[0] < side ||
            dir === DIR.DOWN && reg[1] < side || dir === DIR.LEFT  && reg[0] > 0) {
            this._moveToClient(clientId, x, y, dir, orgJson);
        } else {
            this._moveToServer(clientId, x, y, dir, orgJson);
        }
    }

    /**
     * Creates response with unique client id for just connected clients
     * @param {Number} reqId Unique request id. Needed for response
     * @api
     */
    _getId(reqId) {
        const sock     = this.sock;
        const region   = this.parent.conns.getFreeRegion();
        const clientId = Connections.toId(region);

        if (region === null) {
            sock.terminate();
            this.parent.fire(this.parent.EVENTS.OVERFLOW, sock);
            Console.warn('This server is overloaded by clients. Try another server to connect.');
            return;
        }
        this.parent.conns.setData(region, 'sock', sock);
        this._setActive(clientId, true);
        this.parent.response(sock, TYPES.RES_GET_ID_OK, reqId, clientId);
        Console.info(`Client ${clientId} has connected`);
    }

    /**
     * Sets near server by direction
     * @param {Number} reqId Unique request id. Needed for response
     * @param {Number} dir Direction of incoming nearest server
     * @api
     */
    _setNearServer(reqId, dir) {
        this.parent.aroundServers.setSocket(this.sock, dir);
        this.parent.response(this.sock, TYPES.RES_SET_NEAR_ACTIVE_OK, reqId);
        Console.info(`'${NAMES[dir]}' server has connected`);
    }

    /**
     * Moves organism's json to nearest client depending on dir parameter
     * @param {String} clientId Unique client id
     * @param {Number} x Organism x coordinate
     * @param {Number} y Organism y coordinate
     * @param {Number} dir Moving direction
     * @param {String} orgJson Organism's serialized json
     */
    _moveToClient(clientId, x, y, dir, orgJson) {
        const region = Connections.toRegion(clientId);

        if      (dir === DIR.UP)    {region[1]--}
        else if (dir === DIR.RIGHT) {region[0]++}
        else if (dir === DIR.DOWN)  {region[1]++}
        else if (dir === DIR.LEFT)  {region[0]--}

        const con = this.parent.conns.getConnection(region);
        if (con.active) {
            this.parent.request(con.sock, TYPES.REQ_MOVE_ORG, x, y, dir, orgJson);
        } else {
            // TODO: possibly slow code - parse() do we really need this id?
            const org        = JSON.parse(orgJson);
            const backRegion = Connections.toRegion(clientId);
            const backCon    = this.parent.conns.getConnection(backRegion);
            this.parent.request(backCon.sock, TYPES.REQ_MOVE_ORG, x, y, dir, orgJson);
            Console.info(`Destination region ${region} is not active. Organism "${org.id}" will be sent back.`);
        }
    }

    /**
     * Moves organism's json to nearest server depending on dir parameter
     * @param {String} clientId Unique client id
     * @param {Number} x Organism x coordinate
     * @param {Number} y Organism y coordinate
     * @param {Number} dir Moving direction
     * @param {String} orgJson Organism's serialized json
     */
    _moveToServer(clientId, x, y, dir, orgJson) {
        const region = Connections.toRegion(clientId);

        const sock = this.parent.aroundServers.getSocket(dir);
        if (sock) {
            this.parent.request(sock, TYPES.REQ_MOVE_ORG, x, y, dir, orgJson);
        } else {
            // TODO: possibly slow code - parse() do we really need this id?
            const org        = JSON.parse(orgJson);
            const backCon    = this.parent.conns.getConnection(region);
            this.parent.request(backCon.sock, TYPES.REQ_MOVE_ORG, x, y, dir, orgJson);
            Console.error(`Destination server ${NAMES[dir]} is not active. Organism "${org.id}" will be sent back.`);
        }
    }

    /**
     * Sets client active. It means, that sibling active client may
     * transfer it's organisms to this client
     * @param {String} clientId
     * @param {Boolean} active
     */
    _setActive(clientId, active) {
        const region = Connections.toRegion(clientId);
        this.parent.conns.setData(region, 'active', active);
        this._activateAll(region);
    }

    /**
     * This code passes active flag of current client to clients
     * around and to active flags of around client to current.
     * This is how our client knows, that client for example above
     * is active and it may pass organism there, if he (organism)
     * goes out of the world (borders). We have to update active
     * state for current and nearest clients as well.
     * @param {Array} activeRegion Region of activated client
     */
    _activateAll(activeRegion) {
        this._activateAround(activeRegion);
        this._activateCentral(activeRegion);
    }

    _activateCentral(region) {
        const server      = this.parent;
        const conns       = server.conns;
        const sock        = server.conns.getConnection(region).sock;
        const servers     = this.parent.aroundServers;
        const side        = conns.side - 1;
        const activeUp    = !!conns.getConnection(_get(conns.upRegion  (region),  'sock')) || region[1] === 0    && servers && servers.hasSocket(DIR.UP);
        const activeRight = !!conns.getConnection(_get(conns.downRegion(region),  'sock')) || region[0] === side && servers && servers.hasSocket(DIR.RIGHT);
        const activeDown  = !!conns.getConnection(_get(conns.downRegion(region),  'sock')) || region[1] === side && servers && servers.hasSocket(DIR.DOWN);
        const activeLeft  = !!conns.getConnection(_get(conns.leftRegion(region),  'sock')) || region[0] === 0    && servers && servers.hasSocket(DIR.LEFT);

        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.UP,    activeUp);
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.RIGHT, activeRight);
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.DOWN,  activeDown);
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.LEFT,  activeLeft);
    }

    /**
     * Sends activate flag to all four nearest clients/Managers (up, right, down, left)
     * @param {Array} region Activated or deactivated region
     * @param {Boolean} activate Activation value
     */
    _activateAround(region, activate = true) {
        const server    = this.parent;
        const conns     = server.conns;
        const upSock    = _get(conns.getConnection(conns.upRegion(region)),    'sock');
        const rightSock = _get(conns.getConnection(conns.rightRegion(region)), 'sock');
        const downSock  = _get(conns.getConnection(conns.downRegion(region)),  'sock');
        const leftSock  = _get(conns.getConnection(conns.leftRegion(region)),  'sock');

        upSock    && server.request(upSock,    TYPES.REQ_SET_NEAR_ACTIVE, DIR.DOWN,  activate);
        rightSock && server.request(rightSock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.LEFT,  activate);
        downSock  && server.request(downSock,  TYPES.REQ_SET_NEAR_ACTIVE, DIR.UP,    activate);
        leftSock  && server.request(leftSock,  TYPES.REQ_SET_NEAR_ACTIVE, DIR.RIGHT, activate);
    }

    /**
     * On connection close with one of the client we have to update active
     * state for nearest clients/Managers
     * @param {String} clientId Deactivated client id
     * @private
     */
    _onClose(clientId) {
        this._activateAround(Connections.toRegion(clientId), false);
    }

    /**
     * Handler of opening connection with near server. dir parameter points to
     * the direction of near server. If new near server appears, we have to notify
     * near clients about it.
     * @param {Number} dir Direction of server
     */
    _onServerOpen(dir) {
        this._updateConnections(dir, true);
    }

    /**
     * Handler of closing connection with near server. dir parameter points to
     * the direction of near server. If near server disappears, we have to notify
     * near clients about it.
     * @param {Number} dir Direction of server
     */
    _onServerClose(dir) {
        this._updateConnections(dir, false);
    }

    _updateConnections(dir, open) {
        const server = this.parent;
        const conns  = server.conns;
        const side   = conns.side;
        let   region;
        let   line;
        let   sock;
        let   offs;

        if (dir === DIR.UP || dir === DIR.DOWN) {
            line   = dir === DIR.UP ? 0 : side - 1;
            region = [0, line];
            offs   = 0;
        } else {
            line   = dir === DIR.LEFT ? 0 : side - 1;
            region = [line, 0];
            offs   = 1;
        }

        for (let i = 0; i < side; i++) {
            region[offs] = i;
            sock = conns.getConnection(region).sock;
            sock && server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, dir, open);
        }
    }
}

module.exports = Api;