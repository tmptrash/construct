/**
 * Manager's plugin, which add energy objects to the world. Such objects
 * may be joined together to get more energy
 *
 * @author flatline
 */
const Dots         = require('./../../../share/Dots');
const Helper       = require('./../../../../../common/src/Helper');
const OConfig      = require('./Config');
const OBJECT_TYPES = require('./../../../view/World').OBJECT_TYPES;
//
// We have to add object types to global types storage
//
OBJECT_TYPES.TYPE_ENERGY0 = -(Object.keys(OBJECT_TYPES).length + 1);
OBJECT_TYPES.TYPE_ENERGY1 = -(Object.keys(OBJECT_TYPES).length + 1);
OBJECT_TYPES.TYPE_ENERGY2 = -(Object.keys(OBJECT_TYPES).length + 1);
OBJECT_TYPES.TYPE_ENERGY3 = -(Object.keys(OBJECT_TYPES).length + 1);
OBJECT_TYPES.TYPE_ENERGY4 = -(Object.keys(OBJECT_TYPES).length + 1);

const GET_COLOR   = (index) => Helper.getColor(8500 + (Math.abs(index) + OBJECT_TYPES.TYPE_ENERGY0) * 500);
const COLOR_INDEX = OBJECT_TYPES.TYPE_ENERGY0;
const COLOR_RGB   = GET_COLOR(COLOR_INDEX);

class Objects extends Dots {
    static getColor(index) {
        return GET_COLOR(index);
    }

    constructor(manager) {
        super(manager, OConfig, {
            addOnce    : false,
            compareCb  : (x, y) => manager.world.getDot(x, y) > 0 && manager.positions[x][y] >= OBJECT_TYPES.TYPE_ENERGY4 && manager.positions[x][y] <= OBJECT_TYPES.TYPE_ENERGY0,
            colorCb    : (    ) => COLOR_RGB,
            setCb      : (x, y) => manager.positions[x][y] = COLOR_INDEX
        });
    }
}

module.exports = Objects;