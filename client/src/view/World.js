/**
 * 2D space, where all organisms are live. In reality this is
 * just a peace of memory, where all organisms are located. It
 * doesn't contain organisms codes, only rectangular with points.
 * It's possible to run our application only in memory. In this
 * case only this 2D world will be used (without visual
 * presentation)
 *
 * Usage:
 *   const World = require('.../World').World;
 *   let world = new World(100, 100);
 *   world.setDot(50, 50, 0xFF00AA);
 *   world.getDot(50, 50); // 0xFF00AA
 *
 * Events:
 *   dot(x,y,color) Fires if one dot in a worlds field changed it's color
 *
 * @author flatline
 */
const Observer     = require('./../../../common/src/Observer');
const Helper       = require('./../../../common/src/Helper');
const EVENT_AMOUNT = require('./../../src/share/Events').EVENT_AMOUNT;

const DOT     = 0;
const WEVENTS = {
    DOT
};
/**
 * {Number} Amount of attempts for finding free place in a world.
 * The same like this.getDot(x, y) === 0
 */
const FREE_DOT_ATTEMPTS = 100;
const OBJECT_TYPES      = {};

class World extends Observer {
    constructor (width, height) {
        super(EVENT_AMOUNT);
        this._data   = [];
        this._width  = width;
        this._height = height;

        for (let x = 0; x < width; x++) {
            this._data[x] = (new Array(height)).fill(0);
        }
    }

    destroy() {
        this._data   = null;
        this._width  = 0;
        this._height = 0;

        super.destroy();
    }

    get data() {return this._data}

    setDot(x, y, color) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {return false}
        this._data[x][y] = color;
        this.fire(DOT, x, y, color);

        return true;
    }

    getDot(x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {return 0}
        return this._data[x][y];
    }

    grabDot(x, y, amount) {
        let dot = Math.min(this.getDot(x, y), amount);

        if (dot > 0) {
            this.fire(DOT, x, y, (this._data[x][y] -= dot));
        }

        return dot;
    }

    getFreePos() {
        const rand   = Helper.rand;
        const width  = this._width;
        const height = this._height;
        let   i      = FREE_DOT_ATTEMPTS;
        let   x;
        let   y;

        while (this.getDot(x = rand(width), y = rand(height)) > 0 && i-- > 0) {}

        return i > 0 ? [x, y] : [-1, -1]
    }

    getNearFreePos(x, y) {
        const positions = [
            x + 1, y,     // right
            x + 1, y + 1, // right down
            x    , y + 1, // down
            x - 1, y + 1, // down left
            x - 1, y,     // left
            x - 1, y - 1, // left up
            x    , y - 1, // up
            x + 1, y - 1  // up right
        ];

        for (let i = 0, j = 0; i < 8; i++) {
            x = positions[j];
            y = positions[j + 1];
            if (this.getDot(x, y) === 0 && x >= 0 && x < this._width && y >= 0 && y < this._height) {
                return [positions[j], positions[j + 1]];
            }
            j += 2;
        }

        return [-1, -1];
    }

    isFree(x, y) {
        return this.getDot(x, y) === 0;
    }
}

module.exports = {World, EVENTS: WEVENTS, OBJECT_TYPES};