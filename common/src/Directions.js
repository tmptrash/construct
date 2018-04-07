/**
 * Contains available directions, where organism may move to
 *
 * @author flatline
 */
const DIR = {
    UP   : 0,
    RIGHT: 1,
    DOWN : 2,
    LEFT : 3,
    NO   : 4
};
/**
 * {Array} Array of flipped directions. Is used for connecting with nearest
 * servers: left -> right, up -> down, right -> left, down -> up
 */
const FLIP_DIR = [
    DIR.DOWN,
    DIR.LEFT,
    DIR.UP,
    DIR.RIGHT
];

const NAMES = {
    0: 'Up',
    1: 'Right',
    2: 'Down',
    3: 'Left',
    4: 'No'
};
/**
 * {Array} X, Y Offsets values for directions. Are used to change current
 * coordinates of some object (organism or world object)
 */
const OFFSX = [
     0,  // Up
     1,  // Right
     0,  // Down
    -1   // Left
];
const OFFSY = [
    -1,  // Up
     0,  // Right
     1,  // Down
     0   // Left
];

module.exports = {DIR, FLIP_DIR, NAMES, OFFSX, OFFSY};