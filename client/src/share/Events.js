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
    IPS             : 2,
    CODE_RUN        : 3,
    BACKUP          : 4,
    CLONE           : 5,
    GRAB_ENERGY     : 6,
    UPDATE_ENERGY   : 7,
    KILL            : 8,  // general kill event
    KILL_TOUR       : 9,  // killed during organisms tournament
    KILL_NO_ENERGY  : 10, // killed if zero energy
    KILL_AGE        : 11, // killed if max age reached
    KILL_EAT        : 12, // killed, because other organism has eat this one
    KILL_OVERFLOW   : 13, // population reaches it's maximum, we have to kill one organism
    KILL_STEP_OUT   : 14, // killed, because organism step outside the world
    KILL_STEP_IN    : 15, // killed, because of punishment for step in from near client
    KILL_CLONE      : 16, // killed, because of lack of energy after clone
    MUTATIONS       : 17,
    EAT             : 18,
    EAT_ORG         : 19,
    EAT_ENERGY      : 20,
    STEP            : 21,
    STEP_OUT        : 22,
    STEP_IN         : 23,
    BORN_ORGANISM   : 24,
    GET_ENERGY      : 25,
    DESTROY         : 26,
    RUN             : 27,
    STOP            : 28,
    RESET_CODE      : 29,
    CHECK_AT        : 30
};

const EVENT_AMOUNT = Object.keys(EVENTS).length;

module.exports = {EVENTS, EVENT_AMOUNT};