/**
 * Configuration of Energy plugin
 *
 * @author flatline
 */
const Helper       = require('./../../../../../common/src/Helper');

const ENERGY_COLOR = 10000;
const COLOR        = Helper.getColor;
const Config       = {
    /**
     * {Number} An amount of iteration, after which we have to check world energy
     * percent. May be 0 if you want to disable energy generation
     */
    checkPeriod: 3000,
    /**
     * {Number} size of one clever energy block in dots
     */
    blockSize: 2,
    /**
     * {Number} Index of energy color. Starts from 0. Ends with 4000. See Organism.MAX_COLORS
     * constant for details
     */
    colorIndex: ENERGY_COLOR,
    /**
     * {Number} Maximum amount of energy dots
     */
    maxValue: .8 * COLOR(ENERGY_COLOR) * 4000,
    /**
     * {Number} Opposite to maxValue. Minimum amount of energy dots
     */
    minValue: .6 * COLOR(ENERGY_COLOR) * 4000,
    /**
     * {Array|null} In case of array you may set sequence of four values: x,y,w,h.
     * They means x,y coordinates, width, height of places with high energy concentration.
     * Example: assume, that resolution 1920, 1080. [1920 / 2, 1080 / 2, 1920, 1080]. In this
     * example all the screen will be filled by energy. As many values by four, you set as
     * many places with energy will be created. In case of null, grouping will be disabled.
     */
    groups: [1920 * 2, 1080 * 2, 1000, 1000]
};

module.exports = Config;