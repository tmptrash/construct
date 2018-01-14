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
        ips    : {pos: 'topleft',   active: false, transparent: 0.6},
        lps    : {pos: 'downleft',  active: false, transparent: 0.6},
        orgs   : {pos: 'topright',  active: false, transparent: 0.6},
        energy : {pos: 'downright', active: true,  transparent: 0.6},
        iq     : {pos: 'topleft',   active: true,  transparent: 0.6},
        changes: {pos: 'downleft',  active: false, transparent: 0.6},
        fit    : {pos: 'topright',  active: true,  transparent: 0.6},
        age    : {pos: 'downright', active: false, transparent: 0.6},
        code   : {pos: 'downleft',  active: true,  transparent: 0.6}

    }
};

module.exports = Config;