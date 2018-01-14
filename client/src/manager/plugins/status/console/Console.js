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
const Status = require('./../Status');
const Config = require('./Config');

const GREEN  = 'color: #00aa00';
const RED    = 'color: #aa0000';

class Console extends Status {
    static _format(value, name, orgs, fixed, pad, coef = 1, perOrg = false) {
        const val = (value / (perOrg ? orgs : 1)) * coef;
        return `${name}:${val.toFixed(fixed === -1 && 2 || (val < 10 && val > -10 ? fixed : 0))}`.padEnd(pad);
    }

    constructor(manager) {
        super(manager, Config);
    }

    destroy() {
        super.destroy();
    }

    /**
     * Is called every time, when new status data is available
     * @param {Object} status Status data
     * @param {Number} orgs Amount of organisms
     * @override
     */
    onStatus(status, orgs) {
        const man       = this.manager;
        const active    = man.activeAround;
        const format    = Console._format;

        const con       = `${active[0] ? '^' : ' '}${active[1] ? '>' : ' '}${active[2] ? 'v' : ' '}${active[3] ? '<' : ' '}`;
        const conns     = `con:${con === '    ' ? 'no  ' : con}`;
        const orgAmount = orgs || 1;
        const sips      = `ips:${status.ips}`.padEnd(10);
        const slps      = format(status.lps,      'lps', orgAmount, 0,  14         );
        const sorgs     = format(orgs,            'org', orgAmount, 0,  10         );
        const senergy   = format(status.energy,   'nrg', orgAmount, 0,  14         );
        const siq       = format(status.iq,       'iq',  orgAmount, 3,  14, 100000 );
        const schanges  = format(status.changes,  'che', orgAmount, 2,  12         );
        const sfit      = format(status.fit,      'fit', orgAmount, 2,  13         );
        const sage      = format(status.age,      'age', orgAmount, 0,  11, 1      );
        const scode     = format(status.code,     'cod', orgAmount, -1, 12, 1, true);

        console.log(`%c${conns}${sips}${slps}${sorgs}%c${siq}${senergy}${schanges}${sfit}${sage}${scode}`, GREEN, RED);
    }
}

module.exports = Console;