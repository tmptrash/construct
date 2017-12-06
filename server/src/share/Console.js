/**
 * Console class for working on a server side in a terminal window.
 *
 * @author flatline
 */
class Console {
    static error(...msg) {console.log('%s \x1b[31m%s\x1b[0m', this._time(), msg.join(''))}
    static warn (...msg) {console.log('%s \x1b[33m%s\x1b[0m', this._time(), msg.join(''))}
    static info (...msg) {console.log('%s \x1b[32m%s\x1b[0m', this._time(), msg.join(''))}
    static _time() {
        const date = new Date;

        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
}

module.exports = Console;