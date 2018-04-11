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
        // this._manager  = manager;
        // this._onLoopCb = this._onLoop.bind(this);
        //
        // Helper.override(manager, 'onLoop', this._onLoopCb);
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

module.exports = Stones;