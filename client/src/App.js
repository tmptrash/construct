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

const manager = new Manager();
//
// manager.run() method will be called after attempt of connection
// to the jevo.js server
//
window.man = manager;
