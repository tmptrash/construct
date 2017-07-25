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
import Helper      from './../../global/Helper';
import Config      from './../../global/Config';
import Console     from './../../global/Console';
import Events      from './../../global/Events';
import Queue       from './../../global/Queue';
import Organism    from './../../organism/Organism';
import Operators   from './../../organism/Operators';
import Code2String from './../../organism/Code2String';
import Backup      from './Backup';

export default class Organisms {
    constructor(manager) {
        this._orgs          = new Queue();
        this._backup        = new Backup();
        this._codeRuns      = 0;
        this._stamp         = Date.now();
        this._manager       = manager;
        this._positions     = {};
        this._orgId         = 0;
        this._code2Str      = new Code2String();
        this._onIterationCb = this._onIteration.bind(this);
        this._onAfterMoveCb = this._onAfterMove.bind(this);

        Helper.override(manager, 'onIteration', this._onIterationCb);
        Helper.override(manager, 'onAfterMove', this._onAfterMoveCb);
        //
        // API of the Manager for accessing outside. (e.g. from Console)
        //
        manager.api.formatCode = (code) => this._code2Str.format(code);
    }

    get orgs() {return this._orgs;}

    destroy() {
        Helper.unoverride(man, 'onAfterMove', this._onAfterMoveCb);
        Helper.unoverride(man, 'onIteration', this._onIterationCb);
        for (let org of this._orgs) {org.destroy();}
        this._orgs.destroy();
        this._orgs          = null;
        this._positions     = null;
        this._manager       = null;
        this._code2Str.destroy();
        this._code2Str      = null;
        this._onIterationCb = null;
        this._onAfterMoveCb = null;
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

        while (item && (org = item.val)) {
            man.fire(Events.ORGANISM, org);
            org.run();
            item = item.next;
        }

        this._updateClone(counter);
        this._updateCrossover(counter);
        this._updateCreate();
        this._updateIps(stamp);
        this._updateBackup(counter);
    }

    /**
     * Cloning parents are chosen according to tournament principle
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
        if ((org2.alive && !org1.alive) || (org2.energy * org2.adds * org2.changes > org1.energy * org1.adds * org1.changes)) {
            [org1, org2] = [org2, org1];
        }
        if (org2.alive && orgAmount >= Config.worldMaxOrgs) {org2.destroy();}
        this._clone(org1);

        return true;
    }

    _updateCrossover(counter) {
        const orgs      = this._orgs;
        const orgAmount = orgs.size;
        const needCrossover = Config.orgCrossoverPeriod === 0 ? false : counter % Config.orgCrossoverPeriod === 0;
        if (!needCrossover || orgAmount < 1 || orgAmount >= Config.worldMaxOrgs) {return false;}

        let org1   = this._tournament();
        let org2   = this._tournament();
        let winner = this._tournament(org1, org2);
        let looser = winner.id === org1.id ? org2 : org1;

        if (looser.alive && orgAmount < Config.worldMaxOrgs) {
            this._crossover(org1, org2);
        }

        return true;
    }

    _updateCreate() {
        if (this._orgs.size < 1) {
            this._createPopulation();
        }
    }

    _updateIps(stamp) {
        const ts   = stamp - this._stamp;
        if (ts < Config.worldIpsPeriodMs) {return;}
        const man  = this._manager;
        const orgs = this._orgs.size;
        let   ips  = this._codeRuns / orgs / (ts / 1000);
        const text = 'ips: ' + ips.toFixed(4);

        // TODO: these outputs should be moved to separate plugin
        man.canvas.text(5, 15, text);
        Console.warn(text);
        man.fire(Events.IPS, ips);
        this._codeRuns = 0;
        this._stamp = stamp;
    }

    _updateBackup(counter) {
        if (counter % Config.backupPeriod !== 0 || Config.backupPeriod === 0) {return;}
        // TODO: done this
        //this._backup.backup(this._orgs);
    }

    _tournament(org1 = null, org2 = null) {
        const orgs      = this._orgs;
        const orgAmount = orgs.size;
        org1            = org1 || orgs.get(Helper.rand(orgAmount)).val;
        org2            = org2 || orgs.get(Helper.rand(orgAmount)).val;

        if (!org1.alive && !org2.alive) {return false;}
        if ((org2.alive && !org1.alive) || (org2.energy * org2.adds * org2.changes > org1.energy * org1.adds * org1.changes)) {
            return org2;
        }

        return org1;
    }

    _crossover(org1, org2) {
        this._clone(org1);
        let child = this._orgs.last.val;

        if (child.alive && org2.alive) {
            child.adds += child.code.crossover(org2.code);
        }
    }

    _clone(org) {
        if (org.energy < 1) {return false;}
        let pos = this._manager.world.getNearFreePos(org.x, org.y);
        if (pos === false || this._createOrg(pos, org) === false) {return false;}
        let child  = this._orgs.last.val;
        let energy = (((org.energy * org.cloneEnergyPercent) + 0.5) << 1) >>> 1; // analog of Math.round()

        org.grabEnergy(energy);
        child.grabEnergy(child.energy - energy);
        this._manager.fire(Events.CLONE, org, child);

        return true;
    }

    _createPopulation() {
        const world = this._manager.world;

        this._orgId = 0;
        for (let i = 0; i < Config.orgStartAmount; i++) {
            this._createOrg(world.getFreePos());
        }
    }

    _onAfterMove(x1, y1, x2, y2, org) {
        if (x1 !== x2 || y1 !== y2) {
            delete this._positions[Helper.posId(x1, y1)];
            this._positions[Helper.posId(x2, y2)] = org;
        }

        return true;
    }

    _addHandlers(org) {
        org.on(Events.DESTROY, this._onKillOrg.bind(this));
        org.on(Events.GET_ENERGY, this._onGetEnergy.bind(this));
        org.on(Events.EAT, this._onEat.bind(this));
        org.on(Events.STEP, this._onStep.bind(this));
    }

    _onGetEnergy(org, x, y, ret) {
        if (x < 0 || y < 0 || !Number.isInteger(x) || !Number.isInteger(y)) {return;}
        const posId = Helper.posId(x, y);

        if (typeof(this._positions[posId]) === 'undefined') {
            ret.ret = this._manager.world.getDot(x, y)
        } else {
            ret.ret = this._positions[posId].energy;
        }
    }

    _onEat(org, x, y, ret) {
        const world = this._manager.world;
        const positions = this._positions;

        if (Config.worldCyclical) {
            if (x < 0)                        {x = Config.worldWidth - 1;}
            else if (x >= Config.worldWidth)  {x = 0;}
            else if (y < 0)                   {y = Config.worldHeight - 1;}
            else if (y >= Config.worldHeight) {y = 0;}
        }

        const posId = Helper.posId(x, y);
        if (typeof(positions[posId]) === 'undefined') {
            ret.ret = world.grabDot(x, y, ret.ret);
        } else {
            ret.ret = ret.ret < 0 ? 0 : (ret.ret > positions[posId].energy ? positions[posId].energy : ret.ret);
            positions[posId].grabEnergy(ret.ret);
        }
    }

    _onStep(org, x1, y1, x2, y2, ret) {
        if (org.alive) {
            ret.ret = +this._manager.move(x1, y1, x2, y2, org)
        }
    }

    _onCodeEnd() {
        this._codeRuns++;
    }

    _createOrg(pos, parent = null) {
        const orgs = this._orgs;
        if (orgs.size >= Config.worldMaxOrgs || pos === false) {return false;}
        orgs.add(null);
        let last   = orgs.last;
        let org    = new Organism(++this._orgId + '', pos.x, pos.y, true, last, this._onCodeEnd.bind(this), Operators, parent);

        last.val = org;
        this._addHandlers(org);
        this._manager.move(pos.x, pos.y, pos.x, pos.y, org);
        this._positions[org.posId] = org;
        this._manager.fire(Events.BORN_ORGANISM, org);
        Console.info(org.id, ' born');

        return true;
    }

    _onKillOrg(org) {
        this._orgs.del(org.item);
        this._manager.world.setDot(org.x, org.y, 0);
        delete this._positions[org.posId];
        this._manager.fire(Events.KILL_ORGANISM, org);
        Console.info(org.id, ' die');
    }
}