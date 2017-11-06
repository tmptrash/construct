/**
 * TODO: add description:
 * TODO:   - events
 * TODO:   -
 * @author flatline
 */
const Organism = require('./../organism/Organism');

class OrganismDos extends Organism {
    onRun() {
        this.jsvm.run(this);
    }
}

module.exports = OrganismDos;