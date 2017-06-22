/**
 * Plugin for Manager module, which handles organisms population
 *
 * Events:
 *   ips(ips)      Fires if IPS has changed
 *   organism(org) Fires after one organism has processed
 *
 * @author DeadbraiN
 * TODO: we have to listen Events.CODE_END event to increase codeRuns and age fields of organism
 */
import Helper   from './../../global/Helper';
import Config   from './../../global/Config';
import Stack    from './../../global/Stack';
import Console  from './../../global/Console';
import Events   from './../../global/Events';
import Organism from './../../organism/Organism';

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
     * iteration of main loop. The counter is an analog of time.
     * @param {Number} counter Value of main loop counter.
     * @param {Number} stamp Time stamp of current iteration
     * @private
     */
    _onIteration(counter, stamp) {
        const orgs      = this._orgs;
        const orgAmount = orgs.length;
        const man       = this._manager;
        let   org;

        for (let i = 0; i < orgAmount; i++) {
            org = orgs[i];
            if (org.alive === false)     {continue;}
            org.run();
            man.fire(Events.ORGANISM, org);

            if (this._updateKill(org))   {continue;}
            if (this._updateClone(org))  {continue;}
            if (this._updateEnergy(org)) {continue;}

            this._updateMutate(org);
        }

        this._updateCreate();
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
        this._manager.fire(Events.IPS, ips);
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

        return !org.alive;
    }

    _kill(index) {

    }

    _updateClone(org) {
        const orgAmount = this._orgAmount();
        const needClone = Config.orgClonePeriod === 0 ? false : org.age % Config.orgClonePeriod === 0;

        if (needClone && orgAmount > 0 && orgAmount < Config.worldMaxOrgs) {
            this._clone();
        }

        return !org.alive;
    }

    _clone() {

    }

    _updateMutate(org) {
        if (Config.orgRainMutationPeriod > 0 && org.mutationPeriod > 0 && org.age % org.mutationPeriod === 0) {
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

    _updateEnergy(org) {
        if (Config.orgEnergySpendPeriod && org.age % Config.orgEnergySpendPeriod === 0) {

        }

        return !org.alive;
    }
}