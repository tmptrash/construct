/**
 * List of all available event ids. New events should be added to
 * the end of the list. Last event id should be bigger then all other
 *
 * @author flatline
 * TODO: find unused and remove. But after main code is done.
 */
const EVENTS = {
    YIELD          : 0,
    ITERATION      : 1,
    IPS            : 2,
    REQUEST        : 3,
    BACKUP         : 4,
    YIELDTO        : 5,
    ORGANISM       : 6,
    GRAB_ENERGY    : 7,
    UPDATE_ENERGY  : 8,
    KILL_ORGANISM  : 9,
    MUTATIONS      : 10,
    CLONE          : 11,
    EAT            : 12,
    STEP           : 13,
    STEP_OUT       : 14,
    STEP_IN        : 15,
    EAT_ORGANISM   : 16,
    EAT_ENERGY     : 17,
    BORN_ORGANISM  : 18,
    DOT_REQUEST    : 19,
    STEP_YIELD     : 20,
    BEFORE_RESPONSE: 21,
    AFTER_REQUEST  : 22,
    GET_ENERGY     : 23,
    PROP_LEFT      : 24,
    PROP_RIGHT     : 25,
    PROP_UP        : 26,
    PROP_DOWN      : 27,
    DOT            : 28,
    MOVE           : 29,
    GRAB_LEFT      : 30,
    GRAB_RIGHT     : 31,
    GRAB_UP        : 32,
    GRAB_DOWN      : 33,
    DESTROY        : 34,
    STOP           : 35,
    RESET_CODE     : 36,
    CHECK_AT       : 37
};

const EVENT_AMOUNT = Object.keys(EVENTS).length;

module.exports = {EVENTS, EVENT_AMOUNT};