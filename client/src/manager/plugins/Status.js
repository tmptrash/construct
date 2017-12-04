/**
 * Shows console status of application
 *
 * @author flatline
 */
const EVENTS = require('./../../share/Events').EVENTS;
const Config = require('./../../share/Config').Config;

const GREEN  = 'color: #00aa00';
const RED    = 'color: #aa0000';
// TODO: move this value to Status plugin config
const PERIOD = 10000;

class Status {
    constructor(manager) {
        this._manager     = manager;
        this._stamp       = 0;
        this._ips         = 0;
        this._energy      = 0;
        this._codeSize    = 0;
        this._runLines    = 0;
        this._changes     = 0;
        this._fitness     = 0;
        this._oldValues   = [0, 0, 0];

        manager.on(EVENTS.IPS, this._onIps.bind(this));
        manager.on(EVENTS.ORGANISM, this._onOrganism.bind(this));
    }

    _onIps(ips, orgs) {
        const stamp     = Date.now();

        if (stamp - this._stamp < PERIOD) {return}
        this._onBeforeIps(ips, orgs);

        const olds      = this._oldValues;
        const orgAmount = orgs.size || 1;
        const sips      = `ips:${this._ips.toFixed(this._ips < 10 ? 2 : 0)}`.padEnd(9);
        const slps      = this._format(this._runLines,          'lps', orgAmount, 0, 14, 1, false, false);
        const sorgs     = this._format(orgAmount,               'org', orgAmount, 0, 10, 1, false, false);
        const siq       = this._format(this._energy  - olds[0], 'iq',  orgAmount, 3, 13, 1000);
        const senergy   = this._format(this._energy,            'nrg', orgAmount, 0, 14, 1, false);
        const schanges  = this._format(this._changes - olds[1], 'che', orgAmount, 3, 12, 100000);
        const sfit      = this._format(this._fitness - olds[2], 'fit', orgAmount, 3, 14);
        const scode     = this._format(this._codeSize,          'cod', orgAmount, 1, 12, 1, false);

        console.log(`%c${sips}${slps}${sorgs}%c${siq}${senergy}${schanges}${sfit}${scode}`, GREEN, RED);
        this._manager.hasView && this._manager.canvas.text(5, 15, sips);
        this._setOldValues();
        this._onAfterIps(stamp);
    }

    _format(value, name, orgs, fixed, pad, coef = 1, lines = true, perOrg = true) {
        orgs  = perOrg ? orgs : 1;
        lines = lines  ? this._runLines : 1;
        return `${name}:${(((value / orgs) / lines) * coef).toFixed(fixed)}`.padEnd(pad);
    }

    _onOrganism(org, lines) {
        this._runLines += lines;
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
            codeSize += org.jsvm.size;
            changes  += org.changes;
            fitness  += org.fitness();
            item = item.next;
        }

        this._ips      = ips;
        this._energy   = energy;
        this._codeSize = codeSize;
        this._changes  = changes;
        this._fitness  = fitness;
    }

    _onAfterIps(stamp) {
        this._stamp    = stamp;
        this._runLines = 0;
    }

    _setOldValues() {
        this._oldValues = [this._energy, this._changes, this._fitness];
    }
}

module.exports = Status;