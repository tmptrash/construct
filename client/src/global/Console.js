/**
 * Module for working with a browser console
 *
 * Usage:
 *   import Console from '.../Console';
 *   Console.msg('msg');
 *
 * @author flatline
 */
import {Config} from './../../../common/src/global/Config';

export default class Console {
    static error(...msg) {
        if (this._mode === Config.QUIET_NO) {return}
        console.log(`%c${msg.join('')}`, 'background: #fff; color: #aa0000');
    }
    static warn (...msg) {
        if (this._mode === Config.QUIET_NO) {return}
        console.log(`%c${msg.join('')}`, 'background: #fff; color: #cc7a00');
    }
    static info (...msg) {
        if (this._mode !== Config.QUIET_ALL) {return}
        console.log(`%c${msg.join('')}`, 'background: #fff; color: #1a1a00');
    }
    static mode (mode = Config.QUIET_IMPORTANT) {this._mode = mode}
}