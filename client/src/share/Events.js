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
    GRAB_ENERGY     : 5,
    UPDATE_ENERGY   : 6,
    KILL            : 7,  // general kill event
    KILL_NO_ENERGY  : 8,  // killed if zero energy
    KILL_AGE        : 9,  // killed if max age reached
    KILL_EAT        : 10, // killed, because other organism has eat this one
    KILL_OVERFLOW   : 11, // population reaches it's maximum, we have to kill one organism
    KILL_STEP_OUT   : 12, // killed, because organism step outside the world
    KILL_STEP_IN    : 13, // killed, because of panishment for step in from near client
    KILL_CLONE      : 14, // killed, because of lack of energy after clone
    MUTATIONS       : 15,
    EAT             : 16,
    EAT_ORG         : 17,
    EAT_ENERGY      : 18,
    STEP            : 19,
    STEP_OUT        : 20,
    STEP_IN         : 21,
    BORN_ORGANISM   : 22,
    GET_ENERGY      : 23,
    DESTROY         : 24,
    RUN             : 25,
    STOP            : 26,
    RESET_CODE      : 27,
    CHECK_AT        : 28
};

const EVENT_AMOUNT = Object.keys(EVENTS).length;

module.exports = {EVENTS, EVENT_AMOUNT};