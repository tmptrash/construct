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
            hAxis    : {textStyle: {fontSize: 10}},
            vAxis    : {textStyle: {fontSize: 10}, gridlines: {count: 10}},
            legend   : 'none',
            chartArea: {left: 80, top: 30, bottom: 50, width: '100%', height: '100%'},
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

    set transparent(t) {this._el && (this._el.style.opacity = t)}
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
            full     : ['100%',  '100%',  '0',     '0'    ],

            top      : ['100%',  '50%',   '0',     '0'    ],
            down     : ['100%',  '50%',   '0',     '50%'  ],
            left     : ['50%',   '100%',  '0',     '0'    ],
            right    : ['50%',   '100%',  '50%',   '0'    ],

            topleft  : ['50%',   '50%',   '0',     '0'    ],
            downleft : ['50%',   '50%',   '0',     '50%'  ],
            topright : ['50%',   '50%',   '50%',   '0'    ],
            downright: ['50%',   '50%',   '50%',   '50%'  ],

            '0-0|9'  : ['33.3%', '33.3%', '0',     '0'    ],
            '1-0|9'  : ['33.3%', '33.3%', '33.3%', '0'    ],
            '2-0|9'  : ['33.3%', '33.3%', '66.6%', '0'    ],
            '0-1|9'  : ['33.3%', '33.3%', '0',     '33.3%'],
            '1-1|9'  : ['33.3%', '33.3%', '33.3%', '33.3%'],
            '2-1|9'  : ['33.3%', '33.3%', '66.6%', '33.3%'],
            '0-2|9'  : ['33.3%', '33.3%', '0',     '66.6%'],
            '1-2|9'  : ['33.3%', '33.3%', '33.3%', '66.6%'],
            '2-2|9'  : ['33.3%', '33.3%', '66.6%', '66.6%'],

            '0-0|16' : ['25%',   '25%',   '0',     '0'    ],
            '1-0|16' : ['25%',   '25%',   '25%',   '0'    ],
            '2-0|16' : ['25%',   '25%',   '50%',   '0'    ],
            '3-0|16' : ['25%',   '25%',   '75%',   '0'    ],

            '0-1|16' : ['25%',   '25%',   '0',     '25%'  ],
            '1-1|16' : ['25%',   '25%',   '25%',   '25%'  ],
            '2-1|16' : ['25%',   '25%',   '50%',   '25%'  ],
            '3-1|16' : ['25%',   '25%',   '75%',   '25%'  ],

            '0-2|16' : ['25%',   '25%',   '0',     '50%'  ],
            '1-2|16' : ['25%',   '25%',   '25%',   '50%'  ],
            '2-2|16' : ['25%',   '25%',   '50%',   '50%'  ],
            '3-2|16' : ['25%',   '25%',   '75%',   '50%'  ],

            '0-3|16' : ['25%',   '25%',   '0',     '75%'  ],
            '1-3|16' : ['25%',   '25%',   '25%',   '75%'  ],
            '2-3|16' : ['25%',   '25%',   '50%',   '75%'  ],
            '3-3|16' : ['25%',   '25%',   '75%',   '75%'  ]
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