/**
 * Plugins manager. Adds plugins into specified instance and destroy
 * them on parent destroy. This class is also a plugin.
 *
 * @author flatline
 */
const Helper      = require('./../Helper');
const AsyncParent = require('./../plugins/AsyncParent');

class Plugins {
    /**
     * Creates plugin instances and adds them into target class instance
     * (parent). For this 'plugins' property will be created in parent.
     * @param {Object} parent Instance we inserting plugins to
     * Like this: {Api: Api,...}
     * @param {Object} cfg Plugin configuration
     *            {Boolean} async true if we have to wait async plugins
     *            {Function} onRun Callback, which is called if run/stop is complete
     *            {Object} plugins Map of names and classes/functions of plugins.
     */
    constructor(parent, cfg = {}) {
        const parentPlugins = parent.plugins = [];

        for (let p of cfg.plugins) {
            const path      = p.path || p;
            const name      = path.split('/').slice(-1)[0];
            let   pluginCls = this.require(path);

            parentPlugins.push(new (pluginCls[name] || pluginCls)(parent, p.cfg || {}));
        }

        this.parent       = parent;
        this._onDestroyCb = this._onDestroy.bind(this);
        this._async       = cfg.async && new AsyncParent(parent, {run: true, onRun: cfg.onRun});

        Helper.override2(parent, 'destroy', this._onDestroyCb);
    }

    /**
     * Is used to fix webpack disability to load dynamic modules with require()
     * @param {String} path Path to the module
     * @return {Function|Object} imported module
     */
    require(path) {
        return require(path);
    }

    /**
     * Is called if parent instance calls destroy() method. Here we
     * destroy all created plugins and the reference to this instance
     * in parent instance. It's important to remove all the plugins
     * ina reverse order to prevent infinite methods unoverride issue
     */
    _onDestroy() {
        const me        = this;
        const parent    = this.parent;
        const plugins   = parent && parent.plugins.slice().reverse();
        const onDestroy = () => {
            parent && (parent.plugins = null);
            Helper.unoverride(me.parent, 'destroy', me._onDestroyCb);
            me._async         = null;
            me._onDestroyCb   = null;
            me.parent         = null;
        };
        //
        // stop() hsould be called in destroy() methods
        //
        for (let p of plugins) {p.destroy && p.destroy()}
        //
        // Stop listening of asynchronous plugins. They destroy will
        // be later after success stopping
        //
        if (me._async) {
            me._async.stop();
            me._async.destroy(onDestroy);
        } else {
            onDestroy();
        }
    }
}

module.exports = Plugins;