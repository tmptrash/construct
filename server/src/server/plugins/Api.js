/**
 * Plugin for Server class, which implement it's API. Is separated from Server to
 * have an ability to change API any time without changing server's code. @api
 * annotation means that specified method is a part of Server API and available
 * from clients requests.
 *
 * @author flatline
 */
const Helper      = require('./../../../../common/src/Helper');
const TYPES       = require('./../../../../common/src/net/Requests').TYPES;
const Console     = require('./../../share/Console');
const Connections = require('./../Connections');

const DIR         = require('./../../../../common/src/Directions').DIR;
const DIR_NAMES   = require('./../../../../common/src/Directions').NAMES;
const BaseApi     = require('./../../../../common/src/net/Api');
class Api extends BaseApi {
    constructor(parent) {
        super(parent);
        this.api[TYPES.REQ_MOVE_ORG] = this._moveOrg.bind(this);
        this.api[TYPES.REQ_GET_ID]   = this._getId.bind(this);

        this._onCloseCb = this._onClose.bind(this);

        Helper.override(parent, 'onClose', this._onCloseCb);
    }

    destroy() {
        Helper.unoverride(this.parent, 'onClose', this._onCloseCb);
        this._onCloseCb = null;

        super.destroy();
    }

    /**
     * Moves organism from one client to another
     * @param {Number} reqId Unique request id. Needed for response
     * @param {String} clientId Unique client id
     * @param {Number} x Current org X position
     * @param {Number} y Current org Y position
     * @param {Number} dir Moving direction
     * @param {String} orgJson Organism's serialized json
     * @api
     */
    _moveOrg(reqId, clientId, x, y, dir, orgJson) {
        const region = Connections.toRegion(clientId);

        if      (dir === DIR.UP)    {region[1]--}
        else if (dir === DIR.RIGHT) {region[0]++}
        else if (dir === DIR.DOWN)  {region[1]++}
        else if (dir === DIR.LEFT)  {region[0]--}

        const con = this.parent.conns.getConnection(region);
        if (con.active) {
            this.parent.request(con.sock, TYPES.REQ_MOVE_ORG, x, y, dir, orgJson);
        } else {
            const org        = JSON.parse(orgJson);
            const backRegion = Connections.toRegion(clientId);
            const backCon    = this.parent.conns.getConnection(backRegion);
            this.parent.request(backCon.sock, TYPES.RES_MOVE_ERR, x, y, dir, orgJson, `Region "${region}" on direction "${DIR_NAMES[dir]}" is not active`);
            Console.error(`Destination region ${region} is not active. Organism "${org.id}" will be sent back.`);
        }
    }

    /**
     * Creates response with unique client id for just connected clients or servers
     * @param {Number} reqId Unique request id. Needed for response
     * @param {Boolean} isClient true for request from client, false for server
     * @api
     */
    _getId(reqId, isClient = true) {
        isClient && this._onGetClientId(reqId) || this._onGetServerId(reqId);
    }

    /**
     * If it was a request from client, then we have to create unique clientId for him.
     * @param {Number} reqId Unique request id
     */
    _onGetClientId(reqId) {
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
    }

    /**
     * If it was a server, then we have to update our "around" servers (this.parent.activeAround)
     * @param {Number} reqId Unique request id
     */
    _onGetServerId(reqId) {
        // TODO:
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
        const server = this.parent;
        const conns  = server.conns;
        const sock   = server.conns.getConnection(activeRegion).sock;
        //
        // We have to send activate message every nearest client to
        // current lying on activeRegion
        //
        this._activateAround(activeRegion);
        //
        // We should also send around active clients status to the current (sock)
        //
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.DOWN,  !!conns.getConnection(conns.downRegion(activeRegion)).sock);
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.LEFT,  !!conns.getConnection(conns.leftRegion(activeRegion)).sock);
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.UP,    !!conns.getConnection(conns.upRegion(activeRegion)).sock);
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.RIGHT, !!conns.getConnection(conns.rightRegion(activeRegion)).sock);
    }

    /**
     * Sends activate flag to all four nearest clients/Managers (up, right, down, left)
     * @param {Array} region Activated or deactivated region
     * @param {Boolean} activate Activation value
     */
    _activateAround(region, activate = true) {
        const server    = this.parent;
        const conns     = server.conns;
        const upSock    = conns.getConnection(conns.upRegion(region)).sock;
        const rightSock = conns.getConnection(conns.rightRegion(region)).sock;
        const downSock  = conns.getConnection(conns.downRegion(region)).sock;
        const leftSock  = conns.getConnection(conns.leftRegion(region)).sock;

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
}

module.exports = Api;