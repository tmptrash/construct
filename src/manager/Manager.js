/**
 * Main class of application. Contains entry point of jevo
 *
 * Usage:
 *   const manager = new Manager()
 *
 * @author DeadbraiN
 */
import Config   from './../global/Config';
import Organism from './../organism/Organism';
import Helper   from './../global/Helper';
import Console  from './../global/Console';
import Stack    from './../global/Stack';

export default class Manager {
    constructor() {
        this._world     = null;
        this._positions = {};
        this._tasks     = null;
        this._killed    = null;
        this._orgId     = 1;
        this._quiet     = Console.MODE_QUIET_IMPORTANT;
        this._ips       = 0;
        this._loop      = this._loopFn.bind(this);

        this._initTasks();
        this._initFastLoop();
    }

    run () {
        window.zeroTimeout(this._loop);
    }

    _loopFn () {
        debugger;
        window.zeroTimeout(this._loop);
    }

    _initTasks () {
        const worldMaxOrgs = Config.worldMaxOrgs;

        this._tasks  = new Array(worldMaxOrgs);
        this._killed = new Stack(worldMaxOrgs);
        for (let i = 0; i < worldMaxOrgs; i++) {
            //
            // We create temporary organisms to prevent keeping empty slots in array. All
            // these organisms will be removed later, during application working.
            //
            const org = new Organism(i);
            org.alive = false;
            this._tasks[i] = {org: org, task: null};
            this._killed.push(i);
        }
    }

    /**
     * This hacky function is obtained from here: https://dbaron.org/log/20100309-faster-timeouts
     * It runs a setTimeout() based infinite loop, but faster, then simply using native setTimeout().
     * See this article for details.
     * @return {Boolean} Initialization status. false if function has already exist
     * @private
     * @hack
     */
    _initFastLoop() {
        if (window.zeroTimeout) {return false;}
        //
        // Only add zeroTimeout to the window object, and hide everything
        // else in a closure.
        //
        (() => {
            let   callbacks = [];
            const msgName   = 'zmsg';

            window.addEventListener('message', (event) => {
                if (event.source === window && event.data === msgName) {
                    event.stopPropagation();
                    if (callbacks.length > 0) {
                        callbacks.shift()();
                    }
                }
            }, true);
            //
            // Like setTimeout, but only takes a function argument. There's
            // no time argument (always zero) and no arguments (you have to
            // use a closure).
            //
            window.zeroTimeout = (fn) => {
                callbacks.push(fn);
                window.postMessage(msgName, '*');
            };
        })();

        return true;
    }
}