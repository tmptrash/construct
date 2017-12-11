describe("server/src/server/Connections", () => {
    const Connections = require('./Connections');
    let THelper       = require('./../../../common/tests/Helper');

    it("Checking Connections instance creation", () => {
        let cons = new Connections(1);
        cons.destroy();
    });
    it("Checking Connections instance creation with wrong amount of connections", () => {
        expect(() => new Connections(0)).toThrow();
        expect(() => new Connections(-1)).toThrow();
        expect(() => new Connections(-100)).toThrow();
    });
    it("Checking toId() method", () => {
        expect(Connections.toId([1,1])).toEqual('1-1');
        expect(Connections.toId([0,0])).toEqual('0-0');
    });
    it("Checking toId() method with generated region", () => {
        let cons   = new Connections(1);
        let region = cons.getFreeRegion();

        expect(THelper.compare(region, [0, 0])).toEqual(true);
        expect(Connections.toId(region)).toEqual('0-0');
        expect(Connections.toId([1,1])).toEqual('1-1');
        expect(Connections.toId([0,0])).toEqual('0-0');
        cons.destroy();
    });
    it("Checking toRegion() method", () => {
        expect(THelper.compare(Connections.toRegion('1-1'), [1,1])).toEqual(true);
        expect(THelper.compare(Connections.toRegion('1-0'), [1,0])).toEqual(true);
    });
    it("Checking upRegion() method", () => {
        let cons = new Connections(1);

        expect(cons.upRegion([0,0]  )).toEqual(null);
        expect(cons.upRegion([1,2]  )).toEqual(null);
        expect(cons.upRegion([1,0]  )).toEqual(null);
        expect(cons.upRegion([1,1]  )).toEqual(null);
        expect(cons.upRegion([-1,0] )).toEqual(null);
        expect(cons.upRegion([-1,1] )).toEqual(null);
        expect(cons.upRegion([-1,-1])).toEqual(null);

        cons.destroy();
    });
    it("Checking upRegion() method 2", () => {
        let cons = new Connections(4);

        expect(cons.upRegion([0,0]  )).toEqual(null);
        expect(cons.upRegion([1,2]  )).toEqual([1,1]);
        expect(cons.upRegion([1,1]  )).toEqual([1,0]);
        expect(cons.upRegion([0,1]  )).toEqual([0,0]);
        expect(cons.upRegion([2,1]  )).toEqual(null);
        expect(cons.upRegion([1,0]  )).toEqual(null);
        expect(cons.upRegion([-1,0] )).toEqual(null);
        expect(cons.upRegion([-1,1] )).toEqual(null);
        expect(cons.upRegion([-1,-1])).toEqual(null);
        expect(cons.upRegion([2,2]  )).toEqual(null);

        cons.destroy();
    });
    it("Checking rightRegion() method", () => {
        let cons = new Connections(1);

        expect(cons.rightRegion([0,0]  )).toEqual(null);
        expect(cons.rightRegion([1,2]  )).toEqual(null);
        expect(cons.rightRegion([1,0]  )).toEqual(null);
        expect(cons.rightRegion([1,1]  )).toEqual(null);
        expect(cons.rightRegion([2,0]  )).toEqual(null);
        expect(cons.rightRegion([2,1]  )).toEqual(null);
        expect(cons.rightRegion([2,-1] )).toEqual(null);
        expect(cons.rightRegion([1,-1] )).toEqual(null);
        expect(cons.rightRegion([-1,-1])).toEqual(null);

        cons.destroy();
    });
    it("Checking rightRegion() method 2", () => {
        let cons = new Connections(4);

        expect(cons.rightRegion([0,0]  )).toEqual([1,0]);
        expect(cons.rightRegion([1,2]  )).toEqual(null);
        expect(cons.rightRegion([2,0]  )).toEqual(null);
        expect(cons.rightRegion([2,1]  )).toEqual(null);
        expect(cons.rightRegion([1,1]  )).toEqual(null);
        expect(cons.rightRegion([0,1]  )).toEqual([1,1]);
        expect(cons.rightRegion([-1,1] )).toEqual([0,1]);
        expect(cons.rightRegion([2,-1] )).toEqual(null);
        expect(cons.rightRegion([1,-1] )).toEqual(null);
        expect(cons.rightRegion([-1,-1])).toEqual(null);

        cons.destroy();
    });
    it("Checking downRegion() method", () => {
        let cons = new Connections(1);

        expect(cons.downRegion([0,0]  )).toEqual(null);
        expect(cons.downRegion([1,2]  )).toEqual(null);
        expect(cons.downRegion([1,0]  )).toEqual(null);
        expect(cons.downRegion([1,1]  )).toEqual(null);
        expect(cons.downRegion([2,0]  )).toEqual(null);
        expect(cons.downRegion([2,1]  )).toEqual(null);
        expect(cons.downRegion([2,-1] )).toEqual(null);
        expect(cons.downRegion([1,-1] )).toEqual(null);
        expect(cons.downRegion([-1,-1])).toEqual(null);

        cons.destroy();
    });
    it("Checking downRegion() method 2", () => {
        let cons = new Connections(4);

        expect(cons.downRegion([0,0]  )).toEqual([0,1]);
        expect(cons.downRegion([1,2]  )).toEqual(null);
        expect(cons.downRegion([1,0]  )).toEqual([1,1]);
        expect(cons.downRegion([1,1]  )).toEqual(null);
        expect(cons.downRegion([2,0]  )).toEqual(null);
        expect(cons.downRegion([2,1]  )).toEqual(null);
        expect(cons.downRegion([2,-1] )).toEqual(null);
        expect(cons.downRegion([1,-1] )).toEqual([1,0]);
        expect(cons.downRegion([0,-1] )).toEqual([0,0]);
        expect(cons.downRegion([-1,-1])).toEqual(null);

        cons.destroy();
    });
    it("Checking leftRegion() method", () => {
        let cons = new Connections(1);

        expect(cons.downRegion([0,0]  )).toEqual(null);
        expect(cons.downRegion([1,2]  )).toEqual(null);
        expect(cons.downRegion([1,0]  )).toEqual(null);
        expect(cons.downRegion([1,1]  )).toEqual(null);
        expect(cons.downRegion([2,0]  )).toEqual(null);
        expect(cons.downRegion([2,1]  )).toEqual(null);
        expect(cons.downRegion([2,-1] )).toEqual(null);
        expect(cons.downRegion([1,-1] )).toEqual(null);
        expect(cons.downRegion([-1,-1])).toEqual(null);

        cons.destroy();
    });
    it("Checking leftRegion() method 2", () => {
        let cons = new Connections(4);

        expect(cons.downRegion([0,0]  )).toEqual([0,1]);
        expect(cons.downRegion([1,2]  )).toEqual(null);
        expect(cons.downRegion([1,0]  )).toEqual([1,1]);
        expect(cons.downRegion([1,1]  )).toEqual(null);
        expect(cons.downRegion([2,0]  )).toEqual(null);
        expect(cons.downRegion([2,1]  )).toEqual(null);
        expect(cons.downRegion([2,-1] )).toEqual(null);
        expect(cons.downRegion([1,-1] )).toEqual([1,0]);
        expect(cons.downRegion([-1,-1])).toEqual(null);

        cons.destroy();
    });
    it('Checking getConnection() method', () => {
        const cons = new Connections(1);

        expect(cons.getConnection([1,1])).toEqual(null);
        expect(cons.getConnection([0,0]).sock).toEqual(null);
        expect(cons.getConnection([2,2])).toEqual(null);

        cons.destroy();
    });
    it('Checking setData() method', () => {
        const cons = new Connections(1);

        cons.setData([0,0], 'active', true);
        expect(cons.getConnection([0,0]).active).toEqual(true);
        expect(cons.getConnection([0,0]).sock).toEqual(null);
        expect(cons.getConnection([1,1])).toEqual(null);
        expect(cons.getConnection([0,1])).toEqual(null);
        expect(cons.getConnection([1,0])).toEqual(null);
        expect(cons.getConnection([2,1])).toEqual(null);
        expect(cons.getConnection([2,2])).toEqual(null);
        expect(cons.getConnection([1,2])).toEqual(null);

        cons.setData([0,0], 'active', false);
        expect(cons.getConnection([1,1])).toEqual(null);
        expect(cons.getConnection([0,1])).toEqual(null);
        expect(cons.getConnection([0,0]).active).toEqual(false);
        expect(cons.getConnection([0,0]).sock).toEqual(null);
        expect(cons.getConnection([1,0])).toEqual(null);
        expect(cons.getConnection([2,1])).toEqual(null);
        expect(cons.getConnection([2,2])).toEqual(null);
        expect(cons.getConnection([1,2])).toEqual(null);

        cons.clearData([0,0]);
        expect(cons.getConnection([1,1])).toEqual(null);
        expect(cons.getConnection([0,1])).toEqual(null);
        expect(cons.getConnection([0,0]).active).toEqual(undefined);
        expect(cons.getConnection([0,0]).sock).toEqual(null);
        expect(cons.getConnection([1,0])).toEqual(null);
        expect(cons.getConnection([2,1])).toEqual(null);
        expect(cons.getConnection([2,2])).toEqual(null);
        expect(cons.getConnection([1,2])).toEqual(null);

        cons.destroy();
    });
    it('Checking setData() method 2', () => {
        const cons = new Connections(9);

        cons.setData([1,1], 'active', true);
        expect(cons.getConnection([0,0]).active).toEqual(undefined);
        expect(cons.getConnection([1,1]).active).toEqual(true);
        expect(cons.getConnection([0,1]).active).toEqual(undefined);
        expect(cons.getConnection([1,0]).active).toEqual(undefined);
        expect(cons.getConnection([2,1]).active).toEqual(undefined);
        expect(cons.getConnection([2,2]).active).toEqual(undefined);
        expect(cons.getConnection([1,2]).active).toEqual(undefined);

        cons.setData([1,1], 'active', false);
        expect(cons.getConnection([0,0]).active).toEqual(undefined);
        expect(cons.getConnection([1,1]).active).toEqual(false);
        expect(cons.getConnection([0,1]).active).toEqual(undefined);
        expect(cons.getConnection([1,0]).active).toEqual(undefined);
        expect(cons.getConnection([2,1]).active).toEqual(undefined);
        expect(cons.getConnection([2,2]).active).toEqual(undefined);
        expect(cons.getConnection([1,2]).active).toEqual(undefined);

        cons.clearData([1,1]);
        expect(cons.getConnection([0,0]).active).toEqual(undefined);
        expect(cons.getConnection([1,1]).active).toEqual(undefined);
        expect(cons.getConnection([0,1]).active).toEqual(undefined);
        expect(cons.getConnection([1,0]).active).toEqual(undefined);
        expect(cons.getConnection([2,1]).active).toEqual(undefined);
        expect(cons.getConnection([2,2]).active).toEqual(undefined);
        expect(cons.getConnection([1,2]).active).toEqual(undefined);

        cons.destroy();
    });
    it('Checking clearData() method', () => {
        const cons = new Connections(1);

        cons.setData([0,0], 'prop', true);
        expect(cons.getConnection([0,0]).prop).toEqual(true);
        cons.clearData([0,0]);
        expect(cons.getConnection([0,0]).prop).toEqual(undefined);
        cons.setData([0,0], 'prop', true);
        cons.setData([0,0], 'prop', 1);
        expect(cons.getConnection([0,0]).prop).toEqual(1);

        cons.destroy();
    });
    it('Checking getFreeRegion() method', () => {
        const cons = new Connections(1);

        expect(cons.getFreeRegion()).toEqual([0,0]);
        expect(cons.getFreeRegion()).toEqual([0,0]);
        cons.setData([0,0], 'sock', true);
        expect(cons.getFreeRegion()).toEqual(null);
        cons.clearData([0,0]);
        expect(cons.getFreeRegion()).toEqual([0,0]);

        cons.destroy();
    });
});















