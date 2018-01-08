/**
 * This plugin is a primitive version of real time charts. It shows
 * different parameters of the jevo.js system, like average energy,
 * iq (energy picking speed), average code size and so on. Here
 * labels explanation:
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
const Configurable = require('./../../../../../common/src/Configurable');
const EVENTS       = require('./../../../share/Events').EVENTS;
const Config       = require('./../../../share/Config').Config;
const StatusConfig = require('./Config');

const GREEN  = 'color: #00aa00';
const RED    = 'color: #aa0000';

class Status extends Configurable {
    static _format(value, name, orgs, fixed, pad, coef = 1, perOrg = false) {
        const val = (value / (perOrg ? orgs : 1)) * coef;
        return `${name}:${val.toFixed(fixed === -1 && 2 || (val < 10 && val > -10 ? fixed : 0))}`.padEnd(pad);
    }

    constructor(manager) {
        super(manager, {Config, cfg: StatusConfig});

        this._manager      = manager;
        this._stamp        = 0;
        this._curEnergy    = 0;
        this._energy       = 0;
        this._fitness      = 0;
        this._changes      = 0;
        this._codeSize     = 0;
        this._runLines     = 1;
        this._age          = 0;
        this._times        = 0;
        this._oldValues    = [0, 0, 0];
        this._onIpsCb      = this._onIps.bind(this);
        this._onOrganismCb = this._onOrganism.bind(this);

        manager.on(EVENTS.IPS, this._onIpsCb);
        manager.on(EVENTS.ORGANISM, this._onOrganismCb);
    }

    destroy() {
        this._manager.off(EVENTS.IPS, this._onIpsCb);
        this._manager.off(EVENTS.ORGANISM, this._onOrganismCb);
        this._onIpsCb      = null;
        this._onOrganismCb = null;
        this._manager      = null;
        this._oldValues    = null;
        super.destroy();
    }

    _onIps(ips, orgs) {
        if (!StatusConfig.showMessages) {return}
        const stamp     = Date.now();
        this._times++;
        if (stamp - this._stamp < StatusConfig.period) {return}

        const man = this._manager;
        this._onBeforeLog(ips, orgs);
        const format    = Status._format;
        const orgAmount = orgs.size || 1;
        const sips      = `ips:${ips.toFixed(ips < 10 ? 2 : 0)}`.padEnd(10);
        const slps      = format(this._runLines / this._times, 'lps', orgAmount, 0,  14         );
        const sorgs     = format(orgAmount,                    'org', orgAmount, 0,  10         );
        const senergy   = format(this._curEnergy,              'nrg', orgAmount, 0,  14         );
        const siq       = format(this._energy,                 'iq',  orgAmount, 3,  12, 100000 );
        const schanges  = format(this._changes,                'che', orgAmount, 2,  12         );
        const sfit      = format(this._fitness,                'fit', orgAmount, 2,  13         );
        const sage      = format(this._age,                    'age', orgAmount, 0,  11, 1, true);
        const scode     = format(this._codeSize,               'cod', orgAmount, -1, 12, 1, true);

        console.log(`%c${sips}${slps}${sorgs}%c${siq}${senergy}${schanges}${sfit}${sage}${scode}`, GREEN, RED);
        const active = man.activeAround;
        man.canvas && man.canvas.text(5, 20, `${sips}${man.clientId && man.clientId || ''} ${active[0] ? '^' : ' '}${active[1] ? '>' : ' '}${active[2] ? 'v' : ' '}${active[3] ? '<' : ' '}`);
        this._onAfterLog(stamp);
    }

    _onOrganism(org, lines) {
	    if (!StatusConfig.showMessages) {return}
        this._runLines += lines;
    }

    _onBeforeLog(ips, orgs) {
        const olds      = this._oldValues;
        const size      = orgs.size || 1;
        const lines     = this._runLines;
        let   energy    = 0;
        let   fitness   = 0;
        let   changes   = 0;
        let   age       = 0;
        let   codeSize  = 0;
        let   item      = orgs.first;
        let   org;

        while(item && (org = item.val)) {
            energy   += org.energy;
            changes  += org.changes;
            fitness  += org.fitness();
            age      += org.iterations;
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
        this._age       = age;
        this._oldValues = [energy, changes, fitness];
    }

    _onAfterLog(stamp) {
        this._times    = 0;
        this._runLines = 0;
        this._stamp    = stamp;
    }
}

module.exports = Status;