/**
 * Plugin for Manager module, which handles organisms population
 *
 * @author DeadbraiN
 */
import Helper   from './../../global/Helper';
import Config   from './../../global/Config';
import Stack    from './../../global/Stack';
import Organism from './../../organism/Organism';

export default class Organisms {
    constructor(manager) {
        this._manager   = manager;
        this._tasks     = null;
        this._killed    = null;

        this._initTasks();

        Helper.override(manager, 'onIteration', this._onIterationCb.bind(this));
    }

    _initTasks () {
        const worldMaxOrgs = Config.worldMaxOrgs;

        this._tasks  = new Array(worldMaxOrgs);
        this._killed = new Stack(worldMaxOrgs);

        for (let i = 0; i < worldMaxOrgs; i++) {
            this._tasks[i] = {org: new Organism(i, 0, 0, false), task: null};
            this._killed.push(i);
        }
    }

    _onIterationCb() {
        for (let org of this._tasks) {

        }
    }
}