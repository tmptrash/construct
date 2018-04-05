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
const BaseOrganisms    = require('./../Organisms');
const Organism         = require('./Organism');
const Config           = require('./../../../../share/Config').Config;
const OConfig          = require('./../Config');
const EVENTS           = require('./../../../../share/Events').EVENTS;
const Helper           = require('./../../../../../../common/src/Helper');
const DIR              = require('./../../../../../../common/src/Directions').DIR;
/**
 * {Number} World object types
 */
const EMPTY            = 0;
const ENERGY           = 1;
const ORGANISM         = 2;
const OBJECT           = 3;
/**
 * {Function} Is created to speed up this function call. constants are run
 * much faster, then Helper.normalize()
 */
const NORMALIZE        = Helper.normalize;
const NORMALIZE_NO_DIR = Helper.normalizeNoDir;

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
        let   energy      = (orgEnergy * .5 + .5) << 0;  // analog of Math.round()
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
        org.energy   > 0 && (org.startEnergy   = org.energy);
        child.energy > 0 && (child.startEnergy = child.energy);
    }

    addOrgHandlers(org) {
        super.addOrgHandlers(org);
        org.on(EVENTS.EAT, this._onEat.bind(this));
        org.on(EVENTS.STEP, this._onStep.bind(this));
        org.on(EVENTS.CHECK_AT, this._onCheckAt.bind(this));
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

    _onEat(org, x, y, ret) {
        const eat       = ret.ret;
        [x, y]          = NORMALIZE_NO_DIR(x, y);
        const victimOrg = this.positions[x][y];
        //
        // World object found. We can't eat objects
        //
        if (victimOrg < 0) {ret.ret = 0; return}
        //
        // Energy found
        //
        if (victimOrg === 0) {
            if (eat >= 0) {
                ret.ret = this.world.grabDot(x, y, eat);
                this.parent.fire(EVENTS.EAT_ENERGY, ret.ret);
            } else {
                ret.ret = eat;
                this.world.setDot(x, y, (((-eat + .5) << 0) >>> 0) + this.world.getDot(x, y));
                this.parent.fire(EVENTS.PUT_ENERGY, -eat);
            }
            return;
        }
        //
        // Organism found
        //
        ret.ret = eat < 0 ? 0 : (eat > victimOrg.energy ? victimOrg.energy : eat);
        if (victimOrg.energy <= ret.ret) {
            this.parent.fire(EVENTS.KILL_EAT, victimOrg);
            //
            // IMPORTANT:
            // We have to do destroy here, to have a possibility for current
            // (winner) organism to clone himself after eating other organism.
            // This is how organisms compete for an ability to clone
            //
            victimOrg.destroy();
        } else {
            this.parent.fire(EVENTS.EAT_ORG, victimOrg, ret.ret);
            victimOrg.energy -= ret.ret;
        }
    }

    _onStep(org, x1, y1, x2, y2) {
        if (org.energy < 1) {return}
        const man = this.parent;
        let   dir;

        [x2, y2, dir] = NORMALIZE(x2, y2);
        //
        // Organism has moved, but still is within the current world (client)
        //
        if (dir === DIR.NO) {
            return this.move(x1, y1, x2, y2, org);
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
        if (man.isDistributed() || Config.worldCyclical === false) {return}
        //
        // The world is cyclical (worldCyclical). The organism will
        // appear on the other side
        //
        this.move(x1, y1, x2, y2, org);
    }

    _onCheckAt(x, y, ret) {
        [x, y] = NORMALIZE_NO_DIR(x, y);

        if (this.positions[x][y] < 0) {              // world object
            ret.ret = OBJECT + -this.positions[x][y];
        } else if (this.positions[x][y] === 0) {     // energy
            ret.ret = this.world.getDot(x, y) > 0 ? ENERGY : EMPTY;
        } else {                                     // organism
            ret.ret = ORGANISM;
        }
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
        if (ret.ret = this.world.isFree(x, y) && this.organisms.length < (OConfig.orgMaxOrgs + OConfig.orgMaxOrgs * OConfig.orgStepOverflowPercent)) {
            const item = this.createOrg(x, y);
            if (item === false) {return}
            const org  = item.val;
            org.unserialize(orgJson);
            const energy = (org.energy * OConfig.orgStepEnergySpendPercent + .5) << 0;
            //
            // IMPORTANT: We have to update organism's coordinates
            //
            org.x = x;
            org.y = y;
            this.world.setDot(x, y, org.color);
            org.energy <= energy && this.parent.fire(EVENTS.KILL_STEP_IN, org);
            org.energy -= energy;
        }
    }
}

module.exports = Organisms;