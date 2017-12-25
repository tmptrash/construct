/**
 * Plugin for a Client class, which provides API of client for the server. The
 * same like Api class plugin for the Server class (see server/src/server/plugins/Api).
 *
 * @author flatline
 */
const TYPES   = require('./../../../../../../common/src/net/Requests').TYPES;
const BaseApi = require('./../../../../../../common/src/net/Api');
const EVENTS  = require('./../../../../share/Events').EVENTS;

class Api extends BaseApi {
    constructor(client) {
        super(client);

        this.api[TYPES.REQ_MOVE_ORG]        = this._stepIn.bind(this, false);
        this.api[TYPES.REQ_MOVE_ORG_BACK]   = this._stepIn.bind(this, true);
        this.api[TYPES.REQ_SET_NEAR_ACTIVE] = this._setActive.bind(this);
    }

    destroy() {
        // super.destroy() should be a last line in this method
        super.destroy();
    }

    /**
     * Is called if organism is move in from other Manager (world)
     * @param {Boolean} back true, if organism is sent back
     * @param {String} reqId Unique request id
     * @param {String} clientId Unique client id within current server
     * @param {Number} x Current org X position
     * @param {Number} y Current org Y position
     * @param {Number} dir Direction of moving
     * @param {String} orgJson Organism's serialized json
     * @api
     */
    _stepIn(back, reqId, clientId, x, y, dir, orgJson) {
        const ret = {ret: true};
        this.parent.manager.fire(EVENTS.STEP_IN, x, y, orgJson, ret);
        !back && this.parent.response(this.sock, ret.ret ? TYPES.RES_MOVE_OK : TYPES.RES_MOVE_ERR, reqId, clientId);
    }

    /**
     * Is called to set active flag of nearest manager/client. After
     * setting it to true, nearest client/Manager may pass it's organisms
     * to the current client/Manager
     * @param {String} reqId Unique request id
     * @param {Number} dir Direction of nearest client/Manager
     * @param {Boolean} active Active state of nearest client/Manager
     * @api
     */
    _setActive(reqId, dir, active) {
        this.parent.manager.activeAround[dir] = active;
    }
}

module.exports = Api;