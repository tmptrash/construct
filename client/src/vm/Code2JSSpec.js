const Operators = require('./Operators');
const Code2JS   = require('./Code2JS');
const OConfig   = require('./../manager/plugins/organisms/Config');
const Helper    = require('./../../../common/src/Helper');

describe("client/src/vm/Operators", () => {
    const h = Helper.toHexNum;
    let cbpv;
    let ccb;
    let ctjs;
    let offs;

    beforeAll(() => {
        cbpv = OConfig.codeBitsPerVar;
        OConfig.codeBitsPerVar = 2;
        ccb = OConfig.codeConstBits;
        OConfig.codeConstBits = 3;
        Operators.compile();
    });
    afterAll(() => {
        OConfig.codeBitsPerVar = cbpv;
        OConfig.codeConstBits = ccb;
    });
    beforeEach(() => {
        ctjs = new Code2JS();
    });
    afterEach(() => {
        ctjs.destroy();
        ctjs = null;
    });

    describe('var() operator', () => {
        it('Checks simplpe var assign', () => {
            expect(ctjs.format([h('100000 00 01 0000000000000000000000')], '\n', true)).toEqual('v0=v1');
        });
    });
});