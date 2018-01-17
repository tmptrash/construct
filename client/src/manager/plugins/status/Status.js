/**
 * Base class for plugin which collects real time data about system like:
 * population energy, changes, organisms lps etc and provide this data to
 * other visualization classes (e.g. Charts). Output data is an object of
 * described below format:
 *
 *     lps: Lines Per Second - average amount of run code lines
 *          per one second
 *     org: Average amount of organisms at the moment of logging
 *     nrg: Amount of energy of average organism
 *     che: Changes amount of average organism
 *     fit: Fitness of average organism
 *     cod: Code size of average organism
 *
 * @author flatline
 */
const _fill        = require('lodash/fill');
const EVENTS       = require('./../../../share/Events').EVENTS;
const Configurable = require('./../../../../../common/src/Configurable');
const Config       = require('./../../../share/Config').Config;

class Status extends Configurable {
    static _toFixed(val, fixed) {
        return +val.toFixed(val < 10 && val > -10 ? fixed : 0);
    }

    /**
     * Is called every time, when new status data is available
     * @param {Object} status Status data
     * @param {Number} orgs Amount of organisms
     * @abstract
     */
    onStatus(status, orgs) {}

    constructor(manager, statCfg, apiCfg = {}) {
        super(manager, {Config, cfg: statCfg}, apiCfg);

        this._status         = {
            lps :0, orgs      :0, energy :0, penergy:0, eenergy :0, changes:0, fit    :0, age     :0, code     :0,
            kill:0, killenergy:0, killage:0, killeat:0, killover:0, killout:0, killin :0, killtour:0, killclone:0
        };
        this._stamp          = 0;
        this._energy         = 0;
        this._pickEnergy     = 0;
        this._eatEnergy      = 0;
        this._fitness        = 0;
        this._changes        = 0;
        this._codeSize       = 0;
        this._runLines       = 0;
        this._age            = 0;
        this._ageCount       = 0;
        this._times          = 0;
        this._kill           = new Array(9);
        this._statusCfg      = statCfg;
        this._firstCall      = true;

        this._onLoopCb       = this._onLoop.bind(this);
        this._onEatEnergyCb  = this._onEatEnergy.bind(this);
        this._onKillOrgCb    = this._onKillOrg.bind(this);
        this._onKillEnergyCb = this._onKillHandlerOrg.bind(this, 1);
        this._onKillAgeCb    = this._onKillHandlerOrg.bind(this, 2);
        this._onKillEatCb    = this._onKillHandlerOrg.bind(this, 3);
        this._onKillOverCb   = this._onKillHandlerOrg.bind(this, 4);
        this._onKillOutCb    = this._onKillHandlerOrg.bind(this, 5);
        this._onKillInCb     = this._onKillHandlerOrg.bind(this, 6);
        this._onKillTourCb   = this._onKillHandlerOrg.bind(this, 7);
        this._onKillCloneCb  = this._onKillHandlerOrg.bind(this, 8);

        manager.on(EVENTS.LOOP,           this._onLoopCb);
        manager.on(EVENTS.EAT_ENERGY,     this._onEatEnergyCb);
        manager.on(EVENTS.KILL,           this._onKillOrgCb);
        manager.on(EVENTS.KILL_NO_ENERGY, this._onKillEnergyCb);
        manager.on(EVENTS.KILL_AGE,       this._onKillAgeCb);
        manager.on(EVENTS.KILL_EAT,       this._onKillEatCb);
        manager.on(EVENTS.KILL_OVERFLOW,  this._onKillOverCb);
        manager.on(EVENTS.KILL_STEP_OUT,  this._onKillOutCb);
        manager.on(EVENTS.KILL_STEP_IN,   this._onKillInCb);
        manager.on(EVENTS.KILL_TOUR,      this._onKillTourCb);
        manager.on(EVENTS.KILL_CLONE,     this._onKillCloneCb);

        _fill(this._kill, 0);
    }

    destroy() {
        const man = this.parent;

        man.off(EVENTS.KILL_CLONE,     this._onKillCloneCb);
        man.off(EVENTS.KILL_TOUR,      this._onKillTourCb);
        man.off(EVENTS.KILL_STEP_IN,   this._onKillInCb);
        man.off(EVENTS.KILL_STEP_OUT,  this._onKillOutCb);
        man.off(EVENTS.KILL_OVERFLOW,  this._onKillOverCb);
        man.off(EVENTS.KILL_EAT,       this._onKillEatCb);
        man.off(EVENTS.KILL_AGE,       this._onKillAgeCb);
        man.off(EVENTS.KILL_NO_ENERGY, this._onKillEnergyCb);
        man.off(EVENTS.KILL,           this._onKillOrgCb);
        man.off(EVENTS.EAT_ENERGY,     this._onEatEnergyCb);
        man.off(EVENTS.LOOP,           this._onLoopCb);

        this._onKillOrgCb    = null;
        this._onEatEnergyCb  = null;
        this._onKillCloneCb  = null;
        this._onKillTourCb   = null;
        this._onKillInCb     = null;
        this._onKillOutCb    = null;
        this._onKillOverCb   = null;
        this._onKillEatCb    = null;
        this._onKillAgeCb    = null;
        this._onKillEnergyCb = null;
        this._onLoopCb       = null;
        this._status         = null;
        this._statusCfg      = null;
    }

    _onBeforeLoop(orgs) {
        const size        = orgs.size || 1;
        let   energy      = 0;
        let   startEnergy = 0;
        let   fitness     = 0;
        let   changes     = 0;
        let   codeSize    = 0;
        let   item        = orgs.first;
        let   org;

        while(item && (org = item.val)) {
            energy      += org.energy;
            startEnergy += org.startEnergy;
            changes     += org.changes;
            fitness     += org.fitness();
            codeSize    += org.vm.size;
            item         = item.next;
        }

        this._pickEnergy = (energy - startEnergy) / size;
        this._energy     = energy  / size;
        this._changes    = changes / size;
        this._fitness    = fitness / size;
        this._codeSize   = codeSize;
    }

    _onLoop() {
        if (!this._statusCfg.active) {return}
        this._times++;
        const stamp     = Date.now();
        if (stamp - this._stamp < this._statusCfg.period) {return}
        const orgs      = this.parent.organisms;
        const status    = this._status;
        const orgAmount = orgs.size || 1;
        const fix       = Status._toFixed;

        this._onBeforeLoop(orgs);

        status.lps        = fix(this.parent.codeRuns - this._runLines, 0);
        status.orgs       = orgAmount;
        status.energy     = fix(this._energy, 2);
        status.penergy    = fix(this._pickEnergy, 2);
        status.eenergy    = fix(this._eatEnergy / orgAmount, 2);
        status.changes    = +(this._changes).toFixed(1);
        status.fit        = fix(this._fitness / 10000000, 2);
        status.age        = fix(this._age / (this._ageCount || 1), 2);
        status.code       = +(this._codeSize / orgAmount).toFixed(2);
        status.kill       = fix(this._kill[0], 2);
        status.killenergy = fix(this._kill[1], 2);
        status.killage    = fix(this._kill[2], 2);
        status.killeat    = fix(this._kill[3], 2);
        status.killover   = fix(this._kill[4], 2);
        status.killout    = fix(this._kill[5], 2);
        status.killin     = fix(this._kill[6], 2);
        status.killtour   = fix(this._kill[7], 2);
        status.killclone  = fix(this._kill[8], 2);

        !this._firstCall && this.onStatus(status, orgs.size);
        this._onAfterLoop(stamp);
        this._firstCall = false;
    }

    _onAfterLoop(stamp) {
        this._times      = 0;
        this._runLines   = this.parent.codeRuns;
        this._age        = 0;
        this._ageCount   = 0;
        this._eatEnergy  = 0;
        this._pickEnergy = 0;
        this._stamp      = stamp;
        _fill(this._kill, 0);
    }

    /**
     * Calculates eat energy, excluding eating other organisms
     * @param {Number} eat Amount of eat energy
     */
    _onEatEnergy(eat) {
        this._eatEnergy += eat;
    }

    _onKillOrg(org) {
        if (!this._statusCfg.active) {return}
        this._age += org.iterations;
        this._kill[0]++;
        this._ageCount++;
    }

    _onKillHandlerOrg(index) {
        this._kill[index]++;
    }
}

module.exports = Status;