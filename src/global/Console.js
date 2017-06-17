/**
 * Module for working with a browser console
 *
 * Usage:
 *   import Console from '.../Console';
 *   Console.msg('msg');
 *
 * @author DeadbraiN
 */
export const MODE_QUIET_ALL       = 0;
export const MODE_QUIET_IMPORTANT = 1;
export const MODE_QUIET_NO        = 2;

export default class Console {
    static msg(msg) {
        console.log(msg);
    }

    static mode(mode = MODE_QUIET_IMPORTANT) {
        this._mode = mode;
    }
}