/**
 * Canvas implementation with minimum logic for drawing colored dots.
 *
 * @author flatline
 */
const Panzoom = require('panzoom');
const Helper  = require('./../../../common/src/Helper');

class Canvas {
    constructor(width, height, noScrolls = false) {
        const id  = 'world';
        const doc = document;

        doc.body.innerHTML += `<canvas id="${id}" width="${width}" height="${height}"></canvas>`;

        this._id        = id;
        this._width     = width;
        this._height    = height;
        this._canvasEl  = doc.querySelector('#' + id);
        this._ctx       = this._canvasEl.getContext('2d');
        this._text      = {x: 0, y: 0, t: ''};
        this._imgData   = this._ctx.createImageData(this._width, this._height);
        this._data      = this._imgData.data;
        this._animate   = this._onAnimate.bind(this);
        this._visualize = true;
        this._panZoom   = null;
        this._fullEl    = this._createFullScreen();

        this._prepareDom(noScrolls);
        this._initPanZoomLib();
        this.clear();
        window.requestAnimationFrame(this._animate);
    }

    destroy() {
        const parentNode = this._canvasEl.parentNode;

        this._panZoom.dispose();
        parentNode.removeChild(this._canvasEl);
        parentNode.removeChild(this._fullEl);
        this._canvasEl = null;
        this._fullEl   = null;
        this._ctx      = null;
        this._imgData  = null;
        this._data     = null;
    }

    visualize(visualize = true) {
        this._visualize = visualize;
        this._onAnimate();
    }

    text(x, y, text) {
        const t = this._text;

        t.t = text;
        t.x = x;
        t.y = y;
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
    }

    _createFullScreen() {
        const el = document.body.appendChild(Helper.setStyles('DIV', {
            position       : 'absolute',
            width          : '20px',
            height         : '20px',
            top            : '7px',
            left           : '7px',
            border         : '1px #000 solid',
            backgroundColor: '#f7ed0e',
            borderRadius   : '6px',
            cursor         : 'pointer'
        }));

        el.title   = 'fullscreen';
        el.onclick = () => {
            this._panZoom.zoomAbs(0, 0, 1.0);
            this._panZoom.moveTo(0, 0);
        };
        
        return el;
    }

    _onAnimate() {
        const text = this._text;

        this._ctx.putImageData(this._imgData, 0, 0);
        this._ctx.fillText(text.t, text.x, text.y);

        if (this._visualize === true) {
            window.requestAnimationFrame(this._animate);
        }
    }

    _prepareDom(noScrolls) {
        const bodyEl = document.body;
        const htmlEl = document.querySelector('html');

        Helper.setStyles(bodyEl, {
            width          : '100%',
            height         : '100%',
            margin         : 0,
            backgroundColor: '#9e9e9e'
        });
        Helper.setStyles(htmlEl, {
            width          : '100%',
            height         : '100%',
            margin         : 0
        });

        this._ctx.font      = "18px Consolas";
        this._ctx.fillStyle = "white";
        //
        // This style hides scroll bars on full screen 2d canvas
        //
        if (noScrolls) {document.querySelector('html').style.overflow = 'hidden'}
    }

    /**
     * Initializes 'panzoom' library, which adds possibility to
     * zoom and scroll canvas by mouse. imageRendering css property
     * removes smooth effect while zooming
     */
    _initPanZoomLib() {
        this._canvasEl.style.imageRendering = 'pixelated';
        this._panZoom   = Panzoom(this._canvasEl, {
            zoomSpeed   : 0.05,
            smoothScroll: false
        });
        this._panZoom.zoomAbs(0, 0, 1.0);
    }
}

module.exports = Canvas;