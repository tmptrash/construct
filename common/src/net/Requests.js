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
    REQ_MOVE_ORG                 : 0, // Organism moves from one world(manager) to another(sibling)
    REQ_MOVE_ORG_BACK            : 1, // Organism sends back to source client\server
    REQ_SET_NEAR_ACTIVE          : 2, // Other (near) server wants to connect with current one
    REQ_GET_ID                   : 3, // Client wants obtain it's unique id from server
    REQ_MOVE_ORG_FROM_SERVER     : 4, // Organism came from near server
    //
    // Responses section
    //
    RES_MOVE_ERR                 : 1000,
    RES_MOVE_OK                  : 1001,
    RES_INVALID_TYPE             : 1002,
    RES_GET_ID_OK                : 1003,
    RES_SET_NEAR_ACTIVE_OK       : 1004
};

module.exports = {TYPES, MASKS};