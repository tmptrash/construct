/**
 * Plugin for adding getter and setter to Manager's API
 *
 * @author flatline
 */
const Api = require('./../../share/Config').api;

class Config {
    constructor(manager) {
        manager.api.setConfig = Api.set.bind(Api);
        manager.api.getConfig = Api.get.bind(Api);
    }
}

module.exports = Config;