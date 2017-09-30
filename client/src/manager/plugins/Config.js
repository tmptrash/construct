/**
 * Plugin for adding getter and setter to Manager's API
 *
 * @author flatline
 */
import {api} from '../../../../src/global/Config';

export default class Config {
    static version() {
        return '0.1';
    }

    constructor(manager) {
        manager.api.setConfig = api.set;
        manager.api.getConfig = api.get;
    }
}