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
        this._stamp       = 0;
        this._ips         = 0;
        this._ipsAmount   = 0;
        this._orgs        = 0;
        this._energy      = 0;
        this._codeSize    = 0;
        this._runLines    = 0;
        this._changes     = 0;
        this._fitness     = 0;
        this._fitnessMode = Config.codeFitnessCls !== null;

        manager.on(Events.IPS, this._onIps.bind(this));
        manager.on(Events.ORGANISM, this._onOrganism.bind(this));
    }

    _onIps(ips, orgs) {
        const stamp     = Date.now();

        this._onBeforeIps(ips, orgs);
        if (stamp - this._stamp < PERIOD) {return;}

        const amount    = this._ipsAmount || 1;
        const orgAmount = (this._orgs / amount) || 1;
        const sips      = ('ips:' + (this._ips      / amount).toFixed(this._ips  / amount < 10 ? 2 : 0)).padEnd(9);
        const slps      = ('lps:' + (this._runLines / amount).toFixed()).padEnd(14);
        const sorgs     = ('org:' + (orgAmount).toFixed()).padEnd(10);
        const senergy   = ('nrg:' + ((((this._energy   / amount) / orgAmount) / this._runLines) * 1000).toFixed(3)).padEnd(14);
        const schanges  = ('che:' + ((((this._changes  / amount) / orgAmount) / this._runLines) * 1000).toFixed(3)).padEnd(12);
        const sfit      = ('fit:' + ((((this._fitness  / amount) / orgAmount) / this._runLines) * 1000).toFixed(3)).padEnd(12);
        const scode     = ('cod:' + ((this._codeSize / amount) / orgAmount).toFixed(1)).padEnd(12);

        console.log(`%c${sips}${slps}${sorgs}%c${senergy}${schanges}${sfit}${scode}`, GREEN, RED);
        this._manager.canvas.text(5, 15, sips);
        this._onAfterIps(stamp);
    }

    _onOrganism(org) {
        this._runLines += (this._fitnessMode ? org.code.size : Config.codeYieldPeriod);
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
        this._changes   = 0;
        this._fitness   = 0;
    }

    _iterateOrganisms(orgs) {
        let item     = orgs.first;
        let energy   = 0;
        let codeSize = 0;
        let changes  = 0;
        let fitness  = 0;
        let org;

        while(item) {
            org = item.val;
            energy   += org.energy;
            codeSize += org.code.size;
            changes  += org.changes;
            fitness  += org.fitness();
            item = item.next;
        }

        this._energy   += energy;
        this._codeSize += codeSize;
        this._changes  += changes;
        this._fitness  += fitness;
    }
}