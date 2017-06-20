/**
 * Plugin for Manager module, which handles organisms population
 *
 * Events:
 *   ips(ips) Fires if IPS has changed
 *
 * @author DeadbraiN
 */
import Helper   from './../../global/Helper';
import Config   from './../../global/Config';
import Stack    from './../../global/Stack';
import Organism from './../../organism/Organism';
import Console  from './../../global/Console';

export default class Organisms {
    constructor(manager) {
        this._manager   = manager;
        this._orgs      = null;
        this._killed    = null;
        this._stamp     = Date.now();
        this._codeRuns  = 0;

        this._initTasks();

        Helper.override(manager, 'onIteration', this._onIteration.bind(this));
    }

    _initTasks () {
        const worldMaxOrgs = Config.worldMaxOrgs;

        this._orgs   = new Array(worldMaxOrgs);
        this._killed = new Stack(worldMaxOrgs);

        for (let i = 0; i < worldMaxOrgs; i++) {
            this._orgs[i] = new Organism(i, 0, 0, true);
            //this._killed.push(i);
        }
    }

    /**
     * Override of Manager.onIteration() method. Is called on every
     * iteration od main loop. The counter is an analog of time.
     * @param {Number} counter Value of main loop counter.
     * @param {Number} stamp Time stamp of current iteration
     * @private
     */
    _onIteration(counter, stamp) {
        for (let t of this._orgs) {
            if (t.alive) {
                t.run();
            }
        }
        this._updateIps(stamp);
    }

    _updateIps(stamp) {
        const orgs = this._orgAmount();
        const ts   = stamp - this._stamp;

        this._codeRuns += orgs;
        if (ts < Config.worldIpsPeriodMs) {return;}
        let ips = this._codeRuns / orgs / (ts / 1000);

        Console.warn('ips: ', ips);
        this._manager.fire('ips', ips);
        this._codeRuns = 0;
        this._stamp    = stamp;
    }

    _orgAmount() {
        return this._orgs.length - this._killed.size();
    }
}