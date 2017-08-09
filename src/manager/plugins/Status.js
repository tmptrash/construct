/**
 * Shows console status of application
 *
 * @author DeadbraiN
 */
import Events from './../../global/Events';
import Config from './../../global/Config';

const GREEN  = 'color: #00aa00';
const RED    = 'color: #aa0000';
const PERIOD = 10000;

export default class {
    constructor(manager) {
        this._manager = manager;
        this._stamp     = 0;
        this._ips       = 0;
        this._ipsAmount = 0;
        this._orgs      = 0;
        this._energy    = 0;
        this._codeSize  = 0;
        this._runLines  = 0;

        manager.on(Events.IPS, this._onIps.bind(this));
        manager.on(Events.ORGANISM, this._onOrganism.bind(this));
    }

    _onIps(ips, orgs) {
        const amount    = this._ipsAmount || 1;
        const orgAmount = (this._orgs / amount) || 1;
        const sips      = ('ips:' + (this._ips      / amount).toFixed(this._ips  / amount < 10 ? 2 : 0)).padEnd(9);
        const slps      = ('lps:' + (this._runLines / amount).toFixed()).padEnd(12);
        const sorgs     = ('org:' + (orgAmount).toFixed()).padEnd(9);
        const senergy   = ('nrg:' + ((this._energy   / amount) / orgAmount).toFixed()).padEnd(11);
        const scode     = ('cod:' + ((this._codeSize / amount) / orgAmount).toFixed(1)).padEnd(12);
        const stamp     = Date.now();

        this._onBeforeIps(ips, orgs);
        if (stamp - this._stamp < PERIOD) {return;}

        console.log(`%c${sips}${slps}${sorgs}%c${senergy}${scode}`, GREEN, RED);
        this._manager.canvas.text(5, 15, sips)
        this._onAfterIps(stamp);
    }

    _onOrganism(org) {
        this._runLines += Config.codeYieldPeriod;
    }

    _onBeforeIps(ips, orgs) {
        this._ips  += ips;
        this._orgs += orgs.size;

        this._ipsAmount++;
        this._iterateOrganisms(orgs);
    }

    _onAfterIps(stamp) {
        this._ips       = 0;
        this._ipsAmount = 0;
        this._orgs      = 0;
        this._energy    = 0;
        this._codeSize  = 0;
        this._stamp     = stamp;
        this._runLines  = 0;
    }

    _iterateOrganisms(orgs) {
        let item     = orgs.first;
        let energy   = 0;
        let codeSize = 0;

        while(item) {
            energy   += item.val.energy;
            codeSize += item.val.code.size;
            item = item.next;
        }

        this._energy   += energy;
        this._codeSize += codeSize;
    }
}