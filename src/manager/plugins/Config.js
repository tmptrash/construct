/**
 * Plugin for adding getter and setter to Manager's API
 *
 * @author DeadbraiN
 */
import {api} from './../../global/Config';

export default class Config {
    static version() {
        return '1.0';
    }

    constructor(manager) {
        manager.api.setConfig = api.set;
        manager.api.getConfig = api.get;
    }
}