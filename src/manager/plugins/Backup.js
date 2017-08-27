/**
 * Manager's plugin, which creates backups according to population age.
 *
 * Depends on:
 *   manager/plugins/Organisms
 *
 * @author DeadbraiN
 */
import Helper   from './../../global/Helper';
import {Config} from './../../global/Config';
import Console  from './../../global/Console';

export default class Backup {
    constructor(orgs, world, positions) {
        this._orgs      = orgs;
        this._world     = world;
        this._positions = positions;
    }

    backup() {
        this._toLocalStorage(this._toJson(this._orgs, this._world));
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
                vars                : org.code.vars,
                code                : org.code.cloneByteCode()
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
//            world: this._manager.world.data,
//            orgs : this._getOrgsByteCode(orgs)
//        });
    }
}