/**
 * Console class for working on a server side in a terminal window.
 *
 * @author flatline
 */
class Console {
    static error(...msg) {console.log(this._time() + '\x1b[31m%s\x1b[0m', msg.join(''))}
    static warn (...msg) {console.log(this._time() + '\x1b[33m%s\x1b[0m', msg.join(''))}
    static info (...msg) {console.log(this._time() + '\x1b[37m%s\x1b[0m', msg.join(''))}
    static _time() {
        const date = new Date;

        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} `;
    }
}

module.exports = Console;