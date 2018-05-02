/**
 * Configuration of Stones plugin
 *
 * @author flatline
 */
const Helper       = require('./../../../../../common/src/Helper');

const STONES_COLOR = 1800;
const Config       = {
    /**
     * {Number} size of one stone block in dots
     */
    blockSize: 300,
    /**
     * {Number} Index of stone color. Starts from 0. Ends with Organism.MAX_COLORS
     */
    colorIndex: STONES_COLOR,
    /**
     * {Number} Maximum amount of stone dots
     */
    maxValue: 500000 * Helper.getColor(STONES_COLOR),
    /**
     * {Array|null} In case of array you may set sequence of four values: x,y,w,h.
     * They means x,y coordinates, width, height of places with high stones concentration.
     * Example: assume, that resolution 1920, 1080. [1920 / 2, 1080 / 2, 1920, 1080]. In this
     * example all the screen will be filled by stones. As many values by four, you set as
     * many places with stones will be created. In case of null, grouping will be disabled.
     */
    groups: [1920 * 2, 1080 * 2, 1920 * 2, 1080 * 4]
};

module.exports = Config;