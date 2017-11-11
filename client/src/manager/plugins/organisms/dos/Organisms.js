/**
 * Plugin for Manager module, which handles organisms population in
 * nature simulation mode. It's related to DOS language.
 *
 * Events od Manager:
 *   TODO:
 *   ORGANISM(org) Fires after one organism has processed
 *
 * Depends on:
 *   manager/Manager
 *
 * @author flatline
 */
const BaseOrganisms = require('./../Organisms');
const Organism      = require('./Organism');
const Config        = require('./../../../../share/Config').Config;
const EVENTS        = require('./../../../../share/Events').EVENTS;
const Helper        = require('./../../../../../../common/src/Helper');
const DIR           = require('./../../../../../../common/src/Directions').DIR;

const EMPTY         = 0;
const ENERGY        = 1;
const ORGANISM      = 2;

class Organisms extends BaseOrganisms {
    constructor(manager) {
        super(manager);
        this._onStepInCb = this._onStepIn.bind(this);
        this.manager.on(EVENTS.STEP_IN, this._onStepInCb);
    }

    destroy() {
        this.manager.off(EVENTS.STEP_IN, this._onStepInCb);
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
        return org.energy > 0;
    }

    /**
     * Is called after cloning of organism
     * @param {Organism} org Parent organism
     * @param {Organism} child Child organism
     * @override
     */
    onClone(org, child) {
        let energy = (((org.energy * org.cloneEnergyPercent) + 0.5) << 1) >>> 1; // analog of Math.round()
        org.grabEnergy(energy);
        child.grabEnergy(child.energy - energy);
    }

    addOrgHandlers(org) {
        super.addOrgHandlers(org);
        org.on(EVENTS.GET_ENERGY, this._onGetEnergy.bind(this));
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

    /**
     * Is called after organism has created
     * @param {Organism} org
     * @override
     */
    onAfterCreateOrg(org) {
        this.manager.positions[org.posId] = org;
    }

    /**
     * Is called after organism has killed
     * @param {Organism} org Killed organism
     * @override
     */
    onAfterKillOrg(org) {
        delete this.manager.positions[org.posId];
    }

    /**
     * Is called after moving of organism is done. Updates this.manager.positions
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
            delete this.manager.positions[Helper.posId(x1, y1)];
            this.manager.positions[Helper.posId(x2, y2)] = org;
        }

        return true;
    }

    _onGetEnergy(org, x, y, ret) {
        if (x < 0 || y < 0 || !Number.isInteger(x) || !Number.isInteger(y)) {return}
        const posId = Helper.posId(x, y);

        if (typeof(this.manager.positions[posId]) === 'undefined') {
            ret.ret = this.manager.world.getDot(x, y)
        } else {
            ret.ret = this.manager.positions[posId].energy;
        }
    }

    _onEat(org, x, y, ret) {
        const world = this.manager.world;
        const positions = this.manager.positions;
        let   dir;

        [x, y, dir] = Helper.normalize(x, y);

        const posId = Helper.posId(x, y);
        if (typeof(positions[posId]) === 'undefined') {
            ret.ret = world.grabDot(x, y, ret.ret);
        } else {
            ret.ret = ret.ret < 0 ? 0 : (ret.ret > positions[posId].energy ? positions[posId].energy : ret.ret);
            positions[posId].grabEnergy(ret.ret);
        }
    }

    _onStep(org, x1, y1, x2, y2, ret) {
        if (org.alive === false) {return}
        const man = this.manager;
        let   dir;

        [x2, y2, dir] = Helper.normalize(x2, y2);
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
        // world and correct removing= require(current world
        //
        if (man.activeAround[dir]) {
            org.x = x2;
            org.y = y2;
            man.fire(EVENTS.STEP_OUT, x2, y2, dir, org);
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
        if (man.hasOtherClients() || Config.worldCyclical === false) {
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
     * organism die at the moment.
     * @param {Number} x Current org X position
     * @param {Number} y Current org Y position
     * @param {String} orgJson Organism's serialized json
     * @private
     */
    _onStepIn(x, y, orgJson) {
        if (this.manager.world.isFree(x, y) && this.organisms.size < Config.orgMaxOrgs && this.createOrg({x, y})) {
            const org = this.organisms.last.val;
            org.unserialize(orgJson);
            org.grabEnergy(Config.orgStepEnergySpendPercent);
        }
    }

    _onCheckAt(x, y, ret) {
        let dir;

        [x, y, dir] = Helper.normalize(x, y);
        if (typeof(this.manager.positions[Helper.posId(x, y)]) === 'undefined') {
            ret.ret = this.manager.world.getDot(x, y) > 0 ? ENERGY : EMPTY;
        } else {
            ret.ret = ORGANISM;
        }
    }
}

module.exports = Organisms;