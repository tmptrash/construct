/**
 * Manager's plugin, which creates backups according to population age.
 *
 * Depends on:
 *   manager/plugins/Organisms
 *
 * @author flatline
 */
import Helper   from '../../global/Helper';
import {Config} from '../../../../src/global/Config';
import Console  from '../../global/Console';

export default class Backup {
    static version() {
        return '0.1';
    }

    constructor(orgs, world, positions) {
        this.orgs      = orgs;
        this._world     = world;
        this._positions = positions;
    }

    destroy() {
        this.orgs       = null;
        this._world     = null;
        this._positions = null;
    }

    backup() {
        this._toLocalStorage(this._toJson(this.orgs, this._world));
        Console.info('Backup has created');
    }

    _toJson(orgs, world) {
        return {
            orgs  : this._getOrgs(orgs),
            energy: this._getEnergy(world)
        };
    }

    _getOrgs(orgs) {
        let cur  = orgs.first;
        let json = [];

        while (cur) {
            let org = cur.val;
            json.push({
                id                  : org.id,
                x                   : org.x,
                y                   : org.y,
                mutationProbs       : org.mutationProbs,
                cloneMutationPercent: org.cloneMutationPercent,
                mutationPeriod      : org.mutationPeriod,
                mutationPercent     : org.mutationPercent,
                color               : org.color,
                vars                : org.jsvm.vars,
                code                : org.jsvm.cloneByteCode()
            });
            cur = cur.next;
        }

        return json;
    }

    _getEnergy(world) {
        let dot;
        let positions = this._positions;
        let posId     = Helper.posId;
        let energy    = [];

        for (let x = 0; x < Config.worldWidth; x++) {
            for (let y = 0; y < Config.worldHeight; y++) {
                dot = world.getDot(x, y);
                if (dot > 0 && positions[posId(x, y)] !== null) {
                    energy.push(x, y);
                }
            }
        }

        return energy;
    }

    _toLocalStorage(json) {
        // TODO: add other organism related properties saving
        // TODO: add removing of old backups
//        localStorage[`jjs-${Date.now()}`] = JSON.stringify({
//            world: this.manager.world.data,
//            orgs : this._getOrgsByteCode(orgs)
//        });
    }
}