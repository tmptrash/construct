/**
 * Tracks connected clients at the moment
 *
 * @author DeadbraiN
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
        this._conns  = new Array(this._side);

        for (let col = 0; col < this._side; col++) {
            this._conns[col] = (new Array(this._side)).fill(null);
        }
    }

    setSocket(sock, region) {
        this._conns[region[0]][region[1]] = sock;
    }

    getFreeRegion() {
        const conns = this._conns;
        const side  = this._side - 1;

        for (let col = 1; col < side; col++) {
            for (let row = 1; row < side; row++) {
                if (conns[col][row] === null) {
                    return [col, row];
                }
            }
        }

        return null;
    }
}


module.exports = Connections;