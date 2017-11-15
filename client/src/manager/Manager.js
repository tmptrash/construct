/**
 * Main manager class of application. Contains all parts of jevo.js app
 * like World, Connection, Console etc... Runs infinite loop inside run()
 * method.
 *
 * Usage:
 *   const Manager = require('.../Manager');
 *   const manager = new Manager();
 *   manager.run();
 *
 * @author flatline
 * TODO: what about destroy of manager instance? We have to destroy plugins
 * TODO: by calling of destroy() method for every of them
 */
const Observer         = require('./../../../common/src/Observer');
const Queue            = require('./../../../common/src/Queue');
const Config           = require('./../share/Config').Config;
const Plugins          = require('./Plugins');
const EVENTS           = require('./../share/Events').EVENTS;
const EVENT_AMOUNT     = require('./../share/Events').EVENT_AMOUNT;
const Console          = require('./../share/Console');
const World            = require('./../view/World').World;
const WEVENTS          = require('./../view/World').EVENTS;
const Canvas           = require('./../view/Canvas');

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
        this._canvas       = hasView && new Canvas(Config.worldWidth, Config.worldHeight) || null;
        this._visualized   = true;
        this._running      = false;
        this._active       = false;
        this._stopping     = false;
        this._destroying   = false;
        this._clientId     = null;
        this._runCb        = () => {};
        this._stopCb       = () => {};
        /**
         * {Array} Array of four bool elements (four sides), which stores activeness
         * of up, right, down and left near Managers (maps). If side is active, then
         * organisms may go there out of borders.
         */
        this._activeAround = [false, false, false, false];
        this._onLoopCb     = this._onLoop.bind(this);
        /**
         * {Object} This field is used as a container for public API of the Manager.
         * It may be used in a user console by the Operator of jevo.js. Plugins
         * may add their methods to this map also.
         */
        this.api           = {
            version: () => '2.0'
        };
        hasView && (this.api.visualize = this._visualize.bind(this));

        this._initLoop();
        this._addHandlers();
        //
        // Plugins creation should be at the end of initialization to
        // have an ability access Manager's API from them
        //
        this._plugins      = new Plugins(this, {
            plugins: Config.plugIncluded,
            async  : true,
            onRun  : this._onDone.bind(this)
        });
    }
    get world()        {return this._world}
    get canvas()       {return this._canvas}
    get clientId()     {return this._clientId}
    get activeAround() {return this._activeAround}
    get active()       {return this._active}
    get codeRuns()     {return this._codeRuns}

    set codeRuns(cr)   {this._codeRuns = cr}

    /**
     * Runs main infinite loop of application
     */
    run (done = () => {}) {
        if (this._active || this._running) {return}
        if (this._stopping) {
            throw `Impossible to run Manager. It's still stopping.`;
        }
        this._running = true;
        this._runCb   = done;
        Console.info('Manager is running...');
    }

    stop(done = () => {}) {
        if (!this._active || this._stopping) {return}
        if (this._running) {
            throw `Impossible to stop Manager. It's still running.`;
        }
        this._active   = false;
        this._stopping = true;
        this._stopCb   = done;
        Console.info('Manager is stopping...');
    }

    setClientId(id) {
        this._clientId = id;
    }

    /**
     * Is called on every iteration in main loop. May be overridden in plugins
     * @param {Number} counter Global counter as an analog of time
     * @param {Number} stamp UNIX time stamp
     */
    onIteration(counter, stamp) {
        this.fire(EVENTS.ITERATION);
    }

    hasOtherClients() {
        return this._activeAround.indexOf(true) !== -1;
    }

    destroy() {
        if (this._active) {
            this.stop();
            this._destroying = true;
            return;
        }
        this._world.destroy();
        this._hasView && this._canvas.destroy();
        this.organisms.destroy();
        this._activeAround = null;
        this.organisms     = null;
        this.positions     = null;
        this._onLoopCb     = null;
        this._active       = false;
        this._running      = false;
        this._stopping     = false;
        this._destroying   = false;
        //
        // Plugins is destroyed itself. We don't need to call this._plugins.destroy()
        //
        this._plugins      = null;
        this.api           = null;

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

            if (!this._hasView) {
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
        //
        // This conditions id needed for turned on visualization mode to
        // prevent flickering of organisms in a canvas. It makes their
        // movement smooth
        //
        const amount  = this._visualized ? 1 : Config.codeIterationsPerOnce;
        const timer   = Date.now;
        let   counter = this._counter;

        for (let i = 0; i < amount; i++) {
            this.onIteration(counter++, timer());
        }
        this._counter = counter;
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
            this._runCb();
            this._onLoop();
            return;
        }

        Console.info('Manager has stopped');
        this._stopping = false;
        this._stopCb();
        this._destroying && this.destroy();
    }
}

module.exports = Manager;