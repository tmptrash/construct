/**
 * Server related configuration module. Client's configuration should
 * be stored in separate config class.
 *
 * @author flatline
 */
const Config = require('./../../../common/src/Config');

class ServerConfig extends Config {}
//
// TODO: parameters, which should be obtained from Admin server
// TODO: should be also removed from here
//
ServerConfig.init({
    /**
     * {Array} Array of server plugin paths. Pay attention, that path
     * should be started from 'src' and not from 'client' or 'common'
     * folders.
     */
    plugIncluded: [
        'src/plugins/Request',
        'src/server/plugins/Api'
    ],
    /**
     * TODO:
     */
    plugExcluded: [],
    /**
     * {Number} Maximum amount of connections for current server. Should
     * be quadratic (x^2) e.g.: 4, 9, 16,... This value will be extended
     * with additional "around" rows and columns for connecting with sibling
     * servers. So, result amount of cells will be e.g.: 16 + 2 rows + 2 cols.
     */
    maxConnections: 100,
    /**
     * {Number} Port number for connecting with server
     */
    port: 8099,
    /**
     * TODO: this config should be obtained from Admin server or from command line
     * TODO: parameters in future cmd line parser
     */
    upHost: 'ws://localhost',
    /**
     * TODO: this config should be obtained from Admin server or from command line
     * TODO: parameters in future cmd line parser
     */
    upPort: 8099
});

module.exports = {Config: ServerConfig.cfg(), api: ServerConfig};