/**
 * Manager's plugin, which add stones to the world
 *
 * @author flatline
 */
const Dots         = require('./../../../share/Dots');
const Config       = require('./Config');
const OBJECT_TYPES = require('../../../view/World').OBJECT_TYPES;
//
// We have to add stone type to global types storage
//
OBJECT_TYPES.TYPE_STONE = -(Object.keys(OBJECT_TYPES).length + 1);

class Stones extends Dots{
    constructor(manager) {
        super(manager, Config, {
            addOnce    : true,
            maxPercent : Config.maxPercent,
            colorIndex : Config.colorIndex,
            blockSize  : Config.blockSize,
            setCb      : (x, y) => manager.positions[x][y] = OBJECT_TYPES.TYPE_STONE
        });
    }
}

module.exports = Stones;