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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Global jevo.js configuration file. Affects only current jevo
 * instance. Other instances may have different configuration values
 *
 * @author flatline
 * TODO: find and remove unused configs
 */
const QUIET_ALL               = 0;
const QUIET_IMPORTANT         = 1;
const QUIET_NO                = 2;

const ORG_MAX_MUTATION_PERIOD = 10000;
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
     * add, change, delete character of the jsvm; change amount of
     * mutations or change mutations period... Depending on these
     * values, organism may have different strategies of living.
     * For example: if add value is bigger then del and change,
     * then jsvm size will be grow up all the time. If del value is
     * bigger then other, then it will be decreased to zero lines
     * of jsvm and will die.
     * Format: [
     *     add          - Probability of adding of new character to the jsvm
     *     change       - Probability of changing existing character in a jsvm
     *     delete       - Probability of deleting of a character in a jsvm
     *     small-change - Probability of "small change" - change of expression part
     *     clone        - Probability for amount of mutations on clone
     *     copy         - Probability of copying of byte code part
     *     period       - Probability of period of organism mutations
     *     amount       - Probability of amount of mutations per period
     *     probs        - Probability of change one of probability coefficient
     *     clonePeriod  - Probability of change clone energy percent value
     * ]
     */
    orgMutationProbs: [50,80,10,100,1,10,10,10,10,10],
    /**
     * {Number} Max value, which we may use in orgMutationProbs array.
     */
    orgMutationProbsMaxValue: 100,
    /**
     * {Number} Percent of mutations from jsvm size, which will be applied to
     * organism after cloning. Should be <= 1.0
     */
    orgCloneMutationPercent: 0.10,
    /**
     * {Number} Amount of iterations before cloning process
     */
    orgClonePeriod: 5,
    /**
     * {Number} Amount of iterations, after which crossover will be applied
     * to random organisms. May be set to 0 to turn crossover off
     */
    orgCrossoverPeriod: 100,
    /**
     * {Number} Amount of iterations within organism's life loop, after that we
     * do mutations according to orgRainMutationPercent config. If 0, then
     * mutations will be disabled. Should be less then ORGANISM_MAX_MUTATION_PERIOD
     */
    orgRainMutationPeriod: 1000,
    /**
     * {Number} Value, which will be used like amount of mutations per
     * orgRainMutationPeriod iterations. 0 is a possible value if
     * we want to disable mutations. Should be less then 100
     */
    orgRainMutationPercent: 0.02,
    /**
     * {Number} Amount of organisms we have to create on program start
     */
    orgStartAmount: 500,
    /**
     * {Number} Amount of energy for first organisms. They are like Adam and
     * Eve. It means that these empty (without jsvm) organism were created
     * by operator and not by evolution.
     */
    orgStartEnergy: 10000,
    /**
     * {Number} Begin color of "empty" organism (organism without jsvm).
     */
    orgStartColor: 0xFF0000,
    /**
     * {Number} Amount of iterations within organism's life loop, after that we decrease
     * some amount of energy. If 0, then energy decreasing will be disabled.
     */
    orgEnergySpendPeriod: 10,
    /**
     * {Number} Amount of iterations when organism is alive. It will die after
     * this period. If 0, then will not be used.
     */
    orgAlivePeriod: 30000,
    /**
     * {Number} This value means the period between organism codeSizes, which
     * affects energy grabbing by the system. For example: we have two
     * organisms: org1.energy = 10, org2.energy = 10, org1.codeSize = 6,
     * org2.codeSize = 9, Config.orgGarbagePeriod = 5. It means that
     * during energy grabbing by the system org1 and org2 will spend the
     * same amount of energy - 1 unit. This is because the period goes
     * from 1..5, 6..10,... and both organisms are in the same period.
     */
    orgGarbagePeriod: 50,
    /**
     * {Number} Size of organism stack (internal memory)
     */
    orgMemSize: 64,
    /**
     * {Number} Percent of energy, which will be given to the child
     */
    orgCloneEnergyPercent: 0.5,
    /**
     * {Number} Maximum amount of arguments in custom functions. Minimum 1. Maximum
     * <= amount of default variables.
     */
    codeFuncParamAmount: 2,
    /**
     * {Number} If organism reach this limit of amount of jsvm lines, then codeSizeCoef
     * will be used during it's energy grabbing by system. We use this approach,
     * because our CPU's are slow and organisms with big codes are very slow. But
     * it's possible for organisms to go outside the limit by inventing new
     * effective mechanisms of energy obtaining.
     */
    codeMaxSize: 100,
    /**
     * {Number} This coefficiend is used for calculating of amount of energy,
     * which grabbed from each organism depending on his codeSize.
     * This coefficient affects entire jsvm size of population and
     * entire system speed. It depends on CPU speed also. So, for
     * different PC's it may be different.
     * Formula is the following: grabEnergy = cfg.codeSizeCoef * org.codeSize
     * See Config.codeMaxSize for details. This config will be turn on only if
     * organism reaches jsvm size limit Config.codeMaxSize
     */
    codeSizeCoef: 10000,
    /**
     * {Number} Amount of bits per one variable. It affects maximum value,
     * which this variable may contain. This value shouldn't be less then 2.
     */
    codeBitsPerVar: 2,
    /**
     * {Number} The value from -X/2 to X/2, which is used for setting
     * default value, while organism is delivering. So, if the value is
     * 1000, then ragne will be: -500..500
     */
    codeVarInitRange: 1000,
    /**
     * {Number} Every jsvm line 'yield' operator will be inserted to prevent
     * locking of threads. Set this value to value bigger then jsvm size, then
     * entire jsvm of organism will be run
     */
    codeYieldPeriod: 10,
    /**
     * {Number} Amount of bits for storing operator. This is first XX bits
     * in a number.
     */
    codeBitsPerOperator: 8,
    /**
     * {Number} Amount of bits, which stores maximum block length. Under block
     * length we mean maximum amount of lines in one block like if, for,...
     */
    codeBitsPerBlock: 4,
    /**
     * {Number} Amount of iterations between calls to V8 event loop. See
     * Manager._initLoop(), Manager.run() methods for details.
     */
    codeIterationsPerOnce: 50,
    /**
     * {String|null} Fitness class or null if default behavior is used. Default
     * behavior is a nature organisms simulator. See Manager.CLASS_MAP for additional
     * details.
     */
    codeFitnessCls: null,//'FitnessGarmin',
    /**
     * {String} Name of the organism class. All organisms in a world
     * will be creates as an instance of this class
     */
    codeOrganismCls: 'OrganismDos',//OrganismGarmin
    /**
     * {Function} Class with available operators. See default Operators
     * class for details. See Manager.CLASS_MAP for additional details.
     */
    codeOperatorsCls: 'OperatorsDos',//'OperatorsGarmin',
    /**
     * {String} Name of the class for string representation of byte jsvm
     */
    code2StringCls: 'Code2StringDos',//'Code2StringGarmin',
    /**
     * {Number} World width
     */
    worldWidth: 450,
    /**
     * {Number} World height
     */
    worldHeight: 450,
    /**
     * {Number} Turns on ciclic world mode. It means that organisms may go outside
     * it's border, but still be inside. For example, if the world has 10x10
     * size and the organism has 10x5 position in it, one step right will move
     * this organism at the position 1x5. The same scenario regarding Y
     * coordinate (height). It actual only for one instance mode (no distributed
     * calculations).
     */
    worldCyclical: true,
    /**
     * {Number} Maximum amount of organisms in a world. If some organisms will
     * try to clone itself, when entire amount of organisms are equal
     * this value, then it(cloning) will not happen.
     */
    worldMaxOrgs: 500,
    /**
     * {Number} Amount of energy blocks in a world. Blocks will be placed in a
     * random way...
     */
    worldEnergyDots: 1000,
    /**
     * {Number} Amount of energy in every block. See worldEnergyDots
     * config for details.
     */
    worldEnergyInDot: 0x00FF00,
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
    worldEnergyCheckPeriod: 5000,
    /**
     * {Number} World scaling. Today monitors pixel are so small, so we have
     * to zoom them with a coefficient.
     */
    worldZoom: 1,
    /**
     * {Number} Period of milliseconds, which is user for checking IPS value. It's
     * possible to increase it to reduce amount of requests and additional
     * jsvm in main loop
     */
    worldIpsPeriodMs: 10000,
    /**
     * {Number} Period of making automatic backup of application. In iterations
     */
    backupPeriod: 1000,
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
    modeQuiet: QUIET_IMPORTANT,
    /**
     * {Number} Maximum amount of connections for current server. Should
     * be quadratic (x^2) e.g.: 4, 9, 16,... This value will be extended
     * with additional "around" rows and columns for connecting with sibling
     * servers. So, result amount of cells will be e.g.: 16 + 2 rows + 2 cols.
     */
    serMaxConnections: 100,
    /**
     * {Number} Port number for connecting with server
     */
    serPort: 8099,
    /**
     * {String} Host for connecting with server
     */
    serHost: 'ws://localhost'
};

const api = {
    set: (key, val) => Config[key] = val,
    get: (key)      => Config[key]
};

module.exports = {Config, api};

// /**
//  * Global jevo.js configuration file. Affects only current jevo
//  * instance. Other instances may have different configuration values
//  *
//  * @author flatline
//  * TODO: find and remove unused values
//  */
// const QUIET_ALL               = 0;
// const QUIET_IMPORTANT         = 1;
// const QUIET_NO                = 2;
//
// const ORG_MAX_MUTATION_PERIOD = 1000;
// const ORG_FIRST_COLOR         = 1;
// const ORG_MAX_COLOR           = Number.MAX_SAFE_INTEGER;
//
// const Config = {
//     /**
//      * Constants of quite mode. This mode affects on amount and
//      * types of console messages. For example in QUIET_IMPORTANT
//      * mode info messages will be hidden.
//      */
//     QUIET_ALL              : QUIET_ALL,
//     QUIET_IMPORTANT        : QUIET_IMPORTANT,
//     QUIET_NO               : QUIET_NO,
//
//     ORG_MAX_MUTATION_PERIOD: ORG_MAX_MUTATION_PERIOD,
//     ORG_FIRST_COLOR        : ORG_FIRST_COLOR,
//     ORG_MAX_COLOR          : ORG_MAX_COLOR,
//     /**
//      * {Array} Probabilities with which mutator decides what to do:
//      * add, change, delete character of the jsvm; change amount of
//      * mutations or change mutations period... Depending on these
//      * values, organism may have different strategies of living.
//      * For example: if add value is bigger then del and change,
//      * then jsvm size will be grow up all the time. If del value is
//      * bigger then other, then it will be decreased to zero lines
//      * of jsvm and will die.
//      * Format: [
//      *     add          - Probability of adding of new character to the jsvm
//      *     change       - Probability of changing existing character in a jsvm
//      *     delete       - Probability of deleting of a character in a jsvm
//      *     small-change - Probability of "small change" - change of expression part
//      *     clone        - Probability for amount of mutations on clone
//      *     period       - Probability of period of organism mutations
//      *     amount       - Probability of amount of mutations per period
//      *     probs        - Probability of change one of probability coefficient
//      *     clonePeriod  - Probability of change clone energy percent value
//      * ]
//      */
//     orgMutationProbs: [50,80,20,100,1,1,1,1,1],
//     /**
//      * {Number} Max value, which we may use in orgMutationProbs array.
//      */
//     orgMutationProbsMaxValue: 100,
//     /**
//      * {Number} Percent of mutations from jsvm size, which will be applied to
//      * organism after cloning. Should be <= 1.0
//      */
//     orgCloneMutationPercent: 0.01,
//     /**
//      * {Number} Amount of iterations before cloning process
//      */
//     orgClonePeriod: 1,
//     /**
//      * {Number} Amount of iterations, after which crossover will be applied
//      * to random organisms.
//      */
//     orgCrossoverPeriod: 20,
//     /**
//      * {Number} Amount of iterations within organism's life loop, after that we
//      * do mutations according to orgRainMutationPercent config. If 0, then
//      * mutations will be disabled. Should be less then ORGANISM_MAX_MUTATION_PERIOD
//      */
//     orgRainMutationPeriod: 30,
//     /**
//      * {Number} Value, which will be used like amount of mutations per
//      * orgRainMutationPeriod iterations. 0 is a possible value if
//      * we want to disable mutations. Should be less then 100
//      */
//     orgRainMutationPercent: 0.02,
//     /**
//      * {Number} Amount of organisms we have to create on program start
//      */
//     orgStartAmount: 3,
//     /**
//      * {Number} Amount of energy for first organisms. They are like Adam and
//      * Eve. It means that these empty (without jsvm) organism were created
//      * by operator and not by evolution.
//      */
//     orgStartEnergy: 100,
//     /**
//      * {Number} Begin color of "empty" organism (organism without jsvm).
//      */
//     orgStartColor: 0xFF0000,
//     /**
//      * {Number} Amount of iterations within organism's life loop, after that we decrease
//      * some amount of energy. If 0, then energy decreasing will be disabled.
//      */
//     orgEnergySpendPeriod: 10,
//     /**
//      * {Number} Amount of iterations when organism is alive. It will die after
//      * this period. If 0, then will not be used.
//      */
//     orgAlivePeriod: 100,
//     /**
//      * {Number} This value means the period between organism codeSizes, which
//      * affects energy grabbing by the system. For example: we have two
//      * organisms: org1.energy = 10, org2.energy = 10, org1.codeSize = 6,
//      * org2.codeSize = 9, Config.orgGarbagePeriod = 5. It means that
//      * during energy grabbing by the system org1 and org2 will spend the
//      * same amount of energy - 1 unit. This is because the period goes
//      * from 1..5, 6..10,... and both organisms are in the same period.
//      */
//     orgGarbagePeriod: 10,
//     /**
//      * {Number} Size of organism stack (internal memory)
//      */
//     orgMemSize: 64,
//     /**
//      * {Number} Percent of energy, which will be given to the child
//      */
//     orgCloneEnergyPercent: 0.5,
//     /**
//      * {Number} This value will be used for multiplying it on organism energy
//      * in case if it (energy) was increased from the moment of last tournament.
//      * This is how we support mutations, which increase organism's energy
//      */
//     orgEnergyIncreaseCoef: 3,
//     /**
//      * {Number} Maximum amount of arguments in custom functions. Minimum 1. Maximum
//      * <= amount of default variables.
//      */
//     codeFuncParamAmount: 2,
//     /**
//      * {Number} If organism reach this limit of amount of jsvm lines, then codeSizeCoef
//      * will be used during it's energy grabbing by system. We use this approach,
//      * because our CPU's are slow and organisms with big codes are very slow. But
//      * it's possible for organisms to go outside the limit by inventing new
//      * effective mechanisms of energy obtaining.
//      */
//     codeMaxSize: 10,
//     /**
//      * {Number} This coefficiend is used for calculating of amount of energy,
//      * which grabbed from each organism depending on his codeSize.
//      * This coefficient affects entire jsvm size of population and
//      * entire system speed. It depends on CPU speed also. So, for
//      * different PC's it may be different.
//      * Formula is the following: grabEnergy = cfg.codeSizeCoef * org.codeSize
//      * See Config.codeMaxSize for details. This config will be turn on only if
//      * organism reaches jsvm size limit Config.codeMaxSize
//      */
//     codeSizeCoef: 10000,
//     /**
//      * {Number} The value from -X/2 to X/2, which is used for setting
//      * default value, while organism is delivering. So, if the value is
//      * 1000, then ragne will be: -500..500
//      */
//     codeVarInitRange: 1000,
//     /**
//      * {Number} Every jsvm line 'yield' operator will be inserted to prevent
//      * locking of threads. Set this value to value bigger then jsvm size, then
//      * entire jsvm of organism will be run
//      */
//     codeYieldPeriod: 1,
//     /**
//      * {Number} Amount of bits per one variable. It affects maximum value,
//      * which this variable may contain
//      */
//     codeBitsPerVar: 2,
//     /**
//      * {Number} Amount of bits for storing operator. This is first XX bits
//      * in a number.
//      */
//     codeBitsPerOperator: 8,
//     /**
//      * {Number} Amount of iterations between calls to V8 event loop. See
//      * Manager._initLoop(), Manager.run() methods for details.
//      */
//     codeIterationsPerOnce: 50,
//     /**
//      * {String|null} Fitness class or null if default behavior is used. Default
//      * behavior is a nature organisms simulator. See Manager.CLASS_MAP for additional
//      * details.
//      */
//     codeFitnessCls: null,//'FitnessGarmin',
//     /**
//      * {Function} Class with available operators. See default Operators
//      * class for details. See Manager.CLASS_MAP for additional details.
//      */
//     codeOperatorsCls: 'OperatorsDos',//'OperatorsGarmin',
//     /**
//      * {String} Name of the class for string representation of byte jsvm
//      */
//     code2StringCls: 'Code2StringDos',//'Code2StringGarmin',
//     /**
//      * {Number} World width
//      */
//     worldWidth: 5,
//     /**
//      * {Number} World height
//      */
//     worldHeight: 5,
//     /**
//      * {Number} Turns on ciclic world mode. It means that organisms may go outside
//      * it's border, but still be inside. For example, if the world has 10x10
//      * size and the organism has 10x5 position in it, one step right will move
//      * this organism at the position 1x5. The same scenario regarding Y
//      * coordinate (height).
//      */
//     worldCyclical: true,
//     /**
//      * {Number} Maximum amount of organisms in a world. If some organisms will
//      * try to clone itself, when entire amount of organisms are equal
//      * this value, then it(cloning) will not happen.
//      */
//     worldMaxOrgs: 4,
//     /**
//      * {Number} Amount of energy blocks in a world. Blocks will be placed in a
//      * random way...
//      */
//     worldEnergyDots: 10,
//     /**
//      * {Number} Amount of energy in every block. See worldEnergyDots
//      * config for details.
//      */
//     worldEnergyInDot: 0x00FF00,
//     /**
//      * {Number} Minimum percent of energy in current world. Under percent i mean
//      * percent from entire world area (100%). If the energy will be less
//      * or equal then this percent, then new random energy should be added.
//      * Should be less then 100.0 and more and equal to 0.0. 0.17 is a
//      * normal percent for this system.
//      */
//     worldEnergyCheckPercent: 0.3,
//     /**
//      * {Number} An amount of iteration, after which we have to check world energy
//      * amount. Works in pair with worldEnergyCheckPercent. May be 0 if
//      * you want to disable it
//      */
//     worldEnergyCheckPeriod: 500,
//     /**
//      * {Number} World scaling. Today monitors pixel are so small, so we have
//      * to zoom them with a coefficient.
//      */
//     worldZoom: 1,
//     /**
//      * {Number} Quite mode. This mode affects on amount and
//      * types of console messages. For example in QUIET_IMPORTANT
//      * mode info messages will be hidden.
//      */
//     worldQuiteMode: QUIET_IMPORTANT,
//     /**
//      * {Number} Period of milliseconds, which is user for checking IPS value. It's
//      * possible to increase it to reduce amount of requests and additional
//      * jsvm in main loop
//      */
//     worldIpsPeriodMs: 10000,
//     /**
//      * {Number} Period of making automatic backup of application. In iterations
//      */
//     backupPeriod: 1000,
//     /**
//      * {Number} Amount of backup files stored on HDD. Old files will be removed
//      */
//     backupAmount: 10,
//     /**
//      * {Number} The period of time between yield() calls in "stand by" mode.
//      * In this mode manager waits for data in sockets and new connections.
//      * In this mode yield() is called only once in a period, because
//      * it eats CPU cicles. In case of data in sockets or new connections
//      * yield() will be called more often.
//      */
//     conYieldPeriod: 0.01,
//     /**
//      * {Number} Percent of energy, which will be minused from organism after
//      * stepping from one instance to another.
//      */
//     conStepEnergySpendPercent: 20,
//     /**
//      * {Number} Starting number for TCP/IP listening
//      */
//     conServerPort: 2010,
//     /**
//      * {String} Works in pair with conServerPort. An IP of current
//      * server/instance.
//      * TODO: IPv6?
//      */
//     conServerIp: '127.0.0.1',
//     /**
//      * {Number} Port number for "fast" mode. It uses, for example, for pooling
//      */
//     conFastServerPort: 2011,
//     /**
//      * {Number} Left side server's (instance) port we want connect to. May be
//      * zero (0) if no left side server available.
//      */
//     conLeftServerPort: 0,
//     /**
//      * {String} Left server(instance) IP address. Works in pair with
//      * conLeftServerPort
//      */
//     conLeftServerIp: '127.0.0.1',
//     /**
//      * {Number} Right side server's (instance) port we want connect to. May be
//      * zero (0) if no right side server available.
//      */
//     conRightServerPort: 0,
//     /**
//      * {String} Right server(instance) IP address. Works in pair with
//      * conRightServerPort
//      */
//     conRightServerIp: '127.0.0.1',
//     /**
//      * {Number} Left up server's (instance) port we want connect to. May be
//      * zero (0) if no up side server available.
//      */
//     conUpServerPort: 0,
//     /**
//      * {String} Up server(instance) IP address. Works in pair with
//      * conUpServerPort
//      */
//     conUpServerIp: '127.0.0.1',
//     /**
//      * {Number} Left down server's (instance) port we want connect to. May be
//      * zero (0) if no down side server available.
//      */
//     conDownServerPort: 0,
//     /**
//      * {String} Down server(instance) IP address. Works in pair with
//      * conDownServerPort
//      */
//     conDownServerIp: '127.0.0.1',
//     /**
//      * {Array} Array of included plugins
//      */
//     plugIncluded: [],
//     /**
//      * {Array} Array of excluded plugins. Affects plugIncluded list
//      */
//     plugExcluded: [],
//     /**
//      * {Boolean} Debug mode. This mode means, that all debug messages
//      * will be posted to the terminal
//      */
//     modeDebug: false,
//     /**
//      * {Boolean} Testing mode. In this mode user may run jevo step by step
//      * and test it'sinternal parts. For example, during unit tests
//      */
//     modeTest: false,
//     /**
//      * {Boolean} Is used for profiling the application with ProfileView
//      * package. See run-profiling.sh for details
//      */
//     modeProfile: false,
//     /**
//      * {Number} Amount of iterations in profile mode after which ProfileView
//      * package will draw performance flame chart
//      */
//     modeProfilePeriod: 2000,
//     /**
//      * {Number} Amount of seconds for status showing in terminal
//      */
//     modeStatusPeriod: 10.0,
//     /**
//      * {Boolean} In this mode status report will be short or full
//      */
//     modeStatusFull: false,
//     /**
//      * {Number} Mode for showing/supressing of messages. Possible values:
//      *   0 - all messages
//      *   1 - only important messages
//      *   2 - no messages
//      */
//     modeQuiet: 1
// };
//
// export default Config;

// /**
//  * Global jevo.js configuration file. Affects only current jevo
//  * instance. Other instances may have different configuration values
//  *
//  * @author flatline
//  * TODO: find and remove unused values
//  */
// const QUIET_ALL               = 0;
// const QUIET_IMPORTANT         = 1;
// const QUIET_NO                = 2;
//
// const ORG_MAX_MUTATION_PERIOD = 1000;
// const ORG_FIRST_COLOR         = 1;
// const ORG_MAX_COLOR           = Number.MAX_SAFE_INTEGER;
//
// const Config = {
//     /**
//      * Constants of quite mode. This mode affects on amount and
//      * types of console messages. For example in QUIET_IMPORTANT
//      * mode info messages will be hidden.
//      */
//     QUIET_ALL              : QUIET_ALL,
//     QUIET_IMPORTANT        : QUIET_IMPORTANT,
//     QUIET_NO               : QUIET_NO,
//
//     ORG_MAX_MUTATION_PERIOD: ORG_MAX_MUTATION_PERIOD,
//     ORG_FIRST_COLOR        : ORG_FIRST_COLOR,
//     ORG_MAX_COLOR          : ORG_MAX_COLOR,
//     /**
//      * {Array} Probabilities with which mutator decides what to do:
//      * add, change, delete character of the jsvm; change amount of
//      * mutations or change mutations period... Depending on these
//      * values, organism may have different strategies of living.
//      * For example: if add value is bigger then del and change,
//      * then jsvm size will be grow up all the time. If del value is
//      * bigger then other, then it will be decreased to zero lines
//      * of jsvm and will die.
//      * Format: [
//      *     add          - Probability of adding of new character to the jsvm
//      *     change       - Probability of changing existing character in a jsvm
//      *     delete       - Probability of deleting of a character in a jsvm
//      *     small-change - Probability of "small change" - change of expression part
//      *     clone        - Probability for amount of mutations on clone
//      *     period       - Probability of period of organism mutations
//      *     amount       - Probability of amount of mutations per period
//      *     probs        - Probability of change one of probability coefficient
//      *     clonePeriod  - Probability of change clone energy percent value
//      * ]
//      */
//     orgMutationProbs: [50,80,20,100,1,1,1,1,1],
//     /**
//      * {Number} Max value, which we may use in orgMutationProbs array.
//      */
//     orgMutationProbsMaxValue: 100,
//     /**
//      * {Number} Percent of mutations from jsvm size, which will be applied to
//      * organism after cloning. Should be <= 1.0
//      */
//     orgCloneMutationPercent: 0.01,
//     /**
//      * {Number} Amount of iterations before clonning process
//      */
//     orgClonePeriod: 1,
//     /**
//      * {Number} Amount of iterations, after which crossover will be applied
//      * to random organisms.
//      */
//     orgCrossoverPeriod: 3,
//     /**
//      * {Number} Amount of iterations within organism's life loop, after that we
//      * do mutations according to orgRainMutationPercent config. If 0, then
//      * mutations will be disabled. Should be less then ORGANISM_MAX_MUTATION_PERIOD
//      */
//     orgRainMutationPeriod: 60,
//     /**
//      * {Number} Value, which will be used like amount of mutations per
//      * orgRainMutationPeriod iterations. 0 is a possible value if
//      * we want to disable mutations. Should be less then 100
//      */
//     orgRainMutationPercent: 0.01,
//     /**
//      * {Number} Amount of organisms we have to create on program start
//      */
//     orgStartAmount: 500,
//     /**
//      * {Number} Amount of energy for first organisms. They are like Adam and
//      * Eve. It means that these empty (without jsvm) organism were created
//      * by operator and not by evolution.
//      */
//     orgStartEnergy: 1,
//     /**
//      * {Number} Begin color of "empty" organism (organism without jsvm).
//      */
//     orgStartColor: 0xFF0000,
//     /**
//      * {Number} Amount of iterations within organism's life loop, after that we decrease
//      * some amount of energy. If 0, then energy decreasing will be disabled.
//      */
//     orgEnergySpendPeriod: 0,
//     /**
//      * {Number} Amount of iterations when organism is alive. It will die after
//      * this period. If 0, then will not be used.
//      */
//     orgAlivePeriod: 0,
//     /**
//      * {Number} This value means the period between organism codeSizes, which
//      * affects energy grabbing by the system. For example: we have two
//      * organisms: org1.energy = 10, org2.energy = 10, org1.codeSize = 6,
//      * org2.codeSize = 9, Config.orgGarbagePeriod = 5. It means that
//      * during energy grabbing by the system org1 and org2 will spend the
//      * same amount of energy - 1 unit. This is because the period goes
//      * from 1..5, 6..10,... and both organisms are in the same period.
//      */
//     orgGarbagePeriod: 10,
//     /**
//      * {Number} Size of organism stack (internal memory)
//      */
//     orgMemSize: 64,
//     /**
//      * {Number} Percent of energy, which will be given to the child
//      */
//     orgCloneEnergyPercent: 0.5,
//     /**
//      * {Number} Maximum amount of arguments in custom functions. Minimum 1. Maximum
//      * <= amount of default variables.
//      */
//     codeFuncParamAmount: 2,
//     /**
//      * {Number} If organism reach this limit of amount of jsvm lines, then codeSizeCoef
//      * will be used during it's energy grabbing by system. We use this approach,
//      * because our CPU's are slow and organisms with big codes are very slow. But
//      * it's possible for organisms to go outside the limit by inventing new
//      * effective mechanisms of energy obtaining.
//      */
//     codeMaxSize: 20,
//     /**
//      * {Number} This coefficiend is used for calculating of amount of energy,
//      * which grabbed from each organism depending on his codeSize.
//      * This coefficient affects entire jsvm size of population and
//      * entire system speed. It depends on CPU speed also. So, for
//      * different PC's it may be different.
//      * Formula is the following: grabEnergy = cfg.codeSizeCoef * org.codeSize
//      * See Config.codeMaxSize for details. This config will be turn on only if
//      * organism reaches jsvm size limit Config.codeMaxSize
//      */
//     codeSizeCoef: 10000,
//     /**
//      * {Number} The value from -X/2 to X/2, which is used for setting
//      * default value, while organism is delivering. So, if the value is
//      * 1000, then ragne will be: -500..500
//      */
//     codeVarInitRange: 1000,
//     /**
//      * {Number} Every jsvm line 'yield' operator will be inserted to prevent
//      * locking of threads. Set this value to value bigger then jsvm size, then
//      * entire jsvm of organism will be run
//      */
//     codeYieldPeriod: 1000,
//     /**
//      * {Number} Amount of bits per one variable. It affects maximum value,
//      * which this variable may contain
//      */
//     codeBitsPerVar: 2,
//     /**
//      * {Number} Amount of bits for storing operator. This is first XX bits
//      * in a number.
//      */
//     codeBitsPerOperator: 8,
//     /**
//      * {Number} Amount of iterations between calls to V8 event loop. See
//      * Manager._initLoop(), Manager.run() methods for details.
//      */
//     codeIterationsPerOnce: 20,
//     /**
//      * {String|null} Fitness class or null if default behavior is used. Default
//      * behavior is a nature organisms simulator. See Manager.CLASS_MAP for additional
//      * details.
//      */
//     codeFitnessCls: 'FitnessGarmin',
//     /**
//      * {Function} Class with available operators. See default Operators
//      * class for details. See Manager.CLASS_MAP for additional details.
//      */
//     codeOperatorsCls: 'OperatorsGarmin',
//     /**
//      * {String} Name of the class for string representation of byte jsvm
//      */
//     code2StringCls: 'Code2StringGarmin',
//     /**
//      * {Number} World width
//      */
//     worldWidth: 30,
//     /**
//      * {Number} World height
//      */
//     worldHeight: 30,
//     /**
//      * {Number} Turns on ciclic world mode. It means that organisms may go outside
//      * it's border, but still be inside. For example, if the world has 10x10
//      * size and the organism has 10x5 position in it, one step right will move
//      * this organism at the position 1x5. The same scenario regarding Y
//      * coordinate (height).
//      */
//     worldCyclical: true,
//     /**
//      * {Number} Maximum amount of organisms in a world. If some organisms will
//      * try to clone itself, when entire amount of organisms are equal
//      * this value, then it(cloning) will not happen.
//      */
//     worldMaxOrgs: 500,
//     /**
//      * {Number} Amount of energy blocks in a world. Blocks will be placed in a
//      * random way...
//      */
//     worldEnergyDots: 1000,
//     /**
//      * {Number} Amount of energy in every block. See worldEnergyDots
//      * config for details.
//      */
//     worldEnergyInDot: 0x00FF00,
//     /**
//      * {Number} Minimum percent of energy in current world. Under percent i mean
//      * percent from entire world area (100%). If the energy will be less
//      * or equal then this percent, then new random energy should be added.
//      * Should be less then 100.0 and more and equal to 0.0. 0.17 is a
//      * normal percent for this system.
//      */
//     worldEnergyCheckPercent: 0.3,
//     /**
//      * {Number} An amount of iteration, after which we have to check world energy
//      * amount. Works in pair with worldEnergyCheckPercent. May be 0 if
//      * you want to disable it
//      */
//     worldEnergyCheckPeriod: 0,
//     /**
//      * {Number} World scaling. Today monitors pixel are so small, so we have
//      * to zoom them with a coefficient.
//      */
//     worldZoom: 1,
//     /**
//      * {Number} Quite mode. This mode affects on amount and
//      * types of console messages. For example in QUIET_IMPORTANT
//      * mode info messages will be hidden.
//      */
//     worldQuiteMode: QUIET_IMPORTANT,
//     /**
//      * {Number} Period of milliseconds, which is user for checking IPS value. It's
//      * possible to increase it to reduce amount of requests and additional
//      * jsvm in main loop
//      */
//     worldIpsPeriodMs: 10000,
//     /**
//      * {Number} Period of making automatic backup of application. In iterations
//      */
//     backupPeriod: 100,
//     /**
//      * {Number} Amount of backup files stored on HDD. Old files will be removed
//      */
//     backupAmount: 10,
//     /**
//      * {Number} The period of time between yield() calls in "stand by" mode.
//      * In this mode manager waits for data in sockets and new connections.
//      * In this mode yield() is called only once in a period, because
//      * it eats CPU cicles. In case of data in sockets or new connections
//      * yield() will be called more often.
//      */
//     conYieldPeriod: 0.01,
//     /**
//      * {Number} Percent of energy, which will be minused from organism after
//      * stepping from one instance to another.
//      */
//     conStepEnergySpendPercent: 20,
//     /**
//      * {Number} Starting number for TCP/IP listening
//      */
//     conServerPort: 2010,
//     /**
//      * {String} Works in pair with conServerPort. An IP of current
//      * server/instance.
//      * TODO: IPv6?
//      */
//     conServerIp: '127.0.0.1',
//     /**
//      * {Number} Port number for "fast" mode. It uses, for example, for pooling
//      */
//     conFastServerPort: 2011,
//     /**
//      * {Number} Left side server's (instance) port we want connect to. May be
//      * zero (0) if no left side server available.
//      */
//     conLeftServerPort: 0,
//     /**
//      * {String} Left server(instance) IP address. Works in pair with
//      * conLeftServerPort
//      */
//     conLeftServerIp: '127.0.0.1',
//     /**
//      * {Number} Right side server's (instance) port we want connect to. May be
//      * zero (0) if no right side server available.
//      */
//     conRightServerPort: 0,
//     /**
//      * {String} Right server(instance) IP address. Works in pair with
//      * conRightServerPort
//      */
//     conRightServerIp: '127.0.0.1',
//     /**
//      * {Number} Left up server's (instance) port we want connect to. May be
//      * zero (0) if no up side server available.
//      */
//     conUpServerPort: 0,
//     /**
//      * {String} Up server(instance) IP address. Works in pair with
//      * conUpServerPort
//      */
//     conUpServerIp: '127.0.0.1',
//     /**
//      * {Number} Left down server's (instance) port we want connect to. May be
//      * zero (0) if no down side server available.
//      */
//     conDownServerPort: 0,
//     /**
//      * {String} Down server(instance) IP address. Works in pair with
//      * conDownServerPort
//      */
//     conDownServerIp: '127.0.0.1',
//     /**
//      * {Array} Array of included plugins
//      */
//     plugIncluded: [],
//     /**
//      * {Array} Array of excluded plugins. Affects plugIncluded list
//      */
//     plugExcluded: [],
//     /**
//      * {Boolean} Debug mode. This mode means, that all debug messages
//      * will be posted to the terminal
//      */
//     modeDebug: false,
//     /**
//      * {Boolean} Testing mode. In this mode user may run jevo step by step
//      * and test it'sinternal parts. For example, during unit tests
//      */
//     modeTest: false,
//     /**
//      * {Boolean} Is used for profiling the application with ProfileView
//      * package. See run-profiling.sh for details
//      */
//     modeProfile: false,
//     /**
//      * {Number} Amount of iterations in profile mode after which ProfileView
//      * package will draw performance flame chart
//      */
//     modeProfilePeriod: 2000,
//     /**
//      * {Number} Amount of seconds for status showing in terminal
//      */
//     modeStatusPeriod: 10.0,
//     /**
//      * {Boolean} In this mode status report will be short or full
//      */
//     modeStatusFull: false,
//     /**
//      * {Number} Mode for showing/supressing of messages. Possible values:
//      *   0 - all messages
//      *   1 - only important messages
//      *   2 - no messages
//      */
//     modeQuiet: 1
// };
//
// export default Config;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EVENTS", function() { return EVENTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EVENT_AMOUNT", function() { return EVENT_AMOUNT; });
/**
 * List of all available event ids. New events should be added to
 * the end of the list. Last event id should be bigger then all other
 *
 * @author flatline
 * TODO: find unused and remove. But after main code is done.
 */
const EVENTS = {
    YIELD          : 0,
    ITERATION      : 1,
    IPS            : 2,
    REQUEST        : 3,
    BACKUP         : 4,
    YIELDTO        : 5,
    ORGANISM       : 6,
    GRAB_ENERGY    : 7,
    UPDATE_ENERGY  : 8,
    KILL_ORGANISM  : 9,
    MUTATIONS      : 10,
    CLONE          : 11,
    EAT            : 12,
    STEP           : 13,
    STEP_OUT       : 14,
    STEP_IN        : 15,
    EAT_ORGANISM   : 16,
    EAT_ENERGY     : 17,
    BORN_ORGANISM  : 18,
    DOT_REQUEST    : 19,
    STEP_YIELD     : 20,
    BEFORE_RESPONSE: 21,
    AFTER_REQUEST  : 22,
    GET_ENERGY     : 23,
    PROP_LEFT      : 24,
    PROP_RIGHT     : 25,
    PROP_UP        : 26,
    PROP_DOWN      : 27,
    DOT            : 28,
    MOVE           : 29,
    GRAB_LEFT      : 30,
    GRAB_RIGHT     : 31,
    GRAB_UP        : 32,
    GRAB_DOWN      : 33,
    DESTROY        : 34,
    STOP           : 35,
    RESET_CODE     : 36,
    CHECK_AT       : 37
};

const EVENT_AMOUNT = Object.keys(EVENTS).length;



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Global helper class
 *
 * @author flatline
 */
const Config = __webpack_require__(0).Config;
const DIR    = __webpack_require__(11).DIR;

class Helper {
    /**
     * Calculates unique id for world's coordinates. For the same x,y
     * id will be the same.
     * @param {Number} x
     * @param {Number} y
     * @returns {Number} unique id
     */
    static posId(x, y) {
        return y * Config.worldWidth + x;
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
                fn.fn.apply(obj, args);
                return fn(...args);
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
    static rand(n) {return Math.trunc(Math.random() * n)}
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
        if (len < 1) {return -1}
        let sum = probs.reduce((a, b) => a + b, 0);
        if (sum < 1) {return -1}
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
            for (i = 0; i < len; i++)  {if (num <= (sum += probs[i])) break}
        } else {
            for (i = len-1; i>-1; i--) {if (num >  (sum -= probs[i])) break}
        }

        return i;
    }
    /**
     * Checks if position is empty. x == y == 0 - this is empty
     * @param {Object} pos Position to check
     */
    static empty(pos) {return pos.x === 0 && pos.y === 0}
    /**
     * Does normalization of X and Y coordinates. It's used
     * in cyclical mode for checking if we out of bound (world).
     * In non cyclical mode it just returns the same coordinates.
     * Usage: [x, y, dir] = Helper.normalize(10, -1); // 10, 100 (height - 1)
     * 'dir' parameter means 'direction' and will be set only if
     * one or two coordinates are out of bounds (world). Otherwise
     * 'dir' parameter will be set to DIR.NO value.
     * @param {Number} x
     * @param {Number} y
     * @returns {[x,y,dir]}
     */
    static normalize(x, y) {
        let dir = DIR.NO;

        if (x < 0) {dir = DIR.LEFT; x = Config.worldWidth - 1}
        else if (x >= Config.worldWidth)  {dir = DIR.RIGHT; x = 0}

        if (y < 0) {dir = DIR.UP; y = Config.worldHeight - 1}
        else if (y >= Config.worldHeight) {dir = DIR.DOWN; y = 0}

        return [x, y, dir];
    }

    /**
     * Analog of jQuery.isNumeric()
     * @param {*} n Value to check
     * @returns {Boolean}
     */
    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Generates unique numeric ids
     * @returns {Number}
     */
    static getId() {
        return ++this._id;
    }

    static isFunc(v) {
        return typeof v === 'function';
    }

    // TODO: will be used later
    // /**
    //  * Saves custom data into the file. If file exists, it will
    //  * be overrided. It's only rewrites existing file and not
    //  * append it. It also doesn't work with native types, in sense
    //  * that you can't save native values into the file without *
    //  * meta information. For example, you can't store ascii string
    //  * in a file without special prefic before it.
    //  * @param {Object} data Data to save
    //  * @param {String} file File name/Key name
    //  * TODO: FileApi should be used
    //  */
    // static save(data, file = "backup.data") {
    //     localStorage[file] = JSON.stringify(data);
    // }
    // /**
    //  * Loads custom data from the file
    //  * @param file File name
    //  * @return {Object} loading result or nothing
    //  * TODO: FileApi should be used
    //  */
    // static load(file = "backup.data") {
    //     return JSON.parse(localStorage[file]);
    // }
}

/**
 * {Number} Is used as unique id generator
 */
Helper._id = 0;

module.exports = Helper;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__);
/**
 * Module for working with a browser console
 *
 * Usage:
 *   import Console from '.../Console';
 *   Console.msg('msg');
 *
 * @author flatline
 */


class Console {
    static error(...msg) {
        if (this._mode === __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].QUIET_NO) {return}
        console.log(`%c${msg.join('')}`, 'background: #fff; color: #aa0000');
    }
    static warn (...msg) {
        if (this._mode === __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].QUIET_NO) {return}
        console.log(`%c${msg.join('')}`, 'background: #fff; color: #cc7a00');
    }
    static info (...msg) {
        if (this._mode !== __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].QUIET_ALL) {return}
        console.log(`%c${msg.join('')}`, 'background: #fff; color: #1a1a00');
    }
    static mode (mode = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].QUIET_IMPORTANT) {this._mode = mode}
}
/* harmony export (immutable) */ __webpack_exports__["default"] = Console;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__);
/**
 * Class - helper for working with with byte code numbers
 *
 * @author flatline
 */



const BITS_PER_VAR        = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeBitsPerVar;
const BITS_PER_OPERATOR   = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeBitsPerOperator;
const NO_OPERATOR_MASK    = 0xffffffff >>> BITS_PER_OPERATOR;
const BITS_OF_TWO_VARS    = BITS_PER_VAR * 2;
const BITS_OF_FIRST_VAR   = 32 - BITS_PER_VAR;
const MAX_VAR             = 1 << BITS_PER_VAR;
const MAX_OPERATOR        = 1 << BITS_PER_OPERATOR;
const VAR_BITS_OFFS       = 32 - BITS_PER_OPERATOR;
const BITS_WITHOUT_2_VARS = 1 << (VAR_BITS_OFFS - BITS_PER_VAR * 2);

class Num {
    static get VAR_BITS_OFFS()       {return VAR_BITS_OFFS}
    static get BITS_PER_VAR()        {return BITS_PER_VAR}
    static get BITS_PER_OPERATOR()   {return BITS_PER_OPERATOR}
    static get VARS()                {return (32 - BITS_PER_OPERATOR) / BITS_PER_VAR}
    static get MAX_VAR()             {return MAX_VAR}
    static get BITS_OF_TWO_VARS()    {return BITS_OF_TWO_VARS}
    static get MAX_OPERATOR()        {return MAX_OPERATOR}
    static get BITS_WITHOUT_2_VARS() {return BITS_WITHOUT_2_VARS}

    /**
     * Sets amount of available operators for first bits
     * @param {Number} amount
     */
    static setOperatorAmount(amount) {
        this._operatorsAmount = amount;
    }

    /**
     * We have to use >>> 0 at the end, because << operator works
     * with signed 32bit numbers, but not with unsigned like we need
     * @returns {number}
     */
    static get() {
        const rand = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default.a.rand;
        return (rand(this._operatorsAmount) << (VAR_BITS_OFFS) | rand(NO_OPERATOR_MASK)) >>> 0;
    }

    static getOperator(num) {
        return num >>> VAR_BITS_OFFS;
    }

    static setOperator(num, op) {
        return (op << VAR_BITS_OFFS | (num & NO_OPERATOR_MASK)) >>> 0;
    }

    static getVar(num, index = 0) {
        return num << (BITS_PER_OPERATOR + index * BITS_PER_VAR) >>> BITS_OF_FIRST_VAR;
    }

    /**
     * Sets variable bits into value 'val' and returns updated full number.
     * Example: _setVar(0xaabbccdd, 2, 0x3) -> 0x
     * @param {Number} num Original number
     * @param {Number} index Variable index
     * @param {Number} val New variable value
     * @returns {Number}
     */
    static setVar(num, index, val) {
        const bits  = index * BITS_PER_VAR;
        const lBits = VAR_BITS_OFFS - bits;
        const rBits = BITS_PER_OPERATOR + bits + BITS_PER_VAR;

        return (num >>> lBits << lBits | val << (VAR_BITS_OFFS - bits - BITS_PER_VAR) | num << rBits >>> rBits) >>> 0;
    }

    /**
     * Returns specified bits from 32bit number. e.g.: getBits(0b11001100, 3, 2) -> 01
     * @param {Number} num
     * @param {Number} start first bit offset
     * @param {Number} len Amount of bits to get
     * @return {Number} Cut bits (number)
     */
    static getBits(num, start, len) {
        return num << start >>> (32 - len);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Num;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Observer implementation. May fire, listen(on()) and clear all the event
 * handlers. This class is optimized for speed. This is why it works with
 * array of numbers as events instead of frequent strings.
 *
 * Usage:
 *   import {EVENTS}       from '.../Events.js'
 *   import {EVENT_AMOUNT} from '.../Events.js'
 *
 *   let bus = new Observer();
 *   bus.on(EVENTS.EVENT, () => console.log(arguments));
 *   bus.fire(EVENTS.EVENT, 1, 2, 3);
 *
 * @author flatline
 */
class Observer {
    /**
     * Constructs handlers map. maxIndex means maximum event value
     * for entire Observer instance life.
     * @param {Number} maxIndex Maximum event index, for current instance
     */
    constructor(maxIndex) {
        this._maxIndex = +maxIndex || 0;
        this._resetEvents();
    }

    on (event, handler) {
        if (typeof(this._handlers[event]) === 'undefined') {return false}
        this._handlers[event].push(handler);

        return true;
    }

    off (event, handler) {
        let index;
        let handlers = this._handlers[event];

        if ((index = handlers.indexOf(handler)) < 0) {return false}
        handlers.splice(index, 1);

        return true;
    }

    /**
     * This method is a most frequently called one. So we have to
     * optimize it as much as possible
     * @param {Number} event Event number
     * @param {*} args List of arguments
     * @param args
     */
    fire (event, ...args) {
        let handlers = this._handlers[event] || [];
        for (let handler of handlers) {handler(...args)}
    }

    /**
     * Removes all the handlers from Observer. It's still possible
     * to use on()/off() methods for working with events, but max
     * event index set in constructor will be the same.
     */
    clear () {
        this._resetEvents();
    }

    _resetEvents() {
        const len      = this._maxIndex;
        const handlers = this._handlers = new Array(len);
        for (let i = 0; i < len; i++) {handlers[i] = []}
    }
}

module.exports = Observer;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Contains Id's for requests from client to server and from server to client
 *
 * @author flatline
 */
/**
 * {Object} Different bit masks
 */
const MASKS = {
    REQ_MASK: 0x80000000, // 10000000000000000000000000000000
    RES_MASK: 0x7fffffff  // 01111111111111111111111111111111
};
/**
 * {Object} Id's of requests from client to server and visa versa
 */
const TYPES = {
    //
    // Requests section
    //
    REQ_SET_ACTIVE     : 0,
    REQ_MOVE_ORG       : 1,
    REQ_GIVE_ID        : 2,
    REQ_SET_NEAR_ACTIVE: 3,
    //
    // Responses section
    //
    RES_MOVE_ERR       : 1000,
    RES_ACTIVE_OK      : 1001,
    RES_INVALID_TYPE   : 1002
};

module.exports = {TYPES: TYPES, MASKS: MASKS};

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_Organism__ = __webpack_require__(10);
/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author flatline
 */


class OrganismDos extends __WEBPACK_IMPORTED_MODULE_0__base_Organism__["a" /* default */] {
    onRun() {
        this.jsvm.run(this);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OrganismDos;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Console__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_Events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_src_global_Queue__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_src_global_Queue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__common_src_global_Queue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__organism_OrganismDos__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Backup__ = __webpack_require__(23);
/**
 * Base class for OrganismsXXX plugins. Manages organisms. Makes
 * cloning, crossover, organisms comparison, killing and more...
 * Main function of this plugin is run organism's in an infinite
 * loop.
 *
 * @author flatline
 */








const RAND_OFFS = 4;

class Organisms {
    /**
     * Compares two organisms and returns more fit one
     * @param {Organism} org1
     * @param {Organism} org2
     * @return {Organism}
     * @abstract
     */
    compare(org1, org2) {}

    /**
     * Is called every time after organism's code was run
     * @param {Organism} org
     * @abstract
     */
    onOrganism(org) {}

    /**
     * Is called after moving of organism is done. Updates this._positions
     * map with a new position of organism
     * @param {Number} x1 Start X position
     * @param {Number} y1 Start Y position
     * @param {Number} x2 End X position
     * @param {Number} y2 End Y position
     * @param {Organism} org Organism, which is moving
     * @returns {Boolean}
     * @abstract
     */
    onAfterMove(x1, y1, x2, y2, org) {}

    /**
     * Is called before cloning of organism
     * @param {Organism} org
     * @abstract
     */
    onBeforeClone(org) {}

    /**
     * Is called after cloning of organism
     * @param {Organism} org Parent organism
     * @param {Organism} child Child organism
     * @abstract
     */
    onClone(org, child) {}

    /**
     * Is called after organism has created
     * @param {Organism} org
     * @abstract
     */
    onAfterCreateOrg(org) {}

    /**
     * Is called after organism has killed
     * @param {Organism} org Killed organism
     * @abstract
     */
    onAfterKillOrg(org) {}

    constructor(manager) {
        this.organisms      = new __WEBPACK_IMPORTED_MODULE_4__common_src_global_Queue___default.a();
        this.backup         = new __WEBPACK_IMPORTED_MODULE_6__Backup__["a" /* default */]();
        this.codeRuns       = 0;
        this.stamp          = Date.now();
        this.manager        = manager;
        this._CLASS_MAP     = this.manager.CLASS_MAP;
        this.code2Str       = new this._CLASS_MAP[__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].code2StringCls];
        this.randOrgItem    = this.organisms.first;
        this._ORG_CLS       = this._CLASS_MAP[__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeOrganismCls];
        this._onIterationCb = this.onIteration.bind(this);

        this.reset();
        __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default.a.override(manager, 'onIteration', this._onIterationCb);
        //
        // API of the Manager for accessing outside. (e.g. from Console)
        //
        manager.api.formatCode = (code) => this.code2Str.format(code);
    }

    get orgs() {return this.organisms}

    destroy() {
        __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default.a.unoverride(man, 'onIteration', this._onIterationCb);
        for (let org of this.organisms) {org.destroy()}
        this.organisms.destroy();
        this.organisms      = null;
        this.manager        = null;
        this.code2Str.destroy();
        this.code2Str       = null;
        this._onIterationCb = null;
    }

    /**
     * Override of Manager.onIteration() method. Is called on every
     * iteration of main loop. The counter is an analog of time.
     * @param {Number} counter Value of main loop counter.
     * @param {Number} stamp Time stamp of current iteration
     * @private
     */
    onIteration(counter, stamp) {
        let item = this.organisms.first;
        let org;

        while (item && (org = item.val)) {
            org.run();
            this.onOrganism(org);
            item = item.next;
        }

        this.updateClone(counter);
        this.updateCrossover(counter);
        this.updateCreate();
        this.updateIps(stamp);
        this.updateBackup(counter);
    }

    addOrgHandlers(org) {
        org.on(__WEBPACK_IMPORTED_MODULE_3__global_Events__["EVENTS"].DESTROY, this._onKillOrg.bind(this));
    }

    /**
     * Cloning parents are chosen according to tournament principle
     * @param {Number} counter Current counter
     * @returns {boolean}
     * @private
     */
    updateClone(counter) {
        const orgs      = this.organisms;
        const needClone = counter % __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].orgClonePeriod === 0 && __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].orgClonePeriod !== 0;
        let   orgAmount = orgs.size;
        if (!needClone || orgAmount < 1) {return false}
        let   org1      = this.getRandOrg();
        let   org2      = this.getRandOrg();
        if (!org1.alive && !org2.alive) {return false}

        let tmpOrg = this._tournament(org1, org2);
        if (tmpOrg === org2) {[org1, org2] = [org2, org1]}

        if (orgAmount >= __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldMaxOrgs) {org2.destroy()}
        if (org1.alive) {this._clone(org1)}

        return true;
    }

    updateCrossover(counter) {
        const orgs      = this.organisms;
        const orgAmount = orgs.size;
        const needCrossover = counter % __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].orgCrossoverPeriod === 0 && __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].orgCrossoverPeriod !== 0;
        if (!needCrossover || orgAmount < 1) {return false}

        let org1   = this._tournament();
        let org2   = this._tournament();
        let winner = this._tournament(org1, org2);
        let looser = winner === org1 ? org2 : org1;

        if (looser.alive) {
            this._crossover(winner, looser);
        }

        return true;
    }

    updateCreate() {
        if (this.organisms.size < 1) {
            this._createPopulation();
        }
    }

    updateIps(stamp) {
        const ts   = stamp - this.stamp;
        if (ts < __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldIpsPeriodMs) {return}
        const man  = this.manager;
        const orgs = this.organisms.size;
        let   ips  = this.codeRuns / orgs / (ts / 1000);

        man.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["EVENTS"].IPS, ips, this.organisms);
        this.codeRuns = 0;
        this.stamp = stamp;
    }

    updateBackup(counter) {
        if (counter % __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].backupPeriod !== 0 || __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].backupPeriod === 0) {return}
        // TODO: done this
        //this.backup.backup(this.organisms);
    }

    getRandOrg() {
        const offs = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default.a.rand(RAND_OFFS);
        let   item = this.randOrgItem;

        for (let i = 0; i < offs; i++) {
            if ((item = item.next) === null) {
                item = this.organisms.first;
            }
        }

        return (this.randOrgItem = item).val;
    }

    reset() {
        this._orgId     = 0;
        this._maxEnergy = 0;
    }

    move(x1, y1, x2, y2, org) {
        let   moved = false;
        const world = this.manager.world;

        if (world.isFree(x2, y2) === false) {return false}
        if (x1 !== x2 || y1 !== y2) {moved = true; world.setDot(x1, y1, 0)}
        world.setDot(x2, y2, org.color);
        this.onAfterMove(x1, y1, x2, y2, org);

        return moved;
    }

    createOrg(pos, parent = null) {
        const orgs = this.organisms;
        if (orgs.size >= __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldMaxOrgs || pos === false) {return false}
        orgs.add(null);
        let last = orgs.last;
        let org  = new this._ORG_CLS(++this._orgId + '', pos.x, pos.y, true, last, this._onCodeEnd.bind(this), this._CLASS_MAP, parent);

        last.val = org;
        this.addOrgHandlers(org);
        this.move(pos.x, pos.y, pos.x, pos.y, org);
        this.onAfterCreateOrg(org);
        this.manager.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["EVENTS"].BORN_ORGANISM, org);
        //Console.info(org.id, ' born');

        return true;
    }

    _tournament(org1 = null, org2 = null) {
        org1 = org1 || this.getRandOrg();
        org2 = org2 || this.getRandOrg();

        if (!org1.alive && !org2.alive) {return false}
        if ((org2.alive && !org1.alive) || this.compare(org2, org1)) {
            return org2;
        }

        return org1;
    }

    _clone(org) {
        if (this.onBeforeClone(org) === false) {return false}
        let pos = this.manager.world.getNearFreePos(org.x, org.y);
        if (pos === false || this.createOrg(pos, org) === false) {return false}
        let child  = this.organisms.last.val;

        this.onClone(org, child);
        this.manager.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["EVENTS"].CLONE, org, child);

        return true;
    }

    _crossover(winner, looser) {
        this._clone(winner);
        const orgs  = this.organisms;
        let   child = orgs.last.val;

        if (child.alive && looser.alive) {
            child.changes += child.jsvm.crossover(looser.jsvm);
            if (orgs.size >= __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldMaxOrgs) {looser.destroy()}
        }
    }

    _createPopulation() {
        const world = this.manager.world;

        this.reset();
        for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].orgStartAmount; i++) {
            this.createOrg(world.getFreePos());
        }
        __WEBPACK_IMPORTED_MODULE_2__global_Console__["default"].info('Population has created');
    }

    _onCodeEnd(org, lines) {
        this.codeRuns++;
        this.manager.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["EVENTS"].ORGANISM, org, lines);
    }

    _onKillOrg(org) {
        if (this.randOrgItem === org.item) {
            if ((this.randOrgItem = org.item.next) === null) {
                this.randOrgItem = this.organisms.first;
            }
        }
        this.organisms.del(org.item);
        this.manager.world.setDot(org.x, org.y, 0);
        this.onAfterKillOrg(org);
        this.manager.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["EVENTS"].KILL_ORGANISM, org);
        //Console.info(org.id, ' die');
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Organisms;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * This file contains interface for available operators for some special
 * task. You have to inherit your operators class from this one.
 *
 * @author flatline
 */

class Operators {
    constructor(offs, vars, obs) {
        /**
         * {Array} Array of offsets for closing braces. For 'for', 'if'
         * and other operators.
         */
        this.offs = offs;
        /**
         * {Array} Available variables
         */
        this.vars = vars;
        /**
         * {Observer} Observer for sending events outside
         */
        this.obs = obs;
    }

    destroy() {
        this.offs = null;
        this.vars = null;
        this.obs  = null;
    }

    /**
     * Returns operators array. Should be overridden in child class
     * @abstract
     */
    get operators() {return []}

    /**
     * Sets offsets array from outside
     * @param {Array} offs New offsets array
     */
    set offsets(offs) {this.offs = offs}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Operators;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Observer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Observer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Observer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__JSVM__ = __webpack_require__(27);
/**
 * Base class for organism
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author flatline
 */







const IS_NUM = __WEBPACK_IMPORTED_MODULE_3__common_src_global_Helper___default.a.isNumeric;

class Organism extends __WEBPACK_IMPORTED_MODULE_1__common_src_global_Observer___default.a {
    /**
     * Is called before every run. Should return true, if everything
     * is okay and we don't need to interrupt running. If true, then
     * onRun() method will be called as well
     * @abstract
     */
    onBeforeRun() {}

    /**
     * Is called as a running body (main) method
     * @abstract
     */
    onRun() {}

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
     * @param {Object} classMap Available classes map. Maps class names into
     * classe functions
     * @param {Organism} parent Parent organism if cloning is needed
     */
    constructor(id, x, y, alive, item, codeEndCb, classMap, parent = null) {
        super(__WEBPACK_IMPORTED_MODULE_2__global_Events__["EVENT_AMOUNT"]);

        this._codeEndCb   = codeEndCb;
        this._classMap    = classMap;

        if (parent === null) {this._create()}
        else {this._clone(parent)}

        this._id          = id;
        this._x           = x;
        this._y           = y;
        this._changes     = 1;
        this._alive       = alive;
        this._item        = item;
        this._iterations  = 0;
        this._fnId        = 0;
    }

    get id()                    {return this._id}
    get x()                     {return this._x}
    get y()                     {return this._y}
    get alive()                 {return this._alive}
    get item()                  {return this._item}
    get iterations()            {return this._iterations}
    get changes()               {return this._changes}
    get mutationProbs()         {return this._mutationProbs}
    get mutationPeriod()        {return this._mutationPeriod}
    get mutationPercent()       {return this._mutationPercent}
    get cloneMutationPercent()  {return this._cloneMutationPercent}
    get energy()                {return this._energy}
    get color()                 {return this._color}
    get mem()                   {return this._mem}
    get cloneEnergyPercent()    {return this._cloneEnergyPercent}
    get posId()                 {return __WEBPACK_IMPORTED_MODULE_3__common_src_global_Helper___default.a.posId(this._x, this._y)}

    set x(newX)                 {this._x = newX}
    set y(newY)                 {this._y = newY}
    set cloneMutationPercent(m) {this._cloneMutationPercent = m}
    set mutationPeriod(m)       {this._mutationPeriod = m}
    set mutationPercent(p)      {this._mutationPercent = p}
    set cloneEnergyPercent(p)   {this._cloneEnergyPercent = p}
    set energy(e)               {this._energy = e}
    set changes(c) {
        this._changes = c;
        this._updateColor(c);
    }

    /**
     * Runs one code iteration and returns
     * @return {Boolean} false means that organism was destroyed
     */
    run() {
        this._iterations++;
        if (this.onBeforeRun() === false) {return true}
        this.onRun();
        return this.alive && this._updateDestroy() && this._updateEnergy();
    }

    /**
     * Serializes an organism into the JSON string
     * @return {String} JSON string
     */
    serialize() {
        let   json = {
            id                  : this._id,
            x                   : this._x,
            y                   : this._y,
            changes             : this._changes,
            alive               : this._alive,
            // 'item' will be added after insertion
            iterations          : this._iterations,
            fnId                : this._fnId,
            jsvm                : this.jsvm.serialize(),
            energy              : this._energy,
            color               : this._color,
            mutationProbs       : this._mutationProbs,
            cloneMutationPercent: this._cloneMutationPercent,
            mutationPeriod      : this._mutationPeriod,
            mutationPercent     : this._mutationPercent,
            cloneEnergyPercent  : this._cloneEnergyPercent,
            mem                 : this.mem.slice()
        };

        return JSON.stringify(json);
    }

    /**
     * Opposite to serialize(). Parses provided JSON string and fill
     * current instance by passed values.
     * @param {String} str JSON string
     */
    unserialize(str) {
        const json = JSON.parse(str);

        // 'id' will be added after insertion
        this._x                    = json.x;
        this._y                    = json.y;
        this._changes              = json.changes;
        this._alive                = json.alive;
        // 'item' will be added after insertion
        this._iterations           = json.iterations;
        this._fnId                 = json.fnId;
        this.jsvm.unserialize(json.jsvm);
        this._energy               = json.energy;
        this._color                = json.color;
        this._mutationProbs        = json.mutationProbs;
        this._cloneMutationPercent = json.cloneMutationPercent;
        this._mutationPeriod       = json.mutationPeriod;
        this._mutationPercent      = json.mutationPercent;
        this._cloneEnergyPercent   = json.cloneEnergyPercent;
        this._mem                  = json.mem.slice();
    }

    grabEnergy(amount) {
        if (!IS_NUM(amount)) {return true}
        const noEnergy = (this._energy -= amount) < 1;
        noEnergy && this.destroy();
        return !noEnergy;
    }

    fitness() {
        return this._energy * this._changes;
    }

    destroy() {
        this.fire(__WEBPACK_IMPORTED_MODULE_2__global_Events__["EVENTS"].DESTROY, this);
        this._alive      = false;
        this._classMap   = null;
        this._energy     = 0;
        this._item       = null;
        this._mem        = null;
        this.jsvm && this.jsvm.destroy();
        this.jsvm        = null;
        this._codeEndCb  = null;
        this.clear();
    }

    _updateColor(changes) {
        if ((this._color += changes) > __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].ORG_MAX_COLOR) {
            this._color = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].ORG_FIRST_COLOR;
        }
    }

    _create() {
        this.jsvm                   = new __WEBPACK_IMPORTED_MODULE_4__JSVM__["a" /* default */](this._codeEndCb.bind(this, this), this, this._classMap);
        this._energy                = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgStartEnergy;
        this._color                 = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgStartColor;
        this._mutationProbs         = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgMutationProbs.slice();
        this._cloneMutationPercent  = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgCloneMutationPercent;
        this._mutationPeriod        = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgRainMutationPeriod;
        this._mutationPercent       = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgRainMutationPercent;
        this._cloneEnergyPercent    = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgCloneEnergyPercent;
        this._mem                   = [];
    }

    _clone(parent) {
        this.jsvm                   = new __WEBPACK_IMPORTED_MODULE_4__JSVM__["a" /* default */](this._codeEndCb.bind(this, this), this, this._classMap, parent.jsvm);
        this._energy                = parent.energy;
        this._color                 = parent.color;
        this._mutationProbs         = parent.mutationProbs.slice();
        this._cloneMutationPercent  = parent.cloneMutationPercent;
        this._mutationPeriod        = parent.mutationPeriod;
        this._mutationPercent       = parent.mutationPercent;
        this._cloneEnergyPercent    = parent.cloneEnergyPercent;
        this._mem                   = parent.mem.slice();
    }

    /**
     * Checks if organism need to be killed/destroyed, because of age or zero energy
     * @return {Boolean} false means that organism was destroyed.
     * @private
     */
    _updateDestroy() {
        const alivePeriod = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgAlivePeriod;
        const needDestroy = (this._energy < 1 || this._iterations >= alivePeriod) && alivePeriod > 0;

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
        if (this._iterations % __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgEnergySpendPeriod !== 0 || __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgEnergySpendPeriod === 0) {return true}
        const codeSize = this.jsvm.size;
        let   grabSize = Math.floor(codeSize / __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgGarbagePeriod);

        if (codeSize > __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].codeMaxSize) {grabSize = codeSize * __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].codeSizeCoef}
        if (grabSize < 1) {grabSize = 1}
        grabSize = Math.min(this._energy, grabSize);
        this.fire(__WEBPACK_IMPORTED_MODULE_2__global_Events__["EVENTS"].GRAB_ENERGY, grabSize);

        return this.grabEnergy(grabSize);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Organism;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/**
 * Contains available directions, where organism may move to
 *
 * @author slackline
 */
const DIR = {
    UP   : 0,
    RIGHT: 1,
    DOWN : 2,
    LEFT : 3,
    NO   : 4
};

const DIR_NAMES = {
    0: 'Up',
    1: 'Right',
    2: 'Down',
    3: 'Left',
    4: 'No'
};

module.exports = {DIR: DIR, NAMES: DIR_NAMES};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Plugins manager. Adds plugins into specified instance and destroy
 * them on parent destroy. This class is also a plugin.
 *
 * @author slackline
 */
const Helper = __webpack_require__(2);

class Plugins {
    /**
     * Creates plugin instances and adds them into target class instance
     * (parent). For this 'plugins' property will be created in parent.
     * @param {Object} parent Instance we inserting plugins to
     * @param {Object} plugins Map of names and classes/functions of plugins.
     * Like this: {Api: Api,...}
     * @param {Boolean} destroy If true, then onDestroy() method will be
     * called, when parent.destroy() is called.
     */
    constructor(parent, plugins, destroy = true) {
        const parentPlugins = parent.plugins = {};

        for (let p in plugins) {
            parentPlugins[p] = new plugins[p](parent);
        }

        this.parent      = parent;
        this._onDestroyCb = this.onDestroy.bind(this);
        this._destroy     = destroy;
        this._destroyed   = false;

        Helper.override(parent, 'destroy', this._onDestroyCb);
    }

    /**
     * Is called if parent instance calls destroy() method. Here we
     * destroy all created plugins and the reference to this instance
     * in parent instance. This method may be called by hands from
     * parent instance also. It's impossible to call this method more
     * then one time.
     */
    onDestroy() {
        if (this._destroyed) {return}
        //
        // User doesn't want to automatic destroy of plugins.
        // He will call this method manually, later.
        //
        if (this._destroy) {
            const plugins = this.parent.plugins;
            for (let p in plugins) {
                plugins.hasOwnProperty(p) && plugins[p].destroy && plugins[p].destroy();
            }
        }
        this.parent.plugins = null;
        this._onDestroyCb   = null;
        this.parent         = null;
        this._destroyed     = true;
    }
}

module.exports = Plugins;

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Observer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Observer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Observer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_src_global_Plugins__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_src_global_Plugins___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__common_src_global_Plugins__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_Events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__global_Console__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__visual_World__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__visual_Canvas__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__organism_OperatorsDos__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__organism_OperatorsGarmin__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__organism_Code2StringDos__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__organism_Code2StringGarmin__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__organism_FitnessGarmin__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__organism_OrganismDos__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__organism_OrganismGarmin__ = __webpack_require__(30);
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
















/**
 * {Object} Mapping of class names and their functions. We use this map
 * for switching between fitness and natural modes
 */
const CLASS_MAP = {
    OperatorsDos     : __WEBPACK_IMPORTED_MODULE_7__organism_OperatorsDos__["a" /* default */],
    OperatorsGarmin  : __WEBPACK_IMPORTED_MODULE_8__organism_OperatorsGarmin__["a" /* default */],
    Code2StringDos   : __WEBPACK_IMPORTED_MODULE_9__organism_Code2StringDos__["a" /* default */],
    Code2StringGarmin: __WEBPACK_IMPORTED_MODULE_10__organism_Code2StringGarmin__["a" /* default */],
    FitnessGarmin    : __WEBPACK_IMPORTED_MODULE_11__organism_FitnessGarmin__["a" /* default */],
    OrganismDos      : __WEBPACK_IMPORTED_MODULE_12__organism_OrganismDos__["a" /* default */],
    OrganismGarmin   : __WEBPACK_IMPORTED_MODULE_13__organism_OrganismGarmin__["a" /* default */]
};

class Manager extends __WEBPACK_IMPORTED_MODULE_0__common_src_global_Observer___default.a {
    /**
     * Is called on every iteration in main loop. May be overridden in plugins
     * @abstract
     */
    onIteration() {}

    /**
     *
     * @param {Object} plugins Manager's plugins
     */
    constructor(plugins) {
        super(__WEBPACK_IMPORTED_MODULE_3__global_Events__["EVENT_AMOUNT"]);
        this._world        = new __WEBPACK_IMPORTED_MODULE_5__visual_World__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldWidth, __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldHeight);
        this._canvas       = new __WEBPACK_IMPORTED_MODULE_6__visual_Canvas__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldWidth, __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldHeight);
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
        this._plugins    = new __WEBPACK_IMPORTED_MODULE_2__common_src_global_Plugins___default.a(this, plugins);
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
        __WEBPACK_IMPORTED_MODULE_4__global_Console__["default"].info('Manager has run');
        this._counter = 0;
        this._onLoop();
    }

    stop() {
        this._stopped = true;
        this._counter = 0;
        __WEBPACK_IMPORTED_MODULE_4__global_Console__["default"].log('Manager has stopped');
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
        const amount  = this._visualized ? 1 : __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeIterationsPerOnce;
        const timer   = Date.now;
        let   counter = this._counter;

        for (let i = 0; i < amount; i++) {
            this.onIteration(counter++, timer());
        }
        this._counter = counter;
        this.zeroTimeout(this._onLoopCb);
    }
    _addHandlers() {
        this._world.on(__WEBPACK_IMPORTED_MODULE_3__global_Events__["EVENTS"].DOT, this._onDot.bind(this));
    }

    _visualize(visualized = true) {
        this._visualized = visualized;
        this._canvas.visualize(visualized);
    }

    _onDot(x, y, color) {
        this._canvas.dot(x, y, color);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Manager;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Manager's plugin. Implements WebSocket client logic. Work in pair with
 * server/src/server/Server class. Activates current manager on a server
 * side and run it.
 * TODO: this plugin should listen organisms moves outside of the world
 * TODO: and send appropriate requests
 * TODO: we have to use events in this class
 *
 * @author flatline
 */
const Helper     = __webpack_require__(2);
const Config     = __webpack_require__(0).Config;
const TYPES      = __webpack_require__(6).TYPES;
const Request    = __webpack_require__(36);
const Api        = __webpack_require__(22);
const Console    = __webpack_require__(3).default;
const Connection = __webpack_require__(34);
const Plugins    = __webpack_require__(12);
const EVENTS     = __webpack_require__(1).EVENTS;

const PLUGINS = {
    Request: Request,
    Api    : Api
};

class Client extends Connection {
    constructor(manager) {
        super(0);
        this._manager        = manager;
        this._closed         = true;
        this._client         = this._createWebSocket();
        this._plugins        = new Plugins(this, PLUGINS);
        this._onStepOutCb    = this._onStepOut.bind(this);

        this._client.onerror = this.onError.bind(this);
        this._client.onclose = this.onClose.bind(this);
        this._client.onopen  = this._onOpen.bind(this);
    }

    get manager() {return this._manager}
    get socket()  {return this._client}

    destroy() {
        super.destroy();
        this._client.onclose   = null;
        this._client.onmessage = null;
        this._client.onerror   = null;
        this._client.onclose   = null;
        this._manager.off(EVENTS.STEP_OUT, this._onStepOutCb);
        this._manager          = null;
        this._plugins          = null;
        this._onStepOutCb      = null;
    }

    /**
     * Is called on connection close with server. Close reason will be in
     * this.closeReason field after calling super.onClose() method
     * @param {Event} event
     */
    onClose(event) {
        const client = this._client;
        super.onClose(event);
        //
        // Client has no connection with server, so we have to start in
        // "separate instance" mode.
        //
        if (this._closed && client === null || client.readyState === WebSocket.CLOSING || client.readyState === WebSocket.CLOSED) {
            this._manager.run();
        }
        this._closed = true;
        Console.warn(`Client "${this._manager.clientId}" has disconnected by reason: ${this.closeReason}`);
    }

    _createWebSocket() {
        let ws = null;
        try {
            ws = new WebSocket(`${Config.serHost}:${Config.serPort}`);
        } catch (e) {
            Console.error(e.message);
        }

        return ws;
    }

    _onOpen() {
        const client = this._client;

        this._closed = false;
        this._manager.on(EVENTS.STEP_OUT, this._onStepOutCb);
        client.onmessage = this.onMessage.bind(this, client);
        Console.info('Connection with Server has opened');
    }

    _onStepOut(x, y, dir, org) {
        this.request(this._client, TYPES.REQ_MOVE_ORG, this._manager.clientId, x, y, dir, org.serialize());
    }
}

module.exports = Client;

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__);
/**
 * Plugin for adding getter and setter to Manager's API
 *
 * @author flatline
 */


class Config {
    constructor(manager) {
        manager.api.setConfig = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["api"].set;
        manager.api.getConfig = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["api"].get;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Config;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Console__ = __webpack_require__(3);
/**
 * Manager's plugin, which tracks amount of energy in a world and updates it.
 *
 * @author flatline
 */




class Energy {
    constructor(manager) {
        this.manager        = manager;
        this._checkPeriod   = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldEnergyCheckPeriod;
        this._onIterationCb = this._onIteration.bind(this);
        //
        // We have to update energy only in nature simulation mode
        //
        if (__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeFitnessCls !== null) {return}
        __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default.a.override(manager, 'onIteration', this._onIterationCb);
    }

    destroy() {
        __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default.a.unoverride(this.manager, 'onIteration', this._onIterationCb);
        this.manager        = null;
        this._onIterationCb = null;
    }

    _onIteration(counter) {
        if (counter % this._checkPeriod === 0 && this._checkPeriod > 0) {
            if (counter === 0) {
                this._updateEnergy(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldEnergyDots, __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldEnergyInDot);
                return;
            }
            let   energy = 0;
            const world  = this.manager.world;
            const width  = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldWidth;
            const height = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldHeight;

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    if (world.getDot(x, y) > 0) {energy++}
                }
            }

            if (energy * 100 / (width * height) <= __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldEnergyCheckPercent) {
                this._updateEnergy(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldEnergyDots, __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldEnergyInDot);
            }
        }
    }

    _updateEnergy(dotAmount, energyInDot) {
        const world  = this.manager.world;
        const width  = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldWidth;
        const height = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldHeight;
        const rand   = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default.a.rand;
        let   x;
        let   y;

        __WEBPACK_IMPORTED_MODULE_2__global_Console__["default"].info('Creating random energy');
        for (let dot = 0; dot < dotAmount; dot++) {
            x = rand(width);
            y = rand(height);
            if (world.getDot(x, y) < 1) {
                world.setDot(x, y, energyInDot);
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Energy;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__organism_OrganismDos__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__organism_Num__ = __webpack_require__(4);
/**
 * Plugin for Manager class, which is tracks when and how many mutations
 * should be added to special organism's code at special moment of it's
 * life.
 *
 * Depends on:
 *   manager/Manager
 *   manager/plugins/Organisms
 *
 * @author flatline
 */






const VAR_BITS_OFFS = __WEBPACK_IMPORTED_MODULE_4__organism_Num__["a" /* default */].VAR_BITS_OFFS - 1;
const VARS          = __WEBPACK_IMPORTED_MODULE_4__organism_Num__["a" /* default */].VARS;
const MAX_VAR       = __WEBPACK_IMPORTED_MODULE_4__organism_Num__["a" /* default */].MAX_VAR;

class Mutator {
    constructor(manager) {
        this.manager = manager;
        this._MUTATION_TYPES = [
            this._onAdd,
            this._onChange,
            this._onDel,
            this._onSmallChange,
            this._onClone,
            this._onCopy,
            this._onPeriod,
            this._onAmount,
            this._onProbs,
            this._onCloneEnergyPercent
        ];
        
        manager.on(__WEBPACK_IMPORTED_MODULE_0__global_Events__["EVENTS"].ORGANISM, this._onOrganism.bind(this));
        manager.on(__WEBPACK_IMPORTED_MODULE_0__global_Events__["EVENTS"].CLONE, this._onCloneOrg.bind(this));
    }

    destroy() {
        this.manager         = null;
        this._MUTATION_TYPES = null;
    }

    _onOrganism(org) {
        if (org.iterations % org.mutationPeriod === 0 && __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].orgRainMutationPeriod > 0 && org.mutationPeriod > 0 && org.alive) {
            this._mutate(org, false);
        }
    }

    _onCloneOrg(parent, child) {
        if (child.energy > 0 && __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].orgCloneMutationPercent > 0) {this._mutate(child)}
    }

    _mutate(org, clone = true) {
        const jsvm      = org.jsvm;
        const probIndex = __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.probIndex;
        const mTypes    = this._MUTATION_TYPES;
        const maxSize   = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeMaxSize;
        let   mutations = Math.round(jsvm.size * (clone ? org.cloneMutationPercent : org.mutationPercent)) || 1;
        let   type;

        for (let i = 0; i < mutations; i++) {
            if (jsvm.size > maxSize) {
                mutations = i;
                break;
            }
            type = jsvm.size < 1 ? 0 : probIndex(org.mutationProbs);
            mTypes[type](org);
        }
        org.changes += mutations;
        this.manager.fire(__WEBPACK_IMPORTED_MODULE_0__global_Events__["EVENTS"].MUTATIONS, org, mutations, clone);

        return mutations;
    }

    _onAdd(org) {
        if (__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeFitnessCls !== null && org.jsvm.size >= __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeMaxSize) {return}
        org.jsvm.insertLine();
    }

    _onChange(org) {
        const jsvm = org.jsvm;
        jsvm.updateLine(__WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.rand(jsvm.size), __WEBPACK_IMPORTED_MODULE_4__organism_Num__["a" /* default */].get());
    }

    _onDel(org) {
        org.jsvm.removeLine();
    }

    /**
     * Operator type or one variable may mutate
     * @param {Organism} org
     * @private
     */
    _onSmallChange(org) {
        const rand  = __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.rand;
        const jsvm  = org.jsvm;
        const index = rand(jsvm.size);
        const rnd   = rand(3);

        if (rnd === 0) {
            jsvm.updateLine(index, __WEBPACK_IMPORTED_MODULE_4__organism_Num__["a" /* default */].setOperator(jsvm.getLine(index), rand(jsvm.operators.operators.length)));
        } else if (rnd === 1) {
            jsvm.updateLine(index, __WEBPACK_IMPORTED_MODULE_4__organism_Num__["a" /* default */].setVar(jsvm.getLine(index), rand(VARS), rand(MAX_VAR)));
        } else {
            // toggle specified bit
            jsvm.updateLine(index, jsvm.getLine(index) ^ (1 << rand(VAR_BITS_OFFS)));
        }
    }

    _onClone(org) {
        org.cloneMutationPercent = Math.random();
    }

    _onCopy(org) {
        org.jsvm.copyLines();
    }

    _onPeriod(org) {
        org.mutationPeriod = __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.rand(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].ORG_MAX_MUTATION_PERIOD);
    }

    _onAmount(org) {
        org.mutationPercent = Math.random();
    }

    _onProbs(org) {
        org.mutationProbs[__WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.rand(org.mutationProbs.length)] = __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.rand(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].orgMutationProbsMaxValue) || 1;
    }

    _onCloneEnergyPercent(org) {
        org.cloneEnergyPercent = Math.random();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Mutator;


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_Organisms__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_Events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_src_global_Directions__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_src_global_Directions___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__common_src_global_Directions__);
/**
 * Plugin for Manager module, which handles organisms population in
 * nature simulation mode. It's related to DOS language.
 *
 * Events od Manager:
 *   TODO:
 *   ORGANISM(org) Fires after one organism has processed
 *
 * Depends on:
 *   manager/Manager
 *
 * @author flatline
 */





const EMPTY     = 0;
const ENERGY    = 1;
const ORGANISM  = 2;

class OrganismsDos extends __WEBPACK_IMPORTED_MODULE_0__base_Organisms__["a" /* default */] {
    constructor(manager) {
        super(manager);

        this._positions  = {};
        this._onStepInCb = this._onStepIn.bind(this);

        this.manager.on(__WEBPACK_IMPORTED_MODULE_1__global_Events__["EVENTS"].STEP_IN, this._onStepInCb);
    }

    destroy() {
        super.destroy();
        this.manager.off(__WEBPACK_IMPORTED_MODULE_1__global_Events__["EVENTS"].STEP_IN, this._onStepInCb);
        this._onStepInCb = null;
        this._positions  = null;
    }

    /**
     * Compares two organisms and returns more fit one
     * @param {Organism} org1
     * @param {Organism} org2
     * @return {Organism}
     * @override
     */
    compare(org1, org2) {
        return org1.fitness() > org2.fitness();
    }

    /**
     * Is called before cloning of organism
     * @param {Organism} org
     * @override
     */
    onBeforeClone(org) {
        return org.energy > 0;
    }

    /**
     * Is called after cloning of organism
     * @param {Organism} org Parent organism
     * @param {Organism} child Child organism
     * @override
     */
    onClone(org, child) {
        let energy = (((org.energy * org.cloneEnergyPercent) + 0.5) << 1) >>> 1; // analog of Math.round()
        org.grabEnergy(energy);
        child.grabEnergy(child.energy - energy);
    }

    addOrgHandlers(org) {
        super.addOrgHandlers(org);
        org.on(__WEBPACK_IMPORTED_MODULE_1__global_Events__["EVENTS"].GET_ENERGY, this._onGetEnergy.bind(this));
        org.on(__WEBPACK_IMPORTED_MODULE_1__global_Events__["EVENTS"].EAT, this._onEat.bind(this));
        org.on(__WEBPACK_IMPORTED_MODULE_1__global_Events__["EVENTS"].STEP, this._onStep.bind(this));
        org.on(__WEBPACK_IMPORTED_MODULE_1__global_Events__["EVENTS"].CHECK_AT, this._onCheckAt.bind(this));
    }

    /**
     * Is called after organism has created
     * @param {Organism} org
     * @override
     */
    onAfterCreateOrg(org) {
        this._positions[org.posId] = org;
    }

    /**
     * Is called after organism has killed
     * @param {Organism} org Killed organism
     * @override
     */
    onAfterKillOrg(org) {
        delete this._positions[org.posId];
    }

    /**
     * Is called after moving of organism is done. Updates this._positions
     * map with a new position of organism
     * @param {Number} x1 Start X position
     * @param {Number} y1 Start Y position
     * @param {Number} x2 End X position
     * @param {Number} y2 End Y position
     * @param {Organism} org Organism, which is moving
     * @returns {Boolean}
     * @override
     */
    onAfterMove(x1, y1, x2, y2, org) {
        if (x1 !== x2 || y1 !== y2) {
            delete this._positions[__WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.posId(x1, y1)];
            this._positions[__WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.posId(x2, y2)] = org;
        }

        return true;
    }

    _onGetEnergy(org, x, y, ret) {
        if (x < 0 || y < 0 || !Number.isInteger(x) || !Number.isInteger(y)) {return}
        const posId = __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.posId(x, y);

        if (typeof(this._positions[posId]) === 'undefined') {
            ret.ret = this.manager.world.getDot(x, y)
        } else {
            ret.ret = this._positions[posId].energy;
        }
    }

    _onEat(org, x, y, ret) {
        const world = this.manager.world;
        const positions = this._positions;
        let   dir;

        [x, y, dir] = __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.normalize(x, y);

        const posId = __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.posId(x, y);
        if (typeof(positions[posId]) === 'undefined') {
            ret.ret = world.grabDot(x, y, ret.ret);
        } else {
            ret.ret = ret.ret < 0 ? 0 : (ret.ret > positions[posId].energy ? positions[posId].energy : ret.ret);
            positions[posId].grabEnergy(ret.ret);
        }
    }

    _onStep(org, x1, y1, x2, y2, ret) {
        if (org.alive === false) {return}
        const man = this.manager;
        let   dir;

        [x2, y2, dir] = __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.normalize(x2, y2);
        //
        // Organism has moved, but still is within the current world (client)
        //
        if (dir === __WEBPACK_IMPORTED_MODULE_3__common_src_global_Directions__["DIR"].NO) {
            ret.ret = +this.move(x1, y1, x2, y2, org);
            return;
        }
        //
        // Current organism try to move out of the world.
        // We have to pass him to the server to another
        // client (Manager)
        //
        if (man.activeAround[dir]) {
            org.x = x2;
            org.y = y2;
            man.fire(__WEBPACK_IMPORTED_MODULE_1__global_Events__["EVENTS"].STEP_OUT, x2, y2, dir, org);
            org.destroy();
            return;
        }
        //
        // Organism try to go outside of the world, but there is no
        // activated client on that side. So this is a border for him.
        // In this case coordinates (x,y) should stay the same
        //
        ret.ret = +this.move(x1, y1, x1, y1, org);
    }

    /**
     * Is called if organism step in from the server or other client (Manager/World).
     * If step in position is not free, then organism die at the moment
     * @param {Number} x Current org X position
     * @param {Number} y Current org Y position
     * @param {Number} dir Moving direction
     * @param {String} orgJson Organism's serialized json
     * @private
     */
    _onStepIn(x, y, dir, orgJson) {
        if (this.manager.world.isFree(x, y) && this.createOrg({x:x, y:y})) {
            this.organisms.last.val.unserialize(orgJson);
        }
    }

    _onCheckAt(x, y, ret) {
        let dir;

        [x, y, dir] = __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.normalize(x, y);
        if (typeof(this._positions[__WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.posId(x, y)]) === 'undefined') {
            ret.ret = this.manager.world.getDot(x, y) > 0 ? ENERGY : EMPTY;
        } else {
            ret.ret = ORGANISM;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OrganismsDos;


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_Console__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__organism_OrganismDos__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_Organisms__ = __webpack_require__(8);
/**
 * Plugin for Manager module, which handles organisms population
 * in fitness mode.
 *
 * Events od Manager:
 *   ORGANISM(org) Fires after one organism has processed
 *
 * Depends on:
 *   manager/Manager
 *
 * @author flatline
 */






class OrganismsGarmin extends __WEBPACK_IMPORTED_MODULE_4__base_Organisms__["a" /* default */] {
    constructor(manager) {
        super(manager);

        this._maxChanges  = 0;
        this._FITNESS_CLS = manager.CLASS_MAP[__WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].codeFitnessCls];
    }

    /**
     * Compares two organisms and returns fittest one
     * @param {Organism} org1
     * @param {Organism} org2
     * @return {Organism}
     * @override
     */
    compare(org1, org2) {
        return this._FITNESS_CLS.compare(org1, org2, this._maxChanges);
    }

    onOrganism(org) {
        if (org.energy > this._maxEnergy) {
            this._maxEnergy = org.energy;
            __WEBPACK_IMPORTED_MODULE_1__global_Console__["default"].warn('--------------------------------------------------');
            __WEBPACK_IMPORTED_MODULE_1__global_Console__["default"].warn('Max energy: ', org.energy, ', org Id: ', org.id);
            __WEBPACK_IMPORTED_MODULE_1__global_Console__["default"].warn('[' + org.jsvm.code + ']');
            __WEBPACK_IMPORTED_MODULE_1__global_Console__["default"].warn(this.manager.api.formatCode(org.jsvm.code));
        }

        if (org.changes > this._maxChanges) {this._maxChanges = org.changes}
    }

    addOrgHandlers(org) {
        super.addOrgHandlers(org);
        org.on(__WEBPACK_IMPORTED_MODULE_2__global_Events__["EVENTS"].STOP, this._onStop.bind(this));
    }

    reset() {
        super.reset();
        this._maxChanges = 0;
    }

    _onStop(org) {
        this.manager.stop();
        __WEBPACK_IMPORTED_MODULE_1__global_Console__["default"].warn('--------------------------------------------------');
        __WEBPACK_IMPORTED_MODULE_1__global_Console__["default"].warn('org id: ', org.id, ', energy: ', org.energy);
        __WEBPACK_IMPORTED_MODULE_1__global_Console__["default"].warn('[' + org.jsvm.code + ']');
        __WEBPACK_IMPORTED_MODULE_1__global_Console__["default"].warn(this.manager.api.formatCode(org.jsvm.code));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OrganismsGarmin;


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__);
/**
 * Shows console status of application
 *
 * @author flatline
 */



const GREEN  = 'color: #00aa00';
const RED    = 'color: #aa0000';
const PERIOD = 10000;

class Status {
    constructor(manager) {
        this._manager     = manager;
        this.stamp        = 0;
        this._ips         = 0;
        this._ipsAmount   = 0;
        this._orgs        = 0;
        this._energy      = 0;
        this._codeSize    = 0;
        this._runLines    = 0;
        this._changes     = 0;
        this._fitness     = 0;

        manager.on(__WEBPACK_IMPORTED_MODULE_0__global_Events__["EVENTS"].IPS, this._onIps.bind(this));
        manager.on(__WEBPACK_IMPORTED_MODULE_0__global_Events__["EVENTS"].ORGANISM, this._onOrganism.bind(this));
    }

    _onIps(ips, orgs) {
        const stamp     = Date.now();

        this._onBeforeIps(ips, orgs);
        if (stamp - this.stamp < PERIOD) {return}

        const amount    = this._ipsAmount || 1;
        const orgAmount = (this._orgs / amount) || 1;
        const sips      = ('ips:' + (this._ips      / amount).toFixed(this._ips  / amount < 10 ? 2 : 0)).padEnd(9);
        const slps      = ('lps:' + (this._runLines / amount).toFixed()).padEnd(14);
        const sorgs     = ('org:' + (orgAmount).toFixed()).padEnd(10);
        const senergy   = ('nrg:' + ((((this._energy   / amount) / orgAmount) / this._runLines) * 1000).toFixed(3)).padEnd(14);
        const schanges  = ('che:' + ((((this._changes  / amount) / orgAmount) / this._runLines) * 100000).toFixed(3)).padEnd(12);
        const sfit      = ('fit:' + ((((this._fitness  / amount) / orgAmount) / this._runLines) * 1000).toFixed(3)).padEnd(13);
        const scode     = ('cod:' + ((this._codeSize / amount) / orgAmount).toFixed(1)).padEnd(12);

        console.log(`%c${sips}${slps}${sorgs}%c${senergy}${schanges}${sfit}${scode}`, GREEN, RED);
        this._manager.canvas.text(5, 15, sips);
        this._onAfterIps(stamp);
    }

    _onOrganism(org, lines) {
        this._runLines += lines;
    }

    _onBeforeIps(ips, orgs) {
        this._ips  += ips;
        this._orgs += orgs.size;

        this._ipsAmount++;
        this._iterateOrganisms(orgs);
    }

    _onAfterIps(stamp) {
        this._ips       = 0;
        this._ipsAmount = 0;
        this._orgs      = 0;
        this._energy    = 0;
        this._codeSize  = 0;
        this.stamp     = stamp;
        this._runLines  = 0;
        this._changes   = 0;
        this._fitness   = 0;
    }

    _iterateOrganisms(orgs) {
        let item     = orgs.first;
        let energy   = 0;
        let codeSize = 0;
        let changes  = 0;
        let fitness  = 0;
        let org;

        while(item) {
            org = item.val;
            energy   += org.energy;
            codeSize += org.jsvm.size;
            changes  += org.changes;
            fitness  += org.fitness();
            item = item.next;
        }

        this._energy   += energy;
        this._codeSize += codeSize;
        this._changes  += changes;
        this._fitness  += fitness;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Status;


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__manager_Manager__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__client_src_manager_plugins_Client__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__client_src_manager_plugins_Client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__client_src_manager_plugins_Client__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_manager_plugins_OrganismsGarmin__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_manager_plugins_OrganismsDos__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_manager_plugins_Config__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src_manager_plugins_Mutator__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__src_manager_plugins_Energy__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__src_manager_plugins_Status__ = __webpack_require__(20);
/**
 * This is an entry point of jevo.js application. Compiled version of
 * this file should be included into index.html
 *
 * Usage:
 *   <script src="./app.js"></script>
 *
 * @author flatline
 */









/**
 * {Boolean} Specify fitness or nature simulation mode
 */
const FITNESS_MODE = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeFitnessCls !== null;
/**
 * {Array} Plugins for Manager
 */
const PLUGINS = {
    Organisms: FITNESS_MODE ? __WEBPACK_IMPORTED_MODULE_3__src_manager_plugins_OrganismsGarmin__["a" /* default */] : __WEBPACK_IMPORTED_MODULE_4__src_manager_plugins_OrganismsDos__["a" /* default */],
    Config   : __WEBPACK_IMPORTED_MODULE_5__src_manager_plugins_Config__["a" /* default */],
    Mutator  : __WEBPACK_IMPORTED_MODULE_6__src_manager_plugins_Mutator__["a" /* default */],
    Energy   : __WEBPACK_IMPORTED_MODULE_7__src_manager_plugins_Energy__["a" /* default */],
    Status   : __WEBPACK_IMPORTED_MODULE_8__src_manager_plugins_Status__["a" /* default */],
    Client   : __WEBPACK_IMPORTED_MODULE_2__client_src_manager_plugins_Client___default.a
};
const manager = new __WEBPACK_IMPORTED_MODULE_0__manager_Manager__["a" /* default */](PLUGINS);
//
// manager.run() method will be called after attempt of connection
// to the jevo.js server
//
window.man = manager;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Plugin for a Client class, which provides API of client for the server. The
 * same like Api class plugin for the Server class (see server/src/server/plugins/Api).
 *
 * @author flatline
 */
const TYPES   = __webpack_require__(6).TYPES;
const BaseApi = __webpack_require__(35);
const Helper  = __webpack_require__(2);
const EVENTS  = __webpack_require__(1).EVENTS;
const Console = __webpack_require__(3).default;

class Api extends BaseApi {
    constructor(client, manager) {
        super(client);

        this.api[TYPES.REQ_GIVE_ID]         = this._giveId.bind(this);
        this.api[TYPES.REQ_MOVE_ORG]        = this._moveOrg.bind(this);
        this.api[TYPES.RES_MOVE_ERR]        = this._moveOrg.bind(this);
        this.api[TYPES.REQ_SET_NEAR_ACTIVE] = this._setActive.bind(this);
    }

    destroy() {
        super.destroy();
    }

    /**
     * Handler of request from server, where it passes us unique client
     * id. We have to save this id and pass it with every request. This
     * is how server will differentiate us from other clients.
     * @param {Number} reqId Unique request id. Unused for this request
     * @param {String} clientId Unique id of current client obtained from
     * the server
     * @api
     */
    _giveId(reqId, clientId) {
        this.parent.manager.setClientId(clientId);
        Console.info(`Client id "${clientId}" obtained from the server`);
        this._request(TYPES.REQ_SET_ACTIVE, true, (type) => {
            if (type === TYPES.RES_ACTIVE_OK) {
                this.parent.manager.run();
            }
        });
    }

    /**
     * Is called if organism is move in from other Manager (world)
     * @param {String} reqId Unique request id
     * @param {Number} x Current org X position
     * @param {Number} y Current org Y position
     * @param {Number} dir Moving direction
     * @param {String} orgJson Organism's serialized json
     * @param {String|null} errMsg Error message
     * @api
     */
    _moveOrg(reqId, x, y, dir, orgJson, errMsg = null) {
        this.parent.manager.fire(EVENTS.STEP_IN, x, y, dir, orgJson);
        errMsg && Console.warn(errMsg);
    }

    /**
     * Is called to set active flag of nearest manager/client. After
     * setting it to true, nearest client/Manager may pass it's organisms
     * to the current client/Manager
     * @param {String} reqId Unique request id
     * @param {Number} dir Direction of nearest client/Manager
     * @param {Boolean} active Active state of nearest client/Manager
     * @api
     */
    _setActive(reqId, dir, active) {
        this.parent.manager.activeAround[dir] = active;
    }

    _request(type, ...params) {
        return this.parent.request(this.parent.socket, type, this.parent.manager.clientId, ...params);
    }
}

module.exports = Api;

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Console__ = __webpack_require__(3);
/**
 * Manager's plugin, which creates backups according to population age.
 *
 * Depends on:
 *   manager/plugins/Organisms
 *
 * @author flatline
 */




class Backup {
    constructor(orgs, world, positions) {
        this.orgs      = orgs;
        this._world     = world;
        this._positions = positions;
    }

    destroy() {
        this.orgs       = null;
        this._world     = null;
        this._positions = null;
    }

    backup() {
        this._toLocalStorage(this._toJson(this.orgs, this._world));
        __WEBPACK_IMPORTED_MODULE_2__global_Console__["default"].info('Backup has created');
    }

    _toJson(orgs, world) {
        return {
            orgs  : this._getOrgs(orgs),
            energy: this._getEnergy(world)
        };
    }

    _getOrgs(orgs) {
        let cur  = orgs.first;
        let json = [];

        while (cur) {
            let org = cur.val;
            json.push({
                id                  : org.id,
                x                   : org.x,
                y                   : org.y,
                mutationProbs       : org.mutationProbs,
                cloneMutationPercent: org.cloneMutationPercent,
                mutationPeriod      : org.mutationPeriod,
                mutationPercent     : org.mutationPercent,
                color               : org.color,
                vars                : org.jsvm.vars,
                code                : org.jsvm.cloneByteCode()
            });
            cur = cur.next;
        }

        return json;
    }

    _getEnergy(world) {
        let dot;
        let positions = this._positions;
        let posId     = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Helper___default.a.posId;
        let energy    = [];

        for (let x = 0; x < __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldWidth; x++) {
            for (let y = 0; y < __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldHeight; y++) {
                dot = world.getDot(x, y);
                if (dot > 0 && positions[posId(x, y)] !== null) {
                    energy.push(x, y);
                }
            }
        }

        return energy;
    }

    _toLocalStorage(json) {
        // TODO: add other organism related properties saving
        // TODO: add removing of old backups
//        localStorage[`jjs-${Date.now()}`] = JSON.stringify({
//            world: this.manager.world.data,
//            orgs : this._getOrgsByteCode(orgs)
//        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Backup;


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Num__ = __webpack_require__(4);
/**
 * This class is used only for code visualization in readable human like form.
 * It converts numeric based byte code into JS string. This class must be
 * synchronized with 'Operators' one.
 *
 * @author flatline
 */


/**
 * {Function} Just a shortcuts
 */
const VAR0                  = __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getVar;
const VAR1                  = (n) => __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getVar(n, 1);
const VAR2                  = (n) => __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getVar(n, 2);
const BITS_AFTER_THREE_VARS = __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].BITS_PER_OPERATOR + __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].BITS_PER_VAR * 3;
const BITS_FOR_NUMBER       = 16;
const HALF_OF_VAR           = __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].MAX_VAR / 2;

class Code2StringDos {
    constructor() {
        /**
         * {Object} These operator handlers should return string representation
         * of numeric based byte jsvm.
         */
        this._OPERATORS_CB = {
            0 : this._onVar.bind(this),
            //1: this._onFunc.bind(this),
            1 : this._onCondition.bind(this),
            2 : this._onLoop.bind(this),
            3 : this._onOperator.bind(this),
            4 : this._onNot.bind(this),
            //5 : this._onPi.bind(this),
            //6 : this._onTrig.bind(this),
            5 : this._onLookAt.bind(this),
            6 : this._onEatLeft.bind(this),
            7 : this._onEatRight.bind(this),
            8 : this._onEatUp.bind(this),
            9 : this._onEatDown.bind(this),
            10: this._onStepLeft.bind(this),
            11: this._onStepRight.bind(this),
            12: this._onStepUp.bind(this),
            13: this._onStepDown.bind(this),
            14: this._onFromMem.bind(this),
            15: this._onToMem.bind(this),
            16: this._onMyX.bind(this),
            17: this._onMyY.bind(this),
            18: this._onCheckLeft.bind(this),
            19: this._onCheckRight.bind(this),
            20: this._onCheckUp.bind(this),
            21: this._onCheckDown.bind(this)
        };
        this._OPERATORS_CB_LEN = Object.keys(this._OPERATORS_CB).length;
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
        //this._TRIGS = ['sin', 'cos', 'tan', 'abs'];
        /**
         * {Array} Contains closing bracket offset for "if", "loop",... operators
         */
        this._offsets = [];

        __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].setOperatorAmount(this._OPERATORS_CB_LEN);
    }

    destroy() {
        this._OPERATORS_CB = null;
        this._CONDITIONS   = null;
        this._OPERATORS    = null;
    }

    format(code, separator = '\n') {
        const len       = code.length;
        const operators = this._OPERATORS_CB;
        const offs      = this._offsets;
        let   lines     = new Array(len);
        let   needClose = 0;

        for (let line = 0; line < len; line++) {
            //
            // We found closing bracket '}' of some loop and have to add
            // it to output code array
            //
            if (line === offs[offs.length - 1]) {
                while (offs.length > 0 && offs[offs.length - 1] === line) {
                    offs.pop();
                    needClose++;
                }
            }
            lines[line] = operators[__WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getOperator(code[line])](code[line], line, len);
            if (needClose > 0) {
                for (let i = 0; i < needClose; i++) {
                    lines[line] = '}' + lines[line];
                }
                needClose = 0;
            }
        }
        //
        // All closing brackets st the end of JS script
        //
        const length = lines.length - 1;
        for (let i = 0; i < offs.length; i++) {
            lines[length] += '}';
        }
        offs.length = 0;

        return js_beautify(lines.join(separator), {indent_size: 4});
    }

    /**
     * Parses variable operator. Format: let = const|number. Num bits format:
     *   BITS_PER_OPERATOR bits - operator id
     *   BITS_PER_VAR bits  - destination var index
     *   BITS_PER_VAR bits  - assign type (const (half of bits) or variable (half of bits))
     *   BITS_PER_VAR bits  - variable index or all bits till the end for constant
     *
     * @param {Num} num Packed into number jsvm line
     * @return {String} Parsed jsvm line string
     */
    _onVar(num) {
        const var1    = VAR1(num);
        const isConst = VAR2(num) >= HALF_OF_VAR;

        return `v${VAR0(num)}=${isConst ? __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, BITS_FOR_NUMBER) : ('v' + var1)}`;
    }

    _onFunc(num) {
        return '';
    }

    _onCondition(num, line, lines) {
        const val3    = __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].BITS_OF_TWO_VARS);
        this._offsets.push(this._getOffs(line, lines, val3));
        return `if(v${VAR0(num)}${this._CONDITIONS[VAR2(num)]}v${VAR1(num)}){`;
    }

    _onLoop(num, line, lines) {
        const var0    = VAR0(num);
        const val3    = __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].BITS_OF_TWO_VARS);
        this._offsets.push(this._getOffs(line, lines, val3));
        return `for(v${var0}=v${VAR1(num)};v${var0}<v${VAR2(num)};v${var0}++){`;
    }

    _onOperator(num) {
        return `v${VAR0(num)}=v${VAR1(num)}${this._OPERATORS[__WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].BITS_OF_TWO_VARS)]}v${VAR2(num)}`;
    }

    _onNot(num) {
        return `v${VAR0(num)}=+!v${VAR1(num)}`;
    }

    //_onPi(num) {
    //    return `v${VAR0(num)}=Math.PI`;
    //}

    //_onTrig(num) {
    //    return `v${VAR0(num)}=Math.${this._TRIGS[VAR2(num)]}(v${VAR1(num)})`;
    //}

    _onLookAt(num) {
        return `v${VAR0(num)}=lookAt(v${VAR1(num)},v${VAR2(num)})`;
    }

    _onEatLeft(num) {
        return `v${VAR0(num)}=eatLeft(v${VAR1(num)})`;
    }

    _onEatRight(num) {
        return `v${VAR0(num)}=eatRight(v${VAR1(num)})`;
    }

    _onEatUp(num) {
        return `v${VAR0(num)}=eatUp(v${VAR1(num)})`;
    }

    _onEatDown(num) {
        return `v${VAR0(num)}=eatDown(v${VAR1(num)})`;
    }

    _onStepLeft(num) {
        return `v${VAR0(num)}=stepLeft()`;
    }

    _onStepRight(num) {
        return `v${VAR0(num)}=stepRight()`;
    }

    _onStepUp(num) {
        return `v${VAR0(num)}=stepUp()`;
    }

    _onStepDown(num) {
        return `v${VAR0(num)}=stepDown()`;
    }

    _onFromMem(num) {
        return `v${VAR0(num)}=fromMem()`;
    }

    _onToMem(num) {
        return `v${VAR0(num)}=toMem(v${VAR1(num)})`;
    }

    _onMyX(num) {
        return `v${VAR0(num)}=myX()`;
    }

    _onMyY(num) {
        return `v${VAR0(num)}=myY()`;
    }

    _onCheckLeft(num) {
        return `v${VAR0(num)}=checkLeft()`;
    }

    _onCheckRight(num) {
        return `v${VAR0(num)}=checkRight()`;
    }

    _onCheckUp(num) {
        return `v${VAR0(num)}=checkUp()`;
    }

    _onCheckDown(num) {
        return `v${VAR0(num)}=checkDown()`;
    }

    /**
     * Returns offset for closing bracket of blocked operators like
     * "if", "for" and so on. These operators shouldn't overlap each
     * other. for example:
     *
     *     for (...) {     // 0
     *         if (...) {  // 1
     *             ...     // 2
     *         }           // 3
     *     }               // 4
     *
     * Closing bracket in line 3 shouldn't be after bracket in line 4.
     * So it's possible to set it to one of  1...3. So we change it in
     * real time to fix the overlap problem.
     * @param {Number} line Current line index
     * @param {Number} lines Amount of lines
     * @param {Number} offs Local offset of closing bracket we want to set
     * @returns {Number}
     * @private
     */
    _getOffs(line, lines, offs) {
        let   offset  = line + offs < lines ? line + offs + 1 : lines;
        const offsets = this._offsets;
        const length  = offsets.length;

        if (length > 0 && offset >= offsets[length - 1]) {
            return offsets[length - 1];
        }

        return offset;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Code2StringDos;


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Num__ = __webpack_require__(4);
/**
 * This class is used only for code visualization in readable human like form.
 * It converts numeric based byte code into JS string. This class must be
 * synchronized with 'Operators' one.
 *
 * @author flatline
 */


/**
 * {Function} Just a shortcuts
 */
const VAR0                  = __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getVar;
const VAR1                  = (n) => __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getVar(n, 1);
const VAR2                  = (n) => __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getVar(n, 2);
const BITS_AFTER_THREE_VARS = __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].BITS_PER_OPERATOR + __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].BITS_PER_VAR * 3;
const HALF_OF_VAR           = __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].MAX_VAR / 2;

class Code2StringGarmin {
    constructor() {
        /**
         * {Array} Array of offsets for closing braces. For 'for', 'if'
         * and all block operators.
         */
        this._offsets = [];
        /**
         * {Object} These operator handlers should return string representation
         * of numeric based byte jsvm.
         */
        this._OPERATORS_CB = {
            0 : this._onVar.bind(this),
            1 : this._onCondition.bind(this),
            //2 : this._onLoop.bind(this),
            2 : this._onOperator.bind(this),
            3 : this._onNot.bind(this),
            //4 : this._onPi.bind(this),
            //5 : this._onTrig.bind(this),
            4 : this._onFromMem.bind(this),
            5 : this._onToMem.bind(this)
        };
        this._OPERATORS_CB_LEN = Object.keys(this._OPERATORS_CB).length;
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
        this._TRIGS = ['sin', 'cos', 'tan', 'abs'];

        __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].setOperatorAmount(this._OPERATORS_CB_LEN);
    }

    destroy() {
        this._offsets      = null;
        this._OPERATORS_CB = null;
        this._CONDITIONS   = null;
        this._OPERATORS    = null;
        this._TRIGS        = null;
    }

    format(code, separator = '\n') {
        const len       = code.length;
        const operators = this._OPERATORS_CB;
        let   codeArr   = new Array(len);
        let   offsets   = this._offsets;
        let   operator;

        for (let i = 0; i < len; i++) {
            operator = operators[__WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getOperator(code[i])](code[i], i, len);
            //
            // This jsvm is used for closing blocks for if, for and other
            // blocked operators.
            //
            if (offsets[offsets.length - 1] === i && offsets.length > 0) {
                operator = operator + '}';
                offsets.pop();
            }
            codeArr[i] = operator;
        }
        if (offsets.length > 0) {
            codeArr[codeArr.length - 1] += ('}'.repeat(offsets.length));
            offsets.length = 0;
        }

        return js_beautify(codeArr.join(separator), {indent_size: 4});
    }

    /**
     * Parses variable operator. Format: let = const|number. Num bits format:
     *   BITS_PER_OPERATOR bits - operator id
     *   BITS_PER_VAR bits  - destination var index
     *   BITS_PER_VAR bits  - assign type (const (half of bits) or variable (half of bits))
     *   BITS_PER_VAR bits  - variable index or all bits till the end for constant
     *
     * @param {Num} num Packed into number jsvm line
     * @return {String} Parsed jsvm line string
     */
    _onVar(num) {
        const var1    = VAR1(num);
        const isConst = var1 >= HALF_OF_VAR;

        return `v${VAR0(num)}=${isConst ? __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].BITS_OF_TWO_VARS) : ('v' + var1)}`;
    }

    _onCondition(num, line, lines) {
        const var3    = __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].BITS_OF_TWO_VARS);
        let   offs    = line + var3 < lines ? line + var3 + 1: lines;
        return `if(v${VAR0(num)}${this._CONDITIONS[VAR2(num)]}v${VAR1(num)}) goto(${offs})`;
    }

//    _onLoop(num, line, lines) {
//        const var0    = VAR0(num);
//        const var3    = Num.getBits(num, BITS_AFTER_THREE_VARS, Num.BITS_OF_TWO_VARS);
//        const index   = line + var3 < lines ? line + var3 : lines - 1;
//
//        this._offsets.push(index);
//        return `for(v${var0}=v${VAR1(num)};v${var0}<v${VAR2(num)};v${var0}++){`;
//    }

    _onOperator(num) {
        return `v${VAR0(num)}=v${VAR1(num)}${this._OPERATORS[__WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, __WEBPACK_IMPORTED_MODULE_0__Num__["a" /* default */].BITS_OF_TWO_VARS)]}v${VAR2(num)}`;
    }

    _onNot(num) {
        return `v${VAR0(num)}=+!v${VAR1(num)}`;
    }

//    _onPi(num) {
//        return `v${VAR0(num)}=Math.PI`;
//    }
//
//    _onTrig(num) {
//        return `v${VAR0(num)}=Math.${this._TRIGS[VAR2(num)]}(v${VAR1(num)})`;
//    }

    _onFromMem(num) {
        return `v${VAR0(num)}=org.fromMem()`;
    }

    _onToMem(num) {
        return `v${VAR0(num)}=org.toMem(v${VAR1(num)})`;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Code2StringGarmin;


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * You may override this class to set your own fitness calculation.
 * TODO: describe interface
 *
 * @author flatline
 */
const FIELDS      = [
    'Date',
    'Calories',
    'Time',
    'Avg HR'
];
const TENNIS      = [
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-26 09:26:26",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 224,
        "Time": "48:39",
        "Avg HR": 102,
        "Max HR": 142,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-25 09:52:07",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 94,
        "Time": "22:20",
        "Avg HR": 95,
        "Max HR": 130,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-22 11:59:39",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 648,
        "Time": "2:26:17",
        "Avg HR": 108,
        "Max HR": 169,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-22 09:59:11",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 726,
        "Time": "1:58:40",
        "Avg HR": 127,
        "Max HR": 182,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-22 09:07:44",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 77,
        "Time": "12:30",
        "Avg HR": 113,
        "Max HR": 135,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-18 19:08:07",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 491,
        "Time": "1:34:08",
        "Avg HR": 112,
        "Max HR": 151,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-18 09:11:38",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 240,
        "Time": "58:20",
        "Avg HR": 97,
        "Max HR": 134,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-14 19:28:05",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 80,
        "Time": "14:41",
        "Avg HR": 105,
        "Max HR": 135,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-14 17:24:01",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 513,
        "Time": "1:19:30",
        "Avg HR": 123,
        "Max HR": 159,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-14 15:42:09",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 264,
        "Time": "53:34",
        "Avg HR": 105,
        "Max HR": 158,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-14 14:29:46",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 163,
        "Time": "36:17",
        "Avg HR": 99,
        "Max HR": 144,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-12 09:04:04",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 363,
        "Time": "1:10:27",
        "Avg HR": 108,
        "Max HR": 152,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-09 17:02:03",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 328,
        "Time": "1:13:30",
        "Avg HR": 99,
        "Max HR": 152,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-04 09:03:02",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 266,
        "Time": "1:03:38",
        "Avg HR": 98,
        "Max HR": 138,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-06-21 08:51:41",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 272,
        "Time": "1:24:06",
        "Avg HR": 90,
        "Max HR": 132,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-06-18 13:43:05",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 110,
        "Time": "1:07:49",
        "Avg HR": 68,
        "Max HR": 106,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-06-14 09:00:42",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 176,
        "Time": "1:11:32",
        "Avg HR": 80,
        "Max HR": 123,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-06-12 18:44:59",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 249,
        "Time": "1:14:26",
        "Avg HR": 91,
        "Max HR": 126,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-06-10 19:19:43",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 205,
        "Time": "49:34",
        "Avg HR": 99,
        "Max HR": 137,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-06-09 09:00:03",
        "Favorite": "false",
        "Title": "Tennis",
        "Distance": 0,
        "Calories": 281,
        "Time": "1:04:21",
        "Avg HR": 104,
        "Max HR": 146,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    }
];
const HOKKEY      = [
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-27 20:10:37",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 373,
        "Time": "1:50:47",
        "Avg HR": 91,
        "Max HR": 138,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-13 20:35:33",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 308,
        "Time": "1:24:29",
        "Avg HR": 92,
        "Max HR": 148,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-07-06 21:11:37",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 267,
        "Time": "1:06:04",
        "Avg HR": 97,
        "Max HR": 129,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-06-15 20:16:14",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 353,
        "Time": "1:44:38",
        "Avg HR": 92,
        "Max HR": 151,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-06-08 20:53:58",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 266,
        "Time": "1:17:18",
        "Avg HR": 92,
        "Max HR": 137,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-05-11 19:29:12",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 546,
        "Time": "1:33:38",
        "Avg HR": 124,
        "Max HR": 171,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-02-09 21:57:27",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 129,
        "Time": "1:00:41",
        "Avg HR": 74,
        "Max HR": 117,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-02-06 22:32:12",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 242,
        "Time": "1:30:35",
        "Avg HR": 80,
        "Max HR": 119,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-02-02 22:41:22",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 292,
        "Time": "1:21:07",
        "Avg HR": 89,
        "Max HR": 133,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-01-26 21:29:13",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 277,
        "Time": "51:53",
        "Avg HR": 106,
        "Max HR": 139,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-01-23 20:42:55",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 276,
        "Time": "1:06:15",
        "Avg HR": 96,
        "Max HR": 124,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-01-19 20:24:38",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 357,
        "Time": "2:02:41",
        "Avg HR": 81,
        "Max HR": 137,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-01-16 20:26:29",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 569,
        "Time": "1:29:14",
        "Avg HR": 120,
        "Max HR": 166,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2017-01-05 19:58:30",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 428,
        "Time": "2:00:16",
        "Avg HR": 89,
        "Max HR": 138,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2016-12-29 20:33:01",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 440,
        "Time": "1:24:54",
        "Avg HR": 110,
        "Max HR": 161,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2016-12-15 20:36:37",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 398,
        "Time": "1:24:44",
        "Avg HR": 106,
        "Max HR": 147,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2016-12-08 20:16:02",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 266,
        "Time": "1:40:29",
        "Avg HR": 82,
        "Max HR": 133,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2016-11-10 21:52:24",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 55,
        "Time": "10:52",
        "Avg HR": 99,
        "Max HR": 120,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2016-11-10 20:25:27",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 316,
        "Time": "1:20:29",
        "Avg HR": 93,
        "Max HR": 128,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "indoor_cardio",
        "Date": "2016-11-03 20:40:32",
        "Favorite": "false",
        "Title": "Hokkey",
        "Distance": 0,
        "Calories": 339,
        "Time": "1:26:42",
        "Avg HR": 92,
        "Max HR": 141,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Speed": "--",
        "Max Speed": "--",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    }
];
const RUNNING     = [
    {
        "Activity Type": "running",
        "Date": "2017-07-19 20:24:03",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 7.02,
        "Calories": 551,
        "Time": "44:36",
        "Avg HR": 163,
        "Max HR": 173,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "6:22",
        "Best Pace": "4:53",
        "Elev Gain": 20,
        "Elev Loss": 32,
        "Avg Stride Length": 0.92,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-06-29 19:39:57",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 4.35,
        "Calories": 236,
        "Time": "25:06",
        "Avg HR": 136,
        "Max HR": 180,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "5:46",
        "Best Pace": "3:26",
        "Elev Gain": 9,
        "Elev Loss": 6,
        "Avg Stride Length": 1.17,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-06-26 19:56:59",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 4.04,
        "Calories": 219,
        "Time": "31:09",
        "Avg HR": 116,
        "Max HR": 149,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "7:43",
        "Best Pace": "5:32",
        "Elev Gain": 6,
        "Elev Loss": 2,
        "Avg Stride Length": 1.01,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-06-24 19:30:47",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 2.96,
        "Calories": 150,
        "Time": "19:45",
        "Avg HR": 121,
        "Max HR": 136,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "6:40",
        "Best Pace": "5:40",
        "Elev Gain": 4,
        "Elev Loss": 2,
        "Avg Stride Length": 1.01,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-06-21 19:24:00",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 4.33,
        "Calories": 246,
        "Time": "23:18",
        "Avg HR": 148,
        "Max HR": 161,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "5:23",
        "Best Pace": "4:47",
        "Elev Gain": 24,
        "Elev Loss": 24,
        "Avg Stride Length": 1.21,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-06-20 19:55:30",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 2.01,
        "Calories": 120,
        "Time": "13:04",
        "Avg HR": 135,
        "Max HR": 154,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "6:31",
        "Best Pace": "5:42",
        "Elev Gain": 15,
        "Elev Loss": 17,
        "Avg Stride Length": 1.02,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-06-05 21:10:12",
        "Favorite": "false",
        "Title": "Ira",
        "Distance": 4.42,
        "Calories": 342,
        "Time": "30:01",
        "Avg HR": 159,
        "Max HR": 173,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "6:47",
        "Best Pace": "5:14",
        "Elev Gain": 12,
        "Elev Loss": 11,
        "Avg Stride Length": 0.87,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-06-05 21:09:40",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 0.02,
        "Calories": 1,
        "Time": "0:18.0",
        "Avg HR": 90,
        "Max HR": 108,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "12:43",
        "Best Pace": "5:30",
        "Elev Gain": "--",
        "Elev Loss": 10,
        "Avg Stride Length": 0.86,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-06-01 20:43:18",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 6.32,
        "Calories": 404,
        "Time": "35:02",
        "Avg HR": 158,
        "Max HR": 175,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "5:33",
        "Best Pace": "4:52",
        "Elev Gain": 19,
        "Elev Loss": 26,
        "Avg Stride Length": 1.19,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-05-28 21:14:31",
        "Favorite": "false",
        "Title": "Ira",
        "Distance": 4.02,
        "Calories": 300,
        "Time": "26:10",
        "Avg HR": 156,
        "Max HR": 176,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "6:30",
        "Best Pace": "5:17",
        "Elev Gain": 10,
        "Elev Loss": 26,
        "Avg Stride Length": 0.91,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-05-28 20:26:49",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 3.41,
        "Calories": 172,
        "Time": "18:20",
        "Avg HR": 138,
        "Max HR": 166,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "5:22",
        "Best Pace": "4:44",
        "Elev Gain": 8,
        "Elev Loss": 9,
        "Avg Stride Length": 1.22,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-05-26 10:04:36",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 3.15,
        "Calories": 108,
        "Time": "16:15",
        "Avg HR": 116,
        "Max HR": 151,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "5:10",
        "Best Pace": "2:06",
        "Elev Gain": 12,
        "Elev Loss": 27,
        "Avg Stride Length": 4.95,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-05-26 09:58:57",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 0.51,
        "Calories": 13,
        "Time": "2:15.3",
        "Avg HR": 106,
        "Max HR": 111,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "4:27",
        "Best Pace": "2:32",
        "Elev Gain": "--",
        "Elev Loss": 2,
        "Avg Stride Length": 3.97,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-05-21 12:33:51",
        "Favorite": "false",
        "Title": "Maria run",
        "Distance": 3.02,
        "Calories": 197,
        "Time": "17:45",
        "Avg HR": 163,
        "Max HR": 184,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "5:52",
        "Best Pace": "2:37",
        "Elev Gain": 24,
        "Elev Loss": 24,
        "Avg Stride Length": 1.08,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-05-15 11:06:37",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 1.68,
        "Calories": 121,
        "Time": "11:30",
        "Avg HR": 151,
        "Max HR": 165,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "6:51",
        "Best Pace": "5:24",
        "Elev Gain": 5,
        "Elev Loss": 21,
        "Avg Stride Length": 0,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-04-09 20:00:20",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 5.88,
        "Calories": 431,
        "Time": "40:05",
        "Avg HR": 153,
        "Max HR": 168,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "6:49",
        "Best Pace": "5:16",
        "Elev Gain": 16,
        "Elev Loss": 39,
        "Avg Stride Length": 0.86,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-04-09 19:30:27",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 3.31,
        "Calories": 195,
        "Time": "20:45",
        "Avg HR": 141,
        "Max HR": 184,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "6:16",
        "Best Pace": "4:44",
        "Elev Gain": 9,
        "Elev Loss": 12,
        "Avg Stride Length": 1.14,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-04-05 20:27:07",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 4.2,
        "Calories": 323,
        "Time": "27:23",
        "Avg HR": 161,
        "Max HR": 178,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "6:31",
        "Best Pace": "3:45",
        "Elev Gain": 15,
        "Elev Loss": 14,
        "Avg Stride Length": 0.89,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "running",
        "Date": "2017-03-29 20:47:38",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 2.64,
        "Calories": 208,
        "Time": "16:46",
        "Avg HR": 164,
        "Max HR": 177,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "6:22",
        "Best Pace": "4:00",
        "Elev Gain": 8,
        "Elev Loss": 10,
        "Avg Stride Length": 0.93,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    },
    {
        "Activity Type": "treadmill_running",
        "Date": "2017-02-17 20:06:50",
        "Favorite": "false",
        "Title": "Untitled",
        "Distance": 0.51,
        "Calories": 47,
        "Time": "3:56.7",
        "Avg HR": 153,
        "Max HR": 178,
        "Aerobic TE": 0,
        "Avg Cadence": "--",
        "Max Cadence": "--",
        "Avg Pace": "7:41",
        "Best Pace": "4:30",
        "Elev Gain": "--",
        "Elev Loss": "--",
        "Avg Stride Length": 1.17,
        "Avg Vertical Ratio": 0,
        "Avg Vertical Oscillation": 0,
        "Avg Ground Contact Time": "--",
        "Avg GCT Balance": "--",
        "Normalized Power® (NP®)": "--",
        "L/R Balance": "--",
        "Training Stress Score®": 0,
        "Max Avg Power (20 min)": "--",
        "Power": "--",
        "Max Power": "--",
        "Total Strokes": "--",
        "Avg. Swolf": "--",
        "Avg Stroke Rate": "--"
    }
];
const ACTIVITIES  = [TENNIS, HOKKEY, RUNNING];
const ERR_PERCENT = 0.1;
const TOTAL       = ((arr)=>{let sum = 0; arr.forEach((el)=>sum+=el.length);return sum})(ACTIVITIES);
const GOAL        = TOTAL - TOTAL * ERR_PERCENT;

class FitnessGarmin {
    static run(org) {
        const len = ACTIVITIES.length;

        org.energy = 0;
        for (let i = 0; i < len; i++) {
            this._run(org, ACTIVITIES[i], i);
        }
        //
        // true means that result is found
        //
        return org.energy >= GOAL;
    }

    static compare(org1, org2, maxChanges) {
        const diff = maxChanges / TOTAL;
        return org1.energy * diff * org1.changes > org2.energy * diff * org2.changes;
    }

    static _run(org, data, index) {
        const len  = data.length;
        const code = org.jsvm;
        const vars = code.vars;

        for (let i = 0; i < len; i++) {
            org.mem.length = 0;
            this._setVars(data[i], vars);
            code.run(org);
            org.energy += +(vars[0] === index);
        }
    }

    static _setVars(data, vars) {
        for (let v = 0, len = vars.length; v < len; v++) {
            vars[v] = this._prepareData(FIELDS[v], data[FIELDS[v]]);
        }
    }

    static _prepareData(key, val) {
        if (key === 'Date') {
            let time = val.split(' ')[1].split(':');
            return +time[0] * 3600 + +time[1] * 60 + +time[2];
        }
        if (key === 'Time') {
            let time = val.split(':');
            return time.length > 2 ? time[0] * 3600 + +time[1] * 60 + +time[2] : +time[0] * 60 + +time[1];
        }

        return val;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FitnessGarmin;


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_src_global_Observer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_src_global_Observer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__common_src_global_Observer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_Events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Num__ = __webpack_require__(4);
/**
 * Implements organism's code logic.
 * TODO: explain here code one number format,...
 *
 * @author flatline
 * TODO: may be this module is redundant
 * TODO: think about custom operators callbacks from outside. This is how
 * TODO: we may solve custom tasks
 */







/**
 * {Number} Maximum stack size, which may be used for recursion or function parameters
 */
const MAX_STACK_SIZE = 30000;

class JSVM extends __WEBPACK_IMPORTED_MODULE_2__common_src_global_Observer___default.a {
    /**
     * Creates JSVM instance. codeEndCb will be called after last code line is run. classMap
     * is a map of classes. We need only one - Operators class. We use this approach, because
     * it's impossible to set class in a Config module. parent is used if JSVM instance is
     * in a cloning mode and we have to create a copy of it.
     * @param {Function} codeEndCb
     * @param {Observer} obs Observer instance for Operators class
     * @param {Array} classMap
     * @param {JSVM} parent Parent JSVM instance in case of cloning
     */
    constructor(codeEndCb, obs, classMap, parent = null) {
        super(__WEBPACK_IMPORTED_MODULE_3__global_Events__["EVENT_AMOUNT"]);

        this._classMap    = classMap;
        this._obs         = obs;
        /**
         * {Function} Callback, which is called on every organism
         * jsvm iteration. On it's end.
         */
        this._onCodeEnd   = codeEndCb;
        /**
         * {Array} Array of two numbers. first - line number where we have
         * to return if first line appears. second - line number, where ends
         * closing block '}' of block operator (e.g. for, if,...).
         */
        this._offsets     = [];
        this._vars        = parent && parent.vars && parent.vars.slice() || this._getVars();
        /**
         * {Function} Class, which implement all supported operators
         */
        this._operators   = new classMap[__WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].codeOperatorsCls](this._offsets, this._vars, obs);
        this._code        = parent && parent.code.slice() || [];
        this._line        = 0;
    }

    get code()      {return this._code}
    get size()      {return this._code.length}
    get operators() {return this._operators};
    get vars()      {return this._vars}
    get offsets()   {return this._offsets}
    get line()      {return this._line}

    serialize() {
        return {
            offsets         : this._offsets.slice(),
            vars            : this._vars.slice(),
            // 'operators' field will be added after insertion
            code            : this._code.slice(),
            line            : this._line
        };
    }

    unserialize(json) {
        this._offsets   = json.offsets;
        this._vars      = json.vars;
        this._code      = json.code;
        this._line      = json.line;
        this._operators = new this._classMap[__WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].codeOperatorsCls](this._offsets, this._vars, this._obs);
    }

    /**
     * Walks through code lines (32bit numbers) one by one and runs associated
     * with line type callback. These callbacks interpret one line of code like:
     * condition, loop, function call etc...
     * @param {Organism} org Current organism
     */
    run(org) {
        let line  = this._line;
        let code  = this._code;
        let lines = code.length;
        let len   = lines === 0 ? 0 : __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].codeYieldPeriod || lines;
        let len2  = len;
        let ops   = this._operators.operators;
        let getOp = __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].getOperator;
        let ret   = false;
        let offs  = this._offsets;

        while (len-- > 0 && org.alive) {
            line = ops[getOp(code[line])](code[line], line, org, lines, ret);
            //
            // We found closing bracket '}' of some loop and have to return
            // to the beginning of operator (e.g.: for)
            //
            if (ret = (offs.length > 0 && line === offs[offs.length - 1])) {
                offs.pop();
                line = offs.pop();
                continue;
            }
            if (line >= lines) {
                line = 0;
                org.alive && (this._operators.offsets = (this._offsets = []));
                if (this._onCodeEnd) {
                    this._onCodeEnd(len2 - len);
                }
                break;
            }
        }

        this._line = line;
    }

    destroy() {
        this._operators.destroy && this._operators.destroy();
        this._operators = null;
        this._vars      = null;
        this._code      = null;
        this._onCodeEnd = null;
        this.clear();
    }

    /**
     * Does crossover between two parent byte codes. Takes second jsvm's code part
     * (from start1 to end1 offset) and inserts it instead first jsvm code part (start...end).
     * For example:
     *   code1 : [1,2,3]
     *   code2 : [4,5,6]
     *   start : 1
     *   end   : 2
     *   start1: 0
     *   end1  : 2
     *   jsvm1.crossover(jsvm2) // [4,5,6] instead [2,3] ->, jsvm1 === [1,4,5,6]
     *
     * @param {JSVM} jsvm JSVM instance, from where we have to cut code part
     * @returns {Number} Amount of changes in current (this) jsvm
     */
    crossover(jsvm) {
        const rand    = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper___default.a.rand;
        const len     = this._code.length;
        const len1    = jsvm.code.length;
        let   start   = rand(len);
        let   end     = rand(len);
        let   start1  = rand(len1);
        let   end1    = rand(len1);
        let   adds;

        if (start > end) {[start, end] = [end, start]}
        if (start1 > end1) {[start1, end1] = [end1, start1]}

        adds = Math.abs(end1 - start1 - end + start);
        if (this._code.length + adds >= __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].codeMaxSize) {return 0}
        this._code.splice.apply(this._code, [start, end - start + 1].concat(jsvm.code.slice(start1, end1 + 1)));
        this._reset();

        return adds;
    }

    /**
     * Takes few lines from itself and makes a copy of them. After that inserts
     * them before or after copied part. All positions are random
     */
    copyLines() {
        const rand    = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper___default.a.rand;
        const code    = this._code;
        const codeLen = code.length;
        const start   = rand(codeLen);
        const end     = start + rand(codeLen - start);
        //
        // Because we use spread (...) operator stack size is important
        // for amount of parameters and we shouldn't exceed it
        //
        if (end - start > MAX_STACK_SIZE) {
            return;
        }
        //
        // We may insert copied piece before "start" (0) or after "end" (1)
        //
        if (rand(2) === 0) {
            code.splice(rand(start), 0, ...code.slice(start, end));
            return;
        }

        code.splice(end + rand(codeLen - end + 1), 0, ...code.slice(start, end));
    }

    /**
     * Inserts random generated number into the byte code at random position
     */
    insertLine() {
        this._code.splice(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper___default.a.rand(this._code.length), 0, __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].get());
        this._reset();
    }

    updateLine(index, number) {
        this._code[index] = number;
        this._reset();
    }

    /**
     * Removes random generated number into byte jsvm at random position
     */
    removeLine() {
        this._code.splice(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper___default.a.rand(this._code.length), 1);
        this._reset();
    }

    getLine(index) {
        return this._code[index];
    }

    _reset() {
        this.fire(__WEBPACK_IMPORTED_MODULE_3__global_Events__["EVENTS"].RESET_CODE);
        this._line    = 0;
        this._operators.offsets = (this._offsets = []);
    }

    /**
     * Generates default variables jsvm. It should be in ES5 version, because
     * speed is important. Amount of vars depends on Config.codeBitsPerVar config.
     * @returns {Array} vars jsvm
     * @private
     */
    _getVars() {
        if (this._vars && this._vars.length > 0) {return this._vars}

        const len    = Math.pow(2, __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].codeBitsPerVar);
        let   vars   = new Array(len);
        const range  = __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].codeVarInitRange;
        const range2 = range / 2;
        const rand   = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper___default.a.rand;

        for (let i = 0; i < len; i++) {
            vars[i] = rand(range) - range2;
        }

        return (this._vars = vars);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = JSVM;


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_Events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_Operators__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Num__ = __webpack_require__(4);
/**
 * Digital Organisms Script - (DOS) is a simple language for JSVM.
 * This file contains all available operators implementation. For example:
 * for, if, variable declaration, steps, eating etc... User may override
 * this class for own needs and change operator list to custom.
 *
 * @author flatline
 */






/**
 * {Function} Just a shortcuts
 */
const VAR0                  = __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].getVar;
const VAR1                  = (n) => __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].getVar(n, 1);
const VAR2                  = (n) => __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].getVar(n, 2);
const BITS_AFTER_THREE_VARS = __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].BITS_PER_OPERATOR + __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].BITS_PER_VAR * 3;
const FOUR_BITS             = 4;
const BLOCK_MAX_LEN         = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeBitsPerBlock;
const BITS_FOR_NUMBER       = 16;
const IS_NUM                = __WEBPACK_IMPORTED_MODULE_2__common_src_global_Helper___default.a.isNumeric;
const HALF_OF_VAR           = __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].MAX_VAR / 2;
const CONDITION_BITS        = 2;

class OperatorsDos extends __WEBPACK_IMPORTED_MODULE_3__base_Operators__["a" /* default */] {
    constructor(offs, vars, obs) {
        super(offs, vars, obs);
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
         */
        this._OPERATORS_CB = [
            this.onVar.bind(this),
            //this.onFunc.bind(this),
            this.onCondition.bind(this),
            this.onLoop.bind(this),
            this.onOperator.bind(this),
            this.onNot.bind(this),
            //this.onPi.bind(this),
            //this.onTrig.bind(this),
            this.onLookAt.bind(this),
            this.onEatLeft.bind(this),
            this.onEatRight.bind(this),
            this.onEatUp.bind(this),
            this.onEatDown.bind(this),
            this.onStepLeft.bind(this),
            this.onStepRight.bind(this),
            this.onStepUp.bind(this),
            this.onStepDown.bind(this),
            this.onFromMem.bind(this),
            this.onToMem.bind(this),
            this.onMyX.bind(this),
            this.onMyY.bind(this),
            this.onCheckLeft.bind(this),
            this.onCheckRight.bind(this),
            this.onCheckUp.bind(this),
            this.onCheckDown.bind(this)
        ];
        /**
         * {Array} Available conditions for if operator. Amount should be
         * the same like (1 << BITS_PER_VAR)
         */
        this._CONDITIONS = [(a,b)=>a<b, (a,b)=>a>b, (a,b)=>a==b, (a,b)=>a!=b];
        /**
         * {Array} Available operators for math calculations
         */
        this._OPERATORS = [
            (a,b)=>a+b, (a,b)=>a-b, (a,b)=>a*b, (a,b)=>a/b, (a,b)=>a%b, (a,b)=>a&b, (a,b)=>a|b, (a,b)=>a^b, (a,b)=>a>>b, (a,b)=>a<<b, (a,b)=>a>>>b, (a,b)=>+(a<b), (a,b)=>+(a>b), (a,b)=>+(a==b), (a,b)=>+(a!=b), (a,b)=>+(a<=b)
        ];
        //this._TRIGS = [(a)=>Math.sin(a), (a)=>Math.cos(a), (a)=>Math.tan(a), (a)=>Math.abs(a)];
        //
        // We have to set amount of available operators for correct
        // working of mutations of operators.
        //
        __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].setOperatorAmount(this._OPERATORS_CB.length);
    }

    destroy() {
        super.destroy();
        this._OPERATORS_CB = null;
        this._CONDITIONS   = null;
        this._OPERATORS    = null;
        //this._TRIGS        = null;
    }

    get operators() {return this._OPERATORS_CB}

    /**
     * Parses variable operator. Format: var = number|var. 'num' bits format:
     * TODO:
     *
     * @param {Num} num Packed into number jsvm line
     * @param {Number} line Current line in jsvm
     * @return {Number} Parsed jsvm line string
     */
    onVar(num, line) {
        const vars = this.vars;
        vars[VAR0(num)] = VAR2(num) < HALF_OF_VAR ? __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, BITS_FOR_NUMBER) : vars[VAR1(num)];
        return line + 1;
    }

    //onFunc(num, line) {
    //    return line + 1;
    //}

    onCondition(num, line, org, lines) {
        const val3 = __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, BLOCK_MAX_LEN);
        const offs = this._getOffs(line, lines, val3);
        const cond = VAR2(num) >>> (__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeBitsPerVar - CONDITION_BITS);

        if (this._CONDITIONS[cond](this.vars[VAR0(num)], this.vars[VAR1(num)])) {
            return line + 1;
        }

        return offs;
    }

    /**
     * for(v0=v1; v0<v2; v0++)
     */
    onLoop(num, line, org, lines, afterIteration = false) {
        const vars = this.vars;
        const var0 = VAR0(num);
        const val3 = __WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, BLOCK_MAX_LEN);
        const offs = this._getOffs(line, lines, val3);
        //
        // If last iteration has done and we've returned to the line,
        // where "for" operator is located
        //
        if (afterIteration === true) {
            if (++vars[var0] < vars[VAR2(num)]) {
                this.offs.push(line, offs);
                return line + 1;
            }
            return offs;
        }
        //
        // This is first time we are running "for" operator. No
        // iterations hav done, yet
        //
        vars[var0] = vars[VAR1(num)];
        if (vars[var0] < vars[VAR2(num)]) {
            this.offs.push(line, offs);
            return line + 1;
        }

        return offs;
    }

    onOperator(num, line) {
        const vars = this.vars;
        vars[VAR0(num)] = this._OPERATORS[__WEBPACK_IMPORTED_MODULE_4__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, FOUR_BITS)](vars[VAR1(num)], vars[VAR2(num)]);
        return line + 1;
    }

    onNot(num, line) {
        this.vars[VAR0(num)] = +!this.vars[VAR1(num)];
        return line + 1;
    }

    //onPi(num, line) {
    //    this.vars[VAR0(num)] = Math.PI;
    //    return line + 1;
    //}

    //onTrig(num, line) {
    //    this.vars[VAR0(num)] = this._TRIGS[VAR2(num)](this.vars[VAR1(num)]);
    //    return line + 1;
    //}

    onLookAt(num, line, org) {
        const vars = this.vars;
        let   x    = vars[VAR1(num)];
        let   y    = vars[VAR2(num)];
        if (!IS_NUM(x) || !IS_NUM(y) || x < 0 || y < 0 || x >= __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldWidth || y >= __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].worldHeight) {
            vars[VAR0(num)] = 0;
            return line + 1;
        }

        let ret = {ret: 0};
        this.obs.fire(__WEBPACK_IMPORTED_MODULE_0__global_Events__["EVENTS"].GET_ENERGY, org, x, y, ret);
        vars[VAR0(num)] = ret.ret;

        return line + 1;
    }

    onEatLeft(num, line, org)   {this.vars[VAR0(num)] = this._eat(org, num, org.x - 1, org.y); return line + 1}
    onEatRight(num, line, org)  {this.vars[VAR0(num)] = this._eat(org, num, org.x + 1, org.y); return line + 1}
    onEatUp(num, line, org)     {this.vars[VAR0(num)] = this._eat(org, num, org.x, org.y - 1); return line + 1}
    onEatDown(num, line, org)   {this.vars[VAR0(num)] = this._eat(org, num, org.x, org.y + 1); return line + 1}

    onStepLeft(num, line, org)  {this.vars[VAR0(num)] = this._step(org, org.x, org.y, org.x - 1, org.y); return line + 1}
    onStepRight(num, line, org) {this.vars[VAR0(num)] = this._step(org, org.x, org.y, org.x + 1, org.y); return line + 1}
    onStepUp(num, line, org)    {this.vars[VAR0(num)] = this._step(org, org.x, org.y, org.x, org.y - 1); return line + 1}
    onStepDown(num, line, org)  {this.vars[VAR0(num)] = this._step(org, org.x, org.y, org.x, org.y + 1); return line + 1}

    onFromMem(num, line, org) {this.vars[VAR0(num)] = org.mem.pop() || 0; return line + 1}
    onToMem(num, line, org) {
        const val = this.vars[VAR1(num)];

        if (IS_NUM(val) && org.mem.length < __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].orgMemSize) {
            this.vars[VAR0(num)] = org.mem.push(val);
        } else {
            this.vars[VAR0(num)] = 0;
        }

        return line + 1;
    }

    onMyX(num, line, org) {this.vars[VAR0(num)] = org.x; return line + 1}
    onMyY(num, line, org) {this.vars[VAR0(num)] = org.y; return line + 1}

    onCheckLeft(num, line, org)  {return this._checkAt(num, line, org, org.x - 1, org.y)}
    onCheckRight(num, line, org) {return this._checkAt(num, line, org, org.x + 1, org.y)}
    onCheckUp(num, line, org)    {return this._checkAt(num, line, org, org.x, org.y - 1)}
    onCheckDown(num, line, org)  {return this._checkAt(num, line, org, org.x, org.y + 1)}

    _checkAt(num, line, org, x, y) {
        const ret = {ret: 0};
        org.fire(__WEBPACK_IMPORTED_MODULE_0__global_Events__["EVENTS"].CHECK_AT, x, y, ret);
        this.vars[VAR0(num)] = ret.ret;
        return line + 1;
    }

    _eat(org, num, x, y) {
        const vars   = this.vars;
        const amount = vars[VAR1(num)];
        if (!IS_NUM(amount) || amount === 0) {return 0}

        let ret = {ret: amount};
        this.obs.fire(__WEBPACK_IMPORTED_MODULE_0__global_Events__["EVENTS"].EAT, org, x, y, ret);
        if (!IS_NUM(ret.ret)) {return 0}
        org.energy += ret.ret;

        return ret.ret;
    }

    _step(org, x1, y1, x2, y2) {
        let ret = {ret: 0};
        let dir;

        this.obs.fire(__WEBPACK_IMPORTED_MODULE_0__global_Events__["EVENTS"].STEP, org, x1, y1, x2, y2, ret);
        if (ret.ret > 0) {
            org.x = x2;
            org.y = y2;
        }

        return ret.ret;
    }

    /**
     * Returns offset for closing bracket of blocked operators like
     * "if", "for" and so on. These operators shouldn't overlap each
     * other. for example:
     *
     *     for (...) {     // 0
     *         if (...) {  // 1
     *             ...     // 2
     *         }           // 3
     *     }               // 4
     *
     * Closing bracket in line 3 shouldn't be after bracket in line 4.
     * So it's possible to set it to one of  1...3. So we change it in
     * real time to fix the overlap problem.
     * @param {Number} line Current line index
     * @param {Number} lines Amount of lines
     * @param {Number} offs Local offset of closing bracket we want to set
     * @returns {Number}
     * @private
     */
    _getOffs(line, lines, offs) {
        let   offset  = line + offs < lines ? line + offs + 1 : lines;
        const offsets = this.offs;
        const length  = offsets.length;

        if (length > 0 && offset >= offsets[length - 1]) {
            return offsets[length - 1];
        }

        return offset;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OperatorsDos;


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base_Operators__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Num__ = __webpack_require__(4);
/**
 * This file contains all available operators implementation. For example:
 * for, if, variable declaration, steps, eating etc... User may override
 * this class for own needs and change operator list to custom. These
 * operators are used to obtain type of training saved by Garmin watches.
 *
 * @author flatline
 */





/**
 * {Function} Just a shortcuts
 */
const VAR0                  = __WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].getVar;
const VAR1                  = (n) => __WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].getVar(n, 1);
const VAR2                  = (n) => __WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].getVar(n, 2);
const BITS_AFTER_THREE_VARS = __WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].BITS_PER_OPERATOR + __WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].BITS_PER_VAR * 3;
const BITS_OF_TWO_VARS      = __WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].BITS_OF_TWO_VARS;
const IS_NUM                = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper___default.a.isNumeric;
const HALF_OF_VAR           = __WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].MAX_VAR / 2;
const CONDITION_BITS        = 2;

class OperatorsGarmin extends  __WEBPACK_IMPORTED_MODULE_2__base_Operators__["a" /* default */] {
    constructor(offs, vars, obs) {
        super(offs, vars, obs);
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
         */
        this._OPERATORS_CB = [
            this.onVar.bind(this),
            this.onCondition.bind(this),
            //this.onLoop.bind(this),
            this.onOperator.bind(this),
            this.onNot.bind(this),
            //this.onPi.bind(this),
            //this.onTrig.bind(this),
            this.onFromMem.bind(this),
            this.onToMem.bind(this)
        ];
        /**
         * {Array} Available conditions for if operator. Amount should be
         * the same like (1 << BITS_PER_VAR)
         */
        this._CONDITIONS = [(a,b)=>a<b, (a,b)=>a>b, (a,b)=>a==b, (a,b)=>a!=b];
        /**
         * {Array} Available operators for math calculations
         */
        this._OPERATORS = [
            (a,b)=>a+b, (a,b)=>a-b, (a,b)=>a*b, (a,b)=>a/b, (a,b)=>a%b, (a,b)=>a&b, (a,b)=>a|b, (a,b)=>a^b, (a,b)=>a>>b, (a,b)=>a<<b, (a,b)=>a>>>b, (a,b)=>+(a<b), (a,b)=>+(a>b), (a,b)=>+(a==b), (a,b)=>+(a!=b), (a,b)=>+(a<=b)
        ];
        this._TRIGS = [(a)=>Math.sin(a), (a)=>Math.cos(a), (a)=>Math.tan(a), (a)=>Math.abs(a)];
        //
        // We have to set amount of available operators for correct
        // working of mutations of operators.
        //
        __WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].setOperatorAmount(this._OPERATORS_CB.length);
    }

    destroy() {
        this._OPERATORS_CB = null;
        this._CONDITIONS   = null;
        this._OPERATORS    = null;
        this._TRIGS        = null;
    }

    get operators() {return this._OPERATORS_CB}

    /**
     * Parses variable operator. Format: let = const|number. Num bits format:
     *   BITS_PER_OPERATOR bits - operator id
     *   BITS_PER_VAR bits  - destination var index
     *   BITS_PER_VAR bits  - assign type (const (half of bits) or variable (half of bits))
     *   BITS_PER_VAR bits  - variable index or all bits till the end for constant
     *
     * @param {Num} num Packed into number jsvm line
     * @param {Number} line Current line in jsvm
     * @return {Number} Parsed jsvm line string
     */
    onVar(num, line) {
        const vars = this.vars;
        const var1 = VAR1(num);
        vars[VAR0(num)] = var1 >= HALF_OF_VAR ? __WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS) : vars[var1];

        return line + 1;
    }

    onCondition(num, line, org, lines) {
        const val3 = __WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS);
        const offs = line + val3 < lines ? line + val3 + 1 : lines;
        const cond = VAR2(num) >>> (__WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].codeBitsPerVar - CONDITION_BITS);

        if (this._CONDITIONS[cond](this.vars[VAR0(num)], this.vars[VAR1(num)])) {
            return line + 1;
        }

        return offs;
    }

//    onLoop(num, line, org, lines, ret) {
//        const vars = this.vars;
//        const var0 = VAR0(num);
//        const val3 = Num.getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS);
//        const offs = line + val3 < lines ? line + val3 + 1 : lines;
//
//        if (ret) {
//            if (++vars[var0] < vars[VAR2(num)]) {
//                this.offs.push(line, offs);
//                return line + 1;
//            }
//            return offs;
//        }
//
//        vars[var0] = vars[VAR1(num)];
//        if (vars[var0] < vars[VAR2(num)]) {
//            this.offs.push(line, offs);
//            return line + 1;
//        }
//
//        return offs;
//    }

    onOperator(num, line) {
        const vars = this.vars;
        vars[VAR0(num)] = this._OPERATORS[__WEBPACK_IMPORTED_MODULE_3__Num__["a" /* default */].getBits(num, BITS_AFTER_THREE_VARS, BITS_OF_TWO_VARS)](vars[VAR1(num)], vars[VAR2(num)]);
        return line + 1;
    }

    onNot(num, line) {
        this.vars[VAR0(num)] = +!this.vars[VAR1(num)];
        return line + 1;
    }

//    onPi(num, line) {
//        this.vars[VAR0(num)] = Math.PI;
//        return line + 1;
//    }
//
//    onTrig(num, line) {
//        this.vars[VAR0(num)] = this._TRIGS[VAR2(num)](this.vars[VAR1(num)]);
//        return line + 1;
//    }

    onFromMem(num, line, org) {this.vars[VAR0(num)] = org.mem.pop() || 0; return line + 1}

    onToMem(num, line, org) {
        const val = this.vars[VAR1(num)];

        if (IS_NUM(val) && org.mem.length < __WEBPACK_IMPORTED_MODULE_0__common_src_global_Config__["Config"].orgMemSize) {
            org.mem.push(val);
            this.vars[VAR0(num)] = val;
        } else {
            this.vars[VAR0(num)] = org.mem[org.mem.length - 1];
        }

        return line + 1;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OperatorsGarmin;


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_Organism__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Events__ = __webpack_require__(1);
/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author flatline
 */




class OrganismGarmin extends __WEBPACK_IMPORTED_MODULE_0__base_Organism__["a" /* default */] {
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
     * @param {Object} classMap Available classes map. Maps class names into
     * classe functions
     * @param {Organism} parent Parent organism if cloning is needed
     */
    constructor(id, x, y, alive, item, codeEndCb, classMap, parent = null) {
        super(id, x, y, alive, item, codeEndCb, classMap, parent);

        this._fitnessCls = classMap[__WEBPACK_IMPORTED_MODULE_1__common_src_global_Config__["Config"].codeFitnessCls];
        this._needRun    = true;

        this.jsvm.on(__WEBPACK_IMPORTED_MODULE_2__global_Events__["EVENTS"].RESET_CODE, this._onResetCode.bind(this));
    }

    onBeforeRun() {
        return !this._needRun;
    }

    onRun() {
        if (this._fitnessCls.run(this)) {this.fire(__WEBPACK_IMPORTED_MODULE_2__global_Events__["EVENTS"].STOP, this)}
        this._needRun = false;
    }

    destroy() {
        super.destroy();
        this._fitnessCls = null;
    }

    /**
     * Is called when some modifications in code appeared and we have
     * to re-execute it again
     * @private
     */
    _onResetCode() {
        this._needRun = true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OrganismGarmin;


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Canvas implementation with minimum logic for drawing colored dots.
 *
 * @author flatline
 */
class Canvas {
    constructor(width, height) {
        const id     = 'world';
        const doc    = document;
        const bodyEl = doc.body;

        this._prepareDom();
        bodyEl.innerHTML += `<canvas id="${id}" width="${width}" height="${height}"></canvas>`;

        this._width     = width;
        this._height    = height;
        this._canvasEl  = doc.querySelector('#' + id);
        this._ctx       = this._canvasEl.getContext('2d');
        this._text      = {x: 0, y: 0, t: ''};
        this._imgData   = this._ctx.createImageData(this._width, this._height);
        this._data      = this._imgData.data;
        this._animate   = this._onAnimate.bind(this);
        this._visualize = true;

        this._ctx.font = "13px Consolas";
        this._ctx.fillStyle = "white";
        this.clear();
        window.requestAnimationFrame(this._animate);
    }

    destroy() {
        this._canvasEl.empty();
        this._ctx     = null;
        this._imgData = null;
        this._data    = null;
    }

    visualize(visualize = true) {
        this._visualize = visualize;
        this._onAnimate();
    }

    text(x, y, text) {
        const t = this._text;

        t.t = text;
        t.x = x;
        t.y = y;
    }

    dot(x, y, color) {
        this._dot(x, y, color);
    }

    /**
     * Clears canvas with black color
     */
    clear() {
        const size = this._width * this._height * 4;
        const data = this._data;

        for (let i = 0; i < size; i += 4) {
            data[i + 3] = 0xff;
        }
    }

    /**
     * Sets pixel to specified color with specified coordinates.
     * Color should contain red, green and blue components in one
     * decimal number. For example: 16777215 is #FFFFFF - white.
     * In case of invalid coordinates 0 value for x, color and y will
     * be used.
     * @param {Number} x X coordinate
     * @param {Number} y Y coordinate
     * @param {Number} color Decimal color
     */
    _dot(x, y, color) {
        const data = this._data;
        const offs = (y * this._width + x) * 4;

        data[offs    ] = (color >> 16) & 0xff;
        data[offs + 1] = (color >> 8)  & 0xff;
        data[offs + 2] = color & 0xff;
    }

    _onAnimate() {
        const text = this._text;

        this._ctx.putImageData(this._imgData, 0, 0);
        this._ctx.fillText(text.t, text.x, text.y);

        if (this._visualize === true) {
            window.requestAnimationFrame(this._animate);
        }
    }

    _prepareDom() {
        const bodyEl = document.querySelector('body');
        const htmlEl = document.querySelector('html');

        bodyEl.style.width  = '100%';
        bodyEl.style.height = '100%';
        bodyEl.style.margin = 0;
        htmlEl.style.width  = '100%';
        htmlEl.style.height = '100%';
        htmlEl.style.margin = 0;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Canvas;


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Observer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_src_global_Observer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_src_global_Observer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_Events__ = __webpack_require__(1);
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
 * @author flatline
 */





/**
 * {Number} Amount of attempts for finding free place in a world.
 * The same like this.getDot(x, y) === 0
 */
const FREE_DOT_ATTEMPTS = 300;

class World extends __WEBPACK_IMPORTED_MODULE_0__common_src_global_Observer___default.a {
    constructor (width, height) {
        super(__WEBPACK_IMPORTED_MODULE_2__global_Events__["EVENT_AMOUNT"]);
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

    get data() {return this._data}

    setDot(x, y, color) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {return false}
        this._data[x][y] = color;
        this.fire(__WEBPACK_IMPORTED_MODULE_2__global_Events__["EVENTS"].DOT, x, y, color);

        return true;
    }

    getDot(x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {return false}
        return this._data[x][y];
    }

    grabDot(x, y, amount) {
        let dot = Math.min(this.getDot(x, y), amount);

        if (dot > 0) {
            this.fire(__WEBPACK_IMPORTED_MODULE_2__global_Events__["EVENTS"].DOT, x, y, (this._data[x][y] -= dot));
        }

        return dot;
    }

    getFreePos() {
        const rand   = __WEBPACK_IMPORTED_MODULE_1__common_src_global_Helper___default.a.rand;
        const width  = this._width;
        const height = this._height;
        let   i      = FREE_DOT_ATTEMPTS;
        let   x;
        let   y;

        while (this.getDot(x = rand(width), y = rand(height)) > 0 && i-- > 0) {}

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
            if (this.getDot(positions[j], positions[j + 1]) === 0) {
                return {x: positions[j], y: positions[j + 1]};
            }
            j += 2;
        }

        return false;
    }

    isFree(x, y) {
        return this.getDot(x, y) === 0;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = World;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * Implementation of two directional Queue. Queue is a list of connected
 * items, where you may iterate back and forward using internal references
 * (next, prev). Every item of the queue contains custom value (in
 * 'val' field). This queue is used for speeding up organisms iteration.
 * Removing of Queue element is done at the moment and not affects items
 * iteration in comparison with an array or an object. Also removing of
 * element from the Queue is very fast.
 *
 * @author flatline
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

    destroy() {
        this._first = null;
        this._last  = null;
        this._size  = 0;
    }

    get first() {return this._first}
    get last()  {return this._last}
    get size()  {return this._size}

    /**
     * Wraps the value into item object and adds it to the end of the queue
     * @param {*} val Value for adding
     */
    add(val) {
        if (this._size++ > 0) {
            this._last = this._last.next = {
                prev: this._last,
                next: null,
                val : val
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

        if (item.prev !== null) {item.prev.next = item.next}
        else {this._first = item.next}

        if (item.next !== null) {item.next.prev = item.prev}
        else {this._last = item.prev}
    }

    /**
     * Possibly slow method, because we have to iterate index times
     * in a loop.
     * @param {Number} index Index of element in a Queue
     * @returns {null|Object} Item or null if index is incorrect
     */
    get(index) {
        let item = this._first;
        while (--index > -1 && item) {item = item.next}
        return item;
    }
}

module.exports = Queue;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Base class for Client and Server classes. Contains basic methods like
 * request(), response(), onMessage(), onClose(),... Client and Server should
 * override them in their classes.
 *
 * @author slackline
 */
const Observer = __webpack_require__(5);

class Connection extends Observer {
    constructor(eventAmount) {
        super(eventAmount);
        /**
         * {String} Reason why connection was closed. See onClose()
         * method for details.
         */
        this._closeReason = '';
    }

    get closeReason() {return this._closeReason}

    /**
     * Sends data to the client. First two parameters are required. All
     * other parameters depend of special request and will be send to
     * the client as an array.
     * @param {WebSocket} sock
     * @param {Number} type Request type (see Requests.TYPES)
     * @param {*} params Array of parameters
     * @return {Number} Unique request id
     * @abstract
     */
    request(sock, type, ...params) {}

    /**
     * Is user for answering on requests. May not be called if response
     * (response) don't needed.
     * @param {WebSocket} sock Socket where send the response
     * @param {Number} type Request type (see Requests.TYPES)
     * @param {Number} reqId Unique request id, returned by send() method
     * @param {Array} params Custom parameters to send
     * @abstract
     */
    response(sock, type, reqId, ...params) {}

    /**
     * Is called every time if server/client sends us a request or response (response).
     * @param {WebSocket} sock Socket, received the message
     * @param {Event} event Message event. Data is in 'data' property
     * @abstract
     */
    onMessage(sock, event) {}

    /**
     * Is called on every error during websockets work
     * @param {Event} event Error event
     * @abstract
     */
    onError(event) {}

    /**
     * Connection has closed
     * @param {Event} event
     */
    onClose(event) {
        let reason = 'Unknown error';
        switch(event.code) {
            case 1000: reason = 'Normal closure';
                break;
            case 1001: reason = 'An endpoint is going away';
                break;
            case 1002: reason = 'An endpoint is terminating the connection due to a protocol error.';
                break;
            case 1003: reason = 'An endpoint is terminating the connection because it has received a type of data it cannot accept';
                break;
            case 1004: reason = 'Reserved. The specific meaning might be defined in the future.';
                break;
            case 1005: reason = 'No status code was actually present';
                break;
            case 1006: reason = 'The connection was closed abnormally';
                break;
            case 1007: reason = 'The endpoint is terminating the connection because a message was received that contained inconsistent data';
                break;
            case 1008: reason = 'The endpoint is terminating the connection because it received a message that violates its policy';
                break;
            case 1009: reason = 'The endpoint is terminating the connection because a data frame was received that is too large';
                break;
            case 1010: reason = 'The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn\'t.';
                break;
            case 1011: reason = 'The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
                break;
            case 1012: reason = 'The server is terminating the connection because it is restarting';
                break;
            case 1013: reason = 'The server is terminating the connection due to a temporary condition';
                break;
            case 1015: reason = 'The connection was closed due to a failure to perform a TLS handshake';
                break;
        }

        this._closeReason = reason;
    }

    /**
     * @destructor
     * @abstract
     */
    destroy() {}
}

module.exports = Connection;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Base class of plugin for Client or Server classes, which implement their API. It separated
 * from Client/Server to have an ability to change API any time without changing server's/client's
 * code. You have to inherit your class from this one to have special API for client/ or server.
 * Also, you have to set API map (see this.api map) to bind request types and their handlers
 * together. For example:
 *
 *     class ServerApi extends Api {
 *         constructor() {
 *             super();
 *             this.api[TYPES.REQ_SET_ACTIVE] = this._setActive;
 *             ...
 *         }
 *         _setActive() {
 *             ...
 *         }
 *     }
 *
 * @author flatline
 */
const Helper = __webpack_require__(2);
const TYPES  = __webpack_require__(6).TYPES;
const MASKS  = __webpack_require__(6).MASKS;

class Api {
    constructor(parent) {
        /**
         * {Object} Mapping of API functions to associated id's. This map
         * is a map, which is used when client/server/server sends message
         * to server/client.
         */
        this.api          = {};
        this.parent       = parent;
        this._onMessageCb = this._onMessage.bind(this);

        Helper.override(parent, 'onMessage', this._onMessageCb);
    }

    destroy() {
        Helper.unoverride(this.parent, 'onMessage', this._onMessageCb);
        this._onMessageCb = null;
        this.parent       = null;
        this.api          = null;
    }

    /**
     * Is called on every message obtained from any client/server.
     * Calls API method to handle the message. data[0] is always request
     * type. data[1] - requestId. data[2], data[3],... are request related
     * parameters. Handlers are called only for requests and skipped for
     * answers.
     * @param {WebSocket} sock Communication socket
     * @param {Event} event Event with parameters obtained from the client
     * @private
     */
    _onMessage(sock, event) {
        const data  = JSON.parse(event.data || event);
        const reqId = data[1];
        const type  = data[0];

        if (((reqId & MASKS.REQ_MASK) >>> 0) > 0) {
            if (this.api[type]) {
                this.api[type](...[reqId].concat(data.slice(2)));
            } else {
                this.parent.response(sock, TYPES.RES_INVALID_TYPE, reqId, `Invalid request type ${type}`);
            }
        }
    }
}

module.exports = Api;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Plugin for Client/Server classes. Implements request/response logic.
 * Manager requests and associated to them responses by unique request
 * id (reqId). Calls callback on answer (response).
 *
 * @author flatline
 */
const Helper   = __webpack_require__(2);
const MASKS    = __webpack_require__(6).MASKS;

class Request {
    /**
     * Creates Request instance and overrides two required methods:
     * send() and onMessage()
     * @param {Object} parent Instance of custom class
     */
    constructor(parent) {
        this.parent        = parent;
        /**
         * {Object} Contains requests map: key - request id, val -
         * response callback
         * TODO: we have to check if connection has closed with socket
         * TODO: and we have to remove "broken" requests ids from _requests
         */
        this._requests     = {};
        this._onRequestCb  = this._onRequest.bind(this);
        this._onResponseCb = this._onResponse.bind(this);
        this._onMessageCb  = this._onMessage.bind(this);

        Helper.override(parent, 'request', this._onRequestCb);
        Helper.override(parent, 'response', this._onResponseCb);
        Helper.override(parent, 'onMessage', this._onMessageCb);
    }

    destroy() {
        const parent = this.parent;
        Helper.unoverride(parent, 'onMessage', this._onMessageCb);
        Helper.unoverride(parent, 'response', this._onResponseCb);
        Helper.unoverride(parent, 'request', this._onRequestCb);
        this._onMessageCb  = null;
        this._onResponseCb = null;
        this._onRequestCb  = null;
        this._requests     = null;
        this.parent        = null;
    }

    /**
     * IMPORTANT: It's impossible to have more then one overrides of 'request'
     * IMPORTANT: method, because return value of second overridden method
     * IMPORTANT: will overlap first one.
     *
     * Sends data to the client or server. First two parameters are required.
     * They are: 'socket' for sending params and 'type' for sending special
     * request type (see Requests.TYPES constants for details). All other
     * parameters depend of special request and will be send to the client
     * as an array. Last parameter is optional callback, which is called after
     * send is complete. If last parameter present, then we should wait for
     * response. Otherwise it should be request only. Final parameters for
     * sending will be: [type, reqId, ...params]
     * 'params' will be without callback parameter at the end.
     * @param {WebSocket} sock Socket where to send params
     * @param {Number} type Type of the request
     * @param {*} params Array of parameters to send
     * @return {Number|null} Unique request id or null if no response needed
     * @override
     * TODO: add timer for tracking request timeout
     */
    _onRequest(sock, type, ...params) {
        const cb    = Helper.isFunc(params[params.length - 1]) ? params.pop() : null;
        const reqId = Helper.getId();

        cb && (this._requests[reqId] = cb);
        sock.send(JSON.stringify([type, (reqId | MASKS.REQ_MASK) >>> 0].concat(params)));

        return reqId;
    }

    /**
     * Is called on every response (response). Required unique request id
     * (reqId) should be used as a parameter. Format of response data is:
     * [type, reqId, ...params].
     * @param {WebSocket} sock Socket where to send response
     * @param {Number} type Type of the request
     * @param {Number} reqId Unique request id, returned by send() method
     * @param {*} params Array of parameters to send
     * @override
     */
    _onResponse(sock, type, reqId, ...params) {
        sock.send(JSON.stringify([type, (reqId & MASKS.RES_MASK) >>> 0].concat(params)));
    }

    /**
     * Is called on every input message is received. It may be a request
     * from remote host or an response (response). In case of request we do
     * nothing. In case of response (response) we have to call callback
     * function, bind in send() method. event.data contains:
     * [type, reqId|null, ...params].
     * @param {WebSocket} sock Owner socket
     * @param {Event} event Event object with received data
     * @private
     */
    _onMessage(sock, event) {
        const data  = JSON.parse(event.data || event);
        const reqId = (data[1] & MASKS.RES_MASK) >>> 0;
        const cb    = this._requests[reqId];
        //
        // data[0] is type
        // data.slice(2) are params
        //
        cb && cb(data[0], data.slice(2));
        delete this._requests[reqId];
    }
}

module.exports = Request;

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map