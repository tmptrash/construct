/**
 * Server side application entry point. In fact, runs server and starts
 * listen for incoming connections from clients\Managers.
 *
 * @author flatline
 */
const Server  = require('./server/Server').Server;
const Api     = require('./server/plugins/Api');
const Request = require('./../../common/src/net/plugins/Request');

const PLUGINS = {
    Request,
    Api
};

// TODO: port should be obtained from command line parameter
// TODO: max connections should be obtained from cmd line parameter
// TODO: Or, maybe these parameter will be obtained from Admin server
const server = new Server(8099, PLUGINS);
server.run();