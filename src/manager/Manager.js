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
 * @author DeadbraiN
 * TODO: what about destroy of manager instance? We have to destroy plugins
 * TODO: by calling of destroy() method for every of them
 */
import Config    from './../global/Config';
import Observer  from './../global/Observer';
import World     from './../visual/World';
import Organisms from './plugins/Organisms';
import Mutator   from './plugins/Mutator';
/**
 * {Array} Plugins for Manager
 */
const PLUGINS = [
    Organisms,
    Mutator
];

export default class Manager extends Observer {
    /**
     * Is called on every iteration in main loop. May be overridden in plugins
     * @abstract
     */
    onIteration() {}

    /**
     * Is called at the end on move() method
     * @abstract
     */
    onAfterMove() {return true;}

    constructor() {
        super();
        this._world   = new World(Config.worldWidth, Config.worldHeight);
        this._plugins = new Array(PLUGINS.length);
        this._stopped = false;
        this._share   = {};

        this._initLoop();
        this._initPlugins();
    }

    get world() {return this._world;}

    /**
     * Runs main infinite loop of application
     */
    run () {
        let counter = 1;
        let timer   = Date.now;
        let stamp   = timer();
        let call    = this.zeroTimeout;
        let me      = this;

        function loop () {
            me.onIteration(counter, stamp);

            counter++;
            stamp = timer();
            call(loop);
        }
        call(loop);
    }

    stop() {
        this._stopped = true;
    }

    destroy() {
        this._world.destroy();
        for (let p of this._plugins) {if (p.destroy) {p.destroy();}}
        this._plugins = null;
        this.clear();
    }

    move(x1, y1, x2, y2, org) {
        let world = this._world;

        if (this._isFree(x2, y2) === false) {return false;}
        if (Config.worldCyclical) {
            if (x2 < 0)                     {x2 = world.width - 1;
            } else if (x2 === world.width)  {x2 = 0;
            } else if (y2 < 0)              {y2 = world.height - 1;
            } else if (y2 === world.height) {y2 = 0;}
        }

        if (x1 !== x2 || y1 !== y2) {this._world.setDot(x1, y1, 0);}
        this._world.setDot(x2, y2, org.color);

        return this.onAfterMove(x1, y1, x2, y2, org);
    }

    /**
     * This hacky function is obtained from here: https://dbaron.org/log/20100309-faster-timeouts
     * It runs a setTimeout() based infinite loop, but faster, then simply using native setTimeout().
     * See this article for details.
     * @return {Boolean} Initialization status. false if function has already exist
     * @private
     * @hack
     */
    _initLoop() {
        if (this.zeroTimeout) {return false;}
        //
        // Only add zeroTimeout to the Manager object, and hide everything
        // else in a closure.
        //
        (() => {
            let   callback;
            const msgName   = 'zm';

            window.addEventListener('message', (event) => {
                if (event.data === msgName) {
                    event.stopPropagation();
                    if (this._stopped) {
                        Console.warn('Manager has stopped');
                        return;
                    }
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

    _initPlugins() {
        for (let i = 0; i < PLUGINS.length; i++) {
            this._plugins[i] = new PLUGINS[i](this);
        }
    }

    _isFree(x, y) {
        return this._world.getDot(x, y) === 0;
    }
}