/**
 * Configuration class implementation. Stores custom configuration
 * inside and has an ability to change options of config in real time
 * using set() and get() methods. init() method should be called first.
 *
 * @author flatline
 */
const _get   = require('lodash/get');
const _set   = require('lodash/set');
const EVENTS = require('./../../client/src/share/Events').EVENTS;

class Config {
    static init(cfg) {
        this._cfg = cfg;
    }

    /**
     * Sets value into the config. key may be composite string like:
     * 'organisms.orgMaxOrgs'.
     * @param {String} key
     * @param {*} val
     * @returns {Config}
     */
    static set(key, val) {
        _set(this._cfg, key, val);
        man.fire(EVENTS.CONFIG_CHANGE, key, val);
        return this;
    }

    /**
     * Gets value of specified config key. key may be composite like:
     * 'organisms.orgMaxOrgs'.
     * @param {String} key
     * @returns {*}
     */
    static get(key) {
        return _get(this._cfg, key);
    }

    static cfg() {
        return this._cfg;
    }
}

module.exports = Config;