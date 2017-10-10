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
    EAT_ORGANISM   : 15,
    EAT_ENERGY     : 16,
    BORN_ORGANISM  : 17,
    DOT_REQUEST    : 18,
    STEP_YIELD     : 19,
    BEFORE_RESPONSE: 20,
    AFTER_REQUEST  : 21,
    GET_ENERGY     : 22,
    PROP_LEFT      : 23,
    PROP_RIGHT     : 24,
    PROP_UP        : 25,
    PROP_DOWN      : 26,
    DOT            : 27,
    MOVE           : 28,
    GRAB_LEFT      : 29,
    GRAB_RIGHT     : 30,
    GRAB_UP        : 31,
    GRAB_DOWN      : 32,
    DESTROY        : 33,
    STOP           : 34,
    RESET_CODE     : 35,
    CHECK_AT       : 36
};

const EVENT_AMOUNT = Object.keys(EVENTS).length;

export {EVENTS, EVENT_AMOUNT};