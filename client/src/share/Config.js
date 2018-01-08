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
     * {Array} Array of paths to Manager's plugins. Root folder for plugins
     * should be './client/src/manager/plugins/'.
     */
    plugIncluded: [
        'organisms/dos/Organisms',
        'organisms/dos/Code2String',
        'Config',
        'client/Client',
        'Energy',
        'status/Status',
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
    worldWidth: 384,
    /**
     * {Number} World height
     */
    worldHeight: 216,
    /**
     * {Number} Turns on cyclic world mode. It means that organisms may go outside
     * it's border, but still be inside. For example, if the world has 10x10
     * size and the organism has 9x5 position in it, one step right will move
     * this organism at the position 0x5. The same scenario regarding Y
     * coordinate (height). It actual only for one instance mode (no distributed
     * calculations).
     */
    worldCyclical: false,
    /**
     * {Number} Amount of energy blocks in a world. Blocks will be placed in a
     * random way...
     */
    worldEnergyDots: 10000,
    /**
     * {Number} Amount of energy in every block. See worldEnergyDots
     * config for details.
     */
    worldEnergyInDot: 0x00FF00,
    /**
     * {Number} Minimum percent of energy in current world. Under percent i mean
     * percent from entire world area (100%). If the energy will be less
     * or equal then this percent, then new random energy should be added.
     * Should be less then 100.0 and more and equal to 0.0. 0.17 is a
     * normal percent for this system.
     */
    worldEnergyCheckPercent: 0.1,
    /**
     * {Number} An amount of iteration, after which we have to check world energy
     * amount. Works in pair with worldEnergyCheckPercent. May be 0 if
     * you want to disable it
     */
    worldEnergyCheckPeriod: 10000,
    /**
     * {Boolean} Turns on/off scroll bars in a 2D canvas
     */
    worldNoScrolls: true,
    /**
     * {Number} Mode for showing/suppressing of messages. Possible values:
     *   0 - all messages
     *   1 - only important messages
     *   2 - no messages
     */
    modeQuiet: QUIET_IMPORTANT,
    /**
     * {Boolean} Running mode. It's also possible to run construct only on
     * server side without browser. For this it should be set to true.
     */
    modeNodeJs: false,
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