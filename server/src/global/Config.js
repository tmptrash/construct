/**
 * Server related configuration module. Client's configuration should
 * be stored in separate config class.
 *
 * @author flatline
 */
const Config = require('./../../../common/src/global/Config');

class ServerConfig extends Config {}
//
// TODO: remove command line related parameters from here
// TODO: parameters, which should be obtained from Admin server
// TODO: should be also removed from here
//
ServerConfig.init({
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
     * {String} Host for connecting with server
     */
    host: 'ws://localhost'
});

module.exports = {Config: ServerConfig.cfg(), api: ServerConfig};