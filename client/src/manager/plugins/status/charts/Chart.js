/**
 * Draws one line chart using Google charts library. The purpose of
 * this class is to show dynamics of changing for some property. For
 * example: energy, iq or code size. update() method should obtain
 * new portion of property data to draw on chart. Works only in browser.
 * Requires internet connection for google charts dynamic load.
 *
 * @author flatline
 */
const GoogleCharts = require('google-charts').GoogleCharts;
const _get         = require('lodash/get');

class Chart {
    constructor(title, cfg) {
        this._options = {
            title    : title,
            hAxis    : {textStyle: {fontSize: 12}},
            vAxis    : {textStyle: {fontSize: 12}},
            legend   : 'none',
            chartArea: {left: 100, top: 50, bottom: 60, width: '100%', height: '100%'},
        };
        this._data    = null;
        this._chart   = null;
        this._ready   = false;
        this._el      = null;
        this._cfg     = cfg;

        GoogleCharts.load(cfg.active ? this._onReady.bind(this) : () => {}, 'corechart');
    }

    /**
     * Updates chart with new portion of data
     * @param {Array} data Array of two new values
     * @return {Boolean}
     */
    update(data) {
        if (!this._ready) {return false}

        this._data.addRow(data);
        _get(this, '_cfg.active') && this._chart.draw(this._data, this._options);

        return true;
    }

    set transparent(t) {this._el.style.opacity = t}
    set pos(p)         {this._updatePos(p)}
    set active(a)      {this._cfg.active !== a && this._updateActive(a)}

    reset() {
        if (!this._ready) {return false}
        this._data = this._createDataTable();
        return true;
    }

    destroy() {
        this._cfg.active && this._chart.clearChart();
        this._el.parentNode.removeChild(this._el);
        this._el      = null;
        this._data    = null;
        this._chart   = null;
        this._options = null;
    }

    _onReady() {
        const el = this._el = document.createElement("DIV");

        el.style.position = 'absolute';
        el.style.opacity  = this._cfg.transparent;
        this._updatePos(this._cfg.pos);
        document.body.appendChild(el);
        this._ready = true;

        this._chart = new google.visualization.LineChart(el);
        !this._data && (this._data = this._createDataTable());
    }

    /**
     * Returns chart container sizes depending on position. Sizes format:
     * [width, height, left, top]
     * @param {String} pos Position
     * @returns {Array} [width, height, left, top]
     * @private
     */
    _getSize(pos) {
        return {
            top      : ['100%', '50%',  '0',   '0'  ],
            down     : ['100%', '50%',  '0',   '50%'],
            left     : ['50%',  '100%', '0',   '0'  ],
            right    : ['50%',  '100%', '50%', '0'  ],
            topleft  : ['50%',  '50%',  '0',   '0'  ],
            downleft : ['50%',  '50%',  '0',   '50%'],
            topright : ['50%',  '50%',  '50%', '0'  ],
            downright: ['50%',  '50%',  '50%', '50%'],
            full     : ['100%', '100%', '0',   '0'  ]
        }[pos];
    }

    _updatePos(pos) {
        if (!this._el) {return}
        const style  = this._el.style;
        const size   = this._getSize(pos);

        style.width  = size[0];
        style.height = size[1];
        style.left   = size[2];
        style.top    = size[3];
    }

    _updateActive(active) {
        if (active) {
            this._onReady();
        } else {
            this._chart.clearChart();
            this._el.parentNode.removeChild(this._el);
            this._chart = this._el = null;
        }
    }

    _createDataTable() {
        const data = new google.visualization.DataTable();

        data.addColumn('string', 'horizontal');
        data.addColumn('number', 'vertical');

        return data;
    }
}

module.exports = Chart;