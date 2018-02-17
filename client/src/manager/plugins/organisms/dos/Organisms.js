/**
 * Plugin for Manager module, which handles organisms population in
 * nature simulation mode. It's related to DOS language.
 *
 * Events od Manager:
 *   TODO:
 *
 * Depends on:
 *   manager/Manager
 *
 * @author flatline
 */
const BaseOrganisms = require('./../Organisms');
const Organism      = require('./Organism');
const Config        = require('./../../../../share/Config').Config;
const OConfig       = require('./../Config');
const EVENTS        = require('./../../../../share/Events').EVENTS;
const Helper        = require('./../../../../../../common/src/Helper');
const DIR           = require('./../../../../../../common/src/Directions').DIR;
/**
 * {Function} Is created to speed up this function call. constants are run
 * much faster, then Helper.normalize()
 */
const NORMALIZE        = Helper.normalize;
const NORMALIZE_NO_DIR = Helper.normalizeNoDir;
/**
 * {Function} Is created to speed up this function call. constants are run
 * much faster, then Helper.posId()
 */
const POSID         = Helper.posId;

class Organisms extends BaseOrganisms {
    constructor(manager) {
        super(manager);
        this._onStepInCb = this._onStepIn.bind(this);

        this.parent.on(EVENTS.STEP_IN, this._onStepInCb);
    }

    destroy() {
        this.parent.off(EVENTS.STEP_IN, this._onStepInCb);
        this._onStepInCb = null;
        super.destroy();
    }

    /**
     * Compares two organisms and returns more fit one
     * @param {Organism} org1
     * @param {Organism} org2
     * @return {Organism}
     * @override
     */
    compare(org1, org2) {
        return org1.fitness() > org2.fitness();
    }

    /**
     * Is called before cloning of organism
     * @param {Organism} org
     * @override
     */
    onBeforeClone(org) {
        return org.energy > 1;
    }

    /**
     * Is called after cloning of organism
     * @param {Organism} org Parent organism
     * @param {Organism} child Child organism
     * @override
     */
    onClone(org, child) {
        const orgEnergy   = org.energy;
        const childEnergy = child.energy;
        //
        // Clone percent is always 0.5
        //
        let   energy      = (((orgEnergy * 0.5) + 0.5) << 1) >>> 1;  // analog of Math.round()
        //
        // This is very special/rare case, when organisms cheating by creating
        // ancestors and put all energy into them at the same time resetting
        // their iterations property and make them immortal
        //
        if (energy === orgEnergy) {
            energy--;
        }
        orgEnergy <= energy && this.parent.fire(EVENTS.KILL_CLONE, org);
        org.energy -= energy;
        childEnergy <= (childEnergy - energy) && this.parent.fire(EVENTS.KILL_CLONE, child);
        child.energy -= (childEnergy - energy);
        org.alive   && (org.startEnergy   = org.energy);
        child.alive && (child.startEnergy = child.energy);
    }

    addOrgHandlers(org) {
        super.addOrgHandlers(org);
        org.on(EVENTS.GET_ENERGY, this._onGetEnergy.bind(this));
        org.on(EVENTS.EAT, this._onEat.bind(this));
        org.on(EVENTS.STEP, this._onStep.bind(this));
    }

    /**
     * Creates instance of an organism
     * @param {Array} args Custom organism arguments
     * @return {Organism} Organism instance
     * @override
     */
    createEmptyOrg(...args) {
        return new Organism(...args);
    }

    /**
     * Is called after organism has killed
     * @param {Organism} org Killed organism
     * @override
     */
    onAfterKillOrg(org) {
        this.positions[org.posId] = undefined;
    }

    /**
     * Is called after moving of organism is done. Updates this.positions
     * map with a new position of organism
     * @param {Number} x1 Start X position
     * @param {Number} y1 Start Y position
     * @param {Number} x2 End X position
     * @param {Number} y2 End Y position
     * @param {Organism} org Organism, which is moving
     * @returns {Boolean}
     * @override
     */
    onAfterMove(x1, y1, x2, y2, org) {
        if (x1 !== x2 || y1 !== y2) {
            this.positions[POSID(x1, y1)] = undefined;
            this.positions[POSID(x2, y2)] = org;
        }

        return true;
    }

    _onGetEnergy(x, y, ret) {
        const posId = POSID(x, y);

        if (typeof(this.positions[posId]) === 'undefined') {
            ret.ret = this.world.getDot(x, y)
        } else {
            ret.ret = this.positions[posId].energy;
        }
    }

    _onEat(org, x, y, ret) {
        const positions = this.positions;
        //
        // Amount of eat energy depends on organism size. Small organisms
        // eat less, big - more
        //
        const eat       = ret.ret / ((OConfig.codeMaxSize / (org.vm.size || 1)) || 1);
        [x, y]          = NORMALIZE_NO_DIR(x, y);
        const posId     = POSID(x, y);

        if (typeof(positions[posId]) === 'undefined') {
            if (eat > 0) {
                ret.ret = this.world.grabDot(x, y, eat);
                this.parent.fire(EVENTS.EAT_ENERGY, ret.ret);
            } else {
                ret.ret = eat;
                this.world.setDot(x, y, ((-eat + .5) << 0) + this.world.getDot(x, y));
                this.parent.fire(EVENTS.EAT_ENERGY, eat);
            }
        } else {
            const victimOrg = positions[posId];
            ret.ret = eat < 0 ? 0 : (eat > victimOrg.energy ? victimOrg.energy : eat);
            victimOrg.energy <= ret.ret && this.parent.fire(EVENTS.KILL_EAT, victimOrg);
            victimOrg.energy -= ret.ret;
        }
    }

    _onStep(org, x1, y1, x2, y2, ret) {
        if (org.alive === false) {return}
        const man = this.parent;
        let   dir;

        [x2, y2, dir] = NORMALIZE(x2, y2);
        //
        // Organism has moved, but still is within the current world (client)
        //
        if (dir === DIR.NO) {
            ret.x = x2;
            ret.y = y2;
            ret.ret = +this.move(x1, y1, x2, y2, org);
            return;
        }
        //
        // Current organism try to move out of the world.
        // We have to pass him to the server to another
        // client (Manager). Changing x,y two times is needed
        // for serializing correct coordinates for destination
        // world and correct removing in current world
        //
        if (man.activeAround[dir]) {
            org.x = x2;
            org.y = y2;
            man.fire(EVENTS.STEP_OUT, x2, y2, dir, org);
            man.fire(EVENTS.KILL_STEP_OUT, org);
            org.x = x1;
            org.y = y1;
            org.destroy();
            return;
        }
        //
        // Organism try to go outside of the world, but there is no
        // activated client on that side. So this is a border for him.
        // In this case coordinates (x,y) should stay the same
        //
        if (man.isDistributed() || Config.worldCyclical === false) {
            ret.x = x1;
            ret.y = y1;
            ret.ret = +this.move(x1, y1, x1, y1, org);
            return;
        }

        ret.x = x2;
        ret.y = y2;
        ret.ret = +this.move(x1, y1, x2, y2, org);
    }

    /**
     * Is called if organism step in from the server or other client (Manager/World).
     * If step in position is not free or maximum organisms are in the world, then
     * organism die at the moment. We have to set true to ret.ret, if in this world
     * there is a free place for the organism. And false otherwise.
     * @param {Number} x Current org X position
     * @param {Number} y Current org Y position
     * @param {String} orgJson Organism's serialized json
     * @param {Object} ret Return object
     */
    _onStepIn(x, y, orgJson, ret) {
        if (ret.ret = this.world.isFree(x, y) && this.organisms.size < (OConfig.orgMaxOrgs + OConfig.orgMaxOrgs * OConfig.orgStepOverflowPercent) && this.createOrg({x, y})) {
            const org = this.organisms.last.val;
            org.unserialize(orgJson);
            //
            // We have to update organism color and coordinates
            //
            org.x = x;
            org.y = y;
            const energy = (((org.energy * OConfig.orgStepEnergySpendPercent) + 0.5) << 1) >>> 1;
            (org.energy <= energy) && this.parent.fire(EVENTS.KILL_STEP_IN, org);
            org.energy -= energy;
        }
    }
}

module.exports = Organisms;