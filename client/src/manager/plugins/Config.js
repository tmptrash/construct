/**
 * Plugin for adding getter and setter to Manager's API
 *
 * @author flatline
 */
const api = require('./../../global/Config').api;

class Config {
    constructor(manager) {
        manager.api.setConfig = api.set;
        manager.api.getConfig = api.get;
    }
}

module.exports = Config;