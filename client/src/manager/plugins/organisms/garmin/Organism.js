/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author flatline
 */
const Organism  = require('./../Organism').Organism;
const Operators = require('./Operators');
const EVENTS    = require('./../../../../share/Events').EVENTS;
const Fitness   = require('./Fitness');

class OrganismGarmin extends Organism {
    /**
     * Creates organism instance. If parent parameter is set, then
     * a clone of parent organism will be created.
     * @param {String} id Unique identifier of organism
     * @param {Number} x Unique X coordinate
     * @param {Number} y Unique Y coordinate
     * @param {Object} item Reference to the Queue item, where
     * this organism is located
     * @param {Observer} obs Observer for sending external events
     * @param {Organism} parent Parent organism if cloning is needed
     */
    constructor(id, x, y, item, obs, parent = null) {
        super(id, x, y, item, Operators, obs, parent);

        this._needRun = true;

        this.vm.on(EVENTS.RESET_CODE, this._onResetCode.bind(this));
    }

    onBeforeRun() {
        return !this._needRun;
    }

    onRun() {
        if (Fitness.run(this)) {this.obs.fire(EVENTS.STOP, this)}
        this._needRun = false;
    }

    destroy() {
        super.destroy();
    }

    /**
     * Is called when some modifications in code appeared and we have
     * to re-execute it again
     */
    _onResetCode() {
        this._needRun = true;
    }
}

module.exports = OrganismGarmin;