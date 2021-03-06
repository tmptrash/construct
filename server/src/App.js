/**
 * Server side application entry point. In fact, runs server and starts
 * listen for incoming connections from clients\Managers.
 *
 * @author flatline
 */
const Server = require('./server/Server').Server;
const Config = require('./share/Config').Config;
const server = new Server(Config.port);
server.run();