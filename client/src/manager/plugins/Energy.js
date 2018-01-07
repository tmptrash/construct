/**
 * Manager's plugin, which tracks amount of energy in a world and updates it.
 *
 * @author flatline
 */
const Helper  = require('./../../../../common/src/Helper');
const Config  = require('./../../share/Config').Config;
const Console = require('./../../share/Console');
const EVENTS  = require('./../../share/Events').EVENTS;

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
        if (counter % Config.worldEnergyCheckPeriod !== 0 || Config.worldEnergyCheckPeriod === 0) {return}
        if (counter === 0) {
            this._updateEnergy(Config.worldEnergyDots, Config.worldEnergyInDot);
            return;
        }
        let   energy = 0;
        const world  = this._manager.world;
        const width  = Config.worldWidth;
        const height = Config.worldHeight;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (world.getDot(x, y) > 0) {energy++}
            }
        }

        if (energy / (width * height) <= Config.worldEnergyCheckPercent) {
            this._updateEnergy(Config.worldEnergyDots, Config.worldEnergyInDot);
        }
    }

    _updateEnergy(dotAmount, energyInDot) {
        const world  = this._manager.world;
        const width  = Config.worldWidth;
        const height = Config.worldHeight;
        const rand   = Helper.rand;
        let   x;
        let   y;

        Console.info('Creating random energy');
        for (let dot = 0; dot < dotAmount; dot++) {
            x = rand(width);
            y = rand(height);
            if (world.getDot(x, y) < 1) {
                world.setDot(x, y, energyInDot);
            }
        }
        this._manager.fire(EVENTS.UPDATE_ENERGY);
    }
}

module.exports = Energy;