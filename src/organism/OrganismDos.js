/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author DeadbraiN
 */
import Organism from './../organism/base/Organism';

export default class OrganismDos extends Organism {
    onRun() {
        this.jsvm.run(this);
    }
}