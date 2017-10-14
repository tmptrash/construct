describe("common/src/net/plugins/Api", () => {
    const Api   = require('./../../../src/net/plugins/Api');
    const MASKS = require('./../../../src/global/Requests').MASKS;
    let   val   = false;

    it("Checking Api class extending", () => {
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
});