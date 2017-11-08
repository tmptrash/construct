/**
 * Plugin for adding getter and setter to Manager's API
 *
 * @author flatline
 */
const Api = require('./../../../../common/src/Config');

class Config {
    constructor(manager) {
        manager.api.setConfig = Api.set;
        manager.api.getConfig = Api.get;
    }
}

module.exports = Config;