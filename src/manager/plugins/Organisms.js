/**
 * Plugin for Manager module, which handles organisms population
 *
 * Events:
 *   ips(ips)      Fires if IPS has changed
 *   organism(org) Fires after one organism has processed
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
            // TODO: at the beginning all organisms should be killed
            // TODO: i have to use createOrganisms() method for that
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
        const alivePeriod    = Config.orgAlivePeriod;
        const checkAge       = alivePeriod > 0;
        const minOrgs        = Config.worldMinOrgs;
        const orgs           = this._orgs;
        const checkMutations = Config.orgRainMutationPeriod > 0;
        const needClone      = Config.orgClonePeriod === 0 ? false : counter % Config.orgClonePeriod === 0;
        let   orgAmount      = orgs.length;
        let   org;

        for (let i = 0; i < orgAmount; i++) {
            if ((org = orgs[i]).alive === false) {continue;}
            org.run();
            if (org.energy < 1 || checkAge && org.age > alivePeriod && this._orgAmount() > minOrgs) {this._kill(i); continue;}
            if (checkMutations && org.mutationPeriod > 0 && counter % org.mutationPeriod === 0)     {this._mutate(org, false);}
            this._manager.fire('organism', org);
        }

        if ((orgAmount = this._orgAmount()) < 1) {this._create();}
        if (needClone && orgAmount > 0 && orgAmount < Config.worldMaxOrgs) {this._clone();}
        if (Config.orgEnergySpendPeriod && counter % Config.orgEnergySpendPeriod === 0) {this._updateEnergy();}
        this._updateIps(stamp);
    }

    _updateIps(stamp) {
        const orgs = this._orgAmount();
        const ts   = stamp - this._stamp;
        let ips;

        this._codeRuns += orgs;
        if (ts < Config.worldIpsPeriodMs) {return;}
        ips = this._codeRuns / orgs / (ts / 1000);
        Console.warn('ips: ', ips);
        this._manager.fire('ips', ips);
        this._codeRuns  = 0;
        this._stamp     = stamp;
    }

    /**
     * Returns alive organisms amount
     * @returns {number}
     * @private
     */
    _orgAmount() {
        return this._orgs.length - this._killed.size();
    }

    _kill(index) {

    }

    _mutate(org, clone = true) {
        //const mutationPercents = org.mutationPercents;
    }

    _create() {

    }

    _clone() {

    }

    _updateEnergy() {

    }
}