/**
 * Helper for tests
 *
 * @author DeadbraiN
 */
export default class Helper {
    /**
     * Compares two arrays only on first level
     * @param {Array} arr1
     * @param {Array} arr2
     * @returns {Boolean}
     */
    static compare(arr1, arr2) {
        if (arr1.length !== arr2.length) {return false}
        return !arr1.some((a) => arr2.indexOf(a) === -1)
    }

    /**
     * Waiting for obj.done property to be true and calls cb() callback
     * after that. If property is not changed, then error will be thrown
     * @param {Object} obj Object with "done" property for waiting for
     * @param {Function} cb Finish callback
     * @param {Number} timeout Timeout in milliseconds
     */
    static waitFor(obj, cb, timeout = 10000) {
        obj.done = false;

        let times = 0;
        let id    = setInterval(() => {
            if (times > timeout / 50) {throw 'Waiting time is over'}
            if (obj.done) {
                clearInterval(id);
                cb();
            }
            times++;
        }, 50);
    }
}