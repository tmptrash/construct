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
import Events    from './../global/Events';
import World     from './../visual/World';
import Canvas    from './../visual/Canvas';
import Organisms from './plugins/Organisms';
import Mutator   from './plugins/Mutator';
import Energy    from './plugins/Energy';
import Backup    from './plugins/Backup';
/**
 * {Array} Plugins for Manager
 */
const PLUGINS = {
    Organisms: Organisms,
    Mutator  : Mutator,
    Energy   : Energy,
    Backup   : Backup
};

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
    onAfterMove() {}

    constructor() {
        super();
        this._world     = new World(Config.worldWidth, Config.worldHeight);
        this._canvas    = new Canvas();
        this._plugins   = PLUGINS;
        this._stopped   = false;

        this._initLoop();
        this._initPlugins();
        this._addHandlers();
    }

    get world() {return this._world;}
    get plugins() {return this._plugins;}

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

    visualize(visualize) {
        this._canvas.visualize(visualize);
    }

    destroy() {
        const plugins = this._plugins;
        this._world.destroy();
        this._canvas.destroy();
        for (let p in plugins) {if (plugins.hasOwnProperty(p) && plugins[p].destroy) {plugins[p].destroy();}}
        this._plugins = null;
        this.clear();
    }

    move(x1, y1, x2, y2, org) {
        let moved = false;

        if (Config.worldCyclical) {
            if (x2 < 0)                        {x2 = Config.worldWidth - 1;}
            else if (x2 >= Config.worldWidth)  {x2 = 0;}
            else if (y2 < 0)                   {y2 = Config.worldHeight - 1;}
            else if (y2 >= Config.worldHeight) {y2 = 0;}
        }
        if (this._isFree(x2, y2) === false) {return false;}

        if (x1 !== x2 || y1 !== y2) {moved = true; this._world.setDot(x1, y1, 0);}
        this._world.setDot(x2, y2, org.color);
        org.x = x2;
        org.y = y2;

        this.onAfterMove(x1, y1, x2, y2, org);

        return moved;
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
        let plugins = this._plugins;
        for (let p in plugins) {
            plugins[p] = new plugins[p](this);
        }
    }

    _addHandlers() {
        this._world.on(Events.DOT, this._onDot.bind(this));
    }

    _onDot(x, y, color) {
        this._canvas.dot(x, y, color);
    }

    _isFree(x, y) {
        return this._world.getDot(x, y) === 0;
    }
}