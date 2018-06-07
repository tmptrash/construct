/**
 * Manager's configuration file. Other managers(clients) may have different
 * configuration values. It shouldn't contain server relates configuration.
 *
 * @author flatline
 */
const Config = require('./../../../common/src/Config');

const QUIET_ALL               = 0;
const QUIET_IMPORTANT         = 1;
const QUIET_NO                = 2;

const ENERGY_COLOR            = 10000;
const IS_NODE_JS              = typeof window === 'undefined';

class ClientConfig extends Config {}

ClientConfig.init({
   /**
    * Constants of quite mode. This mode affects on amount and
    * types of console messages. For example in QUIET_IMPORTANT
    * mode info messages will be hidden.
    */
    QUIET_ALL,
    QUIET_IMPORTANT,
    QUIET_NO,
    /**
     * {Boolean} Running mode. It's also possible to run construct only on
     * server side without browser. For this it should be set to true.
     */
    MODE_NODE_JS: IS_NODE_JS,
    /**
     * {Array} Array of paths to Manager's plugins. Root folder for plugins
     * should be './client/src/manager/plugins/'.
     */
    plugIncluded: [
        'organisms/dos/Organisms',
        'organisms/dos/Code2JS',
        'Config',
        'client/Client',
        'energy/Energy',
        'stones/Stones',
        'objects/Objects',
        'status/console/Console',
        IS_NODE_JS ? '' : 'status/charts/Charts',
        'ips/Ips',
        'backup/Backup'
    ],
    /**
     * {Array} Array of excluded plugins. Affects plugIncluded list
     * TODO:
     */
    plugExcluded: [],
    /**
     * {Number} World width
     */
    worldWidth: 1920 * 4,
    /**
     * {Number} World height
     */
    worldHeight: 1080 * 4,
    /**
     * {Number} Color index of one energy dot
     */
    worldEnergyColor: ENERGY_COLOR,
    /**
     * {Number} Amount of all energy in a world including organisms and all kinds
     * of energy. Total energy should not be greater then this value.
     */
    worldEnergy: 0x6d3b4 * 10000 * 10, // Helper.getColor(ENERGY_COLOR) === 0x6d3b4
    /**
     * {Number} Turns on cyclic world mode. It means that organisms may go outside
     * it's border, but still be inside. For example, if the world has 10x10
     * size and the organism has 9x5 position in it, one step right will move
     * this organism at the position 0x5. The same scenario regarding Y
     * coordinate (height). It actual only for one instance mode (no distributed
     * calculations).
     */
    worldCyclical: true,
    /**
     * {Number} Speed coefficient. Between 0..1. 1 - max speed, 0 - min.
     */
    worldSpeed: 1,
    /**
     * {Number} Zoom speed 0..1
     */
    worldZoomSpeed: 0.1,
    /**
     * {Number} Mode for showing/suppressing of messages. Possible values:
     *   0 - all messages
     *   1 - only important messages
     *   2 - no messages
     */
    modeQuiet: QUIET_IMPORTANT,
    /**
     * {Number} Port number for connecting with server
     */
    serverPort: 8301,
    /**
     * {String} Host for connecting with server
     */
    serverHost: 'ws://127.0.0.1'//'ws://192.168.31.176'
});

module.exports = {Config: ClientConfig.cfg(), api: ClientConfig};