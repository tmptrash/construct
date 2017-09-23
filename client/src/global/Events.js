/**
 * List of all available event ids. New events should be added to
 * the end of the list. Last event id should be bigger then all other
 *
 * @author DeadbraiN
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
    EAT_ORGANISM   : 14,
    EAT_ENERGY     : 15,
    BORN_ORGANISM  : 16,
    DOT_REQUEST    : 17,
    STEP_YIELD     : 18,
    BEFORE_RESPONSE: 19,
    AFTER_REQUEST  : 20,
    GET_ENERGY     : 21,
    PROP_LEFT      : 22,
    PROP_RIGHT     : 23,
    PROP_UP        : 24,
    PROP_DOWN      : 25,
    DOT            : 26,
    MOVE           : 27,
    GRAB_LEFT      : 28,
    GRAB_RIGHT     : 29,
    GRAB_UP        : 30,
    GRAB_DOWN      : 31,
    DESTROY        : 32,
    STOP           : 33,
    RESET_CODE     : 34,
    CHECK_AT       : 35
};

const EVENT_AMOUNT = Object.keys(EVENTS).length;

export {EVENTS, EVENT_AMOUNT};