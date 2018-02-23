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
        this._lastX         = -1;
        this._lastY         = -1;
        this._colorIndex    = Helper.rand(Organism.getMaxColors());
        this._amount        = Config.worldCleverEnergyBlockSize;
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
        Config.worldCleverEnergy && this._cleverActive && this._updateCleverEnergy();

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

    _updateCleverEnergy() {
        const x = this._lastX >= 0 ? this._lastX : Helper.rand(Config.worldWidth);
        const y = this._lastY >= 0 ? this._lastY : Helper.rand(Config.worldHeight);

        if (x < 0 || x >= Config.worldWidth || y < 0 || y >= Config.worldHeight || --this._amount < 0)  {
            this._lastX      = this._lastY = -1;
            this._colorIndex = Helper.rand(Organism.getMaxColors());
            this._amount     = Config.worldCleverEnergyBlockSize;
            return;
        }

        const world  = this._manager.world;
        for (let i = 0; i < 8; i++) {
            this._lastX = x + Helper.rand(3) - 1;
            this._lastY = y + Helper.rand(3) - 1;
            if (world.getDot(this._lastX, this._lastY) === 0) {
                world.setDot(this._lastX, this._lastY, Organism.getColor(this._colorIndex))
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