/**
 * Plugin for Client/Server classes. Implements request/response logic.
 * Manager requests and associated to them responses by unique request
 * id (reqId). Calls callback on answer (response).
 *
 * @author flatline
 */
const Helper  = require('./../Helper');
const Config  = require('./../../../client/src/share/Config').Config;
const MASKS   = require('./../net/Requests').MASKS;
const Console = require(`./../../../${Config.modeNodeJs ? 'server' : 'client'}/src/share/Console`);

class Request {
    /**
     * Creates Request instance and overrides two required methods:
     * send() and onMessage()
     * @param {Object} parent Instance of custom class
     */
    constructor(parent) {
        this.parent        = parent;
        /**
         * {Object} Contains requests map: key - request id, val -
         * response callback
         * TODO: we have to check if connection has closed with socket
         * TODO: and we have to remove "broken" requests ids from _requests
         */
        this._requests     = {};
        this._onRequestCb  = this._onRequest.bind(this);
        this._onSendErrCb  = this._onSendErr.bind(this);
        this._onResponseCb = this._onResponse.bind(this);
        this._onMessageCb  = this._onMessage.bind(this);

        Helper.override(parent, 'request', this._onRequestCb);
        Helper.override(parent, 'response', this._onResponseCb);
        Helper.override(parent, 'onMessage', this._onMessageCb);
    }

    destroy() {
        const parent = this.parent;
        Helper.unoverride(parent, 'onMessage', this._onMessageCb);
        Helper.unoverride(parent, 'response', this._onResponseCb);
        Helper.unoverride(parent, 'request', this._onRequestCb);
        this._onMessageCb  = null;
        this._onResponseCb = null;
        this._onSendErrCb  = null;
        this._onRequestCb  = null;
        this._requests     = null;
        this.parent        = null;
    }

    /**
     * IMPORTANT: It's impossible to have more then one overrides of 'request'
     * IMPORTANT: method, because return value of second overridden method
     * IMPORTANT: will overlap first one.
     *
     * Sends data to the client or server. First two parameters are required.
     * They are: 'socket' for sending params and 'type' for sending special
     * request type (see Requests.TYPES constants for details). All other
     * parameters depend of special request and will be send to the client
     * as an array. Last parameter is optional callback, which is called after
     * send is complete. If last parameter present, then we should wait for
     * response. Otherwise it should be request only. Final parameters for
     * sending will be: [type, reqId, ...params]
     * 'params' will be without callback parameter at the end.
     * @param {WebSocket} sock Socket where to send params
     * @param {Number} type Type of the request
     * @param {*} params Array of parameters to send
     * @return {Number|null} Unique request id or null if no response needed
     * @override
     * TODO: add timer for tracking request timeout
     */
    _onRequest(sock, type, ...params) {
        const cb    = Helper.isFunc(params[params.length - 1]) ? params.pop() : null;
        const reqId = Helper.getId();

        cb && (this._requests[reqId] = cb);
        sock.send(JSON.stringify([type, (reqId | MASKS.REQ_MASK) >>> 0].concat(params)), this._onSendErrCb);

        return reqId;
    }

    /**
     * Is called on every response (response). Required unique request id
     * (reqId) should be used as a parameter. Format of response data is:
     * [type, reqId, ...params].
     * @param {WebSocket} sock Socket where to send response
     * @param {Number} type Type of the request
     * @param {Number} reqId Unique request id, returned by send() method
     * @param {*} params Array of parameters to send
     * @override
     */
    _onResponse(sock, type, reqId, ...params) {
        sock.send(JSON.stringify([type, (reqId & MASKS.RES_MASK) >>> 0].concat(params)), this._onSendErrCb);
    }

    /**
     * Is called if send() method failed. It's possible of many reasons. For
     * example on server closing event.
     * @param {String} error Error message
     */
    _onSendErr(error) {
        if (typeof error !== 'undefined') {
            Console.error(`Request.send() error: ${error}`);
        }
    }

    /**
     * Is called on every input message is received. It may be a request
     * from remote host or an response (response). In case of request we do
     * nothing. In case of response (response) we have to call callback
     * function, bind in send() method. event.data contains:
     * [type, reqId|null, ...params].
     * @param {WebSocket} sock Owner socket
     * @param {Event} event Event object with received data
     * @private
     */
    _onMessage(sock, event) {
        const data  = JSON.parse(event.data || event);
        const reqId = (data[1] & MASKS.REQ_MASK) >>> 31 === 1 ? null : (data[1] & MASKS.RES_MASK) >>> 0;
        const cb    = this._requests[reqId];
        //
        // data[0] is type
        // data.slice(2) are params
        //
        cb && cb(data[0], ...data.slice(2));
        delete this._requests[reqId];
    }
}

module.exports = Request;