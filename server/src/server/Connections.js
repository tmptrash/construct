/**
 * Tracks connected clients at the moment
 *
 * @author flatline
 */
class Connections {
    /**
     * Converts region to unique id
     * @param {Array} region Array of X and Y coordinates
     * @returns {Boolean|String}
     */
    static toId(region) {
        return region !== null && region.join('-');
    }

    /**
     * Converts client's id into client's region
     * @param {String} id Unique id of the client
     * @returns {Array}
     */
    static toRegion(id) {
        return id.split('-');
    }

    constructor(amount) {
        /**
         * {Number} amount Maximum amount of connections for current server. Should
         * be quadratic (x^2) e.g.: 4, 9, 16,... This value will be extended
         * with additional "around" rows and columns for connecting with sibling
         * servers. So, result amount will be e.g.: 100 + 2 rows + 2 columns.
         */
        this._amount = amount;
        this._side   = Math.sqrt(amount) + 2;
        /**
         * {Number} Size of one side of MAX_CONNECTIONS qub. Contains additional
         * "around" rows and columns. For qub == 16, it's 4.
         */
        this.conns   = new Array(this._side);

        for (let col = 0, conns = this.conns; col < this._side; col++) {
            conns[col] = (new Array(this._side)).fill(null);
            conns[col].forEach((v, i, a) => a[i] = {sock: null});
        }
    }

    destroy() {
        this.conns = null;
    }

    /**
     * Returns connection object by region
     * @param {Array} region Region to get
     * @returns {Object|null}
     */
    getConnection(region) {
        return this.conns[region[0]][region[1]];
    }

    /**
     * Sets value by field into region. e.g.: if region == [1,1] and
     * field == 'test' and value == 123, then region related object
     * will be extend with an object: {test: 123}
     * @param {Array} region Region we are set to
     * @param {String} field Name of the field in region structure
     * @param {*} val Value
     */
    setData(region, field, val) {
        this.conns[region[0]][region[1]][field] = val;
    }

    clearData(region) {
        this.conns[region[0]][region[1]] = {sock: null};
    }

    getFreeRegion() {
        const conns = this.conns;
        const side  = this._side - 1;

        for (let col = 1; col < side; col++) {
            for (let row = 1; row < side; row++) {
                if (conns[col][row].sock === null) {
                    return [col, row];
                }
            }
        }

        return null;
    }
}


module.exports = Connections;