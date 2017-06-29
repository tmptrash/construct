/**
 * Plugin for Manager class, which is tracks when and how many mutations
 * should be added to special organism's code at special moment of it's
 * life.
 *
 * Depends on:
 *   manager/Manager
 *
 * @author DeadbraiN
 */
import Events from './../../global/Events';
import Config from './../../global/Config';

export default class Mutator {
    constructor(manager) {
        this._manager = manager;

        manager.on(Events.ORGANISM, this._onOrganism.bind(this));
        manager.on(Events.CLONE, this._onClone.bind(this));
    }

    _onOrganism(org) {
        if (Config.orgRainMutationPeriod > 0 && org.mutationPeriod > 0 && org.age % org.mutationPeriod === 0) {
            this._mutate(org, false);
        }
    }

    _onClone(parent, child) {
        if (child.energy > 0) {this._mutate(child);}
    }

    _mutate(org, clone = true) {
        //const mutationPercents = org.mutationPercents;
    }

    destroy() {
    }
}