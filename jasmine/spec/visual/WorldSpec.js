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

    it("Checking getNearFreePos() with left free pos", () => {
        let width  = 3;
        let height = 3;
        let world  = new World(width, height);
        let pos;

        expect(world.setDot(0,0,1)).toEqual(true);
        expect(world.setDot(1,0,1)).toEqual(true);
        expect(world.setDot(2,0,1)).toEqual(true);
        //expect(world.setDot(0,1,1)).toEqual(true);
        //expect(world.setDot(1,1,1)).toEqual(true); // center
        expect(world.setDot(2,1,1)).toEqual(true);
        expect(world.setDot(0,2,1)).toEqual(true);
        expect(world.setDot(1,2,1)).toEqual(true);
        expect(world.setDot(2,2,1)).toEqual(true);
        pos = world.getNearFreePos(1,1);
        expect(pos !== false).toEqual(true);
        expect(pos.x === 0 && pos.y === 1).toEqual(true);

        world.destroy();
    });
    it("Checking getNearFreePos() with up free pos", () => {
        let width  = 3;
        let height = 3;
        let world  = new World(width, height);
        let pos;

        expect(world.setDot(0,0,1)).toEqual(true);
        //expect(world.setDot(1,0,1)).toEqual(true);
        expect(world.setDot(2,0,1)).toEqual(true);
        expect(world.setDot(0,1,1)).toEqual(true);
        //expect(world.setDot(1,1,1)).toEqual(true); // center
        expect(world.setDot(2,1,1)).toEqual(true);
        expect(world.setDot(0,2,1)).toEqual(true);
        expect(world.setDot(1,2,1)).toEqual(true);
        expect(world.setDot(2,2,1)).toEqual(true);
        pos = world.getNearFreePos(1,1);
        expect(pos !== false).toEqual(true);
        expect(pos.x === 1 && pos.y === 0).toEqual(true);

        world.destroy();
    });
    it("Checking getNearFreePos() with right free pos", () => {
        let width  = 3;
        let height = 3;
        let world  = new World(width, height);
        let pos;

        expect(world.setDot(0,0,1)).toEqual(true);
        expect(world.setDot(1,0,1)).toEqual(true);
        expect(world.setDot(2,0,1)).toEqual(true);
        expect(world.setDot(0,1,1)).toEqual(true);
        //expect(world.setDot(1,1,1)).toEqual(true); // center
        //expect(world.setDot(2,1,1)).toEqual(true);
        expect(world.setDot(0,2,1)).toEqual(true);
        expect(world.setDot(1,2,1)).toEqual(true);
        expect(world.setDot(2,2,1)).toEqual(true);
        pos = world.getNearFreePos(1,1);
        expect(pos !== false).toEqual(true);
        expect(pos.x === 2 && pos.y === 1).toEqual(true);

        world.destroy();
    });
    it("Checking getNearFreePos() with down free pos", () => {
        let width  = 3;
        let height = 3;
        let world  = new World(width, height);
        let pos;

        expect(world.setDot(0,0,1)).toEqual(true);
        expect(world.setDot(1,0,1)).toEqual(true);
        expect(world.setDot(2,0,1)).toEqual(true);
        expect(world.setDot(0,1,1)).toEqual(true);
        //expect(world.setDot(1,1,1)).toEqual(true); // center
        expect(world.setDot(2,1,1)).toEqual(true);
        expect(world.setDot(0,2,1)).toEqual(true);
        //expect(world.setDot(1,2,1)).toEqual(true);
        expect(world.setDot(2,2,1)).toEqual(true);
        pos = world.getNearFreePos(1,1);
        expect(pos !== false).toEqual(true);
        expect(pos.x === 1 && pos.y === 2).toEqual(true);

        world.destroy();
    });

    it("Checking 'dot' event with setDot() method", () => {
        let width  = 10;
        let height = 10;
        let world  = new World(width, height);
        let inc    = 0;

        world.on('dot', (x,y,c) => {
            expect(x).toEqual(3);
            expect(y).toEqual(4);
            expect(c).toEqual(2);
            inc++;
        });
        expect(world.setDot(3,4,2)).toEqual(true);
        expect(inc).toEqual(1);

        world.destroy();
    });
    it("Checking 'dot' event with grabDot() method", () => {
        let width  = 10;
        let height = 10;
        let world  = new World(width, height);
        let inc    = 0;

        world.on('dot', (x,y,c) => {
            expect(c).toEqual(2 - inc);
            expect(x).toEqual(3);
            expect(y).toEqual(4);
            inc++;
        });
        expect(world.setDot(3,4,2)).toEqual(true);
        expect(world.grabDot(3,4,1)).toEqual(1);
        expect(inc).toEqual(2);

        world.destroy();
    });
});