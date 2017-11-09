/**
 * List of all available event ids. New events should be added to
 * the end of the list. Last event id should be bigger then all other
 *
 * @author flatline
 * TODO: find unused and remove. But after main code is done.
 */
const EVENTS = {
    ITERATION      : 0,
    IPS            : 1,
    BACKUP         : 2,
    ORGANISM       : 3,
    GRAB_ENERGY    : 4,
    UPDATE_ENERGY  : 5,
    KILL_ORGANISM  : 6,
    MUTATIONS      : 7,
    CLONE          : 8,
    EAT            : 9,
    STEP           : 10,
    STEP_OUT       : 11,
    STEP_IN        : 12,
    BORN_ORGANISM  : 13,
    GET_ENERGY     : 14,
    DESTROY        : 15,
    STOP           : 16,
    RESET_CODE     : 17,
    CHECK_AT       : 18
};

const EVENT_AMOUNT = Object.keys(EVENTS).length;

module.exports = {EVENTS, EVENT_AMOUNT};