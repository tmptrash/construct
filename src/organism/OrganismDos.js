/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author DeadbraiN
 */
import Organism from './../organism/base/Organism';

export default class OrganismDos extends Organism {
    static version() {
        return '0.1';
    }

    onRun() {
        this.jsvm.run(this);
    }
}