/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author DeadbraiN
 */
import Organism from './../organism/base/Organism';

export default class OrganismDos extends Organism {
    static version() {
        return '1.0';
    }

    onRun() {
        this.jsvm.run(this);
    }
}