/**
 * Calculates IPS (Iterations Per Second) value.
 *
 * Events of Manager:
 *   IPS(ips)      Fires if IPS has changed
 *
 * Depends on:
 *   manager/Manager
 *   manager/plugins/Organisms
 *
 * @author DeadbraiN
 */
import Helper  from './../../global/Helper';
import Events  from './../../global/Events';
import Config  from './../../global/Config';
import Console from './../../global/Console';

export default class Ips {
    constructor(manager) {
        this._manager       = manager;
        this._stamp         = Date.now();
        this._orgs          = manager.get('orgs');
        this._onIterationCb = this._onIteration.bind(this);

        Helper.override(manager, 'onIteration', this._onIterationCb);
    }

    destroy() {
        Helper.unoverride(this._manager, 'onIteration', this._onIterationCb);
    }

    /**
     * Override of Manager.onIteration() method. Is called on every
     * iteration of main loop. The counter is an analog of time.
     * @param {Number} counter Value of main loop counter.
     * @param {Number} stamp Time stamp of current iteration
     * @private
     */
    _onIteration(counter, stamp) {
        const ts   = stamp - this._stamp;
        if (ts < Config.worldIpsPeriodMs) {return;}
        const man  = this._manager;
        const orgs = this._orgs.size;

        let   ips;
        ips = man.get('codeRuns') / orgs / (ts / 1000);
        Console.warn('ips: ', ips);
        man.fire(Events.IPS, ips);
        man.set('codeRuns',  0);
        this._stamp  = stamp;
    }
}