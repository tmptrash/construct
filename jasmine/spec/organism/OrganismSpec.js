describe("src/global/Console", () => {
    let Organism = require('../../../src/organism/Organism').default;
    let Config   = require('../../../src/global/Config').default;

    it("Checking organism creation", () => {
        let org = new Organism(0, 1, 1, true, null);

        expect(org).toEqual(0);
    });
});