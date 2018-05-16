/**
 * Manager's plugin, which tracks amount of energy in a world and updates it.
 *
 * @author flatline
 */
const Dots     = require('./../../../share/Dots');
const EConfig  = require('./Config');

class Energy extends Dots {
    constructor(manager) {
        super(manager, EConfig, {
            addOnce  : false,
            compareCb: (x,y) => manager.world.getDot(x, y) > 0 && manager.positions[x][y] === 0,
            checkMin : (val) => val + manager.sharedObj.orgEnergy < this.config.minValue
        });
    }
}

module.exports = Energy;