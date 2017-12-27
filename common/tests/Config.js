/**
 * Helper class for managing different configurations. It's useful
 * for setting temporary config parameters to config object and resetting
 * them later back. Is used in tests.
 *
 * Usage:
 *   CConfig.prop = 1;
 *   const cfg = new Config(CConfig); // CConfig.prop = 1
 *   cfg.set('prop', 2);
 *
 * @author flatline
 */
const _set   = require('lodash/set');
const _get   = require('lodash/get');
const _merge = require('lodash/merge');

class Config {
    constructor(cfgObj) {
        this._tmpCfg = {};
        this._cfg    = cfgObj;
    }

    set(prop, val) {
        const tmpCfg = this._tmpCfg;
        const cfg    = this._cfg;

        _get(tmpCfg, prop) === undefined && _set(tmpCfg, prop, _get(cfg, prop));
        _set(cfg, prop, val);
    }

    reset() {
        _merge(this._cfg, this._tmpCfg);
        this._tmpCfg = {};
    }
}

module.exports = Config;