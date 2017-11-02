// TODO: add two events test
describe("common/src/global/Observer", () => {
    let   Observer = require('./../../../common/src/global/Observer');
    let   Config   = require('./../../../client/src/global/Config').Config;
    let   Console  = require('./../../../client/src/global/Console');
    const EVENT    = 0;
    const EVENT2   = 1;
    let   obs;

    beforeEach(() => obs = new Observer(2));
    afterEach(() => obs = null);

    it("Checking empty Observer creation", () => {
        let o    = new Observer();
        let flag = false;

        function handler() {flag = true}
        Console.mode(Config.QUIET_NO);
        o.on(EVENT, handler);
        expect(flag).toEqual(false);
        o.fire(EVENT);
        expect(flag).toEqual(false);
        Console.mode(Config.QUIET_IMPORTANT);
    });
    it("Checking on()/fire() methods", () => {
        let flag = false;

        function handler() {flag = true}

        obs.on(EVENT, handler);
        obs.fire(EVENT);
        expect(flag).toEqual(true);
    });
    it("Checking on()/fire() for two events", () => {
        let flag = false;

        function handler() {flag = true}

        obs.on(EVENT, handler);
        obs.on(EVENT2, handler);
        obs.fire(EVENT);
        flag = false;
        obs.fire(EVENT2);
        expect(flag).toEqual(true);

        flag = false;
        obs.clear();
        obs.fire(EVENT);
        obs.fire(EVENT2);
        expect(flag).toEqual(false);
    });
    it("Checking on() without firing", () => {
        let flag = false;

        function handler() {flag = true}

        obs.on(EVENT, handler);
        expect(flag).toEqual(false);
    });
    it("Checking off() method", () => {
        let flag = false;

        function handler() {flag = true}

        obs.on(EVENT, handler);
        expect(obs.off(EVENT, handler)).toEqual(true);
        obs.fire(EVENT);
        expect(flag).toEqual(false);
    });
    it("Checking off() method with incorrect event id", () => {
        let flag = false;

        function handler() {flag = true}

        obs.on(EVENT, handler);
        expect(obs.off(EVENT2, handler)).toEqual(false);
        obs.fire(EVENT);
        expect(flag).toEqual(true);
    });
    it("Checking double off() method", () => {
        let flag = false;

        function handler() {flag = true}

        obs.on(EVENT, handler);
        expect(obs.off(EVENT, handler)).toEqual(true);
        expect(obs.off(EVENT, handler)).toEqual(false);
        obs.fire(EVENT);
        expect(flag).toEqual(false);
    });
    it("Checking off() with no handlers", () => {
        let flag = false;

        function handler() {flag = true}

        expect(obs.off(EVENT, handler)).toEqual(false);
        obs.fire(EVENT);
        expect(flag).toEqual(false);
    });
    it("Checking two event handlers", () => {
        let inc = 0;

        function handler1() {inc++}
        function handler2() {inc++}

        obs.on(EVENT, handler1);
        obs.on(EVENT, handler2);
        obs.fire(EVENT);
        expect(inc).toEqual(2);
    });
    it("Checking complex behavior", () => {
        let inc = 0;

        function handler1() {inc++}
        function handler2() {inc++}

        obs.on(EVENT, handler1);
        obs.on(EVENT, handler1);
        obs.on(EVENT, handler2);
        expect(obs.off(EVENT, handler1)).toEqual(true);
        obs.fire(EVENT);
        expect(inc).toEqual(2);
        expect(obs.off(EVENT, handler1)).toEqual(true);
        obs.fire(EVENT);
        expect(inc).toEqual(3);
    });
    it("Checking complex behavior 2", () => {
        let inc = 0;

        function handler1() {inc++}
        function handler2() {inc++}

        obs.on(EVENT, handler1);
        obs.on(EVENT, handler1);
        obs.on(EVENT, handler2);
        obs.fire(EVENT);
        obs.fire(EVENT);
        expect(inc).toEqual(6);
    });
    it("Checking clear() method", () => {
        let inc = 0;

        function handler1() {inc++}
        function handler2() {inc++}

        obs.on(EVENT, handler1);
        obs.on(EVENT, handler2);
        obs.clear();
        obs.fire(EVENT);
        expect(inc).toEqual(0);

        obs.on(EVENT, handler1);
        obs.fire(EVENT);
        expect(inc).toEqual(1);
    });
    it("Checking clear() method and fire with incorrect event id", () => {
        let inc = 0;

        function handler() {inc++}

        obs.on(EVENT, handler);
        obs.clear();
        obs.fire(EVENT);
        obs.fire(EVENT2);
        expect(inc).toEqual(0);

        obs.on(EVENT, handler);
        obs.fire(EVENT2);
        expect(inc).toEqual(0);
    });
});