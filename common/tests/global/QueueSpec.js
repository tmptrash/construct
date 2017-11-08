describe('common/src/share/Queue', () => {
    let Queue = require('./../../src/Queue');
    let q;

    beforeEach(() => q = new Queue());
    afterEach(() => q = null);

    it('Checking empty queue', () => {
        expect(q.size).toEqual(0);
    });
    it('Checking adding', () => {
        q.add(23);
        expect(q.size).toEqual(1);
        expect(q.first.val).toEqual(23);

        q.add(2);
        expect(q.size).toEqual(2);
        expect(q.first.val).toEqual(23);
        expect(q.first.next.val).toEqual(2);
    });

    it('Checking last property', () => {
        expect(q.size).toEqual(0);
        expect(q.last.val).toEqual(null);

        q.add(23);
        expect(q.last.val).toEqual(23);
        q.add(78);
        expect(q.first.val).toEqual(23);
        expect(q.last.val).toEqual(78);

        q.add(2);
        expect(q.size).toEqual(3);
        expect(q.first.val).toEqual(23);
        expect(q.last.val).toEqual(2);

        q.del(q.last);
        expect(q.size).toEqual(2);
        expect(q.last.val).toEqual(78);

        q.del(q.last);
        expect(q.size).toEqual(1);
        expect(q.last.val).toEqual(23);

        q.del(q.last);
        expect(q.size).toEqual(0);
        expect(q.last.val).toEqual(null);

        q.del(q.last);
        expect(q.size).toEqual(0);
        expect(q.last.val).toEqual(null);
    });

    it('Checking deletion', () => {
        q.add(123);
        expect(q.first.val).toEqual(123);
        q.del(q.first);
        expect(q.size).toEqual(0);
        expect(q.first.val !== 123).toEqual(true);

        q.add(12);
        expect(q.first.val).toEqual(12);
        q.del(q.first);
        expect(q.size).toEqual(0);

        q.del(q.first);
        expect(q.size).toEqual(0);
        expect(q.first.val !== 12).toEqual(true);
    });
    it('Checking deletion of two elements', () => {
        q.add(123);
        q.add(-4);
        expect(q.first.val).toEqual(123);
        expect(q.first.next.val).toEqual(-4);
        expect(q.size).toEqual(2);
        expect(q.get(1).val).toEqual(-4);

        q.del(q.first);
        expect(q.size).toEqual(1);
        expect(q.first.val === -4).toEqual(true);

        q.del(q.first);
        expect(q.size).toEqual(0);
        expect(q.first.val === null).toEqual(true);
    });
    
    it('Checking size field', () => {
        expect(q.size).toEqual(0);
        q.add(1);
        expect(q.size).toEqual(1);
        q.add(2);
        expect(q.size).toEqual(2);
        q.del(q.first);
        expect(q.size).toEqual(1);
        q.add(3);
        expect(q.size).toEqual(2);
        q.del(q.first);
        expect(q.size).toEqual(1);
        q.del(q.first);
        expect(q.size).toEqual(0);
        q.del(q.first);
        expect(q.size).toEqual(0);
        q.add(5);
        expect(q.size).toEqual(1)
    });

    it('Checking connections', () => {
        let first = q.first;

        expect(first.prev).toEqual(null);
        expect(first.next).toEqual(null);

        q.add(1);
        expect(first.prev).toEqual(null);
        expect(first.next).toEqual(null);
        expect(first === q.first).toEqual(true);

        q.add(2);
        expect(first.prev).toEqual(null);
        expect(first === q.first).toEqual(true);
        expect(first.next === q.first.next).toEqual(true);
        expect(first === q.first.next.prev).toEqual(true);

        q.add(3);
        expect(first.prev).toEqual(null);
        expect(first === q.first).toEqual(true);
        expect(first.next === q.first.next).toEqual(true);
        expect(first.next === q.first.next.next.prev).toEqual(true);
        expect(first === q.first.next.prev).toEqual(true);
        expect(first.next.next.next).toEqual(null);
    });

    it('Checking getting item by index', () => {
        for (let i=0; i<10; i++) {q.add(i)}
        expect(q.get(3).val).toEqual(3);
        expect(q.get(0).val).toEqual(0);
        expect(q.get(9).val).toEqual(9);
        expect(q.get(10)).toEqual(null);
    });
});
