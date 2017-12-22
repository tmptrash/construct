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
    maxConnections: 4,
    /**
     * {Number} Port number for connecting with server. This value will be
     * passed to the server during creation
     */
    port: 8301,
    /**
     * {Boolean} Means, that this server will be run in distributed mode. And
     * will be connected with near servers (up...left). false, means, that
     * server will be run in single server mode (no near servers).
     */
    modeDistributed: true,
    /**
     * {String} Host address of server above. Shouldn't contain port
     */
    upHost: 'ws://192.168.31.176',
    /**
     * {Number} Port number of server above.
     */
    upPort: 8201,
    /**
     * {String} Host address of server on the right. Shouldn't contain port
     */
    rightHost: 'ws://127.0.0.1',
    /**
     * {Number} Port number of server on the right
     */
    rightPort: 8101,
    /**
     * {String} Host address of server below. Shouldn't contain port
     */
    downHost: 'ws://127.0.0.1',
    /**
     * {Number} Port number of server below
     */
    downPort: 8100,
    /**
     * {String} Host address of server on the left. Shouldn't contain port
     */
    leftHost: 'ws://127.0.0.1',
    /**
     * {Number} Port number of server on the left
     */
    leftPort: 8103
});

module.exports = {Config: ServerConfig.cfg(), api: ServerConfig};