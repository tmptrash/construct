/**
 * Plugin for a Client class, which provides API of client for the server. The
 * same like Api class plugin for the Server class (see server/src/server/plugins/Api).
 *
 * @author flatline
 */
const TYPES   = require('./../../../../common/src/global/Requests').TYPES;
const BaseApi = require('./../../../../common/src/net/plugins/Api');
const Helper  = require('./../../../../common/src/global/Helper');
const EVENTS  = require('./../../global/Events').EVENTS;
const Console = require('./../../../../client/src/global/Console').default;

class Api extends BaseApi {
    constructor(client, manager) {
        super(client);

        this.api[TYPES.REQ_GIVE_ID]         = this._giveId.bind(this);
        this.api[TYPES.REQ_MOVE_ORG]        = this._moveOrg.bind(this);
        this.api[TYPES.RES_MOVE_ERR]        = this._moveOrg.bind(this);
        this.api[TYPES.REQ_SET_NEAR_ACTIVE] = this._setActive.bind(this);
    }

    destroy() {
        super.destroy();
    }

    /**
     * Handler of request from server, where it passes us unique client
     * id. We have to save this id and pass it with every request. This
     * is how server will differentiate us from other clients.
     * @param {Number} reqId Unique request id. Unused for this request
     * @param {String} clientId Unique id of current client obtained from
     * the server
     * @api
     */
    _giveId(reqId, clientId) {
        this.parent.manager.setClientId(clientId);
        Console.info(`Client id "${clientId}" obtained from the server`);
        this._request(TYPES.REQ_SET_ACTIVE, true, (type) => {
            if (type === TYPES.RES_ACTIVE_OK) {
                this.parent.manager.run();
            }
        });
    }

    /**
     * Is called if organism is move in from other Manager (world)
     * @param {String} reqId Unique request id
     * @param {Number} x Current org X position
     * @param {Number} y Current org Y position
     * @param {String} orgJson Organism's serialized json
     * @param {String|null} errMsg Error message
     * @api
     */
    _moveOrg(reqId, x, y, orgJson, errMsg = null) {
        this.parent.manager.fire(EVENTS.STEP_IN, x, y, orgJson);
        errMsg && Console.warn(errMsg);
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

    _request(type, ...params) {
        return this.parent.request(this.parent.socket, type, this.parent.manager.clientId, ...params);
    }
}

module.exports = Api;