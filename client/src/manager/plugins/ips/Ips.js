/**
 * Shows and updates IPS value at the left top screen corner. I mean in
 * a word's canvas.
 *
 * Configuration:
 *   {Boolean} show Shows/Hides IPS value at the top-left corner
 *   {Number}  periodMs Period of milliseconds, which is user for checking
 *             IPS value. It's possible to increase it to reduce amount of
 *             requests and additional vm in main loop
 *
 * @author flatline
 */
const Configurable = require('./../../../../../common/src/Configurable');
const Helper       = require('./../../../../../common/src/Helper');
const Config       = require('./../../../share/Config').Config;
const IpsConfig    = require('./Config');
const EVENTS       = require('./../../../share/Events').EVENTS;

class Ips extends Configurable {
    constructor(manager) {
        super(manager, {Config, cfg: IpsConfig}, {show: ['_show', 'Shows IPS of the world']});
        this._stamp         = Date.now();
        this._ips           = 0;
        this._onLoopCb      = this._onLoop.bind(this);
        this._onIterationCb = this._onIteration.bind(this);

        Helper.override(manager, 'onLoop', this._onLoopCb);
        Helper.override(manager, 'onIteration', this._onIterationCb);
    }

    destroy() {
        Helper.unoverride(this.parent, 'onLoop', this._onLoopCb);
        Helper.unoverride(this.parent, 'onIteration', this._onIterationCb);
        this._onLoopCb      = null;
        this._onIterationCb = null;
        super.destroy();
    }

    _onLoop(counter, stamp) {
        if (!this.cfg.show) {return}
        const ts = stamp - this._stamp;
        if (ts < this.cfg.periodMs) {return}

        this.parent.fire(EVENTS.IPS, this._ips / (ts / 1000));
        this._ips   = 0;
        this._stamp = stamp;
    }

    _onIteration() {this._ips++}

    _show(show = true) {
        this.cfg.show = show;
    }
}

module.exports = Ips;