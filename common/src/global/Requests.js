/**
 * Contains Id's for requests from client to server and from server to client
 *
 * @author flatline
 */
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
    REQ_MOVE_ORG       : 0,
    REQ_GIVE_ID        : 1,
    REQ_SET_NEAR_ACTIVE: 2,
    REQ_GET_ID         : 3,
    //
    // Responses section
    //
    RES_MOVE_ERR       : 1000,
    RES_INVALID_TYPE   : 1001,
    RES_GET_ID_OK      : 1002
};

module.exports = {TYPES, MASKS};