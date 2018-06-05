/**
 * Manager's plugin, which tracks amount of energy in a world and updates it.
 *
 * @author flatline
 */
const Dots     = require('./../../../share/Dots');
const EConfig  = require('./Config');
const Helper   = require('./../../../../../common/src/Helper');
const EVENTS   = require('./../../../share/Events').EVENTS;

class Energy extends Dots {
    constructor(manager) {
        super(manager, EConfig, {
            addOnce  : false,
            compareCb: (x,y) => manager.world.getDot(x, y) > 0 && manager.positions[x][y] === 0,
            checkMin : (val) => val + manager.sharedObj.orgEnergy + manager.sharedObj.objectsEnergy < EConfig.minValue
        });
        this._color     = Helper.getColor(EConfig.colorIndex);
        this._energy    = 0;
        this._sharedObj = manager.sharedObj;
        this._sharedObj.energy = 0;
    }

    onIteration(counter) {
        const energy = super.onIteration(counter);
        if (energy !== false) {
            this.manager.fire(EVENTS.WORLD_ENERGY, energy / this._color);
            this._energy = energy;
        }
    }

    /**
     * Override of Manager.onLoop() method. Stores amount of energy in sharedObj
     * @param {Number} counter Global counter. Time analog
     * @param {Number} stamp Time stamp
     * @param {Object} sharedObj Shared object of the manager
     */
    onLoop(counter, stamp, sharedObj) {
        super.onLoop(counter, stamp, sharedObj);
        sharedObj.energy = this._energy;
    }
}

module.exports = Energy;