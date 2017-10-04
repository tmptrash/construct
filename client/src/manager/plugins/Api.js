/**
 * Plugin for a Client class, which provides API of client for the server. The
 * same like Api class plugin for the Server class (see server/src/server/plugins/Api).
 *
 * @author flatline
 */
const TYPES   = require('./../../.././common/Requests').TYPES;
const BaseApi = require('./../../.././net/plugins/Api');

class Api extends BaseApi {
    constructor(client) {
        super(client);
        this.API[TYPES.REQ_GIVE_ID] = this._giveId;
    }

    /**
     * Handler of request from server, where it passes us unique client
     * id. We have to save this id and pass it with every request. This
     * is how server will differentiate us from other clients.
     * @api
     */
    _giveId() {}
}

module.exports = Api;