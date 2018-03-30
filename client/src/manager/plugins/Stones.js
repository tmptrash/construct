/**
 * Manager's plugin, which add stones to the world
 *
 * @author flatline
 */
const Helper       = require('./../../../../common/src/Helper');
const Config       = require('./../../share/Config').Config;
const Organism     = require('./../../manager/plugins/organisms/Organism').Organism;
const OBJECT_TYPES = require('./../../view/World').OBJECT_TYPES;

const STONE_BLOCK_SIZE  = 300;
//
// We have to add stone type to global types storage
//
OBJECT_TYPES.TYPE_STONE = -(Object.keys(OBJECT_TYPES).length + 1);

class Stones {
    constructor(manager) {
        this._manager  = manager;
        this._onLoopCb = this._onLoop.bind(this);

        Helper.override(manager, 'onLoop', this._onLoopCb);
    }

    destroy() {
        Helper.unoverride(this._manager, 'onLoop', this._onLoopCb);
        this._manager  = null;
        this._onLoopCb = null;
    }

    _onLoop(counter) {
        if (counter > 1 || Config.worldStonesPercent === .0) {return}

        const stones = Config.worldStonesPercent * Config.worldWidth * Config.worldHeight;
        let   amount = 0;
        while (amount < stones) {
            amount = this._addStoneBlock(amount, stones);
        }
    }

    _addStoneBlock(amount, stones) {
        const width  = Config.worldWidth;
        const height = Config.worldHeight;
        const color  = Organism.getColor(Config.worldStoneColorIndex);
        const man    = this._manager;
        const world  = man.world;
        const stone  = OBJECT_TYPES.TYPE_STONE;
        let   x      = Helper.rand(width);
        let   y      = Helper.rand(height);

        for (let i = 0; i < STONE_BLOCK_SIZE; i++) {
            x = x + Helper.rand(3) - 1;
            y = y + Helper.rand(3) - 1;
            if (x < 0 || x >= width || y < 0 || y >= height) {return amount}
            if (world.isFree(x, y)) {
                if (world.setDot(x, y, color)) {
                    man.positions[x][y] = stone;
                    if (++amount >= stones) {return amount}
                }
            }
        }

        return amount;
    }
}

module.exports = Stones;