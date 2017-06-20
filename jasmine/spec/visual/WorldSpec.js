describe("src/visual/World", () => {
    let World = require('../../../src/visual/World').default;

    it("Checking world creation", () => {
        let world = new World(10, 10);
        world.destroy();
    });
    it("Checking getDot() method", () => {
        let world = new World(10, 10);

        expect(world.getDot(0,0)).toEqual(0);
        expect(world.getDot(1,1)).toEqual(0);
        expect(world.getDot(3,1)).toEqual(0);
        expect(world.getDot(9,9)).toEqual(0);

        expect(world.getDot(-1,0)).toEqual(false);
        expect(world.getDot(1,-2)).toEqual(false);
        expect(world.getDot(-1,-2)).toEqual(false);
        expect(world.getDot(9,10)).toEqual(false);
        expect(world.getDot(10,9)).toEqual(false);
        expect(world.getDot(10,10)).toEqual(false);
        expect(world.getDot(-1,10)).toEqual(false);
        expect(world.getDot(10,-10)).toEqual(false);

        world.destroy();
    });

    it("Checking setDot() method", () => {
        let world = new World(10, 10);

        expect(world.getDot(5,6)).toEqual(0);
        expect(world.setDot(5,6,0x112233)).toEqual(true);
        expect(world.getDot(5,6)).toEqual(0x112233);
        expect(world.setDot(5,6,0)).toEqual(true);
        expect(world.getDot(5,6)).toEqual(0);

        expect(world.setDot(-1,6,0x112233)).toEqual(false);
        expect(world.setDot(1,-7,0x112233)).toEqual(false);
        expect(world.setDot(-11,-2,0x112233)).toEqual(false);

        world.destroy();
    });

    it("Checking grabDot() method", () => {
        let world = new World(20, 30);

        expect(world.setDot(0,15,0xffffff)).toEqual(true);
        expect(world.grabDot(0,15,0x000011)).toEqual(0x000011);
        expect(world.getDot(0,15)).toEqual(0xffffee);

        expect(world.grabDot(0,15,0xffffee)).toEqual(0xffffee);
        expect(world.getDot(0,15)).toEqual(0);

        expect(world.grabDot(0,15,0xffffee)).toEqual(0);
        expect(world.getDot(0,15)).toEqual(0);

        expect(world.grabDot(-1,15,0x000001)).toEqual(0);
        expect(world.grabDot(21,-415,0x000001)).toEqual(0);
        expect(world.grabDot(-2,-45,0x000001)).toEqual(0);

        world.destroy();
    });

    it("Checking getFreePos() method", () => {
        let width  = 10;
        let height = 10;
        let world  = new World(width, height);
        let pos    = world.getFreePos();

        expect(pos !== false).toEqual(true);
        expect(pos.x >= 0 && pos.x < width).toEqual(true);
        expect(pos.y >= 0 && pos.y < height).toEqual(true);

        world.destroy();
    });
    it("Checking getFreePos() method 2", () => {
        let width  = 3;
        let height = 3;
        let world  = new World(width, height);
        let pos;

        expect(world.setDot(0,0,1)).toEqual(true);
        expect(world.setDot(1,0,1)).toEqual(true);
        expect(world.setDot(2,0,1)).toEqual(true);

        pos = world.getFreePos();
        expect(pos !== false).toEqual(true);
        expect(pos.x >= 0 && pos.x < width).toEqual(true);
        expect(pos.y >= 1 && pos.y < height).toEqual(true);

        world.destroy();
    });
});