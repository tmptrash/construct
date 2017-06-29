/**
 * Plugin for Manager module, which handles organisms population
 *
 * Events od Manager:
 *   ORGANISM(org) Fires after one organism has processed
 *
 * Depends on:
 *   manager/Manager
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
        let orgs = new Queue();

        manager.share('codeRuns', 0);
        manager.share('orgs', orgs);

        this._orgs          = orgs;
        this._manager       = manager;
        this._positions     = {};
        this._orgId         = 0;
        this._onIterationCb = this._onIteration.bind(this);
        this._onAfterMoveCb = this._onAfterMove.bind(this);

        Helper.override(manager, 'onIteration', this._onIterationCb);
        Helper.override(manager, 'onAfterMove', this._onAfterMoveCb);

        this._createPopulation();
    }

    destroy() {
        const man = this._manager;

        Helper.unoverride(man, 'onAfterMove', this._onAfterMoveCb);
        Helper.unoverride(man, 'onIteration', this._onIterationCb);
        this._positions = null;
        for (let org of this._orgs) {org.destroy();}
        this._manager.unshare('codeRuns');
        this._manager.unshare('orgs');
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
            org.run();
            item = item.next;
        }

        this._updateClone(counter);
        this._updateCreate();
    }

    /**
     * Cloning parents are chosen according two tournament principle
     * @param {Number} counter Current counter
     * @returns {boolean}
     * @private
     */
    _updateClone(counter) {
        const orgs      = this._orgs;
        const orgAmount = orgs.size;
        const needClone = Config.orgClonePeriod === 0 ? false : counter % Config.orgClonePeriod === 0;
        if (!needClone || orgAmount < 1 || orgAmount >= Config.worldMaxOrgs) {return false;}

        let org1 = orgs.get(Helper.rand(orgAmount)).val;
        let org2 = orgs.get(Helper.rand(orgAmount)).val;

        if (!org1.alive && !org2.alive) {return false;}
        if ((org2.alive && !org1.alive) || (org2.energy * org2.mutations > org1.energy * org1.mutations)) {
            [org1, org2] = [org2, org1];
        }
        if (org2.alive && orgAmount >= Config.worldMaxOrgs) {org2.destroy();}
        this._clone(org1);

        return true;
    }

    _updateCreate() {
        if (this._orgs.size < 1) {
            this._createPopulation();
        }
    }

    _clone(org) {
        if (org.energy < 1) {return false;}
        let pos = this._manager.world.getNearFreePos(org.x, org.y);
        if (pos === false || this._createOrg(pos, org) === false) {return false;}
        let child  = this._orgs.last.val;
        let energy = (((org.energy * org.cloneEnergyPercent) + 0.5) << 1) >> 1; // analog of Math.round()

        org.grabEnergy(energy);
        child.grabEnergy(child.energy - energy);
        this._manager.fire(Events.CLONE, org, child);

        return true;
    }

    _createPopulation() {
        const world = this._manager.world;

        for (let i = 0; i < Config.orgStartAmount; i++) {
            this._createOrg(world.getFreePos());
        }
    }

    _createOrg(pos, parent = null) {
        const orgs = this._orgs;
        if (orgs.size >= Config.worldMaxOrgs || pos === false) {return false;}
        orgs.add(null);
        let last   = orgs.last;
        let org    = new Organism(++this._orgId + '', pos.x, pos.y, true, last, parent);

        last.val = org;
        this._bindEvents(org);
        this._manager.move(pos.x, pos.y, pos.x, pos.y, org);
        this._positions[org.posId] = org;
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
        const man = this._manager;
        man.set('codeRuns', man.get('codeRuns') + 1);
    }

    _onKillOrg(org) {
        this._manager.fire(Events.KILL_ORGANISM, org);
        this._orgs.del(org.item);
        delete this._positions[org.posId];
        Console.info(org.id, ' die');
    }
}