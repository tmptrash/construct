/**
 * Console class for working on a server side in a terminal window.
 *
 * @author flatline
 */
class Console {
    static error(...msg) {console.log('\x1b[31m%s\x1b[0m', msg.join(''))}
    static warn (...msg) {console.log('\x1b[33m%s\x1b[0m', msg.join(''))}
    static info (...msg) {console.log('\x1b[37m%s\x1b[0m', msg.join(''))}
}

module.exports = Console;