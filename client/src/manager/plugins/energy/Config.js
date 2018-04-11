/**
 * Configuration of Energy plugin
 *
 * @author flatline
 */
const Config = {
    /**
     * {Number} An amount of iteration, after which we have to check world energy
     * percent. May be 0 if you want to disable energy generation
     */
    checkPeriod: 5000,
    /**
     * {Number} size of one clever energy block in dots
     */
    blockSize: 10,
    /**
     * {Number} Index of energy color. Starts from 0. Ends with 4000. See Organism.MAX_COLORS
     * constant for details
     */
    colorIndex: 9174,
    /**
     * {Number} Percent from all energy in a world until clever energy will be added.
     * After this value clever energy will be stopped to add until it's amount will
     * be less then minPercent. These two configs create cyclical
     * energy adding to the world.
     */
    maxPercent: .3,
    /**
     * {Number} Opposite to maxPercent. Sets minimum percent from
     * all energy in a world after which clever energy will turn on (be added to the
     * world again).
     */
    minPercent: .28
};

module.exports = Config;