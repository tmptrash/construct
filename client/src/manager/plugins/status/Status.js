/**
 * Shows console status of application
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
    constructor(manager) {
        super(manager, {Config, cfg: StatusConfig});

        this._manager     = manager;
        this._stamp       = 0;
        this._ips         = 0;
        this._energy      = 0;
        this._codeSize    = 0;
        this._runLines    = 1;
        this._times       = 0;
        this._oldValues   = [0, 0, 0];
        this._speed       = [0, 0, 0];

        manager.on(EVENTS.IPS, this._onIps.bind(this));
        manager.on(EVENTS.ORGANISM, this._onOrganism.bind(this));
    }

    destroy() {
        this._manager   = null;
        this._oldValues = null;
        this._speed     = null;
        super.destroy();
    }

    _onIps(ips, orgs) {
        if (!StatusConfig.showMessages) {return}
        const stamp     = Date.now();

        this._onBeforeIps(ips, orgs);
        if (stamp - this._stamp < StatusConfig.period) {return}

        const times     = this._times || 1;
        const times1    = (times - 1) || 1;
        const realIps   = this._ips / times;
        const orgAmount = orgs.size || 1;
        const sips      = `ips:${realIps.toFixed(realIps < 10 ? 2 : 0)}`.padEnd(10);
        const slps      = this._format(this._runLines / times,   'lps', orgAmount, 0, 14, 1, false, false);
        const sorgs     = this._format(orgAmount,                'org', orgAmount, 0, 10, 1, false, false);
        const senergy   = this._format(this._energy   / times,   'nrg', orgAmount, 0, 14, 1, false);
        const siq       = this._format(this._speed[0] / times1,  'iq',  orgAmount, 3, 13, 1000);
        const schanges  = this._format(this._speed[1] / times1,  'che', orgAmount, 3, 12, 100000);
        const sfit      = this._format(this._speed[2] / times1,  'fit', orgAmount, 3, 14);
        const scode     = this._format(this._codeSize / times,   'cod', orgAmount, 1, 12, 1, false);

        console.log(`%c${sips}${slps}${sorgs}%c${siq}${senergy}${schanges}${sfit}${scode}`, GREEN, RED);
        this._manager.hasView && this._manager.canvas.text(5, 15, sips);
        this._onAfterIps(stamp);
    }

    _onOrganism(org, lines) {
	    if (!StatusConfig.showMessages) {return}
        this._runLines += lines;
    }
	
    _format(value, name, orgs, fixed, pad, coef = 1, lines = true, perOrg = true) {
        orgs  = perOrg ? orgs : 1;
        lines = lines  ? this._runLines : 1;
        return `${name}:${(((value / orgs) / lines) * coef).toFixed(fixed)}`.padEnd(pad);
    }

    _onBeforeIps(ips, orgs) {
        let item     = orgs.first;
        let energy   = 0;
        let codeSize = 0;
        let changes  = 0;
        let fitness  = 0;
        let org;

        while(item && (org = item.val)) {
            energy   += org.energy;
            codeSize += org.vm.size;
            changes  += org.changes;
            fitness  += org.fitness();
            item = item.next;
        }

        if (this._oldValues) {
            const olds = this._oldValues;
            this._speed[0] += energy  - olds[0];
            this._speed[1] += changes - olds[1];
            this._speed[2] += fitness - olds[2];
        }

        this._ips      += ips;
        this._energy   += energy;
        this._codeSize += codeSize;
        this._setOldValues(energy, changes, fitness);

        this._times++;
    }

    _onAfterIps(stamp) {
        this._ips       = 0;
        this._energy    = 0;
        this._codeSize  = 0;
        this._runLines  = 0;
        this._times     = 0;
        this._stamp     = stamp;
        this._oldValues = null;
        this._speed     = [0, 0, 0];
    }

    _setOldValues(energy, changes, fitness) {
        this._oldValues = [energy, changes, fitness];
    }
}

module.exports = Status;