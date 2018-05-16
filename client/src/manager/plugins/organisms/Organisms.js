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
const ORG_EVENTS   = require('./../../../../src/manager/plugins/organisms/Organism').EVENTS;
//const Backup       = require('./../backup/Backup');
const Mutator      = require('./Mutator');
const Num          = require('./../../../vm/Num');

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
     * Creates one instance of organism. You have to override this
     * method in your child class
     * @param {Array} args Custom organism arguments
     * @return {Organism} Organism instance
     * @abstract
     */
    createEmptyOrg(...args) {}

    constructor(manager) {
        super(manager, {Config, cfg: OConfig}, {
            getAmount  : ['_apiGetAmount', 'Shows amount of organisms within current Client(Manager)'],
            getOrganism: ['_apiGetOrganism', 'Returns organism instance by id or int\'s index in an array']
        });
        this.organisms       = manager.organisms;
        this.positions       = manager.positions;
        this.world           = manager.world;

        this._mutator        = new Mutator(manager, this);
        this._oldOrg         = null;
        this._curOldOrg      = null;
        this._energy         = 0;
        this._curEnergy      = 0;
        this._onIterationCb  = this._onIteration.bind(this);
        this._onLoopCb       = this._onLoop.bind(this);
        this._onConfigChange = this._onConfigChange.bind(this);

        this.reset();
        Helper.override(manager, 'onIteration', this._onIterationCb);
        Helper.override(manager, 'onLoop', this._onLoopCb);
        manager.on(EVENTS.CONFIG_CHANGE, this._onConfigChange);
    }

    destroy() {
        const orgs = this.organisms;
        const len  = orgs.length;
        for (let i = 0; i < len; i++) {if (orgs.get(i)) {orgs.get(i).destroy()}}

        Helper.unoverride(this.parent, 'onIteration', this._onIterationCb);
        Helper.unoverride(this.parent, 'onLoop', this._onLoopCb);
        this.parent.off(EVENTS.CONFIG_CHANGE, this._onConfigChange);
        this._energy         = 0;
        this._curEnergy      = 0;
        this._curOldOrg      = null;
        this._oldOrg         = null;
        this._mutator.destroy();
        this._mutator        = null;
        this.world           = null;
        this.positions       = null;
        this.organisms       = null;
        this._onConfigChange = null;
        this._onIterationCb  = null;
        this._onLoopCb       = null;

        super.destroy();
    }

    /**
     * Is called at the end of run() method. Found oldest organism and calculates
     * energy of all organisms
     * @param {Organism} org Current organism
     */
    onOrganism(org) {
        if (org.vm === null) {return}
        if (this._curOldOrg === null) {this._curOldOrg = org}
        if (this._curOldOrg.iterations < org.iterations) {this._curOldOrg = org}
        this._curEnergy += org.energy;
    }

    addOrgHandlers(org) {
        org.on(ORG_EVENTS.DESTROY,        this._onDestroyOrg.bind(this));
        org.on(ORG_EVENTS.KILL_NO_ENERGY, this._onKillNoEnergyOrg.bind(this));
        org.on(ORG_EVENTS.KILL_AGE,       this._onKillAgeOrg.bind(this));
        org.on(ORG_EVENTS.ITERATION,      this._onIterationOrg.bind(this));
        org.on(ORG_EVENTS.CLONE,          this._onCloneOrg.bind(this));
    }

    reset() {
        this._orgId = 0;
        this.parent.sharedObj.orgEnergy = 0;
    }

    move(x1, y1, x2, y2, org) {
        const world = this.world;
        if (world.isFree(x2, y2) === false) {return false}

        org.x = x2;
        org.y = y2;
        world.setDot(x2, y2, org.color);

        if (x1 === x2 && y1 === y2) {return false}
        world.setDot(x1, y1, 0);
        this.positions[x1][y1] = 0;
        this.positions[x2][y2] = org;

        return true;
    }

    createOrg(x, y, parent = null) {
        if (x === -1) {return false}
        const orgs = this.organisms;
        let   org  = this.createEmptyOrg(++this._orgId + '', x, y, orgs.freeIndex, parent);

        orgs.add(org);
        this.addOrgHandlers(org);
        this.world.setDot(x, y, org.color);
        this.positions[x][y] = org;
        this.parent.fire(EVENTS.BORN_ORGANISM, org);
        //Console.info(org.id, ' born');

        return org.item;
    }

    /**
     * Returns random organism of current population
     * @return {Organism|false}
     */
    _randOrg() {
        const org = this.organisms.get(Helper.rand(this.organisms.size));
        if (org === null) {return false}
        return org;
    }

    /**
     * Override of Manager.onIteration() method. Is called on every
     * iteration of main loop. The counter is an analog of time.
     * @param {Number} counter Value of main loop counter.
     * @param {Number} stamp Time stamp of current iteration
     */
    _onIteration(counter, stamp) {
        const orgs = this.organisms;
        let   org;

        for (let i = 0, len = orgs.size; i < len; i++) {
            if ((org = orgs.get(i)) === null) {continue}
            org.run();
            this.onOrganism(org);
        }

        this._onAfterIteration();
        this._updateTournament(counter);
        this._updateRandomOrgs(counter);
        this._updateCrossover(counter);
    }

    _onLoop() {
        this._updateCreate();
    }

    /**
     * Is called when global configuration has changed. Tracks if amount of
     * organisms has changed and updated this.organisms array
     * @param {String} key Unique config key
     * @param {*} val New value
     */
    _onConfigChange(key, val) {
        if (key === 'organisms.orgMaxOrgs') {
            const orgs = this.organisms;
            if (val < orgs.size) {
                for (let i = orgs.size - 1; i >= val; i--) {orgs.get(i) !== null && orgs.get(i).destroy()}
            }
            orgs.resize(val);
        }
    }

    _tournament(org1 = null, org2 = null) {
        org1 = org1 || this._randOrg();
        org2 = org2 || this._randOrg();

        if (org1 === false && org2 !== false) {return org2}
        if (org2 === false && org1 !== false) {return org1}
        if (org1 === false && org2 === false) {return false}
        if (org1.energy  < 1 && org2.energy < 1) {return false}
        if ((org2.energy > 0 && org1.energy < 1) || this.compare(org2, org1)) {
            return org2;
        }

        return org1;
    }

    _clone(org, isCrossover = false) {
        if (this.onBeforeClone(org) === false) {return false}
        let x;
        let y;

        [x, y] = this.world.getNearFreePos(org.x, org.y);
        if (x === -1 || this.createOrg(x, y, org) === false) {return false}
        let child = this.organisms.added();
        if (!child) {return false}

        this.onClone(org, child);
        if (org.energy < 1 || child.energy < 1) {return false}
        this.parent.fire(EVENTS.CLONE, org, child, isCrossover);

        return true;
    }

    _crossover(org1, org2) {
        if (!this._clone(org1, true)) {return false}
        let child = this.organisms.added();

        if (child.energy > 0 && org2.energy > 0) {
            child.changes += (Math.abs(child.vm.crossover(org2.vm)) * Num.MAX_BITS);
            return true;
        }

        return false;
    }

    _createPopulation() {
        const world       = this.world;
        const positions   = OConfig.orgPosition;
        const hasPosition = positions.length > 3;

        this.reset();
        for (let i = 0, len = OConfig.orgStartAmount; i < len; i++) {
            if (hasPosition) {
                const x = Helper.rand(positions[2]) + positions[0] - positions[2] / 2;
                const y = Helper.rand(positions[3]) + positions[1] - positions[3] / 2;
                if (world.isFree(x, y)) {this.createOrg(x, y)}
            } else {
                this.createOrg(...world.getFreePos());
            }
        }
        Console.info('Population has created');
    }

    /**
     * API method, which will be added to Manager.api interface
     * @api
     * @return {Number} Amount of organisms within current Manager
     */
    _apiGetAmount() {
        return this.parent.organisms.length;
    }

    /**
     * Return organism instance by id or it's index in array
     * @param {Number|String} index Index or id
     * @return {Organism|null} Organism instance or null
     * @api
     */
    _apiGetOrganism(index) {
        return this.organisms.get(index);
    }

    _onDestroyOrg(org) {
        this.organisms.del(org.item);
        this.world.setDot(org.x, org.y, 0);
        this.positions[org.x][org.y] = 0;
        this.parent.fire(EVENTS.KILL, org);
        //Console.info(org.id, ' die');
    }

    _onKillNoEnergyOrg(org) {this._parent.fire(EVENTS.KILL_NO_ENERGY, org)}
    _onKillAgeOrg(org)      {this._parent.fire(EVENTS.KILL_AGE, org)}
    _onIterationOrg(lines, org)    {
        this._parent.codeRuns += lines;
        this._parent.fire(EVENTS.CODE_RUN, lines, org);
    }

    _onCloneOrg(org) {
        //const maxOrgs = OConfig.orgMaxOrgs;
        //const orgAmount = this.organisms.length;

        //if (OConfig.orgKillOnClone && orgAmount >= maxOrgs) {this._killInTour()}
        //if (orgAmount >= maxOrgs && (OConfig.orgKillOnClone || Math.random() <= (org.energy / org.vm.size) / this._maxEnergy)) {this._randOrg().destroy()}
        // if (this.organisms.length >= OConfig.orgMaxOrgs && Math.random() <= ((org.energy / 10000000000000) * (org.iterations / OConfig.orgAlivePeriod))) {
        //     this._randOrg().destroy();
        //     this._randOrg().destroy();
        // }
        //if (this.organisms.length <  maxOrgs) {this._clone(org)}
        //if (this.organisms.length >= maxOrgs && Math.random() <= (org.energy / org.vm.size) / this._maxEnergy) {this._randOrg().destroy()}
        //
        // This is very important part of application! Cloning should be available only if
        // amount of organisms is less then maximum or if current organism has ate other just
        // now (and free one slot in Organisms.organisms queue). It's not a good idea to
        // kill organisms here with small amount of energy or support more energetic
        // organisms before cloning. They should kill each other to have a possibility
        // to clone them.
        //
        if (OConfig.orgKillOnClone && this.organisms.length >= OConfig.orgMaxOrgs && this._oldOrg) {
            this._oldOrg.destroy();
            this._oldOrg = null;
            //this._killInTour();
        }
        if (this.organisms.length < OConfig.orgMaxOrgs && org.vm !== null) {this._clone(org)}
    }

    _killInTour() {
        let org1     = this._randOrg();
        let org2     = this._randOrg();
        if (org1 === false || org2 === false || org1.energy < 1 || org2.energy < 1 || org1 === org2 || this.organisms.length < 1) {return false}
        const winner = this._tournament(org1, org2);
        if (winner === false) {return false}

        if (winner === org2) {[org1, org2] = [org2, org1]}
        this.parent.fire(EVENTS.KILL_TOUR, org2);
        org2.destroy();

        return true;
    }

    _onAfterIteration() {
        this.parent.sharedObj.orgEnergy = this._curEnergy;
        this._oldOrg    = this._curOldOrg;
        this._energy    = this._curEnergy;
        this._curOldOrg = null;
        this._curEnergy = 0;
    }

    /**
     * Does tournament between two random organisms and kill looser. In general
     * this function is a natural selection in our system.
     * @param {Number} counter Current value of global iterations counter
     * @returns {Boolean} true - tournament occurred, false - otherwise
     */
    _updateTournament(counter) {
        const period = OConfig.orgTournamentPeriod;
        return counter % period === 0 && this.organisms.length > 0 && period !== 0 && this._killInTour();
    }

    _updateRandomOrgs(counter) {
        if (counter % OConfig.orgRandomOrgPeriod !== 0 || OConfig.orgRandomOrgPeriod === 0 || this.organisms.length < 1) {return false}
        const vm   = this._randOrg().vm;
        if (!vm) {return false}
        const size = Helper.rand(vm.size) + 1;
        const pos  = Helper.rand(vm.size - size);

        vm.generate(pos, size);

        return true;
    }

    _updateCrossover(counter) {
        const orgAmount = this.organisms.length;
        if (counter % OConfig.orgCrossoverPeriod !== 0 || OConfig.orgCrossoverPeriod === 0 || orgAmount < 1) {return false}
        //
        // We have to have a possibility to crossover not only with best
        // organisms, but with low fit also
        //
        let org1 = this._tournament();
        let org2 = this._tournament();

        if (org1 === false || org2 === false || org1.energy < 1 || org2.energy < 1) {return false}
        this._crossover(org1, org2);
        if (orgAmount + 1 >= OConfig.orgMaxOrgs) {
            const winner = this._tournament(org1, org2);
            if (winner === false) {return false}
            if (winner === org2) {[org1, org2] = [org2, org1]}
            this.parent.fire(EVENTS.KILL_OVERFLOW, org2);
            org2.destroy();
        }

        return true;
    }

    _updateCreate() {
        if (this.organisms.length < 1) {this._createPopulation()}
    }
}

module.exports = Organisms;