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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
 * TODO: find and remove unused values
 */
const QUIET_ALL               = 0;
const QUIET_IMPORTANT         = 1;
const QUIET_NO                = 2;

const ORG_MAX_MUTATION_PERIOD = 1000;
const ORG_FIRST_COLOR         = 1;
const ORG_MAX_COLOR           = Number.MAX_SAFE_INTEGER;

const Config = {
    /**
     * Constants of quite mode. This mode affects on amount and
     * types of console messages. For example in QUIET_IMPORTANT
     * mode info messages will be hidden.
     */
    QUIET_ALL              : QUIET_ALL,
    QUIET_IMPORTANT        : QUIET_IMPORTANT,
    QUIET_NO               : QUIET_NO,

    ORG_MAX_MUTATION_PERIOD: ORG_MAX_MUTATION_PERIOD,
    ORG_FIRST_COLOR        : ORG_FIRST_COLOR,
    ORG_MAX_COLOR          : ORG_MAX_COLOR,
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
	 * {Number} Every code line 'yield' operator will be inserted to prevent
	 * locking of threads.
	 */
	codeYieldPeriod: 10,
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
     * {Number} Quite mode. This mode affects on amount and
     * types of console messages. For example in QUIET_IMPORTANT
     * mode info messages will be hidden.
     */
    worldQuiteMode: QUIET_IMPORTANT,
    /**
     * {Number} Period of milliseconds, which is user for checking IPS value. It's
     * possible to increase it to reduce amount of requests and additional
     * code in main loop
     */
    worldIpsPeriodMs: 1000,
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Config__ = __webpack_require__(0);
/**
 * Global helper class
 *
 * @author DeadbraiN
 */


class Helper {
    static posId(x, y) {
        return y * __WEBPACK_IMPORTED_MODULE_0__Config__["a" /* default */].worldWidth + x;
    }
    /**
     * Overrides specified function in two ways: softly - by
     * calling new function and after that original; hardly - by
     * erasing old function by new one. It's still possible to
     * unoverride erasing by copy old function from fn.fn property.
     * @param {Object} obj Destination object, we want to override
     * @param {String} fnName Function name
     * @param {Function} fn Destination function
     * @param {Boolean} hard true - erase old function, false - call
     * new function and aol after that.
     */
    static override(obj, fnName, fn, hard = false) {
        fn.fn = obj[fnName];
        if (!hard) {
            obj[fnName] = (...args) => {
                fn(...args);
                fn.fn.apply(obj, args);
            };
            return;
        }
        obj[fnName] = fn;
    }

    /**
     * Opposite to override. Removes overridden method.
     * @param {Object} obj Destination object, we want to override
     * @param {String} fnName Function name
     * @param {Function} fn Destination function
     */
    static unoverride(obj, fnName, fn) {
        obj[fnName] = fn.fn;
        delete fn.fn;
    }
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
 * List of all available event ids. New events should be added to
 * the end of the list.
 *
 * @author DeadbraiN
 * TODO: find unused and remove. But after main code is done.
 */
const Events = {
    YIELD: 1,
    ITERATION: 2,
    IPS: 3,
    REQUEST: 4,
    BACKUP: 5,
    YIELDTO: 6,
    ORGANISM: 7,
    GRAB_ENERGY: 8,
    UPDATE_ENERGY: 9,
    KILL_ORGANISM: 10,
    MUTATIONS: 11,
    CLONE: 12,
    EAT: 13,
    STEP: 17,
    EAT_ORGANISM: 21,
    EAT_ENERGY: 22,
    BORN_ORGANISM: 23,
    DOT_REQUEST: 24,
    STEP_YIELD: 25,
    BEFORE_RESPONSE: 26,
    AFTER_REQUEST: 27,
    GET_ENERGY: 28,
    PROP_LEFT: 29,
    PROP_RIGHT: 30,
    PROP_UP: 31,
    PROP_DOWN: 32,
    DOT: 33,
    MOVE: 34,
    GRAB_LEFT: 35,
    GRAB_RIGHT: 36,
    GRAB_UP: 37,
    GRAB_DOWN: 38,
    DESTROY: 39
};

/* harmony default export */ __webpack_exports__["a"] = (Events);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Observer implementation. May fire, listen(on()) and clear all the event
 * handlers
 *
 * Usage:
 *   import Events from '.../Events.js'
 *   let bus = new Observer();
 *   bus.on(Events.EVENT, () => console.log(arguments));
 *   bus.fire(Events.EVENT, 1, 2, 3);
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
        let handlers = this._handlers[event];

        if (typeof(handlers) === 'undefined' || (index = this._handlers[event].indexOf(handler)) < 0) {return false;}
        this._handlers[event].splice(index, 1);
        if (this._handlers[event].length === 0) {delete this._handlers[event];}

        return true;
    }

    fire (event, ...args) {
        let handler;
        let handlers = this._handlers[event];
        if (typeof(handlers) === 'undefined') {return false;}

        for (handler of handlers) {handler(...args);}

        return true;
    }

    clear () {
        this._handlers = {};
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Observer;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_Helper__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Observer__ = __webpack_require__(3);
/**
 * Implements organism's code logic.
 * TODO: explain here code, byteCode, one number format,...
 *
 * @author DeadbraiN
 * TODO: may be this module is redundant
 */




const BITS_PER_VAR        = 2;
const BITS_OF_TWO_VARS    = BITS_PER_VAR * 2;
const BITS_OF_THREE_VARS  = BITS_PER_VAR * 3;
const BITS_OF_FIRST_VAR   = 32 - BITS_PER_VAR;
const OPERATOR_BITS       = 8;
const MAX_VAR             = 1 << BITS_PER_VAR;
const MAX_OPERATOR        = 1 << OPERATOR_BITS;
const VAR_BITS_OFFS       = 32 - OPERATOR_BITS;
const BITS_WITHOUT_2_VARS = 1 << (VAR_BITS_OFFS - BITS_PER_VAR * 2);
const HALF_OF_VAR         = MAX_VAR / 2;

class Code extends __WEBPACK_IMPORTED_MODULE_2__global_Observer__["a" /* default */] {
    static get VARS()          {return (32 - OPERATOR_BITS) / BITS_PER_VAR;}
    static get MAX_VAR()       {return MAX_VAR;}
    static get MAX_OPERATOR()  {return MAX_OPERATOR;}

    constructor(codeEndCb) {
        super();
		/**
		 * {Function} Callback, which is called on every organism 
		 * code iteration. On it's end.
		 */
		this._onCodeEnd = codeEndCb;
        // TODO: think about custom operators set from outside
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
         */
        this._OPERATOR_CB = {
            0 : this._onVar.bind(this),
            //1: this._onFunc.bind(this),
            1 : this._onCondition.bind(this),
            2 : this._onLoop.bind(this),
            3 : this._onOperator.bind(this),
            4 : this._not.bind(this),
            5 : this._onPi.bind(this),
            6 : this._onTrig.bind(this),
            7 : this._onLookAt.bind(this),
            8 : this._eatLeft.bind(this),
            9 : this._eatRight.bind(this),
            10: this._eatUp.bind(this),
            11: this._eatDown.bind(this),
            12: this._stepLeft.bind(this),
            13: this._stepRight.bind(this),
            14: this._stepUp.bind(this),
            15: this._stepDown.bind(this),
            16: this._fromMem.bind(this),
            17: this._toMem.bind(this),
            18: this._myX.bind(this),
            19: this._myY.bind(this)
        };
        this._OPERATORS_LEN = Object.keys(this._OPERATOR_CB).length;
        /**
         * {Array} Available conditions for if operator. Amount should be
         * the same like (1 << BITS_PER_VAR)
         */
        this._CONDITIONS = ['<', '>', '==', '!='];
		/**
		 * {Array} Available operators for math calculations
		 */
		this._OPERATORS = [
		    '+', '-', '*', '/', '%', '&', '|', '^', '>>', '<<', '>>>', '<', '>', '==', '!=', '<=' 
		];
		this._TRIGS     = ['sin', 'cos', 'tan', 'abs'];
        this._offsets   = [];

        this._byteCode  = [];
        this._code      = [];
        this._gen       = null;
        this.compile();
    }

    get size() {return this._byteCode.length;}

    clone(code) {
        this._code     = code.cloneCode();
        this._byteCode = code.cloneByteCode();
    }

    cloneCode() {
        return this._code.slice();
    }

    cloneByteCode() {
        return this._byteCode.slice();
    }

    insertLine() {
        this._byteCode.splice(__WEBPACK_IMPORTED_MODULE_1__global_Helper__["a" /* default */].rand(this._byteCode.length), 0, this.number());
    }

    updateLine(index, number) {
        this._byteCode[index] = number;
    }

    removeLine() {
        this._byteCode.splice(__WEBPACK_IMPORTED_MODULE_1__global_Helper__["a" /* default */].rand(this._byteCode.length), 1);
    }

    getLine(index) {
        return this._byteCode[index];
    }

    destroy() {
        this._byteCode = null;
        this._code     = null;
        this._gen      = null;
    }

    compile(org) {
        const header1 = 'this.__compiled=function* dna(org){var rand=Math.random,pi=Math.PI;';
        const vars    = this._getVars();
        const header2 = ';while(true){yield;';
        const footer  = ';this._onCodeEnd()}}';

        this._code = this._compileByteCode(this._byteCode);
        eval(header1 + vars + header2 + this._code.join(';') + footer);

        this._gen = this.__compiled(org);
    }

    run() {
        this._gen.next();
    }

    /**
     * We have to use >>> 0 at the end, because << operator works
     * with signed 32bit numbers, but not with unsigned like we need
     * @returns {number}
     */
    number() {
        const rand = __WEBPACK_IMPORTED_MODULE_1__global_Helper__["a" /* default */].rand;
        return (rand(this._OPERATORS_LEN) << (VAR_BITS_OFFS) | rand(0xffffff)) >>> 0;
    }

    getOperator(num) {
        return num >>> VAR_BITS_OFFS;
    }

    setOperator(num, op) {
        return (num & (op << VAR_BITS_OFFS) | 0x00ffffff) >>> 0;
    }

    /**
     * Sets variable bits into value 'val' and returns updated full number.
     * Example: _setVar(0xaabbccdd, 2, 0x3) -> 0x
     * @param {Number} num Original number
     * @param {Number} index Variable index
     * @param {Number} val New variable value
     * @returns {Number}
     * @private
     */
    setVar(num, index, val) {
        const bits  = index * BITS_PER_VAR;
        const lBits = VAR_BITS_OFFS - bits;
        const rBits = OPERATOR_BITS + bits + BITS_PER_VAR;

        return (num >>> lBits << lBits | val << (lBits - BITS) | num << rBits >>> rBits) >>> 0;
    }

    getVar(num, index) {
        return num << (OPERATOR_BITS + index * BITS_PER_VAR) >>> BITS_OF_FIRST_VAR;
    }
	
	/**
	 * Returns specified bits from 32bit number. e.g.: getBits(0b11001100, 3, 2) -> 01
	 * @param {Number} num
	 * @param {Number} start first bit offset
	 * @param {Number} len Amount of bits to get
	 * @return {Number} Cut bits (number)
	 */
	getBits(num, start, len) {
        return num << start >>> (32 - len);
    }

    _compileByteCode(byteCode) {
        const len         = byteCode.length;
        const operators   = this._OPERATOR_CB;
		const yieldPeriod = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].codeYieldPeriod;
        let   code        = new Array(len);
        let   offsets     = this._offsets;
        let   operator;

        for (let i = 0; i < len; i++) {
            operator = operators[this.getOperator(byteCode[i])](byteCode[i], i, len);
            //
            // This code is used for closing blocks for if, for and other
            // blocked operators.
            //
            if (offsets[offsets.length - 1] === i && offsets.length > 0) {
                operator = operator + '}';
                offsets.pop();
            }
			//
			// Every yieldPeriod 'yield' operator will be inserted into the code
			//
			if (i % yieldPeriod === 0 && i > 0) {operator = operator + ';yield';}
            code[i] = operator;
        }
        if (offsets.length > 0) {
		    code[code.length - 1] += ('}'.repeat(offsets.length));
		}

        return code;
    }

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
            code[i] = 'var v' + i + rand;
        }

        return code.join(';');
    }

    /**
     * Parses variable operator. Format: var = const|number. Number bits format:
     *   OPERATOR_BITS bits - operator id
     *   BITS_PER_VAR bits  - destination var index
     *   BITS_PER_VAR bits  - assign type (const (half of bits) or variable (half of bits))
     *   BITS_PER_VAR bits  - variable index or all bits till the end for constant
     *
     * @param {Number} num Packed into number code line
     * @return {String} Parsed code line string
     */
    _onVar(num) {
        const var0    = this.getVar(num, 0);
        const var1    = this.getVar(num, 1);
        const isConst = var1 > HALF_OF_VAR;

        return 'v' + var0 + '=' + (isConst ? __WEBPACK_IMPORTED_MODULE_1__global_Helper__["a" /* default */].rand(BITS_WITHOUT_2_VARS) : ('v' + var1));
    }

    _onFunc(num) {
        return '';
    }

    _onCondition(num, line, lines) {
        const var0    = this.getVar(num, 0);
        const var1    = this.getVar(num, 1);
        const var2    = this.getVar(num, 2);
        const var3    = this.getVar(num, 3);
        const index   = line + var3 < lines ? line + var3 : lines - 1;

        this._offsets.push(index);
        return 'if(v' + var0 + this._CONDITIONS[var2] + 'v' + var1 + '){';
    }

    _onLoop(num, line, lines) {
        const var2    = this.getVar(num, 3);
        const index   = line + var2 < lines ? line + var2 : lines - 1;
		const var0Str = 'v' + this.getVar(num, 0);
		const var1Str = 'v' + this.getVar(num, 1);
		const var3Str = 'v' + var2;

        this._offsets.push(index);
        return 'for(' + var0Str + '=' + var1Str + ';' + var0Str + '<' + var3Str + ';' + var0Str + '++' + '){yield';
    }

    _onOperator(num) {
        return 'v' + this.getVar(num, 0) + '=v' + this.getVar(num, 1) + this._OPERATORS[this.getBits(num, BITS_OF_THREE_VARS, BITS_OF_TWO_VARS)] + 'v' + this.getVar(num, 2);
    }

    _not(num) {
        return 'v' + this.getVar(num, 0) + '=!v' + this.getVar(num, 1);
    }

    _onPi(num) {
        return 'v' + this.getVar(num, 0) + '=pi';
    }
	
	_onTrig(num) {
		return 'v' + this.getVar(num, 0) + '=Math.' + this._TRIGS[this.getVar(num, 1)] + '(v' + this.getVar(num, 2) + ')';
	}

    _onLookAt(num) {
        return 'v' + this.getVar(num, 0) + '=org.lookAt(' + 'v' + this.getVar(num, 1) + ',v' + this.getVar(num, 2) + ')';
    }

    _eatLeft(num) {
		return 'v' + this.getVar(num, 0) + '=org.eatLeft(v' + this.getVar(num, 1) + ')';
    }

	_eatRight(num) {
		return 'v' + this.getVar(num, 0) + '=org.eatRight(v' + this.getVar(num, 1) + ')';
    }
	
	_eatUp(num) {
		return 'v' + this.getVar(num, 0) + '=org.eatUp(v' + this.getVar(num, 1) + ')';
    }
	
	_eatDown(num) {
		return 'v' + this.getVar(num, 0) + '=org.eatDown(v' + this.getVar(num, 1) + ')';
    }
	
	_stepLeft(num) {
		return 'v' + this.getVar(num, 0) + '=org.stepLeft()';
    }
	
	_stepRight(num) {
		return 'v' + this.getVar(num, 0) + '=org.stepRight()';
    }
	
	_stepUp(num) {
		return 'v' + this.getVar(num, 0) + '=org.stepUp()';
    }
	
	_stepDown(num) {
		return 'v' + this.getVar(num, 0) + '=org.stepDown()';
    }
	
	_fromMem(num) {
		return 'v' + this.getVar(num, 0) + '=org.fromMem()';
	}
	
	_toMem(num) {
		return 'org.toMem(' + this.getVar(num, 0) + ')';
	}
	
	_myX(num) {
		return 'v' + this.getVar(num, 0) + '=org.myX()';
	}
	
	_myY(num) {
		return 'v' + this.getVar(num, 0) + '=org.myY()';
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Code;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_Stack__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Observer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_Events__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__global_Helper__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Code__ = __webpack_require__(4);
/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author DeadbraiN
 */







class Organism extends __WEBPACK_IMPORTED_MODULE_2__global_Observer__["a" /* default */] {
    /**
     * Creates organism instance. If parent parameter is set, then
     * a clone of parent organism will be created.
     * @param {String} id Unique identifier of organism
     * @param {Number} x Unique X coordinate
     * @param {Number} y Unique Y coordinate
     * @param {Boolean} alive true if organism is alive
     * @param {Object} item Reference to the Queue item, where
     * this organism is located
	 * @param {Function} codeEndCb Callback, which is called at the 
     * end of every code iteration.
     * @param {Organism} parent Parent organism if cloning is needed
     */
    constructor(id, x, y, alive, item, codeEndCb, parent = null) {
        super();

        this._code                  = new __WEBPACK_IMPORTED_MODULE_5__Code__["a" /* default */](this._onCodeEnd.bind(this));

        if (parent === null) {this._create();}
        else {this._clone(parent);}

        this._id                    = id;
        this._x                     = x;
        this._y                     = y;
        this._alive                 = alive;
        this._item                  = item;

        this._mutationProbs         = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgMutationProbs;
        this._mutationClonePercent  = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgCloneMutation;
        this._mutationPeriod        = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgRainMutationPeriod;
        this._mutationPercent       = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgRainMutationPercent;
        this._mutations             = 1;
        this._energy                = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgStartEnergy;
        this._color                 = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgStartColor;
        this._age                   = 0;
        this._cloneEnergyPercent    = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgCloneEnergyPercent;
        this._fnId                  = 0;
        this._codeEndCb             = codeEndCb;
    }

    get id()                    {return this._id;}
    get x()                     {return this._x;}
    get y()                     {return this._y;}
    get alive()                 {return this._alive;}
    get item()                  {return this._item;}
    get mutationProbs()         {return this._mutationProbs;}
    get mutationPeriod()        {return this._mutationPeriod;}
    get mutationPercent()       {return this._mutationPercent;}
    get mutationClonePercent()  {return this._mutationClonePercent;}
    get mutations()             {return this._mutations;}
    get energy()                {return this._energy;}
    get color()                 {return this._color;}
    get mem()                   {return this._mem;}
    get age()                   {return this._age;}
    get cloneEnergyPercent()    {return this._cloneEnergyPercent;}
    get code()                  {return this._code;}
    get posId()                 {return __WEBPACK_IMPORTED_MODULE_4__global_Helper__["a" /* default */].posId(this._x, this._y);}

    set mutationClonePercent(m) {this._mutationClonePercent = m;}
    set mutationPeriod(m)       {this._mutationPeriod = m;}
    set mutationPercent(p)      {this._mutationPercent = p;}
    set cloneEnergyPercent(p)   {this._cloneEnergyPercent = p;}
    set mutations(m)            {
        this._mutations = m;
        this._updateColor(m);
    }

    /**
     * Runs one code iteration and returns
     * @return {Boolean} false means that organism was destroyed
     */
    run() {
        this._code.run();
        return this._updateDestroy() && this._updateEnergy();
    }

    grabEnergy(amount) {
        const noEnergy = (this._energy -= amount) < 1;
        noEnergy && this.destroy();
        return !noEnergy;
    }

    destroy() {
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].DESTROY, this);
        this._alive    = false;
        this._energy   = 0;
        this._item     = null;
        this._mem      = null;
        this._code     = null;
        this.clear();
    }

    lookAt() {
        let ret = {ret: 0};
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].GET_ENERGY, this, ret);
        return ret.ret;
    }

    eatLeft(amount) {
        let ret = {ret: amount};
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].EAT, this, this._x - 1, this._y, ret);
        return ret.ret;
    }

    eatRight(amount) {
        let ret = {ret: amount};
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].EAT, this, this._x + 1, this._y, ret);
        return ret.ret;
    }

    eatUp(amount) {
        let ret = {ret: amount};
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].EAT, this, this._x, this._y - 1, ret);
        return ret.ret;
    }

    eatDown(amount) {
        let ret = {ret: amount};
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].EAT, this, this._x, this._y + 1, ret);
        return ret.ret;
    }

    stepLeft() {
        let ret = {ret: null};
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].STEP, this, this._x, this._y, this._x - 1, this._y, ret);
        return ret.ret;
    }

    stepRight() {
        let ret = {ret: null};
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].STEP, this, this._x, this._y, this._x + 1, this._y, ret);
        return ret.ret;
    }

    stepUp() {
        let ret = {ret: null};
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].STEP, this, this._x, this._y, this._x, this._y - 1, ret);
        return ret.ret;
    }

    stepDown() {
        let ret = {ret: null};
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].STEP, this, this._x, this._y,  this._x, this._y + 1, ret);
        return ret.ret;
    }

	fromMem() {
        return this._mem.pop();
    }

	toMem(val) {
        this._mem.push(val);
    }

	myX() {
        return this._x;
    }

	myY() {
        return this._y;
    }

    _onCodeEnd() {
        this._age++;
        this._codeEndCb(this);
    }

    _updateColor(mutAmount) {
        const mutations = this._mutations;
        const colPeriod = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgColorPeriod;
        const colIndex  = mutations - (mutations % colPeriod);

        if (mutations > colPeriod && colIndex >= mutations - mutAmount && colIndex <= mutations) {
            if (++this._color > __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].ORG_MAX_COLOR) {this._color = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].ORG_FIRST_COLOR;}
        }
    }

    _create() {
        this._mem = new __WEBPACK_IMPORTED_MODULE_1__global_Stack__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgMemSize);
    }

    _clone(parent) {
        this._mem = parent.mem.clone();
        this._code.clone(parent.code);
    }

    /**
     * Checks if organism need to be killed/destroyed, because of age or zero energy
     * @return {Boolean} false means that organism was destroyed.
     * @private
     */
    _updateDestroy() {
        const alivePeriod = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgAlivePeriod;
        const needDestroy = this._energy < 1 || alivePeriod > 0 && this._age >= alivePeriod;

        needDestroy && this.destroy();

        return !needDestroy;
    }

    /**
     * This is how our system grabs an energy from organism if it's age is
     * divided into Config.orgEnergySpendPeriod.
     * @return {Boolean} false means that organism was destroyed.
     * @private
     */
    _updateEnergy() {
        if (__WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgEnergySpendPeriod === 0 || this._age % __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgEnergySpendPeriod !== 0) {return true;}
        const codeSize = this._code.size;
        let   grabSize = (((codeSize / __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].orgGarbagePeriod) + 0.5) << 1) >> 1; // analog of Math.round()

        if (codeSize > __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].codeMaxSize) {grabSize = codeSize * __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].codeSizeCoef;}
        if (grabSize < 1) {grabSize = 1;}
        grabSize = Math.min(this._energy, grabSize);
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].GRAB_ENERGY, grabSize);

        return this.grabEnergy(grabSize);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Organism;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_Observer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__visual_World__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__plugins_Organisms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__plugins_Mutator__ = __webpack_require__(11);
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





/**
 * {Array} Plugins for Manager
 */
const PLUGINS = [
    __WEBPACK_IMPORTED_MODULE_3__plugins_Organisms__["a" /* default */],
    __WEBPACK_IMPORTED_MODULE_4__plugins_Mutator__["a" /* default */]
];

class Manager extends __WEBPACK_IMPORTED_MODULE_1__global_Observer__["a" /* default */] {
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
        this._world   = new __WEBPACK_IMPORTED_MODULE_2__visual_World__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].worldWidth, __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].worldHeight);
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
        if (__WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].worldCyclical) {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Manager;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__manager_Manager__ = __webpack_require__(6);
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Config__ = __webpack_require__(0);
/**
 * Module for working with a browser console
 *
 * Usage:
 *   import Console from '.../Console';
 *   Console.msg('msg');
 *
 * @author DeadbraiN
 */


class Console {
    static error(...msg) {
        if (this._mode === __WEBPACK_IMPORTED_MODULE_0__Config__["a" /* default */].QUIET_NO) {return;}
        console.log(`%c${msg.join('')}`, 'background: #fff; color: #aa0000');
    }
    static warn (...msg) {
        if (this._mode === __WEBPACK_IMPORTED_MODULE_0__Config__["a" /* default */].QUIET_NO) {return;}
        console.log(`%c${msg.join('')}`, 'background: #fff; color: #cc7a00');
    }
    static info (...msg) {
        if (this._mode !== __WEBPACK_IMPORTED_MODULE_0__Config__["a" /* default */].QUIET_ALL) {return;}
        console.log(`%c${msg.join('')}`, 'background: #fff; color: #1a1a00');
    }
    static mode (mode = __WEBPACK_IMPORTED_MODULE_0__Config__["a" /* default */].QUIET_IMPORTANT) {this._mode = mode;}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Console;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Implementation of two directional Queue. Queue is a list of connected
 * items, where you may iterate back and forward using internal references
 * (next, prev). Every item of the queue contains custom value (in
 * 'val' field). This queue is used for speeding up organisms iteration.
 *
 * @author DeadbraiN
 */
class Queue {
    /**
     * At least one object should exist to exclude check
     * of empty queue in add/del methods
     */
    constructor() {
        this._last = this._first = {
            prev: null,
            next: null,
            val : null
        };
        this._size = 0;
    }

    get first() {return this._first;}
    get last()  {return this._last;}
    get size()  {return this._size;}

    /**
     * Wraps the value into item object and adds it to the end of the queue
     * @param {*} val Value for adding
     */
    add(val) {
        if (this._size++ > 0) {
            this._last = this._last.next = {
                prev: this._last,
                next: null,
                val: val
            };
            return;
        }

        this._first.val = val;
    }

    /**
     * Removes specified item from the queue. 'item' parameter is not
     * the same as value inside this item. Remember remove position may
     * be any in a queue.
     * @param {Object} item Item to remove
     */
    del(item) {
        if (--this._size < 1) {
            this._first.val = null;
            this._size = 0;
            return;
        }

        if (item.prev !== null) {item.prev.next = item.next;}
        else {this._first = item.next;}

        if (item.next !== null) {item.next.prev = item.prev;}
        else {this._last = item.prev;}
    }

    get(index) {
        let item = this._first;
        while (--index > -1 && item) {item = item.next;}
        return item;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Queue;


/***/ }),
/* 10 */
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
     * @param {Array} arr Array of elements for clonning
     * @param {Number} pos Starting position (if arr !null)
     */
    constructor(size, arr = null, pos = -1) {
        this._size = size;
        this._arr  = arr === null ? new Array(size) : arr;
        this._pos  = pos;
    }

    /**
     * Adds value at the top of the stack. If stack is full,
     * then false will be returned.
     * @param {*} val
     * @returns {boolean} true means, that value was added
     */
    push(val) {
        if (this._pos + 1 === this._size) {return false;}
        this._arr[++this._pos] = val;
        return true;
    }

    /**
     * Returns one value from the top of the stack
     * @return {*|null} null in case of mistake
     */
    pop() {
        if (this._pos < 0) {return null;}
        return this._arr[this._pos--];
    }

    size() {
        return this._pos + 1;
    }

    /**
     * Returns full clone of current stack instance
     * @return {Stack} Clonned Stack instance
     */
    clone() {
        return new Stack(this._size, this._arr.slice(), this._pos);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Stack;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Events__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Helper__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__organism_Organism__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__organism_Code__ = __webpack_require__(4);
/**
 * Plugin for Manager class, which is tracks when and how many mutations
 * should be added to special organism's code at special moment of it's
 * life.
 *
 * Depends on:
 *   manager/Manager
 *   manager/plugins/Organisms
 *
 * @author DeadbraiN
 */






class Mutator {
    constructor(manager) {
        this._manager = manager;
        this._MUTATION_TYPES = [
            this._onAdd.bind(this),
            this._onChange.bind(this),
            this._onDel.bind(this),
            this._onSmallChange.bind(this),
            this._onClone.bind(this),
            this._onPeriod.bind(this),
            this._onAmount.bind(this),
            this._onProbs.bind(this),
            this._onCloneEnergyPercent.bind(this)
        ]

        manager.on(__WEBPACK_IMPORTED_MODULE_0__global_Events__["a" /* default */].ORGANISM, this._onOrganism.bind(this));
        manager.on(__WEBPACK_IMPORTED_MODULE_0__global_Events__["a" /* default */].CLONE, this._onCloneOrg.bind(this));
    }

    destroy() {
    }

    _onOrganism(org) {
        if (__WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].orgRainMutationPeriod > 0 && org.mutationPeriod > 0 && org.age % org.mutationPeriod === 0) {
            this._mutate(org, false);
        }
    }

    _onCloneOrg(parent, child) {
        if (child.energy > 0) {this._mutate(child);}
    }

    _mutate(org, clone = true) {
        const code      = org.code;
        let   mutations = Math.round(code.size * org.mutationPercent) || 1;
        const probIndex = __WEBPACK_IMPORTED_MODULE_2__global_Helper__["a" /* default */].probIndex;
        const mTypes    = this._MUTATION_TYPES;

        for (let i = 0; i < mutations; i++) {
            mTypes[code.size < 1 ? 0 : probIndex(org.mutationProbs)](org);
        }
        org.mutations += mutations;
        org.code.compile(org);
        this._manager.fire(__WEBPACK_IMPORTED_MODULE_0__global_Events__["a" /* default */].MUTATIONS, org, mutations, clone);

        return mutations;
    }

    _onAdd(org) {
        org.code.insertLine();
    }

    _onChange(org) {
        const code = org.code;
        code.updateLine(__WEBPACK_IMPORTED_MODULE_2__global_Helper__["a" /* default */].rand(code.size), code.number());
    }

    _onDel(org) {
        org.code.removeLine();
    }

    /**
     * Operator type or one variable may mutate
     * @param {Organism} org
     * @private
     */
    _onSmallChange(org) {
        const index = __WEBPACK_IMPORTED_MODULE_2__global_Helper__["a" /* default */].rand(org.code.size);
        const code  = org.code;

        if (__WEBPACK_IMPORTED_MODULE_2__global_Helper__["a" /* default */].rand(1) === 0) {
            code.updateLine(index, code.setOperator(code.getLine[index], __WEBPACK_IMPORTED_MODULE_2__global_Helper__["a" /* default */].rand(__WEBPACK_IMPORTED_MODULE_4__organism_Code__["a" /* default */].MAX_OPERATOR)));
        } else {
            code.updateLine(index, code.setVar(code.getLine(index), __WEBPACK_IMPORTED_MODULE_2__global_Helper__["a" /* default */].rand(__WEBPACK_IMPORTED_MODULE_4__organism_Code__["a" /* default */].VARS), __WEBPACK_IMPORTED_MODULE_2__global_Helper__["a" /* default */].rand(__WEBPACK_IMPORTED_MODULE_4__organism_Code__["a" /* default */].MAX_VAR)));
        }
    }

    _onClone(org) {
        org.mutationClonePercent = Math.random();
    }

    _onPeriod(org) {
        org.mutationPeriod = __WEBPACK_IMPORTED_MODULE_2__global_Helper__["a" /* default */].rand(__WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].ORG_MAX_MUTATION_PERIOD);
    }

    _onAmount(org) {
        org.mutationPercent = Math.random();
    }

    _onProbs(org) {
        org.mutationProbs[__WEBPACK_IMPORTED_MODULE_2__global_Helper__["a" /* default */].rand(org.mutationProbs.length)] = __WEBPACK_IMPORTED_MODULE_2__global_Helper__["a" /* default */].rand(__WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].orgMutationProbsMaxValue);
    }

    _onCloneEnergyPercent(org) {
        org.cloneEnergyPercent = Math.random();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Mutator;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Helper__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Console__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_Events__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__global_Queue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__organism_Organism__ = __webpack_require__(5);
/**
 * Plugin for Manager module, which handles organisms population
 *
 * Events od Manager:
 *   ORGANISM(org) Fires after one organism has processed
 *
 * Depends on:
 *   manager/Manager
 *
 * @author DeadbraiN
 */







class Organisms {
    constructor(manager) {
        this._orgs          = new __WEBPACK_IMPORTED_MODULE_4__global_Queue__["a" /* default */]();
        this._codeRuns      = 0;
        this._stamp         = Date.now();
        this._manager       = manager;
        this._positions     = {};
        this._orgId         = 0;
        this._onIterationCb = this._onIteration.bind(this);
        this._onAfterMoveCb = this._onAfterMove.bind(this);

        __WEBPACK_IMPORTED_MODULE_0__global_Helper__["a" /* default */].override(manager, 'onIteration', this._onIterationCb);
        __WEBPACK_IMPORTED_MODULE_0__global_Helper__["a" /* default */].override(manager, 'onAfterMove', this._onAfterMoveCb);

        this._createPopulation();
    }

    destroy() {
        const man = this._manager;

        __WEBPACK_IMPORTED_MODULE_0__global_Helper__["a" /* default */].unoverride(man, 'onAfterMove', this._onAfterMoveCb);
        __WEBPACK_IMPORTED_MODULE_0__global_Helper__["a" /* default */].unoverride(man, 'onIteration', this._onIterationCb);
        this._positions = null;
        for (let org of this._orgs) {org.destroy();}
    }

    /**
     * Override of Manager.onIteration() method. Is called on every
     * iteration of main loop. The counter is an analog of time.
     * @param {Number} counter Value of main loop counter.
     * @param {Number} stamp Time stamp of current iteration
     * @private
     */
    _onIteration(counter, stamp) {
        const man  = this._manager;
        let   item = this._orgs.first;
        let   org;

        while (item) {
            org = item.val;
            man.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].ORGANISM, org);
            org.run();
            item = item.next;
        }

        this._updateClone(counter);
        this._updateCreate();
        this._updateIps(stamp);
    }

    /**
     * Cloning parents are chosen according two tournament principle
     * @param {Number} counter Current counter
     * @returns {boolean}
     * @private
     */
    _updateClone(counter) {
        const orgs      = this._orgs;
        const orgAmount = orgs.size;
        const needClone = __WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].orgClonePeriod === 0 ? false : counter % __WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].orgClonePeriod === 0;
        if (!needClone || orgAmount < 1 || orgAmount >= __WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].worldMaxOrgs) {return false;}

        let org1 = orgs.get(__WEBPACK_IMPORTED_MODULE_0__global_Helper__["a" /* default */].rand(orgAmount)).val;
        let org2 = orgs.get(__WEBPACK_IMPORTED_MODULE_0__global_Helper__["a" /* default */].rand(orgAmount)).val;

        if (!org1.alive && !org2.alive) {return false;}
        if ((org2.alive && !org1.alive) || (org2.energy * org2.mutations > org1.energy * org1.mutations)) {
            [org1, org2] = [org2, org1];
        }
        if (org2.alive && orgAmount >= __WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].worldMaxOrgs) {org2.destroy();}
        this._clone(org1);

        return true;
    }

    _updateCreate() {
        if (this._orgs.size < 1) {
            this._createPopulation();
        }
    }

    _updateIps(stamp) {
        const ts   = stamp - this._stamp;
        if (ts < __WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].worldIpsPeriodMs) {return;}
        const man  = this._manager;
        const orgs = this._orgs.size;

        let   ips;
        ips = this._codeRuns / orgs / (ts / 1000);
        __WEBPACK_IMPORTED_MODULE_2__global_Console__["a" /* default */].warn('ips: ', ips);
        man.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].IPS, ips);
        this._codeRuns = 0;
        this._stamp  = stamp;
    }

    _clone(org) {
        if (org.energy < 1) {return false;}
        let pos = this._manager.world.getNearFreePos(org.x, org.y);
        if (pos === false || this._createOrg(pos, org) === false) {return false;}
        let child  = this._orgs.last.val;
        let energy = (((org.energy * org.cloneEnergyPercent) + 0.5) << 1) >> 1; // analog of Math.round()

        org.grabEnergy(energy);
        child.grabEnergy(child.energy - energy);
        this._manager.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].CLONE, org, child);

        return true;
    }

    _createPopulation() {
        const world = this._manager.world;

        for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].orgStartAmount; i++) {
            this._createOrg(world.getFreePos());
        }
    }

    _createOrg(pos, parent = null) {
        const orgs = this._orgs;
        if (orgs.size >= __WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].worldMaxOrgs || pos === false) {return false;}
        orgs.add(null);
        let last   = orgs.last;
        let org    = new __WEBPACK_IMPORTED_MODULE_5__organism_Organism__["a" /* default */](++this._orgId + '', pos.x, pos.y, true, last, this._onCodeEnd.bind(this), parent);

        last.val = org;
        this._bindEvents(org);
        this._manager.move(pos.x, pos.y, pos.x, pos.y, org);
        this._positions[org.posId] = org;
        this._manager.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].BORN_ORGANISM, org);
        __WEBPACK_IMPORTED_MODULE_2__global_Console__["a" /* default */].info(org.id, ' born');

        return true;
    }
	
    _onAfterMove(x1, y1, x2, y2, org) {
        if (x1 !== x2 || y1 !== y2) {
            const posId = __WEBPACK_IMPORTED_MODULE_0__global_Helper__["a" /* default */].posId(x1, y1);
            delete this._positions[posId];
            this._positions[posId] = org;
        }

        return true;
    }

    _bindEvents(org) {
        org.on(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].DESTROY, this._onKillOrg.bind(this));
        org.on(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].GET_ENERGY, this._onGetEnergy.bind(this));
        org.on(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].EAT, this._onEat.bind(this));
        org.on(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].STEP, this._onStep.bind(this));
    }

    _onGetEnergy(org, ret) {
        if (typeof(this._positions[org.posId]) !== 'undefined') {
            ret.ret = this._positions[org.posId].energy;
        } else {
            ret.ret = this._manager.world.getDot(org.x, org.y)
        }
    }

    _onEat(org, x, y, ret) {
        const world = this._manager.world;

        if (__WEBPACK_IMPORTED_MODULE_1__global_Config__["a" /* default */].worldCyclical) {
            if (x < 0)                  {x = world.width - 1;}
            else if (x >= world.width)  {x = 0;}
            else if (y < 0)             {y = world.height - 1;}
            else if (y >= world.height) {y = 0;}
        }

        const posId = __WEBPACK_IMPORTED_MODULE_0__global_Helper__["a" /* default */].posId(x, y);
        const positions = this._positions;
        if (typeof(positions[posId]) === 'undefined') {
            ret.ret = world.grabDot(x, y, ret.ret);
        } else {
            ret.ret = ret.ret < 0 ? 0 : (ret.ret > positions[posId].energy ? positions[posId].energy : ret.ret);
            positions[posId].grabEnergy(ret.ret);
        }
    }

    _onStep(org, x1, y1, x2, y2, ret) {
        if (org.alive) {
            ret.ret = this._manager.move(x1, y1, x2, y2, org)
        }
    }

    _onCodeEnd() {
        this._codeRuns++;
    }

    _onKillOrg(org) {
        this._manager.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["a" /* default */].KILL_ORGANISM, org);
        this._orgs.del(org.item);
        delete this._positions[org.posId];
        __WEBPACK_IMPORTED_MODULE_2__global_Console__["a" /* default */].info(org.id, ' die');
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Organisms;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Observer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_Helper__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Events__ = __webpack_require__(2);
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
        this.fire(__WEBPACK_IMPORTED_MODULE_2__global_Events__["a" /* default */].DOT, x, y, color);

        return true;
    }

    getDot(x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {return false;}
        return this._data[x][y];
    }

    grabDot(x, y, amount) {
        let dot = Math.min(this.getDot(x, y), amount);

        if (dot > 0) {
            this.fire(__WEBPACK_IMPORTED_MODULE_2__global_Events__["a" /* default */].DOT, x, y, (this._data[x][y] -= dot));
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
            x = positions[j];
            y = positions[j + 1];
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