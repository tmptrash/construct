/**
 * Base class for other classes, which want to have their own config.
 * For example plugin "Ips.js" has configuration "show", which will be
 * added as a part of global configuration in Config.js under key "Ips".
 * It also has an API method 'show()', which will be added into global
 * API as:
 *   man.api.Ips.show().
 * See Ips plugin for details regarding API and configurations formats.
 *
 * Usage:
 *   import Config from './../Config'; // Client or Server global config
 *
 *   class Plugin extends Configurable {
 *     constructor(parent) {
 *       super(parent, {Config, cfg: {show: true}}, {show: ['_show', 'Shows something']});
 *     }
 *
 *     _show(show = true) {
 *       this.cfg.show = show;
 *       // your logic if needed
 *     }
 *   }
 *
 *   man.api.Plugin.show(false);            // hides something
 *   console.log(Config.Plugin.show);       // -> false
 *   console.log(man.api.Plugin.show.desc); // -> 'Shows something'
 *
 * @author flatline
 */
class Configurable {
    /**
     * See Ips plugin for details of configurations formats.
     * @param {Function} parent Parent class instance
     * @param {Boolean|Object} cfg Config of this class
     * @param {Boolean|Object} apiCfg API interface of this class
     */
    constructor(parent, cfg = false, apiCfg = false) {
        this._parent = parent;
        this._cfg    = cfg.cfg;

        cfg    && this._updateCfg(cfg);
        apiCfg && this._updateApi(apiCfg);
    }

    get parent() {return this._parent}
    get cfg()    {return this._cfg}

    destroy() {
        this._parent = null;
    }

    /**
     * Adds parent class related configuration into global configuration. cfg
     * parameter refers to the object in format:
     * {
     *   Config: Object, // Reference to the global configuration object
     *   cfg   : Object  // Reference to the parent class related configuration
     * }
     * @param {Object} cfg {Config: Object, cfg: Object}
     */
    _updateCfg(cfg) {
        const config = cfg.Config;
        const cls    = this.constructor.name;

        if (typeof config[cls] !== 'undefined') {
            throw `Looks like there are two plugins with the same name try to set their configuration. Name: ${cls}`;
        }

        config[cls] = cfg.cfg;
    }

    /**
     * Adds class related API functions to global API. apiCfg May be in two
     * formats: String and Array. For example: '_show' or ['_show', 'description']
     * '_show' value means name of the method, which will be called if user call it
     * using api like this: man.api.<className>.show(). 'description' will be shown
     * if user types like this: man.api.<className>.show.desc.
     * @param {Object} apiCfg Object of name for key and String or Array for value
     * @private
     */
    _updateApi(apiCfg) {
        const api = this._parent.api;
        const cls = this.constructor.name;

        if (typeof api[cls] !== 'undefined') {
            throw `Looks like there are two plugins with the same name try to set their configuration. Name: ${cls}`;
        }

        api[cls] = this._prepareCfg(apiCfg);
    }

    _prepareCfg(cfg) {
        for (let c in cfg) {
            if (cfg.hasOwnProperty(c)) {
                const key   = cfg[c];
                const isStr = typeof key === 'string';
                let   desc  = isStr && 'No description' || key[1];

                cfg[c] = (isStr && this[key] || this[key[0]]).bind(this);
                cfg[c].desc = desc;
            }
        }

        return cfg;
    }
}

module.exports = Configurable;