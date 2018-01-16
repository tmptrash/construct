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
        ips       : {pos: 'topleft',  active: false, transparent: 0.6},
        lps       : {pos: 'downleft', active: false, transparent: 0.6},
        killout   : {pos: 'topright', active: false, transparent: 0.6},
        orgs      : {pos: '0-0|16',   active: true,  transparent: 0.6},
        energy    : {pos: '0-1|16',   active: true,  transparent: 0.6},
        penergy   : {pos: '0-2|16',   active: true,  transparent: 0.6},
        eenergy   : {pos: '0-3|16',   active: true,  transparent: 0.6},
        fit       : {pos: '1-0|16',   active: true,  transparent: 0.6},
        age       : {pos: '1-1|16',   active: true,  transparent: 0.6},
        code      : {pos: '1-2|16',   active: true,  transparent: 0.6},
        kill      : {pos: '1-3|16',   active: true,  transparent: 0.6},
        killenergy: {pos: '2-0|16',   active: true,  transparent: 0.6},
        killage   : {pos: '2-1|16',   active: true,  transparent: 0.6},
        killeat   : {pos: '2-2|16',   active: true,  transparent: 0.6},
        killover  : {pos: '2-3|16',   active: true,  transparent: 0.6},
        changes   : {pos: '3-0|16',   active: true,  transparent: 0.6},
        killin    : {pos: '3-1|16',   active: true,  transparent: 0.6},
        killtour  : {pos: '3-2|16',   active: true,  transparent: 0.6},
        killclone : {pos: '3-3|16',   active: true,  transparent: 0.6}
    }
};

module.exports = Config;