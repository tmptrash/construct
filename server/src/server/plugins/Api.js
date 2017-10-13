/**
 * Plugin for Server class, which implement it's API. Is separated from Server to
 * have an ability to change API any time without changing server's code.
 *
 * @author flatline
 */
const Connections = require('./../Connections');
const Console     = require('./../../global/Console');
const Helper      = require('./../../../../common/src/global/Helper');
const TYPES       = require('./../../../../common/src/global/Requests').TYPES;
const DIR         = require('./../../../../common/src/global/Directions').DIR;
const DIR_NAMES   = require('./../../../../common/src/global/Directions').NAMES;
const BaseApi     = require('./../../../../common/src/net/plugins/Api');

class Api extends BaseApi {
    constructor(parent) {
        super(parent);
        this.API[TYPES.REQ_SET_ACTIVE] = this._setActive.bind(this);
        this.API[TYPES.REQ_MOVE_ORG]   = this._moveOrg.bind(this);

        this._onCloseCb = this._onClose.bind(this);

        Helper.override(parent, 'onClose', this._onCloseCb);
    }

    destroy() {
        super.destroy();

        Helper.unoverride(this.parent, 'onClose', this._onCloseCb);
        this._onCloseCb = null;
    }

    /**
     * Sets client active. It means, that sibling active client may
     * transfer it's organisms to this client
     * @param {Number} reqId Unique request id. Needed for response
     * @param {String} clientId
     * @param {Boolean} active
     * @api
     */
    _setActive(reqId, clientId, active) {
        const region =  Connections.toRegion(clientId);
        const server = this.parent;
        const con    = server.conns.getConnection(region);

        server.conns.setData(region, 'active', active);
        server.response(con.sock, TYPES.RES_ACTIVE_OK, reqId);
        this._activateAll(region);
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
     * This code passes active flag of current client to clients
     * around and to active flags of around client to current.
     * This is how our client knows, that client for example above
     * is active and it may pass organism there, if he (organism)
     * goes out of the world (borders). We have to update active
     * state for current and nearest clients as well.
     * @param {Array} activeRegion Region of activated client
     */
    _activateAll(activeRegion) {
        const server    = this.parent;
        const conns     = server.conns;
        const sock      = server.conns.getConnection(activeRegion).sock;
        const upSock    = conns.getConnection(conns.upRegion(activeRegion)).sock;
        const rightSock = conns.getConnection(conns.rightRegion(activeRegion)).sock;
        const downSock  = conns.getConnection(conns.downRegion(activeRegion)).sock;
        const leftSock  = conns.getConnection(conns.leftRegion(activeRegion)).sock;
        //
        // We have to send activate message every nearest client to
        // current lying on activeRegion
        //
        this._activateAround(activeRegion);
        //
        // We also should send current active client activation status of
        // all nearest clients as well
        //
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.DOWN,  !!downSock);
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.LEFT,  !!leftSock);
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.UP,    !!upSock);
        server.request(sock, TYPES.REQ_SET_NEAR_ACTIVE, DIR.RIGHT, !!rightSock);
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