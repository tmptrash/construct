/**
 * Plugins manager. Adds plugins into specified instance and destroy
 * them on parent destroy. This class is also a plugin.
 *
 * @author slackline
 */
const Helper = require('./Helper');

class Plugins {
    /**
     * Creates plugin instances and adds them into target class instance
     * (parent). For this 'plugins' property will be created in parent.
     * @param {Object} parent Instance we inserting plugins to
     * @param {Object} plugins Map of names and classes/functions of plugins.
     * Like this: {Api: Api,...}
     * @param {Boolean} destroy If true, then onDestroy() method will be
     * called, when parent.destroy() is called.
     */
    constructor(parent, plugins, destroy = true) {
        const parentPlugins = parent.plugins = {};

        for (let p in plugins) {
            parentPlugins[p] = new plugins[p](parent);
        }

        this.parent      = parent;
        this._onDestroyCb = this.onDestroy.bind(this);
        this._destroy     = destroy;
        this._destroyed   = false;

        Helper.override(parent, 'destroy', this._onDestroyCb);
    }

    /**
     * Is called if parent instance calls destroy() method. Here we
     * destroy all created plugins and the reference to this instance
     * in parent instance. This method may be called by hands from
     * parent instance also. It's impossible to call this method more
     * then one time.
     */
    onDestroy() {
        if (this._destroyed) {return}
        //
        // User doesn't want to automatic destroy of plugins.
        // He will call this method manually, later.
        //
        if (this._destroy) {
            const plugins = this.parent.plugins;
            for (let p in plugins) {
                plugins.hasOwnProperty(p) && plugins[p].destroy && plugins[p].destroy();
            }
        }
        this.parent.plugins = null;
        this._onDestroyCb   = null;
        this.parent         = null;
        this._destroyed     = true;
    }
}

module.exports = Plugins;