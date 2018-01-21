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
     * {Number} Maximum amount of chart rows, after which we will cut
     * it on 10%
     */
    dataMaxSize: 100000,
    /**
     * {Object} Available chart types
     */
    charts: {
        lps       : {pos: 'downleft',  active: false, transparent: 0.8},
        killout   : {pos: 'topright',  active: false, transparent: 0.8},
        energy    : {pos: 'topdown',   active: false, transparent: 0.8},
        orgs      : {pos: '0-0|16',    active: true,  transparent: 0.8},
        penergy   : {pos: '0-1|16',    active: true,  transparent: 0.8},
        eenergy   : {pos: '0-2|16',    active: true,  transparent: 0.8},
        fit       : {pos: '0-3|16',    active: true,  transparent: 0.8},
        age       : {pos: '1-0|16',    active: true,  transparent: 0.8},
        code      : {pos: '1-1|16',    active: true,  transparent: 0.8},
        kill      : {pos: '1-2|16',    active: true,  transparent: 0.8},
        killtour  : {pos: '1-3|16',    active: true,  transparent: 0.8},
        killenergy: {pos: '2-0|16',    active: true,  transparent: 0.8},
        killage   : {pos: '2-1|16',    active: true,  transparent: 0.8},
        killeat   : {pos: '2-2|16',    active: true,  transparent: 0.8},
        killover  : {pos: '2-3|16',    active: true,  transparent: 0.8},
        changes   : {pos: '3-0|16',    active: true,  transparent: 0.8},
        killin    : {pos: '3-1|16',    active: true,  transparent: 0.8},
        killclone : {pos: '3-2|16',    active: true,  transparent: 0.8},
        ips       : {pos: '3-3|16',    active: true,  transparent: 0.8}
    }
};

module.exports = Config;