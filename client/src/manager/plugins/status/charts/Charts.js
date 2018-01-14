/**
 * Manager plugin, which draws real time charts based on real time data. For example:
 * energy, iq, changes and so on. The same values like Status plugin uses.
 *
 * @author flatline
 */
const Status = require('./../Status');
const Chart  = require('./Chart');
const Config = require('./Config');
const _each  = require('lodash/each');

const API = {
    transparent: ['_transparent', 'Sets transparent level'     ],
    pos        : ['_pos',         'Sets chart position'        ],
    active     : ['_active',      'Activates/Deactivates chart']
};

class Charts extends Status {
    constructor(manager) {
        super(manager, Config, API);

        this._data   = new Array(2);
        this._charts = {
            ips   : new Chart('IPS', Config.charts.ips),
            energy: new Chart('Organism average energy', Config.charts.energy)
        };
    }

    destroy() {
        _each(this._charts, chart => chart.destroy());
        this._charts = null;
        this._data   = null;

        super.destroy();
    }

    /**
     * Is called every time, when new status data is available
     * @param {Object} status Status data
     * @param {Number} orgs Amount of organisms
     * @override
     */
    onStatus(status, orgs) {
        // const man       = this.manager;
        // const active    = man.activeAround;
        // const format    = Console._format;
        const stamp     = Date.now();
        const time      = new Date(stamp);
        //
        // const con       = `${active[0] ? '^' : ' '}${active[1] ? '>' : ' '}${active[2] ? 'v' : ' '}${active[3] ? '<' : ' '}`;
        // const conns     = `con:${con === '    ' ? 'no  ' : con}`;
        const orgAmount = orgs || 1;
        // const sips      = `ips:${status.ips}`.padEnd(10);
        // const slps      = format(status.lps,      'lps', orgAmount, 0,  14         );
        // const sorgs     = format(orgs,            'org', orgAmount, 0,  10         );
        // const senergy   = format(status.energy,   'nrg', orgAmount, 0,  14         );
        // const siq       = format(status.iq,       'iq',  orgAmount, 3,  14, 100000 );
        // const schanges  = format(status.changes,  'che', orgAmount, 2,  12         );
        // const sfit      = format(status.fit,      'fit', orgAmount, 2,  13         );
        // const sage      = format(status.age,      'age', orgAmount, 0,  11, 1      );
        // const scode     = format(status.code,     'cod', orgAmount, -1, 12, 1, true);

        //console.log(`%c${conns}${sips}${slps}${sorgs}%c${siq}${senergy}${schanges}${sfit}${sage}${scode}`, GREEN, RED);
        // TODO: this code should be moved to separate plugin
        //const active = man.activeAround;
        //man.canvas && man.canvas.text(5, 20, `${sips}${man.clientId && man.clientId || ''} ${active[0] ? '^' : ' '}${active[1] ? '>' : ' '}${active[2] ? 'v' : ' '}${active[3] ? '<' : ' '}`);


        const data = this._data;
        data[0]    = `${time.getHours()}:${time.getMinutes()}`;

        data[1]    = status.ips;
        this._charts.ips.update(data);

        data[1]    = status.energy;
        this._charts.energy.update(data);
    }

    /**
     * Sets current chart transparent coefficient
     * @param {String} chart Chart name, e.g: 'energy', or 'iq'
     * @param {Number} t Value between 0...1
     * @api
     */
    _transparent(chart, t) {this._setProperty(chart, 'transparent', t)}

    /**
     * Sets current chart position. Available positions:
     * top, down, left, right, topleft, downleft, topright,
     * downright, full.
     * @param {String} chart Chart name, e.g: 'energy', or 'iq'
     * @param {String} p new position
     * @api
     */
    _pos(chart, p) {this._setProperty(chart, 'pos', p)}

    /**
     * Sets current chart position. Available positions:
     * top, down, left, right, topleft, downleft, topright,
     * downright, full.
     * @param {String} chart Chart name, e.g: 'energy', or 'iq'
     * @param {Boolean} a New active state
     * @api
     */
    _active(chart, a) {this._setProperty(chart, 'active', a)}

    _setProperty(chart, prop, val) {
        _each(this._charts, chart => chart[prop] = val);
        this.cfg.charts[chart][prop] = val;
    }
}

module.exports = Charts;