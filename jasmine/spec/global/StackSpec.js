describe("src/global/Stack", () => {
	let Stack = require('../../../src/global/Stack').default;
    let stack;

    beforeEach(() => stack = new Stack(3));
    afterEach(() => stack = null);

    it("Checking push()/pop() methods", () => {
        expect(stack.push(1)).toEqual(true);
        expect(stack.pop()).toEqual(1);
    });

    it("Checking pop() method edge case", () => {
        expect(stack.pop()).toEqual(null);
    });

    it("Checking push()/pop() methods edge cases", () => {
        expect(stack.push(1)).toEqual(true);
        expect(stack.push(2)).toEqual(true);
        expect(stack.push(3)).toEqual(true);
        expect(stack.push(4)).toEqual(false);
        expect(stack.pop())  .toEqual(3);
        expect(stack.push(4)).toEqual(true);
        expect(stack.push(5)).toEqual(false);
    });

    it("Checking push()/pop() methods edge cases 2", () => {
        expect(stack.push(1)).toEqual(true);
        expect(stack.push(2)).toEqual(true);
        expect(stack.push(3)).toEqual(true);
        expect(stack.pop())  .toEqual(3);
        expect(stack.pop())  .toEqual(2);
        expect(stack.pop())  .toEqual(1);
        expect(stack.pop())  .toEqual(null);
        expect(stack.push(2)).toEqual(true);
    });

    it("Checking Stack creation with zero size", () => {
        stack = new Stack(0);
        expect(stack.push(1)).toEqual(false);
        expect(stack.pop()).toEqual(null);
    });

    it("Checking size() method", () => {
        expect(stack.push(1)).toEqual(true);
        expect(stack.size()).toEqual(1);
    });

    it("Checking clone() method", () => {
        let clonedStack = stack.clone();
        expect(clonedStack.size()).toEqual(stack.size());
    });
    it('Checking clone() method with items', () => {
        for (let i = 0; i < stack.size(); i++) {stack.push(i);}
        let clonedStack = stack.clone();
        for (let i = 0; i < stack.size(); i++) {
            expect(clonedStack.pop()).toEqual(stack.pop());
        }
    })
});