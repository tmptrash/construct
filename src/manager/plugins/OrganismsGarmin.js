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
 * @author DeadbraiN
 */
import {Config}       from './../../global/Config';
import Console        from './../../global/Console';
import {EVENTS}       from './../../global/Events';
import Organism       from '../../organism/OrganismDos';
import Organisms      from './../../manager/plugins/base/Organisms';

export default class OrganismsGarmin extends Organisms {
    constructor(manager) {
        super(manager);

        this._maxChanges  = 0;
        this._FITNESS_CLS = manager.CLASS_MAP[Config.codeFitnessCls];
    }

    /**
     * Compares two organisms and returns fittest one
     * @param {Organism} org1
     * @param {Organism} org2
     * @return {Organism}
     * @override
     */
    compare(org1, org2) {
        return this._FITNESS_CLS.compare(org1, org2, this._maxChanges);
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

    _onStop(org) {
        this.manager.stop();
        Console.warn('--------------------------------------------------');
        Console.warn('org id: ', org.id, ', energy: ', org.energy);
        Console.warn('[' + org.jsvm.code + ']');
        Console.warn(this.manager.api.formatCode(org.jsvm.code));
    }
}