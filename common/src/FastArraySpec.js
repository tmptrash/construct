describe('common/src/FastArray', () => {
    const FastArray = require('./FastArray');
    const size      = 10;
    let   fa;

    beforeEach(() => fa = new FastArray(size));
    afterEach (() => {fa.destroy(); fa = null});

    it('Checking creation', () => {
        expect(fa.size).toEqual(size);
        expect(fa.length).toEqual(0);
        expect(fa.freeIndex).toEqual(size - 1);
    });

    it('Checking destroy', () => {
        const fSize = 3;
        const fa1   = new FastArray(fSize);
        expect(fa1.size).toEqual(fSize);
        fa1.destroy();
        expect(fa1.size).toEqual(null);
    });

    it('Checking length property', () => {
        fa.add({});
        expect(fa.length).toEqual(1);
        fa.get(size - 1);
        expect(fa.length).toEqual(1);
        fa.del(size - 1);
        expect(fa.length).toEqual(0);
        fa.resize(size * 2);
        expect(fa.length).toEqual(0);
        fa.add({});
        expect(fa.length).toEqual(1);
        fa.resize(size);
        expect(fa.length).toEqual(0);
        fa.add({});
        fa.add({});
        expect(fa.length).toEqual(2);
    });

    it('Checking size property', () => {
        expect(fa.size).toEqual(size);
        fa.add({});
        expect(fa.size).toEqual(size);
        fa.del(size - 1);
        expect(fa.size).toEqual(size);
    });
});