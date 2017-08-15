/**
 * Plugin for adding getter and setter to Manager's API
 *
 * @author DeadbraiN
 */
import GlobalConfig from './../../global/Config';

export default class Config {
    constructor(manager) {
        manager.api.setConfig = (key, val) => GlobalConfig[key] = val;
        manager.api.getConfig = (key)      => GlobalConfig[key];
    }
}