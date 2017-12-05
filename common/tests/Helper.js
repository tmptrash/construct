/**
 * Helper for tests
 *
 * @author flatline
 */
class Helper {
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
    static wait(obj, cb, timeout = 10000) {
        obj.done = false;

        let times = 0;
        let id    = setInterval(() => {
            if (times > timeout / 50) {
                clearInterval(id);
                throw 'Waiting time is over';
            }
            if (obj.done) {
                clearInterval(id);
                cb();
            }
            times++;
        }, 50);
    }

    /**
     * Similar to wait(), but waits for 'event' of object 'obj'. If event
     * occurs, then calls 'cb' callback. In case of three parameters, preCb
     * will be a callback (cb).
     * @param {Object} obj Object, which fires 'event' event
     * @param {Number} event Event id
     * @param {Function} preCb Pre callback. Is called before waiting
     * @param {Function} cb Callback, which is called on event occurs
     */
    static waitEvent(obj, event, preCb, cb = null) {
        const waitObj = {done: false};
        const eventCb = () => waitObj.done = true;
        const waitCb  = () => {obj.off(event, eventCb); cb(); return true};

        !cb && (cb = preCb) && (preCb = () => {});
        obj.on(event, eventCb);
        preCb();

        waitObj.done && waitCb() || Helper.wait(waitObj, waitCb);
    }
}

module.exports = Helper;