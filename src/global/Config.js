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
    orgCloneMutationPercent: 0.01,
    /**
     * {Number} Amount of iterations before cloning process
     */
    orgClonePeriod: 5,
    /**
     * {Number} Amount of iterations, after which crossover will be applied
     * to random organisms.
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
    worldWidth: 1920,
    /**
     * {Number} World height
     */
    worldHeight: 1080,
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
    modeQuiet: QUIET_IMPORTANT,
    /**
     * {Number} Maximum amount of connections for current server. Should
     * be quadratic (x^2) e.g.: 4, 9, 16,... This value will be extended
     * with additional "around" rows and columns for connecting with sibling
     * servers. So, result amount of cells will be e.g.: 16 + 2 rows + 2 cols.
     */
    serMaxConnections: 100
};

const api = {
    set: (key, val) => Config[key] = val,
    get: (key)      => Config[key]
};

export {Config, api};

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
