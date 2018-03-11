/**
 * Manager plugin, which draws real time charts based on real time data. For example:
 * energy, iq, changes and so on. The same values like Status plugin uses.
 *
 * @author flatline
 */
const _each  = require('lodash/each');
const _has   = require('lodash/has');
const _get   = require('lodash/get');
const Helper = require('./../../../../../../common/src/Helper');
const Status = require('./../Status');
const Chart  = require('./Chart');
const Config = require('./Config');

const API = {
    transparent: ['_transparent', 'Sets transparent level'                ],
    pos        : ['_pos',         'Sets chart position'                   ],
    pos9       : ['_pos9',        'Sets chart position in 3x3 grid'       ],
    pos16      : ['_pos16',       'Sets chart position in 4x4 grid'       ],
    active     : ['_active',      'Activates/Deactivates chart'           ],
    on         : ['_on',          'Activates/Deactivates chart'           ],
    off        : ['_off',         'Deactivates chart'                     ],
    reset      : ['_reset',       'Resets chart data'                     ],
    preset     : ['_preset',      'Positioning charts according to preset']
};

const PRESETS = {
    general  : {
        lps       : 'topleft',
        eenergy   : 'downleft',
        changes   : 'topright',
        code      : 'downright'
    },
    general9 : {
        lps       : '0-0|9',
        orgs      : '0-1|9',
        eenergy   : '0-2|9',
        changes   : '1-0|9',
        age       : '1-1|9',
        code      : '1-2|9',
        kill      : '2-0|9',
        ips       : '2-1|9',
        fit       : '2-2|9'
    },
    general16: {
        lps       : '0-0|16',
        orgs      : '0-1|16',
        energy    : '0-2|16',
        eenergy   : '0-3|16',
        penergy   : '1-0|16',
        changes   : '1-1|16',
        age       : '1-2|16',
        code      : '1-3|16',
        fit       : '2-0|16',
        kill      : '2-1|16',
        killeat   : '2-2|16',
        killenergy: '2-3|16'
    },
    kill9    : {
        kill      : '0-0|9',
        killtour  : '0-1|9',
        killenergy: '0-2|9',
        killage   : '1-0|9',
        killeat   : '1-1|9',
        killover  : '1-2|9',
        killout   : '2-0|9',
        killin    : '2-1|9',
        killclone : '2-2|9'
    },
    energy   : {
        lps       : 'topleft',
        energy    : 'downleft',
        eenergy   : 'topright',
        penergy   : 'downright'
    }
};

class Charts extends Status {
    static _to12h(time) {
        let hours   = time.getHours();
        let minutes = time.getMinutes();

        hours = hours % 12;
        hours = hours ? hours : 12;

        return hours + ':' + minutes;
    }

    static _createHeader() {
        return document.body.appendChild(Helper.setStyles('DIV', {
            position  : 'absolute',
            top       : '7px',
            left      : '35px',
            color     : '#fff',
            fontSize  : '18px',
            fontFamily: 'Consolas'
        }));
    }

    constructor(manager) {
        super(manager, Config, API);
        const periodSec = Config.period / 1000;

        this._data     = new Array(2);
        this._headerEl = Charts._createHeader();
        this._charts   = {
            lps       : new Chart('LPS - Lines Per Second',                                         Config.charts.lps),
            ips       : new Chart('IPS - Iterations Per Second',                                    Config.charts.ips),
            orgs      : new Chart('Amount of organisms',                                            Config.charts.orgs),
            energy    : new Chart('Average organism energy',                                        Config.charts.energy),
            penergy   : new Chart('Average organism\'s picked energy (all)',                        Config.charts.penergy),
            eenergy   : new Chart('Average organism\'s picked energy (energy only)',                Config.charts.eenergy),
            puenergy  : new Chart('Average organism\'s put energy to the world',                    Config.charts.puenergy),
            changes   : new Chart('Average organism\'s changes (Mutations)',                        Config.charts.changes),
            fit       : new Chart('Average organism\'s Fitness',                                    Config.charts.fit),
            age       : new Chart('Average organism\'s Age',                                        Config.charts.age),
            code      : new Chart('Average organism\'s code size',                                  Config.charts.code),
            kill      : new Chart(`Amount of killed organisms per ${periodSec} sec (all)`,          Config.charts.kill),
            killtour  : new Chart(`Amount of killed organisms in tournament per ${periodSec} sec`,  Config.charts.killtour),
            killenergy: new Chart(`Amount of killed organisms with 0 energy per ${periodSec} sec`,  Config.charts.killenergy),
            killage   : new Chart(`Amount of killed organisms with max age per ${periodSec} sec`,   Config.charts.killage),
            killeat   : new Chart(`Amount of killed organisms eat by other per ${periodSec} sec`,   Config.charts.killeat),
            killover  : new Chart(`Amount of organisms killed after overflow per ${periodSec} sec`, Config.charts.killover),
            killout   : new Chart(`Amount of organisms killed after step out per ${periodSec} sec`, Config.charts.killout),
            killin    : new Chart(`Amount of organisms killed after step in per ${periodSec} sec`,  Config.charts.killin),
            killclone : new Chart(`Amount of organisms killed during clone per ${periodSec} sec`,   Config.charts.killclone)
        };
    }

    destroy() {
        _each(this._charts, chart => chart.destroy());
        this._headerEl.parentNode.removeChild(this._headerEl);
        this._headerEl = null;
        this._charts   = null;
        this._data     = null;

        super.destroy();
    }

    /**
     * Is called every time, when new status data is available
     * @param {Object} status Status data
     * @override
     */
    onStatus(status) {
        this._updateCharts(status);
        this._updateHeader(status);
    }

    _updateCharts(status) {
        const data   = this._data;
        const charts = this._charts;
        data[0]      = Charts._to12h(new Date);

        _each(charts, (chart, key) => {
            data[1] = status[key];
            chart.update(data);
        });
    }

    _updateHeader(status) {
        const man    = this.parent;
        const active = man.activeAround;
        if (!man.canvas) {return}
        const conns  = `${active[0] ? '^' : ''}${active[1] ? '>' : ''}${active[2] ? 'v' : ''}${active[3] ? '<' : ''}`;
        const ips    = `ips:${status.ips}`;
        const enrg   = `enrg:${status.eenergy}`;
        const wnrg   = `wnrg:${status.wenergy}`;
        const wnrgup = status.wenergyup ? '\u2191' : '\u2193';
        const code   = `cod:${status.code}`;
        const age    = `age:${status.age}`;
        const kill   = `kil:${status.kill}`;
        const kilo   = `kilo:${status.killeat}`;
        const orgs   = `org:${status.orgs}`;

        this._headerEl.textContent = `${man.clientId ? 'id:' + man.clientId : ''} ${conns === '' ? '' : 'con:' + conns} ${ips} ${wnrg} ${wnrgup} ${enrg} ${code} ${age} ${kill} ${kilo} ${orgs}`;
    }

    /**
     * Sets specified chart transparent coefficient. May be called
     * with one Number parameter to set it for all charts.
     * @param {String|Number} chart Chart name, e.g: 'energy', or 'lps' or opacity value
     * @param {Number=} t Value between 0...1 or undefined
     * @api
     */
    _transparent(chart, t) {
        if (typeof t === 'undefined') {
            _each(this._charts, (c, k) => this._setProperty(k, 'transparent', chart));
        } else {
            this._setProperty(chart, 'transparent', t);
        }
    }

    /**
     * Sets current chart position. Available positions:
     * top, down, left, right, topleft, downleft, topright,
     * downright, full.
     * @param {String} chart Chart name, e.g: 'energy', or 'lps'
     * @param {String} p new position
     * @api
     */
    _pos(chart, p) {this._setProperty(chart, 'pos', p)}

    /**
     * Positioning method, which position a chart in 3x3 grid.
     * Positioning based on x,y coordinates. e.g.: pos('kill', 0,0)
     * will be located in a left top corner
     * @param {String} chart Chart name, e.g: 'energy', or 'lps'
     * @param {Number} x X coordinate
     * @param {Number} y Y coordinate
     * @api
     */
    _pos9(chart, x, y) {this._setProperty(chart, 'pos', `${x > 2 ? 2 : x < 0 ? 0 : x}-${y > 2 ? 2 : y < 0 ? 0 : y}|9`)}

    /**
     * Positioning method, which position a chart in 4x4 grid.
     * Positioning based on x,y coordinates. e.g.: pos('kill', 0,0)
     * will be located in a left top corner
     * @param {String} chart Chart name, e.g: 'energy', or 'lps'
     * @param {Number} x X coordinate
     * @param {Number} y Y coordinate
     * @api
     */
    _pos16(chart, x, y) {this._setProperty(chart, 'pos', `${x > 3 ? 3 : x < 0 ? 0 : x}-${y > 3 ? 3 : y < 0 ? 0 : y}|16`)}

    /**
     * Sets current chart position. Available positions:
     * top, down, left, right, topleft, downleft, topright,
     * downright, full. This method may be called with one
     * Boolean parameter. In this case all charts will be activated
     * or deactivated.
     * @param {String|Boolean} chart Chart name, e.g: 'energy', or 'lps'
     * @param {Boolean=} a New active state
     * @api
     */
    _active(chart, a) {
        const noA     = typeof a === 'undefined';
        const noChart = typeof chart === 'undefined';
        const bChart  = typeof chart === 'boolean';

        a     = noA     ? (bChart ? chart : true) : a;
        chart = noChart ? null : (bChart ? null : chart);

        if (chart === null) {
            _each(this._charts, (c, k) => this._setProperty(k, 'active', a));
        } else {
            this._setProperty(chart, 'active', a);
        }
    }

    /**
     * Shortcut for _active() method. See it for details.
     */
    _on(...args) {
        this._active(...args)
    }

    /**
     * Opposite to _on().
     * @param {String=} chart Chart name
     */
    _off(chart) {
        if (typeof chart === 'string') {
            this._active(chart, false);
        } else {
            this._active(false);
        }
    }

    /**
     * Resets chart data. It means, that chart will be refreshed with
     * data started from this moment and further. You may call this
     * method without parameters to reset all charts.
     * @param {String=} chart Chart name, e.g: 'energy', or 'lps'
     * @api
     */
    _reset(chart) {
        if (typeof chart === 'undefined') {
            _each(this._charts, c => {c.reset(); return true});
        } else {
            _get(this, `_charts.${chart}`, {}).reset && this._charts[chart].reset();
        }
    }

    _preset(name) {
        if (typeof(PRESETS[name]) === 'undefined') {return}

        _each(this._charts, (inst, chart) => this._off(chart));
        _each(PRESETS[name], (pos, chart) => {
            this._pos(chart, pos);
            this._on(chart);
        });
    }

    _setProperty(chart, prop, val) {
        if (typeof(this._charts[chart]) === 'undefined') {return}
        _has(this.cfg, `charts.${chart}.${prop}`) && (this.cfg.charts[chart][prop] = val);
        this._charts[chart][prop] = val;
    }
}

module.exports = Charts;