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
    maxPercent: .05
};

module.exports = Config;