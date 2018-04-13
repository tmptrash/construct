/**
 * Manager's plugin, which tracks amount of energy in a world and updates it.
 *
 * @author flatline
 */
const Dots     = require('./../../../share/Dots');
const Config   = require('./Config');
const EVENTS   = require('./../../../share/Events').EVENTS;

class Energy extends Dots {
    constructor(manager) {
        super(manager, Config, {
            addOnce  : false,
            compareCb: (x,y) => manager.world.getDot(x, y) > 0 && manager.positions[x][y] === 0
        });
    }

    onIteration(counter) {
        const energy = super.onIteration(counter);
        energy !== false && this.manager.fire(EVENTS.WORLD_ENERGY, energy);
    }
}

module.exports = Energy;