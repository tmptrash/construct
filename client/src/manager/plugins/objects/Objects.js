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
            colorCb    : (    ) => {color = Helper.rand(5); return Organism.getColor(4500 + color * 500)},
            setCb      : (x, y) => manager.positions[x][y] = -color
        });
    }

    // destroy() {
    //     Helper.unoverride(this._manager, 'onLoop', this._onLoopCb);
    //     this._manager  = null;
    //     this._onLoopCb = null;
    // }
    //
    // _onLoop(counter) {
    //     if (counter > 1 || Config.worldStonesPercent === .0) {return}
    //
    //     const stones   = Config.worldStonesPercent * Config.worldWidth * Config.worldHeight;
    //     let   amount   = 0;
    //     let   attempts = 0;
    //     while (amount < stones && attempts < 100) {
    //         const startAmount = amount;
    //         amount = this._addStoneBlock(amount, stones);
    //         if (startAmount === amount) {
    //             attempts++;
    //         } else {
    //             attempts = 0;
    //         }
    //     }
    // }
    //
    // _addStoneBlock(amount, stones) {
    //     const width       = Config.worldWidth;
    //     const height      = Config.worldHeight;
    //     const color       = Organism.getColor(Config.worldStoneColorIndex);
    //     const man         = this._manager;
    //     const world       = man.world;
    //     const stone       = OBJECT_TYPES.TYPE_STONE;
    //     let   x           = Helper.rand(width);
    //     let   y           = Helper.rand(height);
    //
    //     for (let i = 0; i < STONE_BLOCK_SIZE; i++) {
    //         x = x + Helper.rand(3) - 1;
    //         y = y + Helper.rand(3) - 1;
    //         if (x < 0 || x >= width || y < 0 || y >= height) {return amount}
    //         if (world.isFree(x, y)) {
    //             if (world.setDot(x, y, color)) {
    //                 man.positions[x][y] = stone;
    //                 if (++amount >= stones) {return amount}
    //             }
    //         }
    //     }
    //
    //     return amount;
    // }
}

module.exports = Objects;