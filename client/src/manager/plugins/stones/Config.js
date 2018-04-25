/**
 * Configuration of Stones plugin
 *
 * @author flatline
 */
const Config = {
    /**
     * {Number} size of one stone block in dots
     */
    blockSize: 300,
    /**
     * {Number} Index of stone color. Starts from 0. Ends with Organism.MAX_COLORS
     */
    colorIndex: 1800,
    /**
     * {Number} Percent from all dots in a world until stones will be added.
     */
    maxPercent: .03,
    /**
     * {Array|null} In case of array you may set sequence of four values: x,y,w,h.
     * They means x,y coordinates, width, height of places with high stones concentration.
     * Example: assume, that resolution 1920, 1080. [1920 / 2, 1080 / 2, 1920, 1080]. In this
     * example all the screen will be filled by stones. As many values by four, you set as
     * many places with stones will be created. In case of null, grouping will be disabled.
     */
    groups: [2880, 1080, 1920, 1080 * 2]
};

module.exports = Config;