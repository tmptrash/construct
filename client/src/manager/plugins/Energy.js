/**
 * Manager's plugin, which tracks amount of energy in a world and updates it.
 *
 * @author flatline
 */
const Helper   = require('./../../../../common/src/Helper');
const Config   = require('./../../share/Config').Config;
const Organism = require('./../../manager/plugins/organisms/Organism').Organism;
const EVENTS   = require('./../../share/Events').EVENTS;

class Energy {
    constructor(manager) {
        this._manager       = manager;
        this._onIterationCb = this._onIteration.bind(this);

        Helper.override(manager, 'onIteration', this._onIterationCb);
    }

    destroy() {
        Helper.unoverride(this._manager, 'onIteration', this._onIterationCb);
        this._manager       = null;
        this._onIterationCb = null;
    }

    _onIteration(counter) {
        if (Config.worldEnergyCheckPeriod === 0 || counter % Config.worldEnergyCheckPeriod !== 0) {return}

        let energy = this._getEnergyPercent();

        this._manager.fire(EVENTS.WORLD_ENERGY, energy);
        if (energy > Config.worldEnergyMinPercent) {return}

        const maxEnergy = Config.worldEnergyMaxPercent * Config.worldWidth * Config.worldHeight;
        let   amount    = 0;
        let   attempts  = 0;
        while (amount < maxEnergy && attempts < 100) {
            const startAmount = amount;
            amount = this._addEnergyBlock(amount, maxEnergy);
            if (amount === startAmount) {
                attempts++;
            } else {
                attempts = 0;
            }
        }
    }

    _addEnergyBlock(amount, maxEnergy) {
        const width = Config.worldWidth;
        const height = Config.worldHeight;
        const color = Organism.getColor(Config.worldEnergyColorIndex);
        let block = Config.worldEnergyBlockSize;
        const world = this._manager.world;
        let x = Helper.rand(width);
        let y = Helper.rand(height);

        for (let i = 0; i < block; i++) {
            x = x + Helper.rand(3) - 1;
            y = y + Helper.rand(3) - 1;
            if (x < 0 || x >= width || y < 0 || y >= height) {
                return amount
            }
            if (world.isFree(x, y)) {
                world.setDot(x, y, color);
                if (++amount > maxEnergy) {
                    return amount
                }
            }
        }

        return amount;
    }

    _getEnergyPercent() {
        let   energy = 0;
        const world  = this._manager.world;
        const width  = Config.worldWidth;
        const height = Config.worldHeight;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (world.getDot(x, y) > 0) {++energy}
            }
        }

        return energy / (width * height);
    }
}

module.exports = Energy;