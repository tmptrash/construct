/**
 * Abstract plugin class, which implements asynchronous behavior of
 * custom class. By asynchronous behavior i mean some abstract logic
 * of starting and stopping. For example, Client class uses such
 * logic in sense that it's starting longer, than other synchronous
 * classes and stops also a little bit longer, because of the connection
 * and disconnection. It adds special methods to the parent class, such
 * as: `isRunning()` and `isActive()`. The fact, that this plugin is used
 * means that parent class uses asynchronous logic. This class works in
 * pair with `AsyncParent`. Also, parent class may be failed. It means,
 * that at the moment plugin loose it's asynchronous nature and stay
 * synchronous. For this `isFailed()` method is used.
 *
 * @author flatline
 */
class AsyncChild {
    /**
     * Says it's active state to caller. Active state is a state of
     * running/stopping.
     * @return {Boolean}
     * @abstract
     */
    isActive() {return false}

    /**
     * Tells it's running state. If it's true, then `isActive()` will
     * return `false`. If it's `false` after `true` value, then `isActive()`
     * will return `true`
     * @return {Boolean}
     * @abstract
     */
    isRunning() {return false}

    /**
     * Tells it's running state. If it's true, then `isActive()` will
     * return `false`. If it's `false` after `true` value, then `isActive()`
     * will return `true`
     * @return {Boolean}
     * @abstract
     */
    isStopping() {return false}

    /**
     * Means, that current class has failed and we shouldn't wait for it's
     * asynchronous run or stop.
     * @returns {Boolean}
     * @abstract
     */
    isFailed() {return false}

    /**
     * Adds public methods like `isRunning()`, `isActive()` and so on to the
     * parent class
     * @param {Function} parent
     */
    constructor(parent) {
        this.parent       = parent;
        parent.isAsync    = true;
        parent.isFailed   = this.isFailed.bind(this);
        parent.isActive   = this.isActive.bind(this);
        parent.isRunning  = this.isRunning.bind(this);
        parent.isStopping = this.isStopping.bind(this);
    }

    destroy() {
        const parent = this.parent;

        delete parent.isAsync;
        delete parent.isFailed;
        delete parent.isActive;
        delete parent.isRunning;
        delete parent.isStopping;

        this.parent = null;

    }
}

module.exports = AsyncChild;