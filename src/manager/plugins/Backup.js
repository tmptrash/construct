/**
 * Manager's plugin, which creates backups according to population age.
 *
 * Depends on:
 *   manager/plugins/Organisms
 *
 * @author DeadbraiN
 */
import Helper  from './../../global/Helper';
import Config  from './../../global/Config';
import Console from './../../global/Console';

export default class Backup {
    constructor(manager) {
        this._manager = manager;
        this._backupPeriod = Config.backupPeriod;
        this._onIterationCb = this._onIteration.bind(this);

        Helper.override(manager, 'onIteration', this._onIterationCb);
    }

    destroy() {
        Helper.unoverride(this._manager, 'onIteration', this._onIterationCb);
    }

    _onIteration(counter) {
        if (counter % this._backupPeriod !== 0 || this._backupPeriod === 0) {return;}

        const orgs  = this._manager.plugins.Organisms.orgs;
        // TODO: add other organism related properties saving
        // TODO: add removing of old backups
//        localStorage[`jjs-${Date.now()}`] = JSON.stringify({
//            world: this._manager.world.data,
//            orgs : this._getOrgsByteCode(orgs)
//        });
//        Console.info('Backup has created');
    }

    _getOrgsByteCode(orgs) {
        let cur = orgs.first;
        let codes = [];

        while (cur) {
            codes.push({
                vars: cur.val.code.vars,
                code: cur.val.code.cloneByteCode()
            });
            cur = cur.next;
        }

        return codes;
    }
}