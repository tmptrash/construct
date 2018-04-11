/**
 * Configuration of Objects plugin
 *
 * @author flatline
 */
const Config = {
    /**
     * {Number} An amount of iteration, after which we have to check world energy
     * objects percent. May be 0 if you want to disable energy objects generation
     */
    checkPeriod: 6000,
    /**
     * {Number} size of one energy objects block in dots
     */
    blockSize: 10,
    /**
     * {Number} Percent from all energy objects in a world until clever energy will
     * be added. After this value energy objects will be stopped to add until it's
     * amount will be less then minPercent. These two configs create cyclical
     * energy objects adding to the world.
     */
    maxPercent: .2,
    /**
     * {Number} Opposite to maxPercent. Sets minimum percent from all energy objects
     * in a world after which energy objects will turn on (be added to the world again).
     */
    minPercent: .15
};

module.exports = Config;