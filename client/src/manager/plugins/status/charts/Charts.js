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
    transparent: ['_transparent', 'Sets transparent level'     ],
    pos        : ['_pos',         'Sets chart position'        ],
    active     : ['_active',      'Activates/Deactivates chart'],
    reset      : ['_reset',       'Resets chart data'          ]
};

class Charts extends Status {
    constructor(manager) {
        super(manager, Config, API);
        const periodSec = Config.period / 1000;

        this._data     = new Array(2);
        this._headerEl = this._createHeader();
        this._charts   = {
            lps       : new Chart('LPS - Lines Per Second',                                         Config.charts.lps),
            ips       : new Chart('IPS - Iterations Per Second',                                    Config.charts.ips),
            orgs      : new Chart('Amount of organisms',                                            Config.charts.orgs),
            energy    : new Chart('Average organism energy',                                        Config.charts.energy),
            penergy   : new Chart('Average organism\'s picked energy (all)',                        Config.charts.penergy),
            eenergy   : new Chart('Average organism\'s picked energy (energy only)',                Config.charts.eenergy),
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
        data[0]      = this._to12h(new Date);

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
        const pnrg   = `pnrg:${status.penergy}`;
        const code   = `cod:${status.code}`;

        this._headerEl.textContent = `id:${man.clientId ? man.clientId : ''} ${conns === '' ? '' : 'con:' + conns} ${ips} ${pnrg} ${code}`;
    }

    _to12h(time) {
        let hours   = time.getHours();
        let minutes = time.getMinutes();

        hours = hours % 12;
        hours = hours ? hours : 12;

        return hours + ':' + minutes;
    }

    _createHeader() {
        return document.body.appendChild(Helper.setStyles('DIV', {
            position  : 'absolute',
            top       : '7px',
            left      : '35px',
            color     : '#fff',
            fontSize  : '18px',
            fontFamily: 'Consolas'
        }));
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

    _setProperty(chart, prop, val) {
        this._charts[chart][prop] = val;
        _has(this.cfg, `charts.${chart}.${prop}`) && (this.cfg.charts[chart][prop] = val);
    }
}

module.exports = Charts;