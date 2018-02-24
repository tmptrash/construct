/**
 * Manager's plugin, which tracks amount of energy in a world and updates it.
 *
 * @author flatline
 */
const Helper   = require('./../../../../common/src/Helper');
const Config   = require('./../../share/Config').Config;
const Organism = require('./../../manager/plugins/organisms/Organism').Organism;
const Console  = require('./../../share/Console');
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
        Config.worldCleverEnergy && this._cleverActive && this._addCleverBlock();

        if (counter % Config.worldEnergyCheckPeriod !== 0 || Config.worldEnergyCheckPeriod === 0) {return}
        if (counter === 0) {
            this._updateEnergy(Config.worldEnergyDots, Config.worldEnergyInDot);
            return;
        }

        const energy = this._getWorldEnergy();
        this._manager.fire(EVENTS.WORLD_ENERGY, energy);
        if (energy <= Config.worldCleverEnergyMinPercent)      {this._manager.fire(EVENTS.WORLD_ENERGY_UP, this._cleverActive = true)}
        else if (energy >= Config.worldCleverEnergyMaxPercent) {this._manager.fire(EVENTS.WORLD_ENERGY_UP, this._cleverActive = false)}

        if (energy <= Config.worldEnergyCheckAmount) {
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

    _addCleverBlock() {
        const width  = Config.worldWidth;
        const height = Config.worldHeight;
        const color  = Helper.rand(Organism.getMaxColors());
        let   block  = Config.worldCleverEnergyBlockSize;
        const world  = this._manager.world;
        let   x      = Helper.rand(width);
        let   y      = Helper.rand(height);

        for (let i = 0; i < block; i++) {
            x = x + Helper.rand(3) - 1;
            y = y + Helper.rand(3) - 1;
            if (x < 0 || x >= width || y < 0 || y >= height || --block < 0) {return}
            if (world.getDot(x, y) === 0) {
                world.setDot(x, y, Organism.getColor(color));
            }
        }
    }

    _getWorldEnergy() {
        let   energy = 0;
        const world  = this._manager.world;
        const width  = Config.worldWidth;
        const height = Config.worldHeight;
        const orgs   = this._manager.organisms;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (typeof orgs[POSID(x, y)] === 'undefined') {energy += world.getDot(x, y)}
            }
        }

        return energy / (width * height * 0xffffffff);
    }
}

module.exports = Energy;