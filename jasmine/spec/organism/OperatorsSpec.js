describe("src/organism/Operators", () => {
    let Operators = require('../../../src/organism/Operators').default;
    let Helper    = require('../../../src/global/Helper').default;

    it("Checking onVar() method", () => {
        let ops  = new Operators([]);
        let rand = Helper.rand

        Helper.rand = () => 123;
        expect(ops.onVar(0x00ffffff)).toEqual('v3=123');
        expect(ops.onVar(0x000fffff)).toEqual('v0=v0');
        expect(ops.onVar(0x001fffff)).toEqual('v0=v1');

        Helper.rand = rand;
    });

    it("Checking onCondition() method", () => {
        let ops = new Operators([]);

        expect(ops.onCondition(0x01ffffff), 0, 1).toEqual('if(v3!=v3){');
        expect(ops.onCondition(0x011fffff), 0, 1).toEqual('if(v0!=v1){');
        expect(ops.onCondition(0x011abfff), 0, 1).toEqual('if(v0==v1){');
        expect(ops.onCondition(0x01ffffff), 0, 1).toEqual('if(v3!=v3){');
    });

    it("Checking onLoop() method", () => {
        let ops = new Operators([]);

        expect(ops.onLoop(0x02ffffff), 0, 1).toEqual('for(v3=v3;v3<v3;v3++){yield');
        expect(ops.onLoop(0x028fffff), 0, 1).toEqual('for(v2=v0;v2<v3;v2++){yield');
        expect(ops.onLoop(0x0287ffff), 0, 1).toEqual('for(v2=v0;v2<v1;v2++){yield');
        expect(ops.onLoop(0x02ffffff), 0, 1).toEqual('for(v3=v3;v3<v3;v3++){yield');
    });

    it("Checking onOperator() method", () => {
        let ops = new Operators([]);

        expect(ops.onOperator(0x031a3fff), 0, 1).toEqual('v0=v1>>v2');
        expect(ops.onOperator(0x036c7fff), 0, 1).toEqual('v1=v2-v3');
        expect(ops.onOperator(0x036fffff), 0, 1).toEqual('v1=v2<=v3');
        expect(ops.onOperator(0x03ffffff), 0, 1).toEqual('v3=v3<=v3');
    });

    it("Checking onNot() method", () => {
        let ops = new Operators([]);

        expect(ops.onNot(0x041fffff), 0, 1).toEqual('v0=!v1');
        expect(ops.onNot(0x046fffff), 0, 1).toEqual('v1=!v2');
        expect(ops.onNot(0x04ffffff), 0, 1).toEqual('v3=!v3');
    });

    it("Checking onPi() method", () => {
        let ops = new Operators([]);

        expect(ops.onPi(0x053fffff), 0, 1).toEqual('v0=pi');
        expect(ops.onPi(0x057fffff), 0, 1).toEqual('v1=pi');
        expect(ops.onPi(0x05ffffff), 0, 1).toEqual('v3=pi');
    });

    it("Checking onTrig() method", () => {
        let ops = new Operators([]);

        expect(ops.onTrig(0x061bffff), 0, 1).toEqual('v0=Math.tan(v1)');
        expect(ops.onTrig(0x0663ffff), 0, 1).toEqual('v1=Math.sin(v2)');
        expect(ops.onTrig(0x06ffffff), 0, 1).toEqual('v3=Math.abs(v3)');
    });

    it("Checking onLookAt() method", () => {
        let ops = new Operators([]);

        expect(ops.onLookAt(0x071bffff), 0, 1).toEqual('v0=org.lookAt(v1,v2)');
        expect(ops.onLookAt(0x076fffff), 0, 1).toEqual('v1=org.lookAt(v2,v3)');
        expect(ops.onLookAt(0x07ffffff), 0, 1).toEqual('v3=org.lookAt(v3,v3)');
    });
});