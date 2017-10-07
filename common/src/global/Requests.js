/**
 * Contains Id's for requests from client to server and from server to client
 *
 * @author flatline
 */

const DIR = {
    UP   : 0,
    RIGHT: 1,
    DOWN : 2,
    LEFT : 3
};
/**
 * {Object} Different bit masks
 */
const MASKS = {
    REQ_MASK: 0x80000000, // 10000000000000000000000000000000
    RES_MASK: 0x7fffffff  // 01111111111111111111111111111111
};
/**
 * {Object} Id's of requests from client to server and visa versa
 */
const TYPES = {
    //
    // Requests section
    //
    REQ_SET_ACTIVE  : 0,
    REQ_MOVE_ORG    : 1,
    REQ_GIVE_ID     : 2,
    //
    // Responses section
    //
    RES_MOVE_ERR    : 1000,
    RES_ACTIVE_OK   : 1001,
    RES_INVALID_TYPE: 1002
};

module.exports = {TYPES: TYPES, DIR: DIR, MASKS: MASKS};