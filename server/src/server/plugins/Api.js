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
    constructor(server) {
        super(server);
        this.API[TYPES.REQ_SET_ACTIVE] = this._setActive.bind(this);
        this.API[TYPES.REQ_MOVE_ORG]   = this._moveOrg.bind(this);
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
        const region = Connections.toRegion(clientId);
        const server = this.parent;
        const con    = server.conns.getConnection(region);

        server.conns.setData(region, 'active', active);
        server.answer(con.sock, TYPES.RES_ACTIVE_OK, reqId);
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
            this.parent.send(con.sock, TYPES.REQ_MOVE_ORG, x, y, dir, orgJson);
        } else {
            const backRegion = Connections.toRegion(clientId);
            const backCon    = this.parent.conns.getConnection(backRegion);
            this.parent.send(backCon.sock, TYPES.RES_MOVE_ERR, x, y, dir, orgJson, `Region "${region}" on direction "${DIR_NAMES[dir]}" is not active`);
            Console.error(`Destination region ${region} is not active. Organism "${orgJson.id}" will be sent back.`);
        }
    }
}

module.exports = Api;