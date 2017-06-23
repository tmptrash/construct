/**
 * Plugin for Manager module, which handles organisms population
 *
 * Events:
 *   IPS(ips)      Fires if IPS has changed
 *   ORGANISM(org) Fires after one organism has processed
 *
 * @author DeadbraiN
 */
import Helper   from './../../global/Helper';
import Config   from './../../global/Config';
import Console  from './../../global/Console';
import Events   from './../../global/Events';
import Queue    from './../../global/Queue';
import Organism from './../../organism/Organism';

export default class Organisms {
    constructor(manager) {
        this._manager   = manager;
        this._orgs      = new Queue();
        this._stamp     = Date.now();
        this._codeRuns  = 0;
        this._positions = {};
        this._orgId     = 0;

        this._createPopulation();

        Helper.override(manager, 'onIteration', this._onIteration.bind(this));
    }

    /**
     * Override of Manager.onIteration() method. Is called on every
     * iteration of main loop. The counter is an analog of time.
     * @param {Number} counter Value of main loop counter.
     * @param {Number} stamp Time stamp of current iteration
     * @private
     */
    _onIteration(counter, stamp) {
        const man  = this._manager;
        let   item = this._orgs.first;
        let   org;

        while (item) {
            if ((org = item.val).alive === false) {continue;}

            org.run();
            man.fire(Events.ORGANISM, org);

            if (this._updateKill(org))            {continue;}
            if (this._updateEnergy(org))          {continue;}
            this._updateMutate(org);

            item = item.next;
        }

        this._updateClone(counter);
        this._updateCreate();
        this._updateIps(stamp);
    }

    _updateIps(stamp) {
        const orgs = this._orgs.size;
        const ts   = stamp - this._stamp;
        let   ips;

        if (ts < Config.worldIpsPeriodMs) {return;}
        ips = this._codeRuns / orgs / (ts / 1000);
        Console.warn('ips: ', ips);
        this._manager.fire(Events.IPS, ips);
        this._codeRuns  = 0;
        this._stamp     = stamp;
    }

    _updateKill(org) {
        const alivePeriod = Config.orgAlivePeriod;
        const checkAge    = alivePeriod > 0;

        if (org.energy < 1 || checkAge && org.age > alivePeriod && this._orgs.size > Config.worldMinOrgs) {
            this._kill(org);
        }

        return !org.alive;
    }

    /**
     * Cloning parents are chosen according two tournament principle
     * @param {Number} counter Current counter
     * @returns {boolean}
     * @private
     */
    _updateClone(counter) {
        const orgAmount = this._orgs.size;
        const needClone = Config.orgClonePeriod === 0 ? false : counter % Config.orgClonePeriod === 0;
        if (!needClone || orgAmount < 1 || orgAmount >= Config.worldMaxOrgs) {return false;}

        let org1 = this._orgs.get(Helper.rand(orgAmount));
        let org2 = this._orgs.get(Helper.rand(orgAmount));

        if (!org1.alive && !org2.alive) {return false;}
        if ((org2.alive && !org1.alive) || (org2.energy * org2.mutations > org1.energy * org1.mutations)) {
            [org1, org2] = [org2, org1];
        }
        if (org2.alive && orgAmount >= Config.worldMaxOrgs) {this._kill(org2);}
        this._clone(org1);

        return true;
    }

    _updateMutate(org) {
        if (Config.orgRainMutationPeriod > 0 && org.mutationPeriod > 0 && org.age % org.mutationPeriod === 0) {
            this._mutate(org, false);
        }
    }

    _updateCreate() {
        if (this._orgs.size < 1) {
            this._createPopulation();
        }
    }

    _updateEnergy(org) {
        if (Config.orgEnergySpendPeriod && org.age % Config.orgEnergySpendPeriod === 0) {

        }

        return !org.alive;
    }

    _kill(org) {
        this._manager.fire(Events.KILL_ORGANISM, org);
        this._orgs.del(org.item);
        delete this._positions[org.posId];
        org.destroy();
        Console.info(org.id, ' die');
    }

    _clone(org) {

    }

    _mutate(org, clone = true) {
        //const mutationPercents = org.mutationPercents;
    }

    _createPopulation() {
        for (let i = 0; i < Config.orgStartAmount; i++) {
            this._createOrg();
        }
    }

    _createOrg(pos = false) {
        if (this._orgs.size >= Config.worldMaxOrgs) {return false;}
        pos = pos === false ? this._manager.world.getFreePos() : pos;
        if (pos === false) {return false;}
        let org = new Organism(++this._orgId, pos.x, pos.y, true);

        this._bindEvents(org);
        this._move(pos.x, pos.y, pos.x, pos.y);
        this._positions[org.posId] = org;
        this._orgs.add(org);
        org.item = this._orgs.last;
        this._manager.fire(Events.BORN_ORGANISM, org);
        Console.info(org.id, ' born');

        return true;
    }

    _move(x1, y1, x2, y2) {

    }

    _bindEvents(org) {
        org.on(Events.CODE_END, this._onCodeEnd.bind(this));
    }

    _onCodeEnd() {
        this._codeRuns++;
    }
}