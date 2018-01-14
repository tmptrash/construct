/**
 * Base class for plugin which collects real time data about system like:
 * population energy, changes, organisms iq etc and provide this data to
 * other visualization classes (e.g. Charts). Output data is an object of
 * described below format:
 *
 *     ips: Iterations Per Second - amount of all organisms full
 *          code runs per one second
 *     lps: Lines Per Second - average amount of run code lines
 *          per one second
 *     org: Average amount of organisms at the moment of logging
 *     nrg: Amount of energy of average organism
 *     iq : Energy picking speed per StatusConfig.period seconds
 *     che: Changes amount of average organism
 *     fit: Fitness of average organism
 *     cod: Code size of average organism
 *
 * @author flatline
 */
const EVENTS       = require('./../../../share/Events').EVENTS;
const Configurable = require('./../../../../../common/src/Configurable');
const Config       = require('./../../../share/Config').Config;

class Status extends Configurable {
    /**
     * Is called every time, when new status data is available
     * @param {Object} status Status data
     * @param {Number} orgs Amount of organisms
     * @abstract
     */
    onStatus(status, orgs) {}

    constructor(manager, statCfg, apiCfg = {}) {
        super(manager, {Config, cfg: statCfg}, apiCfg);

        this.manager       = manager;
        this._stamp        = 0;
        this._curEnergy    = 0;
        this._energy       = 0;
        this._fitness      = 0;
        this._changes      = 0;
        this._codeSize     = 0;
        this._runLines     = 1;
        this._age          = 0;
        this._ageCount     = 0;
        this._times        = 0;
        this._oldValues    = [0, 0, 0];
        this._status       = {ips:0, lps:0, orgs:0, energy:0, iq:0, changes:0, fit:0, age:0, code:0};
        this._statusCfg    = statCfg;
        this._onIpsCb      = this._onIps.bind(this);
        this._onOrganismCb = this._onOrganism.bind(this);
        this._onKillOrgCb  = this._onKillOrg.bind(this);

        manager.on(EVENTS.IPS, this._onIpsCb);
        manager.on(EVENTS.ORGANISM, this._onOrganismCb);
        manager.on(EVENTS.KILL_ORGANISM, this._onKillOrgCb);
    }

    destroy() {
        this.manager.off(EVENTS.KILL_ORGANISM, this._onKillOrgCb);
        this.manager.off(EVENTS.ORGANISM, this._onOrganismCb);
        this.manager.off(EVENTS.IPS, this._onIpsCb);
        this._onKillOrgCb  = null;
        this._onOrganismCb = null;
        this._onIpsCb      = null;
        this.manager       = null;
        this._oldValues    = null;
    }

    onBeforeStatus(ips, orgs) {
        const olds      = this._oldValues;
        const size      = orgs.size || 1;
        const lines     = this._runLines || 1;
        let   energy    = 0;
        let   fitness   = 0;
        let   changes   = 0;
        let   codeSize  = 0;
        let   item      = orgs.first;
        let   org;

        while(item && (org = item.val)) {
            energy   += org.energy;
            changes  += org.changes;
            fitness  += org.fitness();
            codeSize += org.vm.size;
            item      = item.next;
        }

        energy  /= size;
        fitness /= size;
        this._curEnergy = energy;
        this._energy    = (energy  - olds[0]) / lines;
        this._changes   = (changes - olds[1]) / size;
        this._fitness   = (fitness - olds[2]) / lines;
        this._codeSize  = codeSize;
        this._oldValues = [energy, changes, fitness];
    }

    onAfterStatus(stamp) {
        this._times    = 0;
        this._runLines = 0;
        this._age      = 0;
        this._ageCount = 0;
        this._stamp    = stamp;
    }

    _onIps(ips, orgs) {
        if (!this._statusCfg.active) {return}
        this._times++;
        const stamp    = Date.now();
        if (stamp - this._stamp < this._statusCfg.period) {return}
        const status   = this._status;

        this.onBeforeStatus(ips, orgs);

        status.ips     = +ips.toFixed(ips < 10 ? 2 : 0);
        status.lps     = this._runLines / this._times;
        status.orgs    = orgs.size;
        status.energy  = this._curEnergy;
        status.iq      = this._energy;
        status.changes = this._changes;
        status.fit     = this._fitness;
        status.age     = this._age / (this._ageCount || 1);
        status.code    = this._codeSize;

        this.onStatus(status, orgs.size);
        this.onAfterStatus(stamp);
    }

    _onOrganism(org, lines) {
        if (!this._statusCfg.active) {return}
        this._runLines += lines;
    }

    _onKillOrg(org) {
        if (!this._statusCfg.active) {return}
        this._age += org.iterations;
        this._ageCount++;
    }
}

module.exports = Status;