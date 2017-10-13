/**
 * Main manager class of application. Contains all parts of jevo.js app
 * like World, Connection, Console etc... Runs infinite loop inside run()
 * method.
 *
 * Usage:
 *   import Manager from '.../Manager';
 *   const manager = new Manager();
 *   manager.run();
 *
 * @author flatline
 * TODO: what about destroy of manager instance? We have to destroy plugins
 * TODO: by calling of destroy() method for every of them
 */
import Observer          from './../../../common/src/global/Observer';
import {Config}          from './../../../common/src/global/Config';
import Plugins           from './../../../common/src/global/Plugins';
import {EVENTS}          from './../global/Events';
import {EVENT_AMOUNT}    from './../global/Events';
import Console           from './../global/Console';
import World             from './../visual/World';
import Canvas            from './../visual/Canvas';

import OperatorsDos      from './../organism/OperatorsDos';
import OperatorsGarmin   from './../organism/OperatorsGarmin';
import Code2StringDos    from './../organism/Code2StringDos';
import Code2StringGarmin from './../organism/Code2StringGarmin';
import FitnessGarmin     from './../organism/FitnessGarmin';
import OrganismDos       from './../organism/OrganismDos';
import OrganismGarmin    from './../organism/OrganismGarmin';
/**
 * {Boolean} Specify fitness or nature simulation mode
 */
const FITNESS_MODE = Config.codeFitnessCls !== null;
/**
 * {Object} Mapping of class names and their functions. We use this map
 * for switching between fitness and natural modes
 */
const CLASS_MAP = {
    OperatorsDos     : OperatorsDos,
    OperatorsGarmin  : OperatorsGarmin,
    Code2StringDos   : Code2StringDos,
    Code2StringGarmin: Code2StringGarmin,
    FitnessGarmin    : FitnessGarmin,
    OrganismDos      : OrganismDos,
    OrganismGarmin   : OrganismGarmin
};

export default class Manager extends Observer {
    /**
     * Is called on every iteration in main loop. May be overridden in plugins
     * @abstract
     */
    onIteration() {}

    constructor() {
        super(EVENT_AMOUNT);
        this._world        = new World(Config.worldWidth, Config.worldHeight);
        this._canvas       = new Canvas(Config.worldWidth, Config.worldHeight);
        this._stopped      = false;
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
        this._plugins    = new Plugins(this, PLUGINS);
    }
    get world()        {return this._world}
    get canvas()       {return this._canvas}
    get clientId()     {return this._clientId}
    get activeAround() {return this._activeAround}
    get CLASS_MAP()    {return CLASS_MAP}

    /**
     * Runs main infinite loop of application
     */
    run () {
        Console.info('Manager has run');
        this._counter = 0;
        this._onLoop();
    }

    stop() {
        this._stopped = true;
        this._counter = 0;
        Console.log('Manager has stopped');
    }

    setClientId(id) {
        this._clientId = id;
    }

    destroy() {
        this._world.destroy();
        this._canvas.destroy();
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