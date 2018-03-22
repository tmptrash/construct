/**
 * Plugin for adding getter and setter to Manager's API
 *
 * @author flatline
 */
const Api    = require('./../../share/Config').api;
const Helper = require('./../../../../common/src/Helper');

class Config {
    constructor(manager) {
        Helper.setApi(manager.api, 'setConfig', Api.set.bind(Api), 'Sets configuration value by name. Namespaces are also supported. Example: \'setConfig(\'organisms.orgMaxOrgs\', 500)\'. Opposite to getConfig()');
        Helper.setApi(manager.api, 'getConfig', Api.get.bind(Api), 'Returns specified config value. First parameter is a namespace (optional) and config name. For example, to get maximum amount of organisms in current instance/world type: man.api.getConfig(\'organisms.orgMaxOrgs\'). Example of organism related configs you may find here (https://github.com/tmptrash/construct/blob/master/client/src/manager/plugins/status/charts/Config.js). Other configuration parameters are located in files with name Config.js');
    }
}

module.exports = Config;