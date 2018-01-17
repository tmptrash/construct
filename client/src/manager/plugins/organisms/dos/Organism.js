/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author flatline
 */
const Organism  = require('./../Organism').Organism;
const Operators = require('./Operators');

class OrganismDos extends Organism {
    /**
     * Creates organism instance. If parent parameter is set, then
     * a clone of parent organism will be created.
     * @param {String} id Unique identifier of organism
     * @param {Number} x Unique X coordinate
     * @param {Number} y Unique Y coordinate
     * @param {Boolean} alive true if organism is alive
     * @param {Object} item Reference to the Queue item, where
     * this organism is located
     * @param {Organism} parent Parent organism if cloning is needed
     */
    constructor(id, x, y, alive, item, parent = null) {
        super(id, x, y, alive, item, Operators, parent);
    }

    onRun() {
        this.vm.run(this);
    }
}

module.exports = OrganismDos;