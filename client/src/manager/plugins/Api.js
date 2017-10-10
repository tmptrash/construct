/**
 * Plugin for a Client class, which provides API of client for the server. The
 * same like Api class plugin for the Server class (see server/src/server/plugins/Api).
 *
 * @author flatline
 */
const TYPES   = require('./../../../../common/src/global/Requests').TYPES;
const BaseApi = require('./../../../../common/src/net/plugins/Api');
const Helper  = require('./../../../../common/src/global/Helper');

class Api extends BaseApi {
    constructor(client) {
        super(client);

        this.API[TYPES.REQ_GIVE_ID]  = this._giveId.bind(this);
        this.API[TYPES.REQ_MOVE_ORG] = this._moveOrg.bind(this);
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
        this.parent.onSetClientId(clientId);
        this.parent.request(TYPES.REQ_SET_ACTIVE, true, (type) => {
            if (type === TYPES.RES_ACTIVE_OK) {
                this.parent.onActivate();
            }
        });
    }

    _moveOrg(reqId, x, y, dir, orgJson) {
        // TODO: ...
    }
}

module.exports = Api;