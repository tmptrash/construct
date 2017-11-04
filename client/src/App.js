/**
 * This is an entry point of jevo.js application. Compiled version of
 * this file should be included into index.html
 *
 * Usage:
 *   <script src="./app.js"></script>
 *
 * @author flatline
 */
const Manager         = require('./manager/Manager');
const Config          = require('./global/Config').Config;
const Client          = require('./../../client/src/manager/plugins/Client').Client;
const OrganismsGarmin = require('./../src/manager/plugins/OrganismsGarmin');
const OrganismsDos    = require('./../src/manager/plugins/OrganismsDos');
const ConfigPlugin    = require('./../src/manager/plugins/Config');
const Mutator         = require('./../src/manager/plugins/Mutator');
const Energy          = require('./../src/manager/plugins/Energy');
const Status          = require('./../src/manager/plugins/Status');
const Ips             = require('./../src/manager/plugins/Ips');
/**
 * {Boolean} Specify fitness or nature simulation mode
 */
const FITNESS_MODE = Config.codeFitnessCls !== null;
/**
 * {Array} Plugins for Manager
 */
// TODO: this list should be obtained from Config
const PLUGINS = {
    Organisms: FITNESS_MODE ? OrganismsGarmin : OrganismsDos,
    Config: ConfigPlugin,
    Client: {cls: Client, cfg: {run: true}},
    Mutator,
    Energy,
    Status,
    Ips
};
const manager = new Manager(PLUGINS);
//
// manager.run() method will be called after attempt of connection
// to the jevo.js server
//
window.man = manager;
