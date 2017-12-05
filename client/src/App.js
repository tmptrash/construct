/**
 * This is an entry point of construct application. Compiled version of
 * this file should be included into index.html.
 *
 * File structure:
 * Every file or folder in 'src' folder is a module. Files inside module
 * are the part of this module and not separate modules. Folders inside
 * module folder are another modules with the same structure. Module should
 * contain only it's files. Aggregated files shouldn't be a part of the
 * module. For example classes World and Canvas may be moved to separate
 * module - 'visual' or 'view'. For example:
 *
 *   src               // root folder
 *     manager         // 'manager' module
 *       plugins       // special folder for plugins (other modules)
 *         organisms   // plugin/module 'organisms'
 *           ...
 *         Ips.js      // simple module - 'Ips'
 *       Manager.js    // part of 'manager' module
 *
 * Usage:
 *   <script src="./app.js"></script>
 *
 * @author flatline
 */
const Manager = require('./manager/Manager');
(window.man = new Manager()).run();