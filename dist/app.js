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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__organism_Organism__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Helper__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_Console__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__global_Stack__ = __webpack_require__(5);
/**
 * Main class of application. Contains entry point of jevo
 *
 * Usage:
 *   const manager = new Manager()
 *
 * @author DeadbraiN
 */






class Manager {
    constructor() {
        this._world     = null;
        this._positions = {};
        this._tasks     = null;
        this._killed    = null;
        this._orgId     = 1;
        this._quiet     = __WEBPACK_IMPORTED_MODULE_3__global_Console__["a" /* default */].MODE_QUIET_IMPORTANT;
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
        const worldMaxOrgs = __WEBPACK_IMPORTED_MODULE_0__global_Config__["a" /* default */].worldMaxOrgs;

        this._tasks  = new Array(worldMaxOrgs);
        this._killed = new __WEBPACK_IMPORTED_MODULE_4__global_Stack__["a" /* default */](worldMaxOrgs);
        for (let i = 0; i < worldMaxOrgs; i++) {
            //
            // We create temporary organisms to prevent keeping empty slots in array. All
            // these organisms will be removed later, during application working.
            //
            const org = new __WEBPACK_IMPORTED_MODULE_1__organism_Organism__["a" /* default */](i);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Manager;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__manager_Manager__ = __webpack_require__(0);
/**
 * @author DeadbraiN
 */


const manager = new __WEBPACK_IMPORTED_MODULE_0__manager_Manager__["a" /* default */]()
manager.run();

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Global jevo configuration file
 *
 * @author DeadbraiN
 */
const Config = {
    /**
     * {Number}
     * Maximum amount of organisms in a world. If some organisms will
     * try to clone itself, when entire amount of organisms are equal
     * this value, then it(clonning) will not happen.
     */
    worldMaxOrgs: 900
};

/* harmony default export */ __webpack_exports__["a"] = (Config);

/***/ }),
/* 3 */
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
    static msg(msg) {
        console.log(msg);
    }

    static mode(mode = MODE_QUIET_IMPORTANT) {
        this._mode = mode;
    }

    static get MODE_QUIET_ALL() {
        return MODE_QUIET_ALL;
    }

    static get MODE_QUIET_IMPORTANT() {
        return MODE_QUIET_IMPORTANT;
    }

    static get MODE_QUIET_NO() {
        return MODE_QUIET_NO;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Console;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @author DeadbraiN
 */
class Helper {
    static emptyFn () {}
}
/* unused harmony export default */


/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 *
 * @author DeadbraiN
 */
class Organism {

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Organism;


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map