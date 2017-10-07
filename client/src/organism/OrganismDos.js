/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author flatline
 */
import Organism from './base/Organism';

export default class OrganismDos extends Organism {
    onRun() {
        this.jsvm.run(this);
    }
}