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

        Helper.override(manager, 'onIteration', this._onIteration.bind(this));
        Helper.override(manager, 'onAfterMove', this._onAfterMove.bind(this));

        this._createPopulation();
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
            org = item.val;
            man.fire(Events.ORGANISM, org);
            if (org.run() === false) {item = item.next; continue;}
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

        let org1 = this._orgs.get(Helper.rand(orgAmount)).val;
        let org2 = this._orgs.get(Helper.rand(orgAmount)).val;

        if (!org1.alive && !org2.alive) {return false;}
        if ((org2.alive && !org1.alive) || (org2.energy * org2.mutations > org1.energy * org1.mutations)) {
            [org1, org2] = [org2, org1];
        }
        if (org2.alive && orgAmount >= Config.worldMaxOrgs) {org2.destroy();}
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

    _clone(org) {
        if (org.energy < 1) {return false;}
        let pos = this._manager.world.getNearFreePos(org.x, org.y);
        if (pos === false || this._createOrg(pos) === false) {return false;}
        let child  = this._orgs.last.val;
        let energy = (((org.energy * org.cloneEnergyPercent) + 0.5) << 1) >> 1; // analog of Math.round()

        org.clone(child);
        org.grabEnergy(energy);
        child.grabEnergy(child.energy - energy);
        if (energy > 0 && child.energy > 0) {this._mutate(child);}

        this._manager.fire(Events.CLONE, org.id, child.id);

        return true;
    }

    _mutate(org, clone = true) {
        //const mutationPercents = org.mutationPercents;
    }

    _createPopulation() {
        const world = this._manager.world;

        for (let i = 0; i < Config.orgStartAmount; i++) {
            this._createOrg(world.getFreePos());
        }
    }

    _createOrg(pos) {
        if (this._orgs.size >= Config.worldMaxOrgs || pos === false) {return false;}
        let org = new Organism(++this._orgId, pos.x, pos.y, true);

        this._bindEvents(org);
        this._manager.move(pos.x, pos.y, pos.x, pos.y, org);
        this._positions[org.posId] = org;
        this._orgs.add(org);
        org.item = this._orgs.last;
        this._manager.fire(Events.BORN_ORGANISM, org);
        Console.info(org.id, ' born');

        return true;
    }

    _onAfterMove(x1, y1, x2, y2, org) {
        if (x1 !== x2 && y1 !== y2) {
            delete this._positions[Helper.posId(x1, y1)];
            this._positions[Helper.posId(x2, y2)] = org;
        }

        return true;
    }

    _bindEvents(org) {
        org.on(Events.CODE_END, this._onCodeEnd.bind(this));
        org.on(Events.DESTROY, this._onKillOrg.bind(this));
    }

    _onCodeEnd() {
        this._codeRuns++;
    }

    _onKillOrg(org) {
        this._manager.fire(Events.KILL_ORGANISM, org);
        this._orgs.del(org.item);
        delete this._positions[org.posId];
        Console.info(org.id, ' die');
    }
}