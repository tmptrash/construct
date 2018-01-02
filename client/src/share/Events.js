/**
 * List of all available event ids. New events should be added to
 * the end of the list. Last event id should be bigger then all other
 *
 * @author flatline
 * TODO: find unused and remove. But after main code is done.
 */
const EVENTS = {
    ITERATION       : 0,
    LOOP            : 1,
    IPS             : 2,
    BACKUP          : 3,
    ORGANISM        : 4,
    GRAB_ENERGY     : 5,
    UPDATE_ENERGY   : 6,
    KILL_ORGANISM   : 7,
    MUTATIONS       : 8,
    CLONE           : 9,
    EAT             : 10,
    STEP            : 11,
    STEP_OUT        : 12,
    STEP_IN         : 13,
    BORN_ORGANISM   : 14,
    GET_ENERGY      : 15,
    DESTROY         : 16,
    RUN             : 17,
    STOP            : 18,
    RESET_CODE      : 19,
    CHECK_AT        : 20
};

const EVENT_AMOUNT = Object.keys(EVENTS).length;

module.exports = {EVENTS, EVENT_AMOUNT};