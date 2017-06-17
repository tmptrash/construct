/**
 * Main class of application. Contains entry point of jevo
 *
 * Usage:
 *   const manager = new Manager()
 *
 *   @author DeadbraiN
 */
import Config   from './../global/Config';
import Organism from './../organism/Organism';
import Helper   from './../global/Helper';
import Console  from './../global/Console';

export default class Manager {
	constructor() {
        this._world     = null;
        this._positions = {};
        this._tasks     = [];
        this._orgId     = 1;
        this._quiet     = Console.MODE_QUIET_IMPORTANT;
        this._ips       = 0;
        this._killed    = [];

        this._initTasks();
    }

    run () {

    }

    _initTasks () {
        let i;
        let org;
        const emptyFn = Helper.emptyFn;
        //
        // We create temporary organisms to prevent keeping empty slots in array. All
        // these organisms will be removed later, during application working.
        //
        for (i = 0; i < Config.worldMaxOrgs; i++) {
            org = new Organism(i);
            org.alive = false;
            this._tasks[i]  = {org: org, fn: emptyFn};
            this._killed[i] = i;
        }
    }
}