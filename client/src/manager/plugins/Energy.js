/**
 * Manager's plugin, which tracks amount of energy in a world and updates it.
 *
 * @author flatline
 */
const Helper   = require('./../../../../common/src/Helper');
const Config   = require('./../../share/Config').Config;
const Organism = require('./../../manager/plugins/organisms/Organism').Organism;
const EVENTS   = require('./../../share/Events').EVENTS;

const POSID    = Helper.posId;

class Energy {
    constructor(manager) {
        this._manager       = manager;
        this._cleverActive  = true;
        this._onIterationCb = this._onIteration.bind(this);

        Helper.override(manager, 'onIteration', this._onIterationCb);
    }

    destroy() {
        Helper.unoverride(this._manager, 'onIteration', this._onIterationCb);
        this._manager       = null;
        this._onIterationCb = null;
    }

    _onIteration(counter) {
        this._cleverActive && this._addEnergyBlock();

        if (Config.worldEnergyCheckPeriod === 0 || counter % Config.worldEnergyCheckPeriod !== 0) {return}

        const energy = this._getEnergyPercent();
        this._manager.fire(EVENTS.WORLD_ENERGY, energy);
        if (energy < Config.worldEnergyMinPercent)      {this._manager.fire(EVENTS.WORLD_ENERGY_UP, this._cleverActive = true)}
        else if (energy > Config.worldEnergyMaxPercent) {this._manager.fire(EVENTS.WORLD_ENERGY_UP, this._cleverActive = false)}
    }

    _addEnergyBlock() {
        const width  = Config.worldWidth;
        const height = Config.worldHeight;
        const color  = Organism.getColor(Config.worldEnergyColorIndex);
        let   block  = Config.worldEnergyBlockSize;
        const world  = this._manager.world;
        let   x      = Helper.rand(width);
        let   y      = Helper.rand(height);

        for (let i = 0; i < block; i++) {
            x = x + Helper.rand(3) - 1;
            y = y + Helper.rand(3) - 1;
            if (x < 0 || x >= width || y < 0 || y >= height) {return}
            if (world.isFree(x, y)) {world.setDot(x, y, color)}
        }
    }

    _getEnergyPercent() {
        let   energy = 0;
        const world  = this._manager.world;
        const width  = Config.worldWidth;
        const height = Config.worldHeight;
        const poses  = this._manager.positions;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (typeof poses[POSID(x, y)] === 'undefined') {energy += world.getDot(x, y)}
            }
        }

        return energy / (width * height * 0xffffffff);
    }
}

module.exports = Energy;