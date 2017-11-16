/**
 * Plugin, which implement 'parent' logic for children of `AsyncChild` classes.
 * Fires two events `RUN` and `STOP`. If class is ready and all it's children
 * are also ready then `RUN` event will be fired. The same for `STOP`. Generally
 * speaking we need to know when some class (AsyncParent) is ready (RUN event)
 * and when it has stopped (STOP event). This actual for Client or Server, where
 * start and stop is asynchronous process and we have to wait some time until
 * they finish running/stopping. This plugin works as a part of other plugin -
 * `Plugins`. See it's code for details.
 *
 * @author flatline
 */
/**
 * {Number} Amount of milliseconds we are waiting for one plugin to start or
 * stop. In case of timeout exception will be thrown.
 */
const WAIT_TIMEOUT_MS   = 10000;
const CHECK_INTERVAL_MS = 50;

class AsyncParent {
    constructor(parent, cfg = {}) {
        this._parent     = parent;
        this._cfg        = cfg;
        this._plugins    = parent.plugins;
        this._destroying = false;
        this._done       = null;
        /**
         * {Object} map of class instances, which are waiting for running or
         * stopping at the moment. Is used in `this.run()` and `this.stop()`.
         * `id` is a time stamp of the beginning of running/stopping, `value`
         * is an unique id of interval, which check it's ready state.
         */
        this._waitMap    = {};
    }

    run(done = () => {})  {this._runWaiting(true, done)}
    stop(done = () => {}) {this._runWaiting(false, done)}

    destroy(done = () => {}) {
        this._done = done || (() => {});
        if (this._hasWaiters()) {
            this._destroying = true;
            return;
        }
        this._waitMap    = {};
        this._parent     = null;
        this._plugins    = null;
        this._destroying = false;
        this._done();
        this._done       = null;
    }

    _runWaiting(run, done) {
        if (this._hasWaiters()) {
            throw `You are trying to ${run ? 'run' : 'stop'} ${this._parent.constructor.name}, but it still running or stopping`;
        }
        const plugins = this._plugins;
        const waitMap = this._waitMap = {};

        for (let p of plugins) {
            if (p.isAsync) {
                const id    = Date.now();
                waitMap[id] = setInterval(this._onInterval.bind(this, id, p, run, done), CHECK_INTERVAL_MS);
            }
        }
        if (!this._hasWaiters()) {this._onDone(run, done)}
    }

    _onInterval(id, plugin, run, done) {
        if (plugin.isFailed() || plugin.isActive() === run) {this._clearWaiter(id)}
        if (!this._hasWaiters()) {return this._onDone(run, done)}
        if (Date.now() - id > WAIT_TIMEOUT_MS) {
            this._clearWaiter(id);
            throw `Async waiting timeout. Plugin: ${plugin.constructor.name}`;
        }
    }

    _clearWaiter(id) {
        clearInterval(this._waitMap[id]);
        delete this._waitMap[id];
    }

    _hasWaiters() {
        return Object.keys(this._waitMap).length > 0;
    }

    _onDone(run, done) {
        this._cfg.run && this._cfg.run(run);
        done();
        this._destroying && this.destroy();
    }
}

module.exports = AsyncParent;