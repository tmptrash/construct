/**
 * This is an entry point of jevo.js application. Compiled version of
 * this file should be included into index.html.
 *
 * Every plugin/module consists of many files and maybe folders inside. We
 * have to create folder every time we have more then one plugin file. For
 * example if we have "Plugin.js" and it's "Config.js". In more complicated
 * case, when plugin consists of many file hre is a complex structure:
 *
 *   [plugin]          // plugin folder with name 'plugin'
 *     [base]          // base classes for 'child' folder
 *       File.js       // base class for 'child'
 *     [child]         // concrete implementation of 'plugin' with name 'child'
 *       File.js       // implementation of 'child'
 *
 * There are these rules in example above:
 *   - One plugin should contain all stuff inside it's folder.
 *   - [base] folder contains base classes for all folder of the same level
 *     (in this example it's [child]). It's possible to have many folders
 *     like [child] on the same level. In this case [base] folders should
 *     contain many base classes.
 *   - [base] folder may be located on all levels as well. See:
 *   - [child] folder may contain [base] folder inside in case when it has
 *     children classes. In this example it's 'child1':
 *     [plugin]        // plugin folder with name 'plugin'
 *       [base]        // base classes for 'child' folder
 *         File.js     // base class for 'child'
 *       [child]       // concrete implementation of 'plugin' with name 'child'
 *         [base]      // folder of base classes for 'child1'
 *           File.js   // base class for 'child1'
 *         [child1]    // concrete implementation of 'child'
 *           File.js   // implementation of 'child1'
 *         File.js     // implementation of 'child'
 *   - [child1] folder has the same structure like [child]
 *   - Files inside folder with the same name like file means 'aggregated':
 *     [plugin]        // plugin folder
 *       [file]        // class File.js aggregated File1.js
 *         File1.js    // Aggregated file of File.js
 *       File.js       // Implementation of 'plugin'
 *
 * Usage:
 *   <script src="./app.js"></script>
 *
 * @author flatline
 */
const Manager         = require('./manager/Manager');
const Config          = require('./global/Config').Config;
const Client          = require('./../../client/src/manager/plugins/Client').Client;
const OrganismsGarmin = require('./manager/plugins/organisms/garmin/Organisms');
const OrganismsDos    = require('./manager/plugins/organisms/dos/Organisms');
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
