describe("server/src/server/Connections", () => {
    const Connections = require('./../../src/server/server/Connections');
    let THelper       = require('./../../../common/tests/Helper');

    it("Checking Connections instance creation", () => {
        let cons = new Connections(1);
        cons.destroy();
    });
    it("Checking toId() method", () => {
        expect(Connections.toId([1,1])).toEqual('1-1');
        expect(Connections.toId([0,0])).toEqual('0-0');
    });
    it("Checking toId() method with generated region", () => {
        let cons   = new Connections(1);
        let region = cons.getFreeRegion();

        expect(THelper.compare(region, [1, 1])).toEqual(true);
        expect(Connections.toId(region)).toEqual('1-1');
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

        expect(THelper.compare(cons.upRegion([1,1]), [1,0])).toEqual(true);
        expect(THelper.compare(cons.upRegion([1,2]), [1,1])).toEqual(true);
        expect(cons.upRegion([0,0]) === null).toEqual(true);
        expect(cons.upRegion([1,0]) === null).toEqual(true);
        expect(cons.upRegion([-1,0]) === null).toEqual(true);
        expect(THelper.compare(cons.upRegion([-1,1]), [-1,0])).toEqual(true);

        cons.destroy();
    });
    it("Checking rightRegion() method", () => {
        let cons = new Connections(1);

        expect(THelper.compare(cons.rightRegion([1,1]), [2,1])).toEqual(true);
        expect(THelper.compare(cons.rightRegion([1,2]), [2,2])).toEqual(true);
        expect(cons.rightRegion([2,0]) === null).toEqual(true);
        expect(cons.rightRegion([2,1]) === null).toEqual(true);
        expect(cons.rightRegion([2,-1]) === null).toEqual(true);
        expect(THelper.compare(cons.rightRegion([1,-1]), [2,-1])).toEqual(true);

        cons.destroy();
    });
    it("Checking downRegion() method", () => {
        let cons = new Connections(1);

        expect(THelper.compare(cons.downRegion([1,1]), [1,2])).toEqual(true);
        expect(THelper.compare(cons.downRegion([1,0]), [1,1])).toEqual(true);
        expect(cons.downRegion([0,2]) === null).toEqual(true);
        expect(cons.downRegion([1,2]) === null).toEqual(true);
        expect(cons.downRegion([-1,2]) === null).toEqual(true);
        expect(THelper.compare(cons.downRegion([-1,1]), [-1,2])).toEqual(true);

        cons.destroy();
    });
    it("Checking leftRegion() method", () => {
        let cons = new Connections(1);

        expect(THelper.compare(cons.leftRegion([1,1]), [0,1])).toEqual(true);
        expect(THelper.compare(cons.leftRegion([2,1]), [1,1])).toEqual(true);
        expect(cons.leftRegion([0,0]) === null).toEqual(true);
        expect(cons.leftRegion([0,1]) === null).toEqual(true);
        expect(cons.leftRegion([0,-1]) === null).toEqual(true);
        expect(THelper.compare(cons.leftRegion([1,-1]), [0,-1])).toEqual(true);

        cons.destroy();
    });
    it('Checking getConnection() method', () => {
        const cons = new Connections(1);

        expect(cons.getConnection([1,1]).sock).toEqual(null);
        expect(cons.getConnection([0,0]).sock).toEqual(null);
        expect(cons.getConnection([2,2]).sock).toEqual(null);

        cons.destroy();
    });
    it('Checking setData() method', () => {
        const cons = new Connections(1);

        cons.setData([1,1], 'active', true);
        expect(cons.getConnection([1,1]).active).toEqual(true);
        expect(cons.getConnection([0,1]).active).toEqual(undefined);
        expect(cons.getConnection([0,0]).active).toEqual(undefined);
        expect(cons.getConnection([1,0]).active).toEqual(undefined);
        expect(cons.getConnection([2,1]).active).toEqual(undefined);
        expect(cons.getConnection([2,2]).active).toEqual(undefined);
        expect(cons.getConnection([1,2]).active).toEqual(undefined);

        cons.setData([1,1], 'active', false);
        expect(cons.getConnection([1,1]).active).toEqual(false);
        expect(cons.getConnection([0,1]).active).toEqual(undefined);
        expect(cons.getConnection([0,0]).active).toEqual(undefined);
        expect(cons.getConnection([1,0]).active).toEqual(undefined);
        expect(cons.getConnection([2,1]).active).toEqual(undefined);
        expect(cons.getConnection([2,2]).active).toEqual(undefined);
        expect(cons.getConnection([1,2]).active).toEqual(undefined);

        cons.clearData([1,1]);
        expect(cons.getConnection([1,1]).active).toEqual(undefined);
        expect(cons.getConnection([0,1]).active).toEqual(undefined);
        expect(cons.getConnection([0,0]).active).toEqual(undefined);
        expect(cons.getConnection([1,0]).active).toEqual(undefined);
        expect(cons.getConnection([2,1]).active).toEqual(undefined);
        expect(cons.getConnection([2,2]).active).toEqual(undefined);
        expect(cons.getConnection([1,2]).active).toEqual(undefined);

        cons.destroy();
    });
    it('Checking clearData() method', () => {
        const cons = new Connections(1);

        cons.setData([1,1], 'prop', true);
        expect(cons.getConnection([1,1]).prop).toEqual(true);
        cons.clearData([1,1]);
        expect(cons.getConnection([1,1]).prop).toEqual(undefined);
        cons.setData([1,1], 'prop', true);
        cons.setData([1,1], 'prop', 1);
        expect(cons.getConnection([1,1]).prop).toEqual(1);

        cons.destroy();
    });
    it('Checking getFreeRegion() method', () => {
        const cons = new Connections(1);

        expect(THelper.compare(cons.getFreeRegion(), [1,1])).toEqual(true);
        expect(THelper.compare(cons.getFreeRegion(), [1,1])).toEqual(true);
        cons.setData([1,1], 'sock', true);
        expect(cons.getFreeRegion()).toEqual(null);
        cons.clearData([1,1]);
        expect(THelper.compare(cons.getFreeRegion(), [1,1])).toEqual(true);

        cons.destroy();
    });
});















