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
        const orgs      = this._orgs;
        const orgAmount = orgs.length;
        let   org;

        for (let i = 0; i < orgAmount; i++) {
            org = orgs[i];
            if (org.alive === false) {continue;}
            org.run();
            this._updateKill(org);
            if (org.alive === false) {continue;}
            this._updateMutate(org, counter);
            this._manager.fire('organism', org);
        }

        this._updateCreate();
        this._updateClone(counter);
        this._updateEnergy(counter);
        this._updateIps(stamp);
    }

    _updateIps(stamp) {
        const orgs = this._orgAmount();
        const ts   = stamp - this._stamp;
        let   ips;

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

    _updateKill(org) {
        const alivePeriod = Config.orgAlivePeriod;
        const checkAge    = alivePeriod > 0;

        if (org.energy < 1 || checkAge && org.age > alivePeriod && this._orgAmount() > Config.worldMinOrgs) {
            this._kill(org.id);
        }
    }

    _kill(index) {

    }

    _updateMutate(org, counter) {
        if (Config.orgRainMutationPeriod > 0 && org.mutationPeriod > 0 && counter % org.mutationPeriod === 0) {
            this._mutate(org, false);
        }
    }

    _mutate(org, clone = true) {
        //const mutationPercents = org.mutationPercents;
    }

    _updateCreate() {
        if (this._orgAmount() < 1) {
            this._create();
        }
    }

    _create() {

    }

    _updateClone(counter) {
        const orgAmount = this._orgAmount();
        const needClone = Config.orgClonePeriod === 0 ? false : counter % Config.orgClonePeriod === 0;

        if (needClone && orgAmount > 0 && orgAmount < Config.worldMaxOrgs) {
            this._clone();
        }
    }
    _clone() {

    }

    _updateEnergy(counter) {
        if (Config.orgEnergySpendPeriod && counter % Config.orgEnergySpendPeriod === 0) {

        }
    }
}