/**
 * Main manager class of application. Contains all parts of construct app
 * like World, Client, Console etc... Runs infinite loop inside run()
 * method. You may run and stop the manager as many times you need.
 * Manager runs/stops and destroys in a asynchronous way. So you may set
 * a callback to these methods, which will be called on finish.
 *
 * Usage:
 *   const Manager = require('.../Manager');
 *   const manager = new Manager();
 *   manager.run();
 *
 * @author flatline
 */
const Observer         = require('./../../../common/src/Observer');
const Queue            = require('./../../../common/src/Queue');
const Config           = require('./../share/Config').Config;
const OConfig          = require('./plugins/organisms/Config');
const Plugins          = require('./Plugins');
const EVENTS           = require('./../share/Events').EVENTS;
const EVENT_AMOUNT     = require('./../share/Events').EVENT_AMOUNT;
const Console          = require('./../share/Console');
const World            = require('./../view/World').World;
const WEVENTS          = require('./../view/World').EVENTS;
const Canvas           = require('./../view/Canvas');
/**
 * {Function} Shortcut to the datetime stamp getter
 */
const TIMER            = Date.now;

class Manager extends Observer {
    /**
     * Creates manager instance. May or may not contain view(canvas). If there
     * is no view, then everything will be done in a memory only
     * @param {Boolean} hasView Means that this manager contains view(canvas)
     */
    constructor(hasView = true) {
        super(EVENT_AMOUNT);
        /**
         * {Queue} Queue of organisms in current Manager. Should be used by plugins.
         * Organisms plugin walk through this queue and run organism's code all the
         * time.
         */
        this.organisms     = new Queue();
        /**
         * {Object} positions of organisms in a world. Is used to prevent collisions
         * and track all world objects
         */
        this.positions     = {};
        /**
         * {Object} This field is used as a container for public API of the Manager.
         * It may be used in a user console by the Operator of construct. Plugins
         * may add their methods to this map also.
         */
        this.api           = {version: () => '0.2.1'};
        hasView && (this.api.visualize = this._visualize.bind(this));

        /**
         * {Boolean} Means that this manager instance doesn't contain view(canvas).
         * All calculations will be done only in memory.
         */
        this._hasView      = hasView;
        /**
         * {Number} Amount of organism's code runs. codeRuns++ will occur after last
         * code line will done. May be changed in plugins.
         */
        this._codeRuns     = 0;

        this._world        = new World(Config.worldWidth, Config.worldHeight);
        this._canvas       = hasView && new Canvas(Config.worldWidth, Config.worldHeight, Config.worldNoScrolls) || null;
        this._visualized   = true;
        this._running      = false;
        this._active       = false;
        this._stopping     = false;
        this._destroying   = false;
        this._clientId     = null;
        this._onLoopCb     = this._onLoop.bind(this);
        /**
         * {Array} Array of four bool elements (four sides), which stores activeness
         * of up, right, down and left near Managers (maps). If side is active, then
         * organisms may go there out of borders.
         */
        this._activeAround = [false, false, false, false];

        this._initLoop();
        this._addHandlers();
        //
        // Plugins creation should be at the end of initialization to
        // have an ability access Manager's API from them
        //
        this._plugins      = new Plugins(this, {
            plugins  : Config.plugIncluded,
            async    : true,
            run      : this._onDone.bind(this),
            isBrowser: !Config.MODE_NODE_JS
        });
    }

    get world()        {return this._world}
    get canvas()       {return this._canvas}
    get clientId()     {return this._clientId}
    get activeAround() {return this._activeAround}
    get active()       {return this._active}
    get codeRuns()     {return this._codeRuns}

    set codeRuns(cr)   {this._codeRuns = cr}
    set clientId(id)   {this._clientId = id}

    /**
     * Runs main infinite loop of application. It also runs all the plugins
     * @param {Function} done Done callback
     */
    run (done = () => {}) {
        if (this._active || this._running) {return}
        if (this._stopping) {
            throw `Impossible to run Manager. It's still stopping.`;
        }
        this._running = true;
        Console.info('Manager is running...');
    }

    /**
     * Stops infinite loop of application. It also stops all the plugins
     * @param {Function} done Done callback
     */
    stop(done = () => {}) {
        if (!this._active || this._stopping) {return}
        if (this._running) {
            throw `Impossible to stop Manager. It's still running.`;
        }
        this._active   = false;
        this._stopping = true;
        this._hasView && this._visualize(false);
        Console.info('Manager is stopping...');
    }

    /**
     * Is called on every iteration in main loop. May be overridden in plugins
     * @param {Number} counter Global counter as an analog of time
     * @param {Number} stamp UNIX time stamp
     */
    onIteration(counter, stamp) {
        this.fire(EVENTS.ITERATION);
    }

    /**
     * Is called after all iterations
     * @param {Number} counter Global counter as an analog of time
     * @param {Number} stamp UNIX time stamp
     */
    onLoop(counter, stamp) {
        this.fire(EVENTS.LOOP);
    }

    /**
     * Returns true if at least one other Manager/client is around and is connected
     * to the current
     * @returns {Boolean}
     */
    isDistributed() {
        return this._activeAround.indexOf(true) !== -1;
    }

    /**
     * Resets active around clients/Managers. It means, that connection with
     * server has closed or interrupted
     */
    resetActive() {
        for (let i = 0, active = this._activeAround, len = active.length; i < len; i++) {active[i] = false}
    }

    destroy(done = () => {}) {
        if (this._active || this._stopping)  {
            this._destroying = true;
            return;
        }
        //
        // Plugins is destroyed itself. We don't need to call this._plugins.destroy()
        //
        this._plugins      = null;
        this._activeAround = null;
        this._onLoopCb     = null;
        this._clientId     = null;
        this._destroying   = false;
        this._stopping     = false;
        this._active       = false;
        this._running      = false;
        this._hasView && this._canvas.destroy();
        this._canvas       = null;
        this._world.destroy();
        this._world        = null;
        this.api           = null;
        this._codeRuns     = 0;
        this.positions     = null;
        this.organisms.destroy();
        this.organisms     = null;
        //
        // destroy event should be fired before super will be called, because
        // it will remove observer and all events
        //
        this.fire(EVENTS.DESTROY);
        super.destroy();
    }

    /**
     * This hacky function is obtained from here: https://dbaron.org/log/20100309-faster-timeouts
     * It runs a setTimeout() based infinite loop, but faster, then simply using native setTimeout().
     * See this article for details.
     * @return {Boolean} Initialization status. false if function has already exist
     * @hack
     */
    _initLoop() {
        //
        // Only adds zeroTimeout to the Manager object, and hides everything
        // else in a closure.
        //
        (() => {
            let callback;

            if (Config.MODE_NODE_JS) {
                this.zeroTimeout = (fn) => setTimeout(callback = fn);
                return;
            }

            const msgName = 'm';

            window.addEventListener('message', (event) => {
                if (event.data === msgName) {
                    event.stopPropagation();
                    if (!this._active) {return}
                    callback();
                }
            }, true);
            //
            // Like setTimeout, but only takes a function argument. There's
            // no time argument (always zero) and no arguments (you have to
            // use a closure)
            //
            this.zeroTimeout = (fn) => {
                callback = fn;
                window.postMessage(msgName, '*');
            };
        })();

        return true;
    }

    /**
     * Is called every time if new loop iteration is appeared. This is not the
     * same like onIteration() method. This one is for loop with many iterations
     * (onIteration()) inside by calling this.zeroTimeout().
     */
    _onLoop () {
        if (!this._active) {return}
        //
        // This conditions id needed for turned on visualization mode to
        // prevent flickering of organisms in a canvas. It makes their
        // movement smooth
        //
        let amount  = this._visualized ? 1 : OConfig.codeIterationsPerOnce;
        let counter = this._counter;
        let i;

        for (i = counter, amount = counter + amount; i < amount; i++) {
            this.onIteration(i, TIMER());
        }
        this.onLoop(this._counter = i, TIMER());
        this.zeroTimeout(this._onLoopCb);
    }

    _addHandlers() {
        this._hasView && this._world.on(WEVENTS.DOT, this._onDot.bind(this));
    }

    _visualize(visualized = true) {
        this._visualized = visualized;
        this._canvas.visualize(visualized);
    }

    _onDot(x, y, color) {
        this._canvas.dot(x, y, color);
    }

    /**
     * The real run entry point is in this method. It means, that all nested
     * components like plugins have run and Manager itself may run it's loop
     * @param {Boolean} run true - Run, false - stop
     */
    _onDone(run) {
        if (run) {
            Console.info('Manager has run');
            this._counter = 0;
            this._running = false;
            this._active  = true;
            this._onLoop();
            this.fire(EVENTS.RUN);
            return;
        }

        Console.info('Manager has stopped');
        this._stopping = false;
        this.fire(EVENTS.STOP);
        this._destroying && this.destroy();
    }
}

module.exports = Manager;