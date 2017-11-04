/**
 * Base class for OrganismsXXX plugins. Manages organisms. Makes
 * cloning, crossover, organisms comparison, killing and more...
 * Main function of this plugin is run organism's in an infinite
 * loop.
 *
 * @author flatline
 */
const Helper       = require('./../../../../../common/src/global/Helper');
const Config       = require('./../../../global/Config').Config;
const Console      = require('./../../../global/Console');
const EVENTS       = require('./../../../global/Events').EVENTS;
const Backup       = require('./../Backup');
const Code2String  = require('CLIENT/' + Config.code2StringCls + '.js');
const CodeOrganism = require('CLIENT/' + Config.codeOrganismCls + '.js');

const RAND_OFFS = 4;

class Organisms {
    /**
     * Compares two organisms and returns more fit one
     * @param {Organism} org1
     * @param {Organism} org2
     * @return {Organism}
     * @abstract
     */
    compare(org1, org2) {}

    /**
     * Is called every time after organism's code was run
     * @param {Organism} org
     * @abstract
     */
    onOrganism(org) {}

    /**
     * Is called after moving of organism is done. Updates this._positions
     * map with a new position of organism
     * @param {Number} x1 Start X position
     * @param {Number} y1 Start Y position
     * @param {Number} x2 End X position
     * @param {Number} y2 End Y position
     * @param {Organism} org Organism, which is moving
     * @returns {Boolean}
     * @abstract
     */
    onAfterMove(x1, y1, x2, y2, org) {}

    /**
     * Is called before cloning of organism
     * @param {Organism} org
     * @abstract
     */
    onBeforeClone(org) {}

    /**
     * Is called after cloning of organism
     * @param {Organism} org Parent organism
     * @param {Organism} child Child organism
     * @abstract
     */
    onClone(org, child) {}

    /**
     * Is called after organism has created
     * @param {Organism} org
     * @abstract
     */
    onAfterCreateOrg(org) {}

    /**
     * Is called after organism has killed
     * @param {Organism} org Killed organism
     * @abstract
     */
    onAfterKillOrg(org) {}

    constructor(manager) {
        this.organisms      = manager.organisms;
        this.backup         = new Backup();
        this.manager        = manager;
        this.code2Str       = new Code2String();
        this.randOrgItem    = this.organisms.first;
        this._onIterationCb = this.onIteration.bind(this);

        this.reset();
        Helper.override(manager, 'onIteration', this._onIterationCb);
        //
        // API of the Manager for accessing outside. (e.g. from Console)
        //
        manager.api.formatCode = (code) => this.code2Str.format(code);
    }

    destroy() {
        Helper.unoverride(this.manager, 'onIteration', this._onIterationCb);
        this.manager        = null;
        this.code2Str.destroy();
        this.code2Str       = null;
        this._onIterationCb = null;
    }

    /**
     * Override of Manager.onIteration() method. Is called on every
     * iteration of main loop. The counter is an analog of time.
     * @param {Number} counter Value of main loop counter.
     * @param {Number} stamp Time stamp of current iteration
     * @private
     */
    onIteration(counter, stamp) {
        let item = this.organisms.first;
        let org;

        while (item && (org = item.val)) {
            org.run();
            this.onOrganism(org);
            item = item.next;
        }

        this.updateClone(counter);
        this.updateCrossover(counter);
        this.updateCreate();
        this.updateBackup(counter);
    }

    addOrgHandlers(org) {
        org.on(EVENTS.DESTROY, this._onKillOrg.bind(this));
    }

    /**
     * Cloning parents are chosen according to tournament principle
     * @param {Number} counter Current counter
     * @returns {boolean}
     * @private
     */
    updateClone(counter) {
        const orgs      = this.organisms;
        const needClone = counter % Config.orgClonePeriod === 0 && Config.orgClonePeriod !== 0;
        let   orgAmount = orgs.size;
        if (!needClone || orgAmount < 1) {return false}
        let   org1      = this.getRandOrg();
        let   org2      = this.getRandOrg();
        if (!org1.alive && !org2.alive) {return false}

        let tmpOrg = this._tournament(org1, org2);
        if (tmpOrg === org2) {[org1, org2] = [org2, org1]}

        if (orgAmount >= Config.worldMaxOrgs) {org2.destroy()}
        if (org1.alive) {this._clone(org1)}

        return true;
    }

    updateCrossover(counter) {
        const orgs      = this.organisms;
        const orgAmount = orgs.size;
        const needCrossover = counter % Config.orgCrossoverPeriod === 0 && Config.orgCrossoverPeriod !== 0;
        if (!needCrossover || orgAmount < 1) {return false}

        let org1   = this._tournament();
        let org2   = this._tournament();
        let winner = this._tournament(org1, org2);
        let looser = winner === org1 ? org2 : org1;

        if (looser.alive) {
            this._crossover(winner, looser);
        }

        return true;
    }

    updateCreate() {
        if (this.organisms.size < 1) {
            this._createPopulation();
        }
    }

    updateBackup(counter) {
        if (counter % Config.backupPeriod !== 0 || Config.backupPeriod === 0) {return}
        // TODO: done this
        //this.backup.backup(this.organisms);
    }

    getRandOrg() {
        const offs = Helper.rand(RAND_OFFS);
        let   item = this.randOrgItem;

        for (let i = 0; i < offs; i++) {
            if ((item = item.next) === null) {
                item = this.organisms.first;
            }
        }

        return (this.randOrgItem = item).val;
    }

    reset() {
        this._orgId     = 0;
        this._maxEnergy = 0;
    }

    move(x1, y1, x2, y2, org) {
        let   moved = false;
        const world = this.manager.world;

        if (world.isFree(x2, y2) === false) {return false}
        if (x1 !== x2 || y1 !== y2) {moved = true; world.setDot(x1, y1, 0)}
        world.setDot(x2, y2, org.color);
        this.onAfterMove(x1, y1, x2, y2, org);

        return moved;
    }

    createOrg(pos, parent = null) {
        const orgs = this.organisms;
        if (orgs.size >= Config.worldMaxOrgs || pos === false) {return false}
        orgs.add(null);
        let last = orgs.last;
        let org  = new CodeOrganism(++this._orgId + '', pos.x, pos.y, true, last, this._onCodeEnd.bind(this), parent);

        last.val = org;
        this.addOrgHandlers(org);
        this.move(pos.x, pos.y, pos.x, pos.y, org);
        this.onAfterCreateOrg(org);
        this.manager.fire(EVENTS.BORN_ORGANISM, org);
        //Console.info(org.id, ' born');

        return true;
    }

    _tournament(org1 = null, org2 = null) {
        org1 = org1 || this.getRandOrg();
        org2 = org2 || this.getRandOrg();

        if (!org1.alive && !org2.alive) {return false}
        if ((org2.alive && !org1.alive) || this.compare(org2, org1)) {
            return org2;
        }

        return org1;
    }

    _clone(org) {
        if (this.onBeforeClone(org) === false) {return false}
        let pos = this.manager.world.getNearFreePos(org.x, org.y);
        if (pos === false || this.createOrg(pos, org) === false) {return false}
        let child  = this.organisms.last.val;

        this.onClone(org, child);
        this.manager.fire(EVENTS.CLONE, org, child);

        return true;
    }

    _crossover(winner, looser) {
        this._clone(winner);
        const orgs  = this.organisms;
        let   child = orgs.last.val;

        if (child.alive && looser.alive) {
            child.changes += child.jsvm.crossover(looser.jsvm);
            if (orgs.size >= Config.worldMaxOrgs) {looser.destroy()}
        }
    }

    _createPopulation() {
        const world = this.manager.world;

        this.reset();
        for (let i = 0; i < Config.orgStartAmount; i++) {
            this.createOrg(world.getFreePos());
        }
        Console.info('Population has created');
    }

    _onCodeEnd(org, lines) {
        this.manager.codeRuns++;
        this.manager.fire(EVENTS.ORGANISM, org, lines);
    }

    _onKillOrg(org) {
        if (this.randOrgItem === org.item) {
            if ((this.randOrgItem = org.item.next) === null) {
                this.randOrgItem = this.organisms.first;
            }
        }
        this.organisms.del(org.item);
        this.manager.world.setDot(org.x, org.y, 0);
        this.onAfterKillOrg(org);
        this.manager.fire(EVENTS.KILL_ORGANISM, org);
        //Console.info(org.id, ' die');
    }
}

module.exports = Organisms;