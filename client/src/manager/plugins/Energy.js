/**
 * Manager's plugin, which tracks amount of energy in a world and updates it.
 *
 * @author flatline
 */
import Helper   from '../../../../common/src/global/Helper';
import {Config} from '../../../../common/src/global/Config';
import Console  from '../../global/Console';

export default class Energy {
    constructor(manager) {
        this.manager        = manager;
        this._checkPeriod   = Config.worldEnergyCheckPeriod;
        this._onIterationCb = this._onIteration.bind(this);
        //
        // We have to update energy only in nature simulation mode
        //
        if (Config.codeFitnessCls !== null) {return}
        Helper.override(manager, 'onIteration', this._onIterationCb);
    }

    destroy() {
        Helper.unoverride(this.manager, 'onIteration', this._onIterationCb);
        this.manager        = null;
        this._onIterationCb = null;
    }

    _onIteration(counter) {
        if (counter % this._checkPeriod === 0 && this._checkPeriod > 0) {
            if (counter === 0) {
                this._updateEnergy(Config.worldEnergyDots, Config.worldEnergyInDot);
                return;
            }
            let   energy = 0;
            const world  = this.manager.world;
            const width  = Config.worldWidth;
            const height = Config.worldHeight;

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    if (world.getDot(x, y) > 0) {energy++}
                }
            }

            if (energy * 100 / (width * height) <= Config.worldEnergyCheckPercent) {
                this._updateEnergy(Config.worldEnergyDots, Config.worldEnergyInDot);
            }
        }
    }

    _updateEnergy(dotAmount, energyInDot) {
        const world  = this.manager.world;
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
    }
}