/**
 * Configuration of Backup plugin
 *
 * @author flatline
 */
const Config = {
    /**
     * {Number} Period of making automatic backup of application. In iterations
     */
    period: 1000,
    /**
     * {Number} Amount of backup files stored on HDD. Old files will be removed
     */
    amount: 10,
};

module.exports = Config;