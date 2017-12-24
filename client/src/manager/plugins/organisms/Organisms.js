/**
 * Base class for OrganismsXXX plugins. Manages organisms. Makes
 * cloning, crossover, organisms comparison, killing and more...
 * Main function of this plugin is run organism's in an infinite
 * loop. This class can't be created as separate instance.
 *
 * @author flatline
 */
const Configurable = require('./../../../../../common/src/Configurable');
const Helper       = require('./../../../../../common/src/Helper');
const Config       = require('./../../../../src/share/Config').Config;
const OConfig      = require('./Config');
const Console      = require('./../../../../src/share/Console');
const EVENTS       = require('./../../../../src/share/Events').EVENTS;
//const Backup       = require('./../backup/Backup');
const Mutator      = require('./Mutator');
const Num          = require('./../../../vm/Num');

const RAND_OFFS = 4;
const MAX_BITS  = Num.MAX_BITS;

// TODO: inherit this class from Configurable
class Organisms extends Configurable {
    /**
     * Compares two organisms and returns more fit one
     * @param {Organism} org1
     * @param {Organism} org2
     * @return {Organism}
     * @abstract
     */
    compare(org1, org2) {}

    /**
     * Is called after moving of organism is done. Updates Manager.positions
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

    /**
     * Creates one instance of organism. You have to override this
     * method in your child class
     * @param {Array} args Custom organism arguments
     * @return {Organism} Organism instance
     * @abstract
     */
    createEmptyOrg(...args) {}

    constructor(manager) {
        super(manager, {Config, cfg: OConfig}, {getAmount: ['_apiGetAmount', 'Shows amount of organisms within current Client(Manager)']});
        this.organisms      = manager.organisms;
        this.manager        = manager;
        this.randOrgItem    = this.organisms.first;
        this._mutator       = new Mutator(manager);
        this._onIterationCb = this.onIteration.bind(this);

        this.reset();
        Helper.override(manager, 'onIteration', this._onIterationCb);
    }

    destroy() {
        let item = this.organisms.first;
        let org;
        while (item && (org = item.val)) {org.destroy(); item = item.next}

        Helper.unoverride(this.manager, 'onIteration', this._onIterationCb);
        this._mutator.destroy();
        this._mutator       = null;
        this.manager        = null;
        this._onIterationCb = null;

        super.destroy();
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
    }

    /**
     * Is called every time after organism's code was run
     * @param {Organism} org
     */
    onOrganism(org) {
        org.alive && org.vm.size === 0 && this._onCodeEnd(org, 0);
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
        const needClone = counter % OConfig.orgClonePeriod === 0 && OConfig.orgClonePeriod !== 0;
        let   orgAmount = orgs.size;
        if (!needClone || orgAmount < 1) {return false}
        let   org1      = this.getRandOrg();
        let   org2      = this.getRandOrg();
        if (!org1.alive && !org2.alive) {return false}

        let tmpOrg = this._tournament(org1, org2);
        if (tmpOrg === org2) {[org1, org2] = [org2, org1]}

        if (orgAmount >= OConfig.orgMaxOrgs) {org2.destroy()}
        if (org1.alive) {this._clone(org1)}

        return true;
    }

    updateCrossover(counter) {
        const orgs      = this.organisms;
        const orgAmount = orgs.size;
        const needCrossover = counter % OConfig.orgCrossoverPeriod === 0 && OConfig.orgCrossoverPeriod !== 0;
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
        this._orgId = 0;
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
        if (orgs.size >= OConfig.orgMaxOrgs || pos === false) {return false}
        orgs.add(null);
        let last = orgs.last;
        let org  = this.createEmptyOrg(++this._orgId + '', pos.x, pos.y, true, last, this._onCodeEnd.bind(this), parent);

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
            child.changes += (child.vm.crossover(looser.vm) * MAX_BITS);
            if (orgs.size >= OConfig.orgMaxOrgs) {looser.destroy()}
        }
    }

    _createPopulation() {
        const world = this.manager.world;

        this.reset();
        for (let i = 0; i < OConfig.orgStartAmount; i++) {
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

    /**
     * API method, which will be added to Manager.api interface
     * @return {Number} Amount of organisms within current Manager
     */
    _apiGetAmount() {
        return this.manager.organisms.size;
    }
}

module.exports = Organisms;