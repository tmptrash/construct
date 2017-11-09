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
const World            = require('./../view/World');
const Canvas           = require('./../view/Canvas');

class Manager extends Observer {
    /**
     * Is called on every iteration in main loop. May be overridden in plugins
     * @abstract
     */
    onIteration() {}

    constructor() {
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
         * {Number} Amount of organism's code runs. codeRuns++ will occur after last
         * code line will done. May be changed in plugins.
         */
        this._codeRuns     = 0;

        this._world        = new World(Config.worldWidth, Config.worldHeight);
        this._canvas       = new Canvas(Config.worldWidth, Config.worldHeight);
        this._stopped      = true;
        this._visualized   = true;
        this._clientId     = null;
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
        this.api         = {
            visualize: this._visualize.bind(this),
            version  : () => '2.0'
        };

        this._initLoop();
        this._addHandlers();
        //
        // Plugins creation should be at the end of initialization to
        // have an ability access Manager's API from them
        //
        this._plugins    = new Plugins(this, Config.plugIncluded);
    }
    get world()        {return this._world}
    get canvas()       {return this._canvas}
    get clientId()     {return this._clientId}
    get activeAround() {return this._activeAround}
    get stopped()      {return this._stopped}
    get codeRuns()     {return this._codeRuns}

    set codeRuns(cr)   {this._codeRuns = cr}

    /**
     * Runs main infinite loop of application
     */
    run () {
        if (!this._stopped) {return}
        Console.info('Manager has run');
        this._counter = 0;
        this._stopped = false;
        this._onLoop();
    }

    stop() {
        this._stopped = true;
        this._counter = 0;
        Console.info('Manager has stopped');
    }

    setClientId(id) {
        this._clientId = id;
    }

    hasOtherClients() {
        return this._activeAround.indexOf(true) !== -1;
    }

    destroy() {
        this._world.destroy();
        this._canvas.destroy();
        for (let org of this.organisms) {org.destroy()}
        this.organisms.destroy();
        this.organisms = null;
        this.positions = null;
        this._onLoopCb = null;
        this._plugins  = null;
        this.api       = null;
        this.clear();
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
            let   callback;
            const msgName = 'm';

            window.addEventListener('message', (event) => {
                if (event.data === msgName) {
                    event.stopPropagation();
                    if (this._stopped) {return}
                    callback();
                }
            }, true);
            //
            // Like setTimeout, but only takes a function argument. There's
            // no time argument (always zero) and no arguments (you have to
            // use a closure).
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
        this._world.on(EVENTS.DOT, this._onDot.bind(this));
    }

    _visualize(visualized = true) {
        this._visualized = visualized;
        this._canvas.visualize(visualized);
    }

    _onDot(x, y, color) {
        this._canvas.dot(x, y, color);
    }
}

module.exports = Manager;