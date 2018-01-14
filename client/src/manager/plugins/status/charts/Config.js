/**
 * Configuration of Status plugin
 *
 * @author flatline
 */
const Config = {
    /**
     * {Boolean} Turns on/off plugin data collection
     */
    active: true,
    /**
     * {Number} Delay in milliseconds between showing one status line
     */
    period: 2000,
    /**
     * {Object} Available chart types
     */
    charts: {
        ips   : {pos: 'topleft',  active: false, transparent: 0.5},
        energy: {pos: 'downleft', active: false, transparent: 0.5}
    }
};

module.exports = Config;