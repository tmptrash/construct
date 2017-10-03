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
 * Id's of requests from client to server
 */
const CTOS = {
    REQ_SET_ACTIVE: 0,
    REQ_MOVE_ORG  : 1
};
/**
 * {Object} Id's of requests from server to client
 */
const STOC = {
    REQ_GIVE_ID   : 0,
    REQ_MOVE_ORG  : 1,
    REQ_MOVE_OK   : 2,

    RES_MOVE_ERR  : 3,
    RES_ACTIVE_OK : 4
};

module.exports = {CTOS: CTOS, STOC: STOC, DIR: DIR};