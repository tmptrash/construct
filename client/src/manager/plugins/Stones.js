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
const POSID             = Helper.posId;
//
// We have to add stone type to global types storage
//
OBJECT_TYPES.TYPE_STONE = Object.keys(OBJECT_TYPES).length;

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
        if (counter > 1 || Config.worldStonesAmount === 0) {return}

        const stones = Config.worldStonesAmount;
        for (let i = 0; i < stones; i++) {
            this._addStoneBlock();
        }
    }

    _addStoneBlock() {
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
            if (x < 0 || x >= width || y < 0 || y >= height) {return}
            if (world.isFree(x, y)) {
                world.setDot(x, y, color) && (man.objects[POSID(x, y)] = stone);
            }
        }
    }
}

module.exports = Stones;