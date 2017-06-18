describe("src/global/Observer", () => {
    let Observer = require('../../../src/global/Observer').default;
    let obs;

    beforeEach(() => obs = new Observer());

    it("Checking on()/fire() methods", () => {
        let flag = false;

        function handler() {flag = true;}

        obs.on('event', handler);
        expect(obs.fire('event')).toEqual(true);
        expect(flag).toEqual(true);
    });
    it("Checking on() without firing", () => {
        let flag = false;

        function handler() {flag = true;}

        obs.on('event', handler);
        expect(flag).toEqual(false);
    });
    it("Checking off() method", () => {
        let flag = false;

        function handler() {flag = true;}

        obs.on('event', handler);
        expect(obs.off('event', handler)).toEqual(true);
        expect(obs.fire('event')).toEqual(false);
        expect(flag).toEqual(false);
    });
    it("Checking double off() method", () => {
        let flag = false;

        function handler() {flag = true;}

        obs.on('event', handler);
        expect(obs.off('event', handler)).toEqual(true);
        expect(obs.off('event', handler)).toEqual(false);
        expect(obs.fire('event')).toEqual(false);
        expect(flag).toEqual(false);
    });
    it("Checking off() with no handlers", () => {
        let flag = false;

        function handler() {flag = true;}

        expect(obs.off('event', handler)).toEqual(false);
        expect(obs.fire('event')).toEqual(false);
        expect(flag).toEqual(false);
    });
    it("Checking two event handlers", () => {
        let inc = 0;

        function handler1() {inc++;}
        function handler2() {inc++;}

        obs.on('event', handler1);
        obs.on('event', handler2);
        expect(obs.fire('event')).toEqual(true);
        expect(inc).toEqual(2);
    });
    it("Checking complex behavior", () => {
        let inc = 0;

        function handler1() {inc++;}
        function handler2() {inc++;}

        obs.on('event', handler1);
        obs.on('event', handler1);
        obs.on('event', handler2);
        expect(obs.off('event', handler1)).toEqual(true);
        expect(obs.fire('event')).toEqual(true);
        expect(inc).toEqual(2);
        expect(obs.off('event', handler1)).toEqual(true);
        expect(obs.fire('event')).toEqual(true);
        expect(inc).toEqual(3);
    });
    it("Checking complex behavior 2", () => {
        let inc = 0;

        function handler1() {inc++;}
        function handler2() {inc++;}

        obs.on('event', handler1);
        obs.on('event', handler1);
        obs.on('event', handler2);
        expect(obs.fire('event')).toEqual(true);
        expect(obs.fire('event')).toEqual(true);
        expect(inc).toEqual(6);
    });
    it("Checking clear() method", () => {
        let inc = 0;

        function handler1() {inc++;}
        function handler2() {inc++;}

        obs.on('event', handler1);
        obs.on('event', handler2);
        obs.clear();
        expect(obs.fire('event')).toEqual(false);
        expect(inc).toEqual(0);

        obs.on('event', handler1);
        expect(obs.fire('event')).toEqual(true);
        expect(inc).toEqual(1);
    });
});