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
    checkPeriod: 3000,
    /**
     * {Number} size of one clever energy block in dots
     */
    blockSize: 10,
    /**
     * {Number} Index of energy color. Starts from 0. Ends with 4000. See Organism.MAX_COLORS
     * constant for details
     */
    colorIndex: 10000,
    /**
     * {Number} Percent from all energy in a world until clever energy will be added.
     * After this value clever energy will be stopped to add until it's amount will
     * be less then minPercent. These two configs create cyclical
     * energy adding to the world. Energy <= orgsAmount * orgMaxEnergy. Formula:
     * (orgMaxOrgs * orgCloneMinEnergy) / (worldWidth * worldHeight * energyAmount)
     */
    maxPercent: .0007535,
    /**
     * {Number} Opposite to maxPercent. Sets minimum percent from
     * all energy in a world after which clever energy will turn on (be added to the
     * world again).
     */
    minPercent: .0004,
    /**
     * {Number} Amount of energy in one dot
     */
    energyAmount: 1000,
    /**
     * {Array|null} In case of array you may set sequence of four values: x,y,w,h.
     * They means x,y coordinates, width, height of places with high energy concentration.
     * Example: assume, that resolution 1920, 1080. [1920 / 2, 1080 / 2, 1920, 1080]. In this
     * example all the screen will be filled by energy. As many values by four, you set as
     * many places with energy will be created. In case of null, grouping will be disabled.
     */
    groups: [3000, 1080 * 2, 2000, 500, 1920 * 2.5, 1080 * 2, 2000, 500]
};

module.exports = Config;