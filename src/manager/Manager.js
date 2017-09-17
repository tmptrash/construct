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
import {Config}          from './../global/Config';
import Observer          from './../global/Observer';
import {EVENTS}          from './../global/Events';
import {EVENT_AMOUNT}    from './../global/Events';
import Console           from './../global/Console';
import World             from './../visual/World';
import Canvas            from './../visual/Canvas';

import OrganismsGarmin   from './plugins/OrganismsGarmin';
import OrganismsDos      from './plugins/OrganismsDos';
import ConfigPlugin      from './plugins/Config';
import Mutator           from './plugins/Mutator';
import Energy            from './plugins/Energy';
import Status            from './plugins/Status';

import OperatorsDos      from './../organism/OperatorsDos';
import OperatorsGarmin   from './../organism/OperatorsGarmin';
import Code2StringDos    from './../organism/Code2StringDos';
import Code2StringGarmin from './../organism/Code2StringGarmin';
import FitnessGarmin     from './../organism/FitnessGarmin';
import OrganismDos       from './../organism/OrganismDos';
import OrganismGarmin    from './../organism/OrganismGarmin';
import JSVM              from './../organism/JSVM';
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
/**
 * {Array} Plugins for Manager
 */
const PLUGINS = {
    Organisms: FITNESS_MODE ? OrganismsGarmin : OrganismsDos,
    Config   : ConfigPlugin,
    Mutator  : Mutator,
    Energy   : Energy,
    Status   : Status
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
        super(EVENT_AMOUNT);
        this._world      = new World(Config.worldWidth, Config.worldHeight);
        this._canvas     = new Canvas(Config.worldWidth, Config.worldHeight);
        this._plugins    = PLUGINS;
        this._stopped    = false;
        this._visualized = true;

        this.api         = {
            visualize: this._visualize.bind(this),
            version  : this.version.bind(this)
        };

        this._initLoop();
        this._initPlugins();
        this._addHandlers();
    }

    /**
     * Collects versions of all nested components and returns final string
     * @return {String}
     */
    version() {
        let plugins = this._plugins;
        let ver     = 'Manager               : 0.9\n' +
            '    World              : ' + this._world.version() + '\n' +
            '    Canvas             : ' + this._canvas.version() + '\n';

        for (let p in plugins) {
            if (plugins.hasOwnProperty(p) && p !== 'Organisms') {
                ver += ('    ' + p.padEnd(19) + ': ' + plugins[p].version() + '\n');
            }
        }

        ver += '' +
            '    Organisms          : ' + plugins.Organisms.version() + '\n' +
            '        JSVM           : ' + JSVM.version() + '\n' +
            '        OperatorsDos   : ' + OperatorsDos.version() + '\n' +
            '        OperatorsGarmin: ' + OperatorsGarmin.version() + '\n' +
            '        OrganismDos    : ' + OrganismDos.version() + '\n' +
            '        OrganismGarmin : ' + OrganismGarmin.version();

        return ver;
    }

    get world()     {return this._world;}
    get canvas()    {return this._canvas;}
    get plugins()   {return this._plugins;}
    get CLASS_MAP() {return CLASS_MAP;}

    /**
     * Runs main infinite loop of application
     */
    run () {
        let counter     = 0;
        let timer       = Date.now;
        let stamp       = timer();
        let me          = this;
        let zeroTimeout = me.zeroTimeout;

        function loop () {
            //
            // This conditions id needed for turned on visualization mode to
            // prevent flickering of organisms in a canvas. It makes their
            // movement smooth
            //
            const amount = me._visualized ? 1 : Config.codeIterationsPerOnce;

            for (let i = 0; i < amount; i++) {
                me.onIteration(counter, stamp);

                counter++;
                stamp = timer();
            }
            zeroTimeout(loop);
        }
        loop();
    }

    stop() {
        this._stopped = true;
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

        if (this._isFree(x2, y2) === false) {return false;}
        if (x1 !== x2 || y1 !== y2) {moved = true; this._world.setDot(x1, y1, 0);}
        this._world.setDot(x2, y2, org.color);
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
            const msgName = 'zm';

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
        this._world.on(EVENTS.DOT, this._onDot.bind(this));
    }

    _visualize(visualized = true) {
        this._visualized = visualized;
        this._canvas.visualize(visualized);
    }

    _onDot(x, y, color) {
        this._canvas.dot(x, y, color);
    }

    _isFree(x, y) {
        return this._world.getDot(x, y) === 0;
    }
}