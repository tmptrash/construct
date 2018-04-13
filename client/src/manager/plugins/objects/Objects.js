/**
 * Manager's plugin, which add energy objects to the world. Such objects
 * may be joined together to get more energy
 *
 * @author flatline
 */
const Dots         = require('./../../../share/Dots');
const Helper       = require('./../../../../../common/src/Helper');
const Config       = require('./Config');
const Organism     = require('./../../plugins/organisms/Organism').Organism;
const OBJECT_TYPES = require('./../../../view/World').OBJECT_TYPES;

let color          = 0;
//
// We have to add object types to global types storage
//
OBJECT_TYPES.TYPE_ENERGY0 = -(Object.keys(OBJECT_TYPES).length + 1);
OBJECT_TYPES.TYPE_ENERGY1 = -(Object.keys(OBJECT_TYPES).length + 1);
OBJECT_TYPES.TYPE_ENERGY2 = -(Object.keys(OBJECT_TYPES).length + 1);
OBJECT_TYPES.TYPE_ENERGY3 = -(Object.keys(OBJECT_TYPES).length + 1);
OBJECT_TYPES.TYPE_ENERGY4 = -(Object.keys(OBJECT_TYPES).length + 1);

class Objects extends Dots {
    constructor(manager) {
        super(manager, Config, {
            addOnce    : false,
            checkPeriod: Config.checkPeriod,
            minPercent : Config.minPercent,
            maxPercent : Config.maxPercent,
            blockSize  : Config.blockSize,
            compareCb  : (x, y) => manager.world.getDot(x, y) > 0 && manager.positions[x][y] >= OBJECT_TYPES.TYPE_ENERGY4 && manager.positions[x][y] <= OBJECT_TYPES.TYPE_ENERGY0,
            colorCb    : (    ) => {color = Helper.rand(5) - OBJECT_TYPES.TYPE_ENERGY0; return Organism.getColor(4500 + (color + OBJECT_TYPES.TYPE_ENERGY0) * 500)},
            setCb      : (x, y) => manager.positions[x][y] = -color
        });
    }
}

module.exports = Objects;