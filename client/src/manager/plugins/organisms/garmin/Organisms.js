/**
 * Plugin for Manager module, which handles organisms population
 * in fitness mode.
 *
 * Events od Manager:
 *
 * Depends on:
 *   manager/Manager
 *
 * @author flatline
 */
const Organism      = require('./Organism');
const Console       = require('./../../../../share/Console');
const EVENTS        = require('./../../../../share/Events').EVENTS;
const BaseOrganisms = require('./../Organisms');
const Fitness       = require('./Fitness');

class Organisms extends BaseOrganisms {
    constructor(manager) {
        super(manager);
        this._maxChanges = 0;
        this._maxEnergy  = 0;

        this.callbacks[EVENTS.STOP] = this._onStop.bind(this);
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
            Console.warn('[' + org.vm.code + ']');
            Console.warn(this.manager.api.toJS(org.vm.code));
        }

        if (org.changes > this._maxChanges) {this._maxChanges = org.changes}
    }

    reset() {
        super.reset();
        this._maxChanges = 0;
        this._maxEnergy  = 0;
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
        Console.warn('[' + org.vm.code + ']');
        Console.warn(this.manager.api.toJS(org.vm.code));
    }
}

module.exports = Organisms;