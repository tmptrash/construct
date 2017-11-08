describe("common/src/net/plugins/Api", () => {
    const Api   = require('./../../../src/net/Api');
    const MASKS = require('./../../../src/net/Requests').MASKS;
    let   val   = false;

    it("Checking Api class extending and specified request type handling", () => {
        const REQ_TYPE = 2;
        const REQ_ID   = 1;
        class Parent {
            onMessage() {}
        }
        class ApiChild extends Api {
            constructor(parent) {
                super(parent);
                this.api[REQ_TYPE] = this._onAction.bind(this);
            }
            _onAction(reqId, msg) {val = msg}
        }
        let parent = new Parent();
        let api    = new ApiChild(parent);

        parent.onMessage({}, '[' + REQ_TYPE + ',' + ((REQ_ID | MASKS.REQ_MASK) >>> 0) + ',"test"]');
        expect(val).toEqual('test');
        expect(api.parent).toEqual(parent);

        api.destroy();
    });
    it("Checking wrong request type handling", () => {
        const REQ_TYPE = 2;
        const REQ_ID   = 1;
        class Parent1 {
            onMessage() {}
            response() {val = true}
        }
        class ApiChild1 extends Api {
            constructor(parent) {
                super(parent);
                this.api[REQ_TYPE] = this._onAction.bind(this);
            }
            _onAction(reqId, msg) {val = msg}
        }
        let parent = new Parent1();
        let api    = new ApiChild1(parent);

        parent.onMessage({}, '[' + (REQ_TYPE + 1) + ',' + ((REQ_ID | MASKS.REQ_MASK) >>> 0) + ',"test"]');
        expect(val).toEqual(true);
        expect(api.parent).toEqual(parent);

        api.destroy();
    });
});