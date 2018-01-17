/**
 * List of all available event ids. New events should be added to
 * the end of the list. Last event id should be bigger then all other
 *
 * @author flatline
 * TODO: find unused and remove. But after main code is done.
 * TODO: describe all events
 */
const EVENTS = {
    ITERATION       : 0,
    LOOP            : 1,
    CODE_RUN        : 2,
    BACKUP          : 3,
    GRAB_ENERGY     : 4,
    UPDATE_ENERGY   : 5,
    KILL            : 6,  // general kill event
    KILL_NO_ENERGY  : 7,  // killed if zero energy
    KILL_AGE        : 8,  // killed if max age reached
    KILL_EAT        : 9,  // killed, because other organism has eat this one
    KILL_OVERFLOW   : 10, // population reaches it's maximum, we have to kill one organism
    KILL_STEP_OUT   : 11, // killed, because organism step outside the world
    KILL_STEP_IN    : 12, // killed, because of panishment for step in from near client
    KILL_TOUR       : 13, // killed in tournament
    KILL_CLONE      : 14, // killed, because of lack of energy after clone
    MUTATIONS       : 15,
    CLONE           : 16,
    EAT             : 17,
    EAT_ORG         : 18,
    EAT_ENERGY      : 19,
    STEP            : 20,
    STEP_OUT        : 21,
    STEP_IN         : 22,
    BORN_ORGANISM   : 23,
    GET_ENERGY      : 24,
    DESTROY         : 25,
    RUN             : 26,
    STOP            : 27,
    RESET_CODE      : 28,
    CHECK_AT        : 29
};

const EVENT_AMOUNT = Object.keys(EVENTS).length;

module.exports = {EVENTS, EVENT_AMOUNT};