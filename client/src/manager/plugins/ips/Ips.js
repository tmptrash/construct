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

class Ips extends Configurable {
    constructor(manager) {
        super(manager, {Config, cfg: IpsConfig}, {show: ['_show', 'Shows IPS of the world']});
        this._stamp    = Date.now();
        this._onLoopCb = this._onLoop.bind(this);

        Helper.override(manager, 'onLoop', this._onLoopCb);
    }

    destroy() {
        Helper.unoverride(this.parent, 'onLoop', this._onLoopCb);
        this._onLoopCb = null;
        super.destroy();
    }

    _onLoop(counter, stamp) {
        if (!this.cfg.show) {return}
        const ts   = stamp - this._stamp;
        if (ts < this.cfg.periodMs) {return}
        const man  = this.parent;
        //let   ips  = man.codeRuns / (man.organisms.size || 1) / (ts / 1000);

        //man.fire(EVENTS.IPS, ips, man.organisms);
        //man.codeRuns = 0;
        this._stamp  = stamp;
    }

    _show(show = true) {
        this.cfg.show = show;
    }
}

module.exports = Ips;