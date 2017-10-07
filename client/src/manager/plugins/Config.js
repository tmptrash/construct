/**
 * Plugin for adding getter and setter to Manager's API
 *
 * @author flatline
 */
import {api} from '../../../../common/src/global/Config';

export default class Config {
    constructor(manager) {
        manager.api.setConfig = api.set;
        manager.api.getConfig = api.get;
    }
}