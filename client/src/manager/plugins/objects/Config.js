/**
 * Configuration of Objects plugin
 *
 * @author flatline
 */
const GConfig = require('./../../../share/Config').Config;

const Config  = {
    /**
     * {Number} An amount of iteration, after which we have to check world energy
     * objects percent. May be 0 if you want to disable energy objects generation
     */
    checkPeriod: 4000,
    /**
     * {Number} size of one energy objects block in dots
     */
    blockSize: 4,
    /**
     * {Number} Maximum amount of object dots
     */
    maxValue: .8 * GConfig.worldEnergy,
    /**
     * {Number} Opposite to maxValue. Minimum amount of object dots
     */
    minValue: .7 * GConfig.worldEnergy,
    /**
     * {Array|null} In case of array you may set sequence of four values: x,y,w,h.
     * They means x,y coordinates, width, height of places with high objects concentration.
     * Example: assume, that resolution 1920, 1080. [1920 / 2, 1080 / 2, 1920, 1080]. In this
     * example all the screen will be filled by objects. As many values by four, you set as
     * many places with objects will be created. In case of null, grouping will be disabled.
     */
    groups: [1920 * 2, 1080 * 2, 50, 50]
};

module.exports = Config;