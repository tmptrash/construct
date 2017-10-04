/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author flatline
 */
import Organism from './base/Organism';

class OrganismDos extends Organism {
    static version() {
        return '0.1';
    }

    onRun() {
        this.jsvm.run(this);
    }
}

module.exports = OrganismDos;