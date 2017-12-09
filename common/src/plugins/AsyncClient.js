/**
 * Implements asynchronous interface of `AsyncChild` class for `Client'. See
 * `common/src/plugins/AsyncChild` class for details. It tracks client states
 * like 'running', 'stopping', 'failed' etc and adds appropriate methods to
 * parent: isRunning(), isStopping(),...
 *
 * @author flatline
 */
const AsyncChild = require('./AsyncChild');
const Helper     = require('./../Helper');

class AsyncClient extends AsyncChild {
    constructor(parent, cfg = null) {
        super(parent);
        const EVENTS    = parent.EVENTS;

        this._active    = false;
        this._running   = false;
        this._stopping  = false;
        this._failed    = false;
        this._openEvent = cfg && cfg.openEvent || EVENTS.GET_ID;

        this._onOpenCb  = this._onOpen.bind(this);
        this._onCloseCb = this._onClose.bind(this);
        this._onRunCb   = this._onRun.bind(this);
        this._onStopCb  = this._onStop.bind(this);

        parent.on(this._openEvent, this._onOpenCb);
        parent.on(EVENTS.CLOSE, this._onCloseCb);
        parent.on(EVENTS.DESTROY, this._onCloseCb);

        Helper.override(parent, 'run', this._onRunCb);
        Helper.override(parent, 'stop', this._onStopCb);
    }

    destroy() {
        const parent = this.parent;

        Helper.unoverride(parent, 'stop', this._onStopCb);
        Helper.unoverride(parent, 'run', this._onRunCb);

        parent.off(parent.EVENTS.OPEN, this._onOpenCb);
        parent.off(parent.EVENTS.CLOSE, this._onCloseCb);
        parent.off(parent.EVENTS.DESTROY, this._onCloseCb);

        this._onOpenCb  = null;
        this._onCloseCb = null;
        this._onRunCb   = null;
        this._onStopCb  = null;

        super.destroy();
    }

    /**
     * Says it's active state to caller. Active state is a state of
     * running/stopping.
     * @return {Boolean}
     * @override
     */
    isActive() {return this._active}

    /**
     * Tells it's running state. If it's true, then `isActive()` will
     * return `false`. If it's `false` after `true` value, then `isActive()`
     * will return `true`
     * @return {Boolean}
     * @override
     */
    isRunning() {return this._running}

    /**
     * Tells it's running state. If it's true, then `isActive()` will
     * return `false`. If it's `false` after `true` value, then `isActive()`
     * will return `true`
     * @return {Boolean}
     * @override
     */
    isStopping() {return this._stopping}

    /**
     * Means, that current class has failed and we shouldn't wait for it's
     * asynchronous run or stop.
     * @returns {Boolean}
     */
    isFailed() {return this._failed}

    _onOpen()    {this._active = true;  this._running  = false; this._failed = false}
    _onRun()     {this._active = false; this._running  = true}
    _onStop()    {this._active = false; this._stopping = true}
    _onClose()   {
        //
        // Error occurs at the beginning, before plugin has run. It means
        // that this plugin failed to start(run)
        //
        if (!this._active) {this._failed = true}
        this._active   = false;
        this._stopping = false;
    }
}

module.exports = AsyncClient;