/**
 * Plugins manager for Client class. Because of webpack behavior,
 * we have to set hard coded path in require() method. For this,
 * we have to have plugins managers for every class, which need it.
 *
 * @author flatline
 */
const Plugins = require('./../../../../../../common/src/global/Plugins');

class ClientPlugins extends Plugins {
    /**
     * Is used to fix webpack disability to load dynamic modules with require()
     * @param {String} path Path to the module
     * @return {Function|Object} imported module
     */
    require(path) {
        try {
            return require('./../../../../../../client/' + path);
        } catch (e) {
            return require('./../../../../../../common/' + path);
        }
    }
}

module.exports = ClientPlugins;