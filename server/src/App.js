/**
 * Server side application entry point. In fact, runs server and starts
 * listen for incoming connections from clients.
 *
 * @author flatline
 */
const Server = require('./server/Server').Server;

// TODO: port should be obtained from command line parameter
const server = new Server(8080);
server.run();