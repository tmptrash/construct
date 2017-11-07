/**
 * The same like Plugins, but loads plugins from './server' folder and deeper
 *
 * @author flatline
 */
const Plugins = require('./Plugins');

class ServerPlugins extends Plugins {
    /**
     * Is used to fix webpack disability to load dynamic modules with require()
     * @param {String} path Path to the module
     * @return {Function|Object} imported module
     */
    require(path) {
        return require('./../../../server/' + path);
    }
}

module.exports = ServerPlugins;