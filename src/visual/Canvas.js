/**
 * Canvas implementation with minimum logic for drawing colored dots.
 *
 * @author DeadbraiN
 */
export default class Canvas {
    constructor() {
        const bodyEl = $('body');

        this._CLEAR_COLOR = '#000000';

        bodyEl.width('100%').height('100%').css('margin', 0).parent().width('100%').height('100%').css('margin', 0);

        this._canvasEl = bodyEl.append('<canvas id="world" width="' + bodyEl.width() + '" height="' + bodyEl.height() + '"></canvas>').find('#world');
        this._ctx      = this._canvasEl[0].getContext('2d');
        this._imgData  = this._ctx.createImageData(1, 1);
        this._data     = this._imgData.data;
        this._data[3]  = 0xff; // Alpha channel

        this.clear();
    }

    destroy() {
        this._canvasEl.empty();
        this._ctx     = null;
        this._imgData = null;
        this._data    = null;
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
    dot(x, y, color) {
        const data = this._data;

        data[0] = (color >> 16) & 255;
        data[1] = (color >> 8) & 255;
        data[2] = color & 255;
        this._ctx.putImageData(this._imgData, x, y);
    }

    /**
     * Clears canvas with black color
     */
    clear() {
        this._ctx.rect(0, 0, this._canvasEl.width(), this._canvasEl.height());
        this._ctx.fillStyle = this._CLEAR_COLOR;
        this._ctx.fill();
    }
}