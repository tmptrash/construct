/**
 * Manager's configuration file. Other managers(clients) may have different
 * configuration values. It shouldn't contain server relates configuration.
 *
 * @author flatline
 */
// TODO: this config should be refactored/moved to manager folder as it's part
const Config = require('./../../../common/src/Config');

const QUIET_ALL               = 0;
const QUIET_IMPORTANT         = 1;
const QUIET_NO                = 2;

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
        'organisms/dos/Code2String',
        'Config',
        'client/Client',
        'Energy',
        'Stones',
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
    worldWidth: 1920 / 4,
    /**
     * {Number} World height
     */
    worldHeight: 1080 / 4,
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
     * {Number} An amount of iteration, after which we have to check world energy
     * percent. May be 0 if you want to disable energy generation
     */
    worldEnergyCheckPeriod: 5000,
    /**
     * {Number} size of one clever energy block in dots
     */
    worldEnergyBlockSize: 20,
    /**
     * {Number} Index of energy color. Starts from 0. Ends with 4000. See Organism.MAX_COLORS
     * constant for details
     */
    worldEnergyColorIndex: 0,
    /**
     * {Number} Percent from all energy in a world until clever energy will be added.
     * After this value clever energy will be stopped to add until it's amount will
     * be less then worldEnergyMinPercent. These two configs create cyclical
     * energy adding to the world.
     */
    worldEnergyMaxPercent: .0009,
    /**
     * {Number} Opposite to worldEnergyMaxPercent. Sets minimum percent from
     * all energy in a world after which clever energy will turn on (be added to the
     * world again).
     */
    worldEnergyMinPercent: .0002,
    /**
     * {Number} Percent of stones in a world. Percent from world size:
     * stoneAmount = worldStonesPercent * worldWidth * worldHeight
     */
    worldStonesPercent: .1,
    /**
     * {Number} Color index for stones in a world. See Organism.MAX_COLORS
     * constant for details
     */
    worldStoneColorIndex: 1800,
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