/**
 * Configuration of Organisms plugin
 *
 * @author flatline
 */
const Config = {
    /**
     * {Number} Max value, which we may use in orgMutationProbs array. We may use
     * range: [0...ORG_MUTATION_PROBS_MAX_VAL] including these values
     */
    ORG_MUTATION_PROBS_MAX_VAL: 100,
    /**
     * {Array} Probabilities which used, when mutator decides what to do:
     * add, change, delete code line inside the vm; change amount of
     * mutations or change mutations period... Depending on these
     * values, organism may have different strategies of living.
     * For example: if add value is bigger then del and change,
     * then vm size will be grow up all the time. If del value is
     * bigger then other, then it will be decreased to zero lines
     * of vm and organism will die.
     * Format: [
     *     change        - Probability of changing existing line of code
     *     delete        - Probability of deleting a line of code
     *     small-change  - Probability of "small change" - change part of one code line
     *     clone         - Probability for sharing of energy percent on clone
     *     period        - Probability of period of organism mutations
     *     amount        - Probability of amount of mutations per period
     *     probs         - Probability of change one of probability coefficient in this array
     *     clone-percent - Probability of change clone energy percent value
     *     add           - Probability of adding new line to the code
     *     copy          - Probability of copying of code lines inside it's own code
     * ]
     */
    orgMutationProbs: [10,1,90,1,1,1,1,1,10,5],
    /**
     * {Boolean} If turned on, then organism will be responsible for changing
     * mutations probabilities. Otherwise these probabilities will be constant
     */
    orgMutationPerOrg: false,
    /**
     * {Number} Percent of energy, which will be given to the child. Set to 0.0
     * to share the same amount of energy with child (energy duplication)
     */
    orgCloneEnergyPercent: 0.5,
    /**
     * {Number} Percent of mutations from vm size, which will be applied to
     * organism after cloning. Should be <= 1.0 (1.0 === 100%)
     */
    orgCloneMutationPercent: 0.0,
    /**
     * {Boolean} Turn this flag on to give organism a possibility to choose his
     * own clone energy and mutations percents. false - mean, that these values
     * will be constant for all organisms
     */
    orgClonePerOrg: false,
    /**
     * {Number} Amount of iterations between cloning. Set it to 0 to turn it off
     */
    orgClonePeriod: 10,
    /**
     * {Number} Amount of iterations between tournament. During tournament one
     * organism (looser) will be killed
     */
    orgTournamentPeriod: 400,
    /**
     * {Number} Amount of iterations within organism's life loop, after that we
     * do mutations according to orgRainMutationPercent config. If 0, then
     * mutations will be disabled. Should be less then ORGANISM_MAX_MUTATION_PERIOD
     */
    orgRainMutationPeriod: 17000,
    /**
     * {Number} Percent of mutations from code size. 0 is a possible value if
     * we want to disable mutations. Should be less then 1.0 (1.0 === 100%)
     */
    orgRainMutationPercent: 0.01,
    /**
     * {Boolean} Turn this flag on to give organism a possibility to choose his
     * own mutations period and percent. false - mean, that these values will be
     * constant for all organisms
     */
    orgRainPerOrg: false,
    /**
     * {Number} Amount of iterations, after which crossover will be applied
     * to random organisms. May be set to 0 to turn crossover off
     */
    orgCrossoverPeriod: 40000,
    /**
     * {Number} Period of iterations for creation of random organisms. Set it to 0
     * to turn off this feature
     */
    orgRandomOrgPeriod: 40000,
    /**
     * {Number} Amount of iterations within organism's life loop, after that we decrease
     * some amount of energy. If 0, then energy decreasing will be disabled.
     */
    orgEnergySpendPeriod: 10,
    /**
     * {Number} Amount of iterations when organism is alive. It will die after
     * this period. If 0, then will not be used and organism may leave forever
     */
    orgAlivePeriod: 18000,
    /**
     * {Number} Size of organism stack (internal memory) in bits. Real amount of
     * organism's internal memory will be 2^orgMemBits. Example: if orgMemBits=3,
     * then memory=2^3 === 8 numbers
     */
    orgMemBits: 8,
    /**
     * {Number} Percent of energy, which will be minused from organism after
     * stepping from one instance to another.
     */
    orgStepEnergySpendPercent: 0.1,
    /**
     * {Number} Percent from orgMaxOrgs config, which is used for crossing borders
     * between clients/Managers. Entire amount of organisms within one client =
     * orgMaxOrgs + orgMaxOrgs * orgStepOverflowPercent. Without this config organisms
     * try to rich the limit of organisms on one client and it's impossible to cross
     * the border (every organism will be returned back, but there will not be free
     * space at that time). In this situation crossing organism just die during crossing.
     */
    orgStepOverflowPercent: 0.1,
    /**
     * {Number} Maximum amount of organisms in a world. If some organism will
     * try to clone itself, when entire amount of organisms are equal
     * this value, the cloning will not happen.
     */
    orgMaxOrgs: 800,
    /**
     * {Number} Amount of organisms we have to create on program start
     */
    orgStartAmount: 800,
    /**
     * {Number} Amount of energy for first organisms. They are like Adam and
     * Eve. It means that these empty (without vm) organism were created
     * by operator and not by evolution.
     */
    orgStartEnergy: 500000,
    /**
     * {Number} Begin color of "empty". It's just an index of color. Starts from
     * 0 and till Number.MAX_VALUE
     */
    orgStartColor: 24,
    /**
     * {Number} The value from -X/2 to X/2, which is used for setting
     * default value, while organism is delivering. So, if the value is
     * 1000, then range will be: -500..500
     */
    codeVarInitRange: 500,
    /**
     * {Number} This value is amount of code lines, which will be run for one
     * organism without interruption by one VM. Set this value to value bigger
     * then codeMaxSize, then entire code of organism will be run
     */
    codeYieldPeriod: 4,
    /**
     * {Number} Amount of bits per one variable. It affects maximum value,
     * which this variable may contain. This value shouldn't be less then 2.
     */
    codeBitsPerVar: 4,
    /**
     * {Number} Amount of bits for storing operator. This is first XX bits
     * in a number.
     */
    codeBitsPerOperator: 8,
    /**
     * {Number} Amount of bits, which stores maximum block length. Under block
     * length we mean maximum amount of lines in one block like if, for,...
     */
    codeBitsPerBlock: 8,
    /**
     * {Number} Amount of iterations between calls to V8 event loop. See
     * Manager._initLoop(), Manager.run() methods for details.
     */
    codeIterationsPerOnce: 200,
    /**
     * {Number} If organism reach this limit of amount of vm lines, then codeSizeCoef
     * will be used during it's energy grabbing by system. We use this approach,
     * because our CPU's are slow and organisms with big codes are very slow. But
     * it's possible for organisms to go outside the limit by inventing new
     * effective mechanisms of energy obtaining.
     */
    codeMaxSize: 60
};

module.exports = Config;