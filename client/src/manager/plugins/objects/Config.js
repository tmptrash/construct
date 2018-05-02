/**
 * Configuration of Objects plugin
 *
 * @author flatline
 */
const Helper = require('./../../../../../common/src/Helper');

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
     * {Number} Maximum amount of object dots
     */
    maxValue: 100 * Helper.getColor(8500 + 2 * 500),
    /**
     * {Number} Opposite to maxValue. Minimum amount of object dots
     */
    minValue: 50 * Helper.getColor(8500 + 2 * 500)
};

module.exports = Config;