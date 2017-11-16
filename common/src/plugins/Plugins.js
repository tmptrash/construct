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
     *            {Function} run Callback, which is called if run/stop is complete
     *            {Object} plugins Map of names and classes/functions of plugins.
     */
    constructor(parent, cfg = {}) {
        this._createPlugins(parent, cfg);
        this.parent       = parent;
        this._onDestroyCb = this._onDestroy.bind(this);
        this._onRunCb  = this._onRun.bind(this);
        this._onStopCb = this._onStop.bind(this);

        Helper.override(parent, 'destroy', this._onDestroyCb);
        if (cfg.async) {
            Helper.override(parent, 'run', this._onRunCb);
            Helper.override(parent, 'stop', this._onStopCb);
            this._async = new AsyncParent(parent, {run: cfg.run});
        }
    }

    /**
     * Is used to fix webpack disability to load dynamic modules with require()
     * @param {String} path Path to the module
     * @return {Function|Object} imported module
     */
    require(path) {
        return require(path);
    }

    _onRun(done = () => {})  {this._async.run(done)}
    _onStop(done = () => {}) {this._async.stop(done)}

    _createPlugins(parent, cfg) {
        const parentPlugins = parent.plugins = [];

        for (let p of cfg.plugins) {
            const path      = p.path || p;
            const name      = path.split('/').slice(-1)[0];
            let   pluginCls = this.require(path);

            parentPlugins.push(new (pluginCls[name] || pluginCls)(parent, p.cfg || {}));
        }
    }

    /**
     * Is called if parent instance calls destroy() method. Here we
     * destroy all created plugins and the reference to this instance
     * in parent instance. It's important to remove all the plugins
     * ina reverse order to prevent infinite methods unoverride issue
     */
    _onDestroy(done = () => {}) {
        const me        = this;
        const parent    = this.parent;
        const plugins   = parent && parent.plugins.slice().reverse();
        const onDestroy = () => {
            parent && (parent.plugins = null);
            Helper.unoverride(parent, 'destroy', me._onDestroyCb);
            me._onDestroyCb   = null;
            if (me._async) {
                Helper.unoverride(parent, 'stop', this._onStopCb);
                Helper.unoverride(parent, 'run', this._onRunCb);
                me._async.destroy();
                me._async = null;
            }
            me._onRunCb       = null;
            me._onStopCb      = null;
            me.parent         = null;
            done();
        };
        //
        // stop() should be called in destroy() methods
        //
        for (let p of plugins) {p.destroy && p.destroy()}
        //
        // Stop listening of asynchronous plugins. They destroy will
        // be later after success stopping
        //
        me._async ? me._async.stop(onDestroy) : onDestroy();
    }
}

module.exports = Plugins;