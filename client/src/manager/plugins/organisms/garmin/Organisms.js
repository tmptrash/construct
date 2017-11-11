/**
 * Plugin for Manager module, which handles organisms population
 * in fitness mode.
 *
 * Events od Manager:
 *   ORGANISM(org) Fires after one organism has processed
 *
 * Depends on:
 *   manager/Manager
 *
 * @author flatline
 */
const Config        = require('./../../../../share/Config').Config;
const Organism      = require('./Organism');
const Console       = require('./../../../../share/Console');
const EVENTS        = require('./../../../../share/Events').EVENTS;
const BaseOrganisms = require('./../Organisms');
const Fitness       = Config.codeFitnessCls && require('CLIENT/' + Config.codeFitnessCls + '.js') || Config.codeFitnessCls;

class Organisms extends BaseOrganisms {
    constructor(manager) {
        super(manager);
        this._maxChanges = 0;
    }

    /**
     * Compares two organisms and returns fittest one
     * @param {Organism} org1
     * @param {Organism} org2
     * @return {Organism}
     * @override
     */
    compare(org1, org2) {
        return Fitness.compare(org1, org2, this._maxChanges);
    }

    onOrganism(org) {
        if (org.energy > this._maxEnergy) {
            this._maxEnergy = org.energy;
            Console.warn('--------------------------------------------------');
            Console.warn('Max energy: ', org.energy, ', org Id: ', org.id);
            Console.warn('[' + org.jsvm.code + ']');
            Console.warn(this.manager.api.formatCode(org.jsvm.code));
        }

        if (org.changes > this._maxChanges) {this._maxChanges = org.changes}
    }

    addOrgHandlers(org) {
        super.addOrgHandlers(org);
        org.on(EVENTS.STOP, this._onStop.bind(this));
    }

    reset() {
        super.reset();
        this._maxChanges = 0;
    }

    /**
     * Creates instance of an organism
     * @param {Array} args Custom organism arguments
     * @return {Organism} Organism instance
     * @override
     */
    createEmptyOrg(...args) {
        return new Organism(...args);
    }

    destroy() {
        //
        // super.destroy() call should be last line in this method
        //
        super.destroy();
    }

    _onStop(org) {
        this.manager.stop();
        Console.warn('--------------------------------------------------');
        Console.warn('org id: ', org.id, ', energy: ', org.energy);
        Console.warn('[' + org.jsvm.code + ']');
        Console.warn(this.manager.api.formatCode(org.jsvm.code));
    }
}

module.exports = Organisms;