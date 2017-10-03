/**
 * Plugin for Client/Server classes. Implements request/response logic.
 * Manager requests and associated to them responses by unique request
 * id (reqId). Calls callback on answer (response).
 *
 * @author flatline
 */
const Helper = require('./../Helper');

const REQ_MASK = 0x80000000;
const RES_MASK = 0x7fffffff;

class Request {
    /**
     * Creates Request instance and overrides two required methods:
     * send() and onMessage()
     * @param {Function} parent Instance of custom class
     */
    constructor(parent) {
        this._parent      = parent;
        /**
         * {Object} Contains requests map: key - request id, val -
         * response callback
         */
        this._requests    = {};
        this._onSendCb    = this._onSend.bind(this);
        this._onAnswerCb  = this._onAnswer.bind(this);
        this._onMessageCb = this._onMessage.bind(this);

        Helper.override(parent, 'send', this._onSendCb);
        Helper.override(parent, 'answer', this._onAnswerCb);
        Helper.override(parent, 'onMessage', this._onMessageCb);
    }

    destroy() {
        const parent = this._parent;
        Helper.unoverride(parent, 'onMessage', this._onMessageCb);
        Helper.unoverride(parent, 'answer', this._onAnswerCb);
        Helper.unoverride(parent, 'send', this._onSendCb);
        this._onMessageCb = null;
        this._onAnswerCb  = null;
        this._onSendCb    = null;
        this._requests    = null;
        this._parent      = null;
    }

    /**
     * IMPORTANT: It's impossible to have more then one overrides of 'send'
     * IMPORTANT: method, because return value of second overridden method
     * IMPORTANT: will overlap first one.
     *
     * Sends data to the client or server. First two parameters are required.
     * They are: 'socket' for sending params and 'type' for sending special
     * request type (see Requests.CTOS|STOC constants for details). All other
     * parameters depend of special request and will be send to the client
     * as an array. Last parameter is optional callback, which is called after
     * send is complete. If last parameter present, then we should wait for
     * response. Otherwise it should be request only. Final parameters for
     * sending will be: [type, reqId, ...params]
     * 'params' will be without callback parameter at the end.
     * @param {WebSocket} sock Socket where to send params
     * @param {Number} type Type of the request
     * @param {*} params Array of parameters to send
     * @return {Number|null} Unique request id or null if no answer needed
     * @override
     * TODO: add timer for tracking request timeout
     */
    _onSend(sock, type, ...params) {
        const cb    = Helper.isFunc(params[params.length - 1]) ? params.pop() : null;
        const reqId = cb ? Helper.getId() | REQ_MASK : null;

        cb && (this._requests[reqId] = cb);
        sock.send(JSON.stringify([type, reqId].concat(params)));
    }

    /**
     * Is called on every answer (response). Required unique request id
     * (reqId) should be used as a parameter. Format of answer data is:
     * [type, reqId, ...params].
     * @param {WebSocket} sock Socket where to send answer
     * @param {Number} type Type of the request
     * @param {Number} reqId Unique request id, returned by send() method
     * @param {*} params Array of parameters to send
     * @override
     */
    _onAnswer(sock, type, reqId, ...params) {
        sock.send(JSON.stringify([type, reqId & RES_MASK].concat(params)));
    }

    /**
     * Is called on every input message is received. It may be a request
     * from remote host or an answer (response). In case of request we do
     * nothing. In case of answer (response) we have to call callback
     * function, bind in send() method. event.data contains:
     * [type, reqId|null, ...params].
     * @param {WebSocket} sock Owner socket
     * @param {Event} event Event object with received data
     * @private
     */
    _onMessage(sock, event) {
        const data  = event.data;
        const reqId = data[1];
        const cb    = this._requests[reqId];
        //
        // data[0] is type
        // data.slice(2) are params
        //
        cb && cb(data[0], data.slice(2));
        delete this._requests[reqId];
    }
}

module.exports = Request;