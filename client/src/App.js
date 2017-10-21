/**
 * This is an entry point of jevo.js application. Compiled version of
 * this file should be included into index.html
 *
 * Usage:
 *   <script src="./app.js"></script>
 *
 * @author flatline
 */
import Manager from './manager/Manager';
import {Config}          from './../../common/src/global/Config';
import Client            from './../../client/src/manager/plugins/Client';
import OrganismsGarmin   from './../src/manager/plugins/OrganismsGarmin';
import OrganismsDos      from './../src/manager/plugins/OrganismsDos';
import ConfigPlugin      from './../src/manager/plugins/Config';
import Mutator           from './../src/manager/plugins/Mutator';
import Energy            from './../src/manager/plugins/Energy';
import Status            from './../src/manager/plugins/Status';
/**
 * {Boolean} Specify fitness or nature simulation mode
 */
const FITNESS_MODE = Config.codeFitnessCls !== null;
/**
 * {Array} Plugins for Manager
 */
const PLUGINS = {
    Organisms: FITNESS_MODE ? OrganismsGarmin : OrganismsDos,
    Config   : ConfigPlugin,
    Mutator,
    Energy,
    Status,
    Client
};
const manager = new Manager(PLUGINS);
//
// manager.run() method will be called after attempt of connection
// to the jevo.js server
//
window.man = manager;
