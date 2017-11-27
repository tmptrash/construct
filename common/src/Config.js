/**
 * Configuration class implementation. Stores custom configuration
 * inside and has an ability to change options of config in real time
 * using set() and get() methods. init() method should be called first.
 *
 * @author flatline
 */
class Config {
    static init(cfg) {
        this._cfg = cfg;
    }

    // TODO: add complex key support like: 'Organisms.orgMutationProbs'
    static set(key, val) {
        this._cfg[key] = val;
        return this;
    }

    static get(key) {
        return this._cfg[key];
    }

    static cfg() {
        return this._cfg;
    }
}

module.exports = Config;