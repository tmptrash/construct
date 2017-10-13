describe("server/src/server/Connections", () => {
    const Connections = require('./../../src/server/Connections');
    let THelper       = require('./../../../common/tests/Helper');

    it("Checking Connections instance creation", () => {
        let cons = new Connections(1);
        cons.destroy();
    });
    it("Checking toId() method", () => {
        expect(Connections.toId([1,1])).toEqual('1-1');
        expect(Connections.toId([0,0])).toEqual('0-0');
    });
    it("Checking toRegion() method", () => {
        expect(THelper.compare(Connections.toRegion('1-1'), ['1','1'])).toEqual(true);
        expect(THelper.compare(Connections.toRegion('1-0'), ['1','0'])).toEqual(true);
    });
});