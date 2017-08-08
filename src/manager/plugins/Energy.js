/**
 * Manager's plugin, which tracks amount of energy in a world and updates it.
 *
 * @author DeadbraiN
 */
import Helper  from './../../global/Helper';
import Config  from './../../global/Config';
import Console from './../../global/Console';

export default class Energy {
    constructor(manager) {
        this._manager       = manager;
        this._checkPeriod   = Config.worldEnergyCheckPeriod;
        this._onIterationCb = this._onIteration.bind(this);
        //
        // We have to update energy only in nature simulation mode
        //
        if (Config.codeFitnessCls !== null) {return}
        Helper.override(manager, 'onIteration', this._onIterationCb);
    }

    destroy() {
        Helper.unoverride(this._manager, 'onIteration', this._onIterationCb);
    }

    _onIteration(counter) {
        if (counter % this._checkPeriod === 0 && this._checkPeriod > 0) {
            if (counter === 0) {
                this._updateEnergy(Config.worldStartEnergyDots, Config.worldStartEnergyInDot);
                return;
            }
            let   energy = 0;
            const world  = this._manager.world;
            const width  = Config.worldWidth;
            const height = Config.worldHeight;

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    if (world.getDot(x, y) > 0) {energy++;}
                }
            }

            if (energy * 100 / (width * height) <= Config.worldEnergyCheckPercent) {
                this._updateEnergy(Config.worldStartEnergyDots, Config.worldStartEnergyInDot);
            }
        }
    }

    _updateEnergy(dotAmount, energyInDot) {
        const world  = this._manager.world;
        const width  = Config.worldWidth;
        const height = Config.worldHeight;
        const rand   = Helper.rand;

        Console.info('Creating random energy');
        for (let dot = 0; dot < dotAmount; dot++) {
            world.setDot(rand(width), rand(height), energyInDot);
        }
    }
}