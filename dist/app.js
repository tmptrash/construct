/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Global jevo.js configuration file. Affects only current jevo
 * instance. Other instances may have different configuration values
 *
 * @author DeadbraiN
 */
const Config = {
    // TODO: find and remove unused values
    /**
     * {Array} Probabilities with which mutator decides what to do: 
     * add, change, delete character of the code; change amount of
     * mutations or change mutations period... Depending on these
     * values, organism may have different strategies of living.
     * For example: if add value is bigger then del and change,
     * then code size will be grow up all the time. If del value is
     * bigger then other, then it will be decreased to zero lines
     * of code and will die.
     * Format: [
     *     add          - Probability of adding of new character to the code
     *     change       - Probability of changing existing character in a code
     *     small-change - Probability of "small change" - change of expression part
     *     delete       - Probability of deleting of a character in a code
     *     clone        - Probability for amount of mutations on clone
     *     period       - Probability of period of organism mutations
     *     amount       - Probability of amount of mutations per period
     * ]
     */
    orgMutationProbs: [50,100,1,0,1,1,1,1,1],
    /**
     * {Number} Max value, which we may use in orgMutationProbs array.
     */
    orgMutationProbsMaxValue: 100,
    /**
     * {Number} Percent of mutations from code size, which will be applied to
     * organism after clonning. Should be <= 1.0
     */
    orgCloneMutation: 0.1,
    /**
     * {Number} Amount of iterations before clonning process
     */
    orgClonePeriod: 20,
    /**
     * {Number} Amount of iterations within organism's life loop, after that we
     * do mutations according to orgRainMutationPercent config. If 0, then
     * mutations will be disabled. Should be less then ORGANISM_MAX_MUTATION_PERIOD
     */
    orgRainMutationPeriod: 0,
    /**
     * {Number} Value, which will be used like amount of mutations per
     * orgRainMutationPeriod iterations. 0 is a possible value if
     * we want to disable mutations. Should be less then 100
     */
    orgRainMutationPercent: 0.01,
    /**
     * {Number} Amount of organisms we have to create on program start
     */
    orgStartAmount: 300,
    /**
     * {Number} Amount of energy for first organisms. They are like Adam and
     * Eve. It means that these empty (without code) organism were created
     * by operator and not by evolution.
     */
    orgStartEnergy: 100000,
    /**
     * {Number} Begin color of "empty" organism (organism without code).
     */
    orgStartColor: 100,
    /**
     * {Number} Only after this amount of mutations organism should update it's color
     */
    orgColorPeriod: 50,
    /**
     * {Number} Amount of iterations within organism's life loop, after that we decrease
     * some amount of energy. If 0, then energy decreasing will be disabled.
     */
    orgEnergySpendPeriod: 500,
    /**
     * {Number} Amount of energy, which will be decreased in case of organism's
     * code error or exception
     */
    orgEnergySpendOnError: 1000,
    /**
     * {Number} Amount of iterations when organism is alive. It will die after
     * this period. If 0, then will not be used.
     */
    orgAlivePeriod: 5000,
    /**
     * {Number} This value means the period between organism codeSizes, which
     * affects energy grabbing by the system. For example: we have two
     * organisms: org1.energy = 10, org2.energy = 10, org1.codeSize = 6,
     * org2.codeSize = 9, Config.orgGarbagePeriod = 5. It means that
     * during energy grabbing by the system org1 and org2 will spend the
     * same amount of energy - 1 unit. This is because the period goes
     * from 1..5, 6..10,... and both organisms are in the same period.
     */
    orgGarbagePeriod: 20,
    /**
     * {Number} Size of organism stack (internal memory)
     */
    orgMemSize: 64,
    /**
     * {Number} Percent of energy, which will be given to the child
     */
    orgCloneEnergyPercent: 0.5,
    /**
     * {Number} Amount of errors in organisms codes in current population
     */
    orgErrors: 0,
    /**
     * {Number} Amount of eval calls for generatin organisms code
     */
    orgEvals: 0,
    /**
     * {Number} Maximum amount of arguments in custom functions. Minimum 1. Maximum
     * <= amount of default variables.
     */
    codeFuncParamAmount: 2,
    /**
     * {Number} Amount of iterations in a loop (for operator)
     */
    codeLoopAmount: 8,
    /**
     * {Number} Amount of organisms entire code runs per some period of time
     */
    codeRuns: 0,
    /**
     * {Number} If organism reach this limit of amount of code lines, then codeSizeCoef
     * will be used during it's energy grabbing by system. We use this approach,
     * because our CPU's are slow and organisms with big codes are very slow. But
     * it's possible for organisms to go outside the limit by inventing new
     * effective mechanisms of energy obtaining.
     */
    codeMaxSize: 60,
    /**
     * {Number} This coefficiend is used for calculating of amount of energy,
     * which grabbed from each organism depending on his codeSize.
     * This coefficient affects entire code size of population and
     * entire system speed. It depends on CPU speed also. So, for
     * different PC's it may be different.
     * Formula is the following: grabEnergy = cfg.codeSizeCoef * org.codeSize
     * See Config.codeMaxSize for details. This config will be turn on only if
     * organism reaches code size limit Config.codeMaxSize
     */
    codeSizeCoef: 10,
    /**
     * {Number} Amount of local variables of organism's script
     */
    codeVarAmount: 5,
    /**
     * {Number} The value from -X/2 to X/2, which is used for setting
     * default value, while organism is delivering. So, if the value is
     * 1000, then ragne will be: -500..500
     */
    codeVarInitRange: 1000,
    /**
     * {Number} World width
     */
    worldWidth: 1900,
    /**
     * {Number} World height
     */
    worldHeight: 900,
    /**
     * {Number} Turns on ciclic world mode. It means that organisms may go outside
     * it's border, but still be inside. For example, if the world has 10x10
     * size and the organism has 10x5 position in it, one step right will move
     * this organism at the position 1x5. The same scenario regarding Y
     * coordinate (height).
     */
    worldCyclical: true,
    /**
     * {Number} Maximum amount of organisms in a world. If some organisms will
     * try to clone itself, when entire amount of organisms are equal
     * this value, then it(clonning) will not happen.
     */
    worldMaxOrgs: 900,
    /**
     * {Number} Minimum amount of orgaisms in a world. If this value riached,
     * then remove minimum energetic organisms mechanism will be disabled
     * until total amount will be more then this value.
     */
    worldMinOrgs: 50,
    /**
     * {Number} Amount of energy blocks in a world. Blocks will be placed in a
     * random way...
     */
    worldStartEnergyDots: 1000,
    /**
     * {Number} Amount of energy in every block. See worldStartEnergyDots
     * config for details.
     */
    worldStartEnergyInDot: 0x0001F4,
    /**
     * {Number} Minimum percent of energy in current world. Under percent i mean
     * percent from entire world area (100%). If the energy will be less
     * or equal then this percent, then new random energy should be added.
     * Should be less then 100.0 and more and equal to 0.0. 0.17 is a
     * normal percent for this system.
     */
    worldEnergyCheckPercent: 0.3,
    /**
     * {Number} An amount of iteration, after which we have to check world energy
     * amount. Works in pair with worldEnergyCheckPercent. May be 0 if
     * you want to disable it
     */
    worldEnergyCheckPeriod: 20000,
    /**
     * {Number} World scaling. On todays monitors pixel are so small, so we have
     * to zoom them with a coefficient.
     */
    worldZoom: 1,
    /**
     * {Number} Period of seconds, which is user for checking IPS value. It's
     * possible to increase it to reduce amount of requests and additional
     * code in main loop
     */
    worldIpsPeriod: 1.0,
    /**
     * {Number} Period of making automatic backup of application. In seconds
     */
    backupPeriod: 300,
    /**
     * {Number} Amount of backup files stored on HDD. Old files will be removed
     */
    backupAmount: 10,
    /**
     * {Number} The period of time between yield() calls in "stand by" mode.
     * In this mode manager waits for data in sockets and new connections.
     * In this mode yield() is called only once in a period, because
     * it eats CPU cicles. In case of data in sockets or new connections
     * yield() will be called more often.
     */
    conYieldPeriod: 0.01,
    /**
     * {Number} Percent of energy, which will be minused from organism after
     * stepping from one instance to another.
     */
    conStepEnergySpendPercent: 20,
    /**
     * {Number} Starting number for TCP/IP listening
     */
    conServerPort: 2010,
    /**
     * {String} Works in pair with conServerPort. An IP of current
     * server/instance.
     * TODO: IPv6?
     */
    conServerIp: '127.0.0.1',
    /**
     * {Number} Port number for "fast" mode. It uses, for example, for pooling
     */
    conFastServerPort: 2011,
    /**
     * {Number} Left side server's (instance) port we want connect to. May be
     * zero (0) if no left side server available.
     */
    conLeftServerPort: 0,
    /**
     * {String} Left server(instance) IP address. Works in pair with
     * conLeftServerPort
     */
    conLeftServerIp: '127.0.0.1',
    /**
     * {Number} Right side server's (instance) port we want connect to. May be
     * zero (0) if no right side server available.
     */
    conRightServerPort: 0,
    /**
     * {String} Right server(instance) IP address. Works in pair with
     * conRightServerPort
     */
    conRightServerIp: '127.0.0.1',
    /**
     * {Number} Left up server's (instance) port we want connect to. May be
     * zero (0) if no up side server available.
     */
    conUpServerPort: 0,
    /**
     * {String} Up server(instance) IP address. Works in pair with
     * conUpServerPort
     */
    conUpServerIp: '127.0.0.1',
    /**
     * {Number} Left down server's (instance) port we want connect to. May be
     * zero (0) if no down side server available.
     */
    conDownServerPort: 0,
    /**
     * {String} Down server(instance) IP address. Works in pair with
     * conDownServerPort
     */
    conDownServerIp: '127.0.0.1',
    /**
     * {Array} Array of included plugins
     */
    plugIncluded: [],
    /**
     * {Array} Array of excluded plugins. Affects plugIncluded list
     */
    plugExcluded: [],
    /**
     * {Boolean} Debug mode. This mode means, that all debug messages
     * will be posted to the terminal
     */
    modeDebug: false,
    /**
     * {Boolean} Testing mode. In this mode user may run jevo step by step
     * and test it'sinternal parts. For example, during unit tests
     */
    modeTest: false,
    /**
     * {Boolean} Is used for profiling the application with ProfileView
     * package. See run-profiling.sh for details
     */
    modeProfile: false,
    /**
     * {Number} Amount of iterations in profile mode after which ProfileView
     * package will draw performance flame chart
     */
    modeProfilePeriod: 2000,
    /**
     * {Number} Amount of seconds for status showing in terminal
     */
    modeStatusPeriod: 10.0,
    /**
     * {Boolean} In this mode status report will be short or full
     */
    modeStatusFull: false,
    /**
     * {Number} Mode for showing/supressing of messages. Possible values:
     *   0 - all messages
     *   1 - only important messages
     *   2 - no messages
     */
    modeQuiet: 1
};

/* harmony default export */ __webpack_exports__["a"] = (Config);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Global helper class
 *
 * @author DeadbraiN
 */
class Helper {
    /**
     * Generates random Int number in range 0:n-1
     * @param {Number} n Right number value in a range
     * @return {Number}
     */
    static rand(n) {return Math.trunc(Math.random() * n);}
    /**
     * It calculates probability index from variable amount of components.
     * Let's imagine we have two actions: one and two. We want
     * these actions to be called randomly, but with different probabilities.
     * For example it may be [3,2]. It means that one should be called
     * in half cases, two in 1/3 cases. Probabilities should be greater then -1.
     * @param {Array} probs Probabilities array. e.g.: [3,2] or [1,3]
     * @return {Number} -1 Means that index is invalid
     */
    static probIndex(probs) {
        let len = probs.length;
        if (len < 1) {return -1;}
        let sum = probs.reduce((a, b) => a + b, 0);
        if (sum < 1) {return -1;}
        let num = Helper.rand(sum) + 1;
        let i;
        //
        // This is small optimization trick. if random number in
        // a left part of all numbers sum, the we have to go to it from
        // left to right, if not - then from right to left. Otherwise,
        // going every time from left to right will be a little bit
        // slower then this approach.
        //
        if (num < sum / 2) {
            sum = 0;
            for (i = 0; i < len; i++)  {if (num <= (sum += probs[i])) break;}
        } else {
            for (i = len-1; i>-1; i--) {if (num >  (sum -= probs[i])) break;}
        }

        return i;
    }
    /**
     * Checks if position is empty. x == y == 0 - this is empty
     * @param {Object} pos Position to check
     */
    static empty(pos) {return pos.x === 0 && pos.y === 0;}
    /**
     * Saves custom data into the file. If file exists, it will
     * be overrided. It's only rewrites existing file and not
     * append it. It also doesn't work with native types, in sense
     * that you can't save native values into the file without *
     * meta information. For example, you can't store ascii string
     * in a file without special prefic before it.
     * @param {Object} data Data to save
     * @param {String} file File name/Key name
     * TODO: FileApi should be used
     */
    static save(data, file = "backup.data") {
        localStorage[file] = JSON.stringify(data);
    }
   /**
    * Loads custom data from the file
    * @param file File name
    * @return {Object} loading result or nothing
    * TODO: FileApi should be used
    */
    static load(file = "backup.data") {
        return JSON.parse(localStorage[file]);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Helper;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Observer implementation. May fire, listen(on()) and clear all the event
 * handlers
 *
 * Usage:
 *   let bus = new Observer();
 *   bus.on('event', () => console.log(arguments));
 *   bus.fire('event', 1, 2, 3);
 *
 * @author DeadbraiN
 */
class Observer {
    constructor() {
        this._handlers = {};
    }

    on (event, handler) {
        (this._handlers[event] || (this._handlers[event] = [])).push(handler);
    }

    off (event, handler) {
        let index;

        if (!this._handlers[event] || (index = this._handlers[event].indexOf(handler)) < 0) {return false;}
        this._handlers[event].splice(index, 1);
        if (!this._handlers[event].length) {delete this._handlers[event];}

        return true;
    }

    fire (event, ...args) {
        if (!this._handlers[event]) {return false;}

        for (let handler of this._handlers[event]) {handler(...args);}

        return true;
    }

    clear () {
        this._handlers = {};
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Observer;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Fast stack implementation. Uses array inside, which is immutable
 * and the position pointer for stack position.
 *
 * @author DeadbraiN
 * TODO: use Uint32Array for id's. It should be faster
 */
class Stack {
    /**
     * Creates Stack instance of specified size. Internal pointer
     * will be set to the bottom of stack.
     * @param {Number} size Stack size (amount of elements)
     */
    constructor (size) {
        this._size = size;
        this._arr  = new Array(size);
        this._pos  = -1;
    }

    /**
     * Adds value at the top of the stack. If stack is full,
     * then false will be returned.
     * @param {*} val
     * @returns {boolean} true means, that value was added
     */
    push (val) {
        if (this._pos + 1 === this._size) {return false;}
        this._arr[++this._pos] = val;
        return true;
    }

    /**
     * Returns one value from the top of the stack
     * @return {*|null} null in case of mistake
     */
    pop () {
        if (this._pos < 0) {return null;}
        return this._arr[this._pos--];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Stack;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__organism_Organism__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Helper__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_Console__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__global_Stack__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__visual_World__ = __webpack_require__(8);
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
 */







class Manager {
    constructor() {
        this._world     = new __WEBPACK_IMPORTED_MODULE_5__visual_World__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].worldWidth, __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].worldHeight);
        this._positions = {};
        this._tasks     = null;
        this._killed    = null;
        this._quiet     = __WEBPACK_IMPORTED_MODULE_3__global_Console__["a" /* default */].MODE_QUIET_IMPORTANT;
        this._ips       = 0;

        this._initTasks();
        this._initLoop();
    }

    run () {
        let counter   = 1;
        let stamp     = Date.now();
        //
        // Main loop of application
        //
        function loop () {
            // TODO: code is here...
            counter++;
            stamp = Date.now();
            window.zeroTimeout(loop);
        }

        window.zeroTimeout(loop);
    }


    _initTasks () {
        const worldMaxOrgs = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].worldMaxOrgs;

        this._tasks  = new Array(worldMaxOrgs);
        this._killed = new __WEBPACK_IMPORTED_MODULE_4__global_Stack__["a" /* default */](worldMaxOrgs);

        for (let i = 0; i < worldMaxOrgs; i++) {
            this._tasks[i] = {org: new __WEBPACK_IMPORTED_MODULE_1__organism_Organism__["a" /* default */](i, 0, 0, false), task: null};
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
    _initLoop() {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Manager;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__manager_Manager__ = __webpack_require__(4);
/**
 * This is an entry point of jevo.js application. Compiled version of
 * this file should be included into index.html
 *
 * Usage:
 *   <script src="./app.js"></script>
 *
 * @author DeadbraiN
 */


const manager = new __WEBPACK_IMPORTED_MODULE_0__manager_Manager__["a" /* default */]();
manager.run();

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Module for working with a browser console
 *
 * Usage:
 *   import Console from '.../Console';
 *   Console.msg('msg');
 *
 * @author DeadbraiN
 */
const MODE_QUIET_ALL       = 0;
const MODE_QUIET_IMPORTANT = 1;
const MODE_QUIET_NO        = 2;

class Console {
    static get MODE_QUIET_ALL()       {return MODE_QUIET_ALL;}
    static get MODE_QUIET_IMPORTANT() {return MODE_QUIET_IMPORTANT;}
    static get MODE_QUIET_NO()        {return MODE_QUIET_NO;}

    static error(msg) {
        if (this._mode === MODE_QUIET_NO) {return;}
        console.log(`%c${msg}`, 'background: #fff; color: #aa0000');
    }
    static warn (msg) {
        if (this._mode === MODE_QUIET_NO) {return;}
        console.log(`%c${msg}`, 'background: #fff; color: #cc7a00');
    }
    static info (msg) {
        if (this._mode !== MODE_QUIET_ALL) {return;}
        console.log(`%c${msg}`, 'background: #fff; color: #1a1a00');
    }
    static mode (mode = MODE_QUIET_IMPORTANT) {this._mode = mode;}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Console;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_Stack__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Observer__ = __webpack_require__(2);
/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author DeadbraiN
 */




class Organism extends __WEBPACK_IMPORTED_MODULE_2__global_Observer__["a" /* default */] {
    constructor(id, x, y, alive) {
        super();
        this._id                   = id;
        this._mutationProbs        = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgMutationProbs;
        this._mutationClonePercent = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgCloneMutation;
        this._mutationPeriod       = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgRainMutationPeriod;
        this._mutationPercent      = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgRainMutationPercent;
        this._mutations            = 1;
        this._energy               = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgStartEnergy;
        this._color                = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgStartColor;
        this._mem                  = new __WEBPACK_IMPORTED_MODULE_1__global_Stack__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgMemSize);
        this._x                    = x;
        this._y                    = y;
        this._age                  = 0;
        this._cloneEnergyPercent   = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgCloneEnergyPercent;
        this._alive                = alive;
        this._varId                = 0;
        this._fnId                 = 0;
        this._code                 = [];
        this._byteCode             = this._compile(this._code);
    }

    born() {

    }

    getEnergy() {}
    eatLeft() {}
    eatRight() {}
    eatUp() {}
    eatDown() {}
    stepLeft() {}
    stepRight() {}
    stepUp() {}
    stepDown() {}
    energyLeft() {}
    energyRight() {}
    energyUp() {}
    energyDown() {}
    getId() {}

    /**
     * Generates default variables code. It should be in ES5 version, because
     * speed is important. Amount of vars depends on Config.codeVarAmount config.
     * @returns {String} vars code
     * @private
     */
    _getVars() {
        const vars  = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].codeVarAmount;
        let   code  = new Array(vars);
        const range = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].codeVarInitRange;
        const half  = range / 2;
        const rand  = '=rand()*' + range + '-' + half;

        for (let i = 0; i < vars; i++) {
            code[i] = 'var v' + (++this._varId) + rand;
        }

        return code.join(';');
    }

    /**
     * Does simple preprocessing and final compilation of the code.
     * @private
     */
    _compile() {
        const header = 'this.__compiled=function* dna(){var rand=Math.random;while(true){yield;';
        const vars   = this._getVars();
        const footer = '}}';
        eval(header + vars + this._code.join(';') + footer);

        return this.__compiled;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Organism;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Observer__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_Helper__ = __webpack_require__(1);
/**
 * 2D space, where all organisms are live. In reality this is
 * just a peace of memory, where all organisms are located. It
 * doesn't contain organisms codes, only rectangular with points.
 * It's possible to run our application only in memory. In this
 * case only this 2D world will be used (without visual
 * presentation)
 *
 * Usage:
 *   import World from '.../World';
 *   let world = new World(100, 100);
 *   world.setDot(50, 50, 0xFF00AA);
 *   world.getDot(50, 50); // 0xFF00AA
 *
 * Events:
 *   dot(x,y,color) Fires if one dot in a worlds field changed it's color
 *
 * @author DeadbraiN
 */



class World extends __WEBPACK_IMPORTED_MODULE_0__global_Observer__["a" /* default */] {
    constructor (width, height) {
        super();
        this._data   = [];
        this._width  = width;
        this._height = height;

        for (let x = 0; x < width; x++) {
            this._data[x] = (new Array(height)).fill(0);
        }
    }

    destroy() {
        this.clear();
        this._data   = null;
        this._width  = 0;
        this._height = 0;
    }

    setDot(x, y, color) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {return false;}
        this._data[x][y] = color;
        this.fire('dot', x, y, color)

        return true;
    }

    getDot(x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {return false;}
        return this._data[x][y];
    }

    grabDot(x, y, amount) {
        let dot = Math.min(this.getDot(x, y), amount)

        if (dot > 0) {
            this.fire('dot', x, y, (this._data[x][y] -= dot));
        }

        return dot;
    }

    getFreePos() {
        const rand   = __WEBPACK_IMPORTED_MODULE_1__global_Helper__["a" /* default */].rand;
        const width  = this._width;
        const height = this._height;
        let   x      = Math.ceil(width / 2);
        let   y      = Math.ceil(height / 2);
        let   i      = width * height < 1000 ? 100 : width * height / 10;

        while (this.getDot(x, y) > 0 && i > 0) {
            x = rand(width);
            y = rand(height);
            i -= 1;
        }

        return i > 0 ? {x: x, y: y} : false
    }

    getNearFreePos(x, y) {
        const positions = [
            x + 1, y,     // right
            x + 1, y + 1, // right down
            x    , y + 1, // down
            x - 1, y + 1, // down left
            x - 1, y,     // left
            x - 1, y - 1, // left up
            x    , y - 1, // up
            x + 1, y - 1  // up right
        ];

        for (let i = 0, j = 0; i < 8; i++) {
            x = positions[j]
            y = positions[j + 1]
            if (this.getDot(x, y) === 0) {return {x: x, y: y};}
            j += 2;
        }

        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = World;


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map