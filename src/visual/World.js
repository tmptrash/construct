/**
 * 2D space, where all organisms are live. In reality this is
 * just a peace of memory, where all organisms are located. It
 * doesn't contain organisms codes, only rectangular with points.
 * It's possible to run our application only in memory. In this
 * case only this 2D world will be used (without visual
 * presentation)
 *
 * Usage:
 *   import World from '.../World';
 *   let world = new World(100, 100);
 *   world.getDot(50, 50, 0xFF00AA);
 *   world.getDot(50, 50); // 0xFF00AA
 *
 * Events:
 *   TODO:
 *
 * @author DeadbraiN
 */
import Observer from './../global/Observer';
import Helper   from './../global/Helper';

export default class {
    constructor (width, height) {
        this._data   = [];
        this._width  = width;
        this._height = height;
        this._obs    = new Observer();

        for (let x = 0; x < width; x++) {
            this._data[x] = (new Array(height)).fill(0);
        }
    }

    destroy() {
        this._data = [];
        this._obs.clear();
        this._width  = 0;
        this._height = 0;
    }

    setDot(x, y, color) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {return false;}
        this._data[x][y] = color;
        this._obs.fire('dot', x, y, color)

        return true;
    }

    getDot(x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {return false;}
        return this._data[x][y];
    }

    grabDot(x, y, amount) {
        let dot = Math.min(this.getDot(x, y), amount)

        if (dot > 0) {
            this._obs.fire('dot', x, y, (this._data[x][y] -= dot));
        }

        return dot;
    }

    getFreePos() {
        const rand   = Helper.rand;
        const width  = this._width;
        const height = this._height;
        let   x      = Math.ceil(width / 2);
        let   y      = Math.ceil(height / 2);
        let   i      = width * height < 1000 ? 100 : width * height / 10;

        while (this.getDot(x, y) > 0 && i > 0) {
            x = rand(width);
            y = rand(height);
            i -= 1;
        }

        return i > 0 ? {x: x, y: y} : false
    }

    getNearFreePos() {

    }
}