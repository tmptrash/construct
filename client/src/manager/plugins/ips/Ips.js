/**
 * Shows and updates IPS value at the left top screen corner. I mean in
 * a word's canvas.
 *
 * Configuration:
 *   {Boolean} show Shows/Hides IPS value at the top-left corner
 *   {Number}  periodMs Period of milliseconds, which is user for checking
 *             IPS value. It's possible to increase it to reduce amount of
 *             requests and additional jsvm in main loop
 *
 * @author flatline
 */
const Configurable = require('./../../../../../common/src/global/Configurable');
const Helper       = require('./../../../../../common/src/global/Helper');
const Config       = require('./../../../global/Config').Config;
const IpsConfig    = require('./Config');
const EVENTS       = require('./../../../global/Events').EVENTS;

class Ips extends Configurable {
    constructor(manager) {
        super(manager, {Config, cfg: IpsConfig}, {show: ['_show', 'Shows IPS of the world']});
        this._stamp         = Date.now();
        this._onIterationCb = this._onIteration.bind(this);

        Helper.override(manager, 'onIteration', this._onIterationCb);
    }

    destroy() {
        Helper.unoverride(this.parent, 'onIteration', this._onIterationCb);
        this._onIterationCb = null;
    }

    _onIteration(counter, stamp) {
        if (!this.cfg.show) {return}
        const ts   = stamp - this._stamp;
        if (ts < this.cfg.periodMs) {return}
        const man  = this.parent;
        let   ips  = man.codeRuns / man.organisms.size / (ts / 1000);

        man.fire(EVENTS.IPS, ips, man.organisms);
        man.codeRuns = 0;
        this._stamp  = stamp;
    }

    _show(show = true) {
        this.cfg.show = show;
    }
}

module.exports = Ips;