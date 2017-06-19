/**
 * Module for working with a browser console
 *
 * Usage:
 *   import Console from '.../Console';
 *   Console.msg('msg');
 *
 * @author DeadbraiN
 */
const MODE_QUIET_ALL       = 0;
const MODE_QUIET_IMPORTANT = 1;
const MODE_QUIET_NO        = 2;

export default class Console {
    static get MODE_QUIET_ALL()       {return MODE_QUIET_ALL;}
    static get MODE_QUIET_IMPORTANT() {return MODE_QUIET_IMPORTANT;}
    static get MODE_QUIET_NO()        {return MODE_QUIET_NO;}

    static error(msg) {
        if (this._mode === MODE_QUIET_NO) {return;}
        console.log(`%c${msg}`, 'background: #fff; color: #aa0000');
    }
    static warn (msg) {
        if (this._mode === MODE_QUIET_NO) {return;}
        console.log(`%c${msg}`, 'background: #fff; color: #cc7a00');
    }
    static info (msg) {
        if (this._mode !== MODE_QUIET_ALL) {return;}
        console.log(`%c${msg}`, 'background: #fff; color: #1a1a00');
    }
    static mode (mode = MODE_QUIET_IMPORTANT) {this._mode = mode;}
}