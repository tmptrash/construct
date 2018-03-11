/**
 * Helper for tests
 *
 * @author flatline
 */
class Helper {
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

    /**
     * Runs all testing tasks of a queue one by one in a synchronous manner.
     * Testing task is another array of four or two elements - event parameters with
     * a function at the end. Four items array is used with waitEvent() and two
     * items array is used with wait()
     * @param {Function} done Done callback
     * @param {Array} queue Testing tasks
     */
    static testQ(done, ...queue) {
        const len     = queue.length;
        let   i       = 0;
        let   iterate = (q) => {
            if (q.length === 4) {
                Helper.waitEvent(q[0], q[1], q[2], () => {
                    q[3]();
                    i < len && iterate(queue[i++]) || done();
                });
            } else if (q.length === 2) {
                Helper.wait(q[0], () => {
                    q[1]();
                    i < len && iterate(queue[i++]) || done();
                });
            } else if (q.length === 1) {
                Helper.wait(q[0], () => {
                    i < len && iterate(queue[i++]) || done();
                });
            }

            return true;
        };

        len && iterate(queue[i++]) || done();
    }

    /**
     * Inserts script into specified organism. Code may be presented
     * as an array of numbers (native format) or as a binary string
     * of bits, e.g.: '10 00 01 10 00000010 1111111111'. Spaces will
     * be cut from this string.
     * @param {VM} vm Destination virtual machine
     * @param {Array} code Code we are inserting in
     */
    static script(vm, code) {
        for (let i = 0; i < code.length; i++) {vm.insertLine()}
        for (let i = 0; i < code.length; i++) {vm.updateLine(i, typeof code[i] === 'string' ? parseInt(code[i].split(' ').join(''), 2) : code[i])}
    }
}

module.exports = Helper;