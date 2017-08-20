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
import Backup      from './Backup';

const EMPTY    = 0;
const ENERGY   = 1;
const ORGANISM = 2;

export default class Organisms {
    constructor(manager) {
        this._orgs          = new Queue();
        this._backup        = new Backup();
        this._codeRuns      = 0;
        this._stamp         = Date.now();
        this._manager       = manager;
        this._positions     = {};
        this._code2Str      = new manager.CLASS_MAP[Config.code2StringCls];
        this._onIterationCb = this._onIteration.bind(this);
        this._onAfterMoveCb = this._onAfterMove.bind(this);

        this._fitnessMode   = Config.codeFitnessCls !== null;
        this._FITNESS_CLS   = manager.CLASS_MAP[Config.codeFitnessCls];

        this._reset();
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
            org.run();
            this._onOrganism(org);
            man.fire(Events.ORGANISM, org);
            item = item.next;
        }

        this._updateClone(counter);
        this._updateCrossover(counter);
        this._updateCreate();
        this._updateIps(stamp);
        this._updateBackup(counter);
    }

    _onOrganism(org) {
        if (this._fitnessMode) {
            if (org.energy > this._maxEnergy) {
                this._maxEnergy = org.energy;
                Console.warn('--------------------------------------------------')
                Console.warn('Max energy: ', org.energy, ', org Id: ', org.id);
                Console.warn('[' + org.code.code + ']');
                Console.warn(this._manager.api.formatCode(org.code.code));
            }

            if (org.changes > this._maxChanges) {this._maxChanges = org.changes}
        }
    }

    _onStop(org) {
        this._manager.stop();
        Console.warn('--------------------------------------------------')
        Console.warn('org id: ', org.id, ', energy: ', org.energy);
        Console.warn('[' + org.code.code + ']');
        Console.warn(this._manager.api.formatCode(org.code.code));
    }

    /**
     * Cloning parents are chosen according to tournament principle
     * @param {Number} counter Current counter
     * @returns {boolean}
     * @private
     */
    _updateClone(counter) {
        const orgs      = this._orgs;
        let   orgAmount = orgs.size;
        const needClone = Config.orgClonePeriod === 0 ? false : counter % Config.orgClonePeriod === 0;
        if (!needClone || orgAmount < 1) {return false;}

        let org1 = orgs.get(Helper.rand(orgAmount)).val;
        let org2 = orgs.get(Helper.rand(orgAmount)).val;
        let tmpOrg;

        if (!org1.alive && !org2.alive) {return false;}

        tmpOrg = this._tournament(org1, org2);
        if (tmpOrg === org2) {[org1, org2] = [org2, org1]}

        if (orgAmount >= Config.worldMaxOrgs) {org2.destroy();}
        if (org1.alive) {this._clone(org1)}

        return true;
    }

    _updateCrossover(counter) {
        const orgs      = this._orgs;
        const orgAmount = orgs.size;
        const needCrossover = Config.orgCrossoverPeriod === 0 ? false : counter % Config.orgCrossoverPeriod === 0;
        if (!needCrossover || orgAmount < 1) {return false;}

        let org1   = this._tournament();
        let org2   = this._tournament();
        let winner = this._tournament(org1, org2);
        let looser = winner === org1 ? org2 : org1;

        if (looser.alive) {
            this._crossover(winner, looser);
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

        man.fire(Events.IPS, ips, this._orgs);
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

        if (this._fitnessMode) {
            if ((org2.alive && !org1.alive) || this._FITNESS_CLS.compare(org2, org1, this._maxChanges)) {
                return org2;
            }
        } else {
            if ((org2.alive && !org1.alive) || (this._fitness(org2) > this._fitness(org1))) {
                return org2;
            }
        }

        return org1;
    }

    _fitness(org) {
        let fit;

        if (org.lastEnergy < org.energy) {
            fit = org.fitness() * Config.orgEnergyIncreaseCoef;
        } else {
            fit = org.fitness();
        }

        return fit;
    }

    _crossover(winner, looser) {
        this._clone(winner);
        const orgs = this._orgs;
        let child  = orgs.last.val;

        if (child.alive && looser.alive) {
            child.changes += child.code.crossover(looser.code);
            if (orgs.size >= Config.worldMaxOrgs) {looser.destroy()}
        }
    }

    _clone(org) {
        if (this._fitnessMode === false && org.energy < 1) {return false;}
        let pos = this._manager.world.getNearFreePos(org.x, org.y);
        if (pos === false || this._createOrg(pos, org) === false) {return false;}
        let child  = this._orgs.last.val;
        //
        // Energy should be grabbed only in native simulation mode
        //
        if (this._fitnessMode === false) {
            let energy = (((org.energy * org.cloneEnergyPercent) + 0.5) << 1) >>> 1; // analog of Math.round()
            org.grabEnergy(energy);
            child.grabEnergy(child.energy - energy);
        }
        this._manager.fire(Events.CLONE, org, child);

        return true;
    }

    _createPopulation() {
        const world = this._manager.world;

        this._reset();
        for (let i = 0; i < Config.orgStartAmount; i++) {
            this._createOrg(world.getFreePos());
        }
        Console.warn('Population has created');
    }

    _reset() {
        this._orgId      = 0;
        this._maxEnergy  = 0;
        this._maxChanges = 0;
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
        org.on(Events.CHECK_AT, this._onCheckAt.bind(this));
        if (this._fitnessMode) {
            org.on(Events.STOP, this._onStop.bind(this));
        }
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

        [x, y] = Helper.normalize(x, y);

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

    _onCheckAt(x, y, ret) {
        [x, y] = Helper.normalize(x, y);
        if (typeof(this._positions[Helper.posId(x, y)]) === 'undefined') {
            ret.ret = this._manager.world.getDot(x, y) > 0 ? ENERGY : EMPTY;
        } else {
            ret.ret = ORGANISM;
        }
    }

    _onCodeEnd(org) {
        this._codeRuns++;
    }

    _createOrg(pos, parent = null) {
        const orgs = this._orgs;
        if (orgs.size >= Config.worldMaxOrgs || pos === false) {return false;}
        orgs.add(null);
        let last   = orgs.last;
        let org    = new Organism(++this._orgId + '', pos.x, pos.y, true, last, this._onCodeEnd.bind(this), this._manager.CLASS_MAP, parent);

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