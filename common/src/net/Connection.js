/**
 * Base class for Client and Server classes. Contains basic methods like
 * request(), response(), onMessage(), onClose(),... Client and Server should
 * override them in their classes.
 *
 * @author slackline
 */
const Observer = require('./../global/Observer');

const MSG     = 0;
const ERR     = 1;
const CLOSE   = 2;
const DESTROY = 3;

const EVENTS  = {
    MSG,
    ERR,
    CLOSE,
    DESTROY
};

class Connection extends Observer {
    constructor(eventAmount) {
        super(eventAmount);
        /**
         * {String} Reason why connection was closed. See onClose()
         * method for details.
         */
        this._closeReason = '';
    }

    get closeReason() {return this._closeReason}

    /**
     * Sends data to the client. First two parameters are required. All
     * other parameters depend of special request and will be send to
     * the client as an array.
     * @param {WebSocket} sock
     * @param {Number} type Request type (see Requests.TYPES)
     * @param {*} params Array of parameters
     * @return {Number} Unique request id
     * @abstract
     */
    request(sock, type, ...params) {}

    /**
     * Is user for answering on requests. May not be called if response
     * (response) don't needed.
     * @param {WebSocket} sock Socket where send the response
     * @param {Number} type Request type (see Requests.TYPES)
     * @param {Number} reqId Unique request id, returned by send() method
     * @param {Array} params Custom parameters to send
     * @abstract
     */
    response(sock, type, reqId, ...params) {}

    /**
     * Is called every time if server/client sends us a request or response (response).
     * @param {WebSocket} sock Socket, received the message
     * @param {Event} event Message event. Data is in 'data' property
     * @abstract
     */
    onMessage(sock, event) {
        this.fire(MSG, sock, event);
    }

    /**
     * Is called on every error during web sockets work
     * @param {Event} event Error event
     * @abstract
     */
    onError(event) {
        this.fire(ERR, event);
    }

    /**
     * Connection has closed
     * @param {Event} event
     */
    onClose(event) {
        let reason = 'Unknown error';
        switch(event.code) {
            case 1000: reason = 'Normal closure';
                break;
            case 1001: reason = 'An endpoint is going away';
                break;
            case 1002: reason = 'An endpoint is terminating the connection due to a protocol error.';
                break;
            case 1003: reason = 'An endpoint is terminating the connection because it has received a type of data it cannot accept';
                break;
            case 1004: reason = 'Reserved. The specific meaning might be defined in the future.';
                break;
            case 1005: reason = 'No status code was actually present';
                break;
            case 1006: reason = 'The connection was closed abnormally';
                break;
            case 1007: reason = 'The endpoint is terminating the connection because a message was received that contained inconsistent data';
                break;
            case 1008: reason = 'The endpoint is terminating the connection because it received a message that violates its policy';
                break;
            case 1009: reason = 'The endpoint is terminating the connection because a data frame was received that is too large';
                break;
            case 1010: reason = 'The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn\'t.';
                break;
            case 1011: reason = 'The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
                break;
            case 1012: reason = 'The server is terminating the connection because it is restarting';
                break;
            case 1013: reason = 'The server is terminating the connection due to a temporary condition';
                break;
            case 1015: reason = 'The connection was closed due to a failure to perform a TLS handshake';
                break;
        }

        this._closeReason = reason;
        this.fire(CLOSE, event);
    }

    /**
     * @destructor
     * @abstract
     */
    destroy() {
        this.fire(DESTROY);
    }
}

module.exports = {Connection, EVENTS};