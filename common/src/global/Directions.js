/**
 * Contains available directions, where organism may move to
 *
 * @author slackline
 */
const DIR = {
    UP   : 0,
    RIGHT: 1,
    DOWN : 2,
    LEFT : 3,
    NO   : 4
};

const DIR_NAMES = {
    0: 'Up',
    1: 'Right',
    2: 'Down',
    3: 'Left',
    4: 'No'
};

module.exports = {DIR: DIR, NAMES: DIR_NAMES};