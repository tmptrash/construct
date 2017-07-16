describe("src/organism/Operators", () => {
    let Operators = require('../../../src/organism/Operators').default;
    let Helper    = require('../../../src/global/Helper').default;
    let rand;

    beforeEach(() => rand = Helper.rand);
    afterEach(() => Helper.rand = rand);

    it("Checking onVar() method", () => {
        let ops = new Operators([]);

        Helper.rand = () => 123;
        expect(ops.onVar(0x00ffffff)).toEqual('v3=123');
        expect(ops.onVar(0x000fffff)).toEqual('v0=v0');
        expect(ops.onVar(0x001fffff)).toEqual('v0=v1');
    });

    it("Checking onCondition() method", () => {
        let ops = new Operators([]);

        expect(ops.onCondition(0x01ffffff), 0, 1).toEqual('if(v3!=v3){');
        expect(ops.onCondition(0x011fffff), 0, 1).toEqual('if(v0!=v1){');
        expect(ops.onCondition(0x011abfff), 0, 1).toEqual('if(v0==v1){');
    });

    it("Checking onLoop() method", () => {
        let ops = new Operators([]);

        expect(ops.onLoop(0x02ffffff), 0, 1).toEqual('for(v3=v3;v3<v3;v3++){yield');
        expect(ops.onLoop(0x028fffff), 0, 1).toEqual('for(v2=v0;v2<v3;v2++){yield');
        expect(ops.onLoop(0x0287ffff), 0, 1).toEqual('for(v2=v0;v2<v1;v2++){yield');
    });

    it("Checking onOperator() method", () => {
        let ops = new Operators([]);

        //console.log(ops.onOperator(0xff1a3fff, 0, 1));
        expect(ops.onOperator(0x031a3fff), 0, 1).toEqual('v0=v1>>v2');
        expect(ops.onOperator(0x031a3fff), 0, 1).toEqual('for(v2=v0;v2<v3;v2++){yield');
        //expect(ops.onOperator(0x0287ffff), 0, 1).toEqual('for(v2=v0;v2<v1;v2++){yield');
    });
});