/**
 * Canvas implementation with minimum logic for drawing colored dots.
 *
 * @author DeadbraiN
 */
export default class Canvas {
    constructor() {
        const bodyEl = $('body');

        this._CLEAR_COLOR = '#000000';

        this._prepareDom();

        this._width     = bodyEl.width();
        this._height    = bodyEl.height();
        this._canvasEl  = bodyEl.append('<canvas id="world" width="' + this._width + '" height="' + this._height + '"></canvas>').find('#world');
        this._ctx       = this._canvasEl[0].getContext('2d');
        this._imgData   = this._ctx.createImageData(this._width, this._height);
        this._data      = this._imgData.data;
        this._animate   = this._onAnimate.bind(this);

        this.clear();
        window.requestAnimationFrame(this._animate);
    }

    destroy() {
        this._canvasEl.empty();
        this._ctx     = null;
        this._imgData = null;
        this._data    = null;
    }

    dot(x, y, color) {
        this._dot(x, y, color);
    }

    /**
     * Clears canvas with black color
     */
    clear() {
        const size = this._width * this._height * 4;
        const data = this._data;

        for (let i = 0; i < size; i += 4) {
            data[i + 3] = 0xff;
        }
//        this._ctx.rect(0, 0, this._width, this._height);
//        this._ctx.fillStyle = this._CLEAR_COLOR;
//        this._ctx.fill();
    }

    /**
     * Sets pixel to specified color with specified coordinates.
     * Color should contain red, green and blue components in one
     * decimal number. For example: 16777215 is #FFFFFF - white.
     * In case of invalid coordinates 0 value for x, color and y will
     * be used.
     * @param {Number} x X coordinate
     * @param {Number} y Y coordinate
     * @param {Number} color Decimal color
     */
    _dot(x, y, color) {
        const data = this._data;
        const offs = (y * this._width + x) * 4;

        data[offs    ] = (color >> 16) & 0xff;
        data[offs + 1] = (color >> 8)  & 0xff;
        data[offs + 2] = color & 0xff;
         //TODO: should be optimized. 0xff should be set once at the beginning
        data[offs + 3] = 0xff; // Alpha channel (no transparency)
        //this._ctx.putImageData(this._imgData, 0, 0);
    }

    _onAnimate() {
        this._ctx.putImageData(this._imgData, 0, 0);
        window.requestAnimationFrame(this._animate);
    }

    _prepareDom() {
        $('body')
            .width('100%')
            .height('100%')
            .css('margin', 0)
        .parent()
            .width('100%')
            .height('100%')
            .css('margin', 0);
    }
}