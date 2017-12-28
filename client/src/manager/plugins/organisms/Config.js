/**
 * Configuration of Organisms plugin
 *
 * @author flatline
 */
const Config = {
    /**
     * {Number} Maximum value of mutation period in iterations. It's used
     * in mutations of org.mutationPeriod parameter
     */
    ORG_MAX_MUTATION_PERIOD: 10000,
    /**
     * {Number} Index of first color of organism. After maximum color this
     * color will be applied
     */
    ORG_FIRST_COLOR: 1,
    /**
     * {Number} Maximum color index of organism
     */
    ORG_MAX_COLOR: Number.MAX_SAFE_INTEGER,
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
     *     add          - Probability of adding new line to the code
     *     change       - Probability of changing existing line of code
     *     delete       - Probability of deleting a line of code
     *     small-change - Probability of "small change" - change part of one code line
     *     clone        - Probability for sharing of energy percent on clone
     *     copy         - Probability of copying of code lines inside it's own code
     *     period       - Probability of period of organism mutations
     *     amount       - Probability of amount of mutations per period
     *     probs        - Probability of change one of probability coefficient in this array
     *     clonePeriod  - Probability of change clone energy percent value
     * ]
     */
    orgMutationProbs: [10,1,1,100,1,1,1,1,1,1],
    /**
     * {Number} Max value, which we may use in orgMutationProbs array. We may use
     * range: [0...orgMutationProbsMaxValue] including these values
     */
    orgMutationProbsMaxValue: 100,
    /**
     * {Number} Percent of mutations from vm size, which will be applied to
     * organism after cloning. Should be <= 1.0 (1.0 === 100%)
     */
    orgCloneMutationPercent: 0.000,
    /**
     * {Number} Amount of iterations between cloning. Set it to 0 to turn it off
     */
    orgClonePeriod: 10,
    /**
     * {Number} Amount of iterations, after which crossover will be applied
     * to random organisms. May be set to 0 to turn crossover off
     */
    orgCrossoverPeriod: 1000,
    /**
     * {Number} Amount of iterations within organism's life loop, after that we
     * do mutations according to orgRainMutationPercent config. If 0, then
     * mutations will be disabled. Should be less then ORGANISM_MAX_MUTATION_PERIOD
     */
    orgRainMutationPeriod: 1000,
    /**
     * {Number} Percent of mutations from code size. 0 is a possible value if
     * we want to disable mutations. Should be less then 1.0 (1.0 === 100%)
     */
    orgRainMutationPercent: 0.01,
    /**
     * {Number} Amount of organisms we have to create on program start
     */
    orgStartAmount: 100,
    /**
     * {Number} Amount of energy for first organisms. They are like Adam and
     * Eve. It means that these empty (without vm) organism were created
     * by operator and not by evolution.
     */
    orgStartEnergy: 1000000,
    /**
     * {Number} Begin color of "empty" organism (organism without code). Color
     * should be set in HEX-RGB mode. Example: 0xRRGGBB
     */
    orgStartColor: 0xFF0000,
    /**
     * {Number} Amount of iterations within organism's life loop, after that we decrease
     * some amount of energy. If 0, then energy decreasing will be disabled.
     */
    orgEnergySpendPeriod: 50,
    /**
     * {Number} Amount of iterations when organism is alive. It will die after
     * this period. If 0, then will not be used and organism may leave forever
     */
    orgAlivePeriod: 0,
    /**
     * {Number} This value means the period between organism codeSizes, which
     * affects energy grabbing by the system. For example: we have two
     * organisms: org1.energy = 10, org2.energy = 10, org1.codeSize = 6,
     * org2.codeSize = 9, OConfig.orgGarbagePeriod = 5. It means that
     * during energy grabbing by the system org1 and org2 will spend the
     * same amount of energy - 1 unit. This is because the period goes
     * from 1..5, 6..10,... and both organisms are in the same period. In
     * simple words, if your size is between 0-20, then 1 unit of energy will
     * be grabbed from you. If your size is between 21-40, then 2 units of
     * energy will be grabbed from you and so on...
     */
    orgGarbagePeriod: 20,
    /**
     * {Number} Size of organism stack (internal memory)
     */
    orgMemSize: 1024,
    /**
     * {Number} Percent of energy, which will be given to the child
     */
    orgCloneEnergyPercent: 0.5,
    /**
     * {Number} Percent of energy, which will be minused from organism after
     * stepping from one instance to another.
     */
    orgStepEnergySpendPercent: 0.0,
    /**
     * {Number} Maximum amount of organisms in a world. If some organism will
     * try to clone itself, when entire amount of organisms are equal
     * this value, the cloning will not happen.
     */
    orgMaxOrgs: 200,
    /**
     * {Number} If organism reach this limit of amount of vm lines, then codeSizeCoef
     * will be used during it's energy grabbing by system. We use this approach,
     * because our CPU's are slow and organisms with big codes are very slow. But
     * it's possible for organisms to go outside the limit by inventing new
     * effective mechanisms of energy obtaining.
     */
    codeMaxSize: 150,
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
     * {Number} This value is amount of code lines, which will be run for one
     * organism without interruption by one VM. Set this value to value bigger
     * then codeMaxSize, then entire code of organism will be run
     */
    codeYieldPeriod: 5,
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
    codeIterationsPerOnce: 1000,
};

module.exports = Config;