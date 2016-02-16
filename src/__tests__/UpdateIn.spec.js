/* global describe, it, expect */
import _ from 'lodash';
import {updateIn, merge, push, unshift, splice, assoc, dissoc} from '../update-in';


const val = {a: {b: 0, c: 2}, xs: [1, 2]};

describe('updateIn applies a fn at a path', () => {

  it('apply', () => {
    const v = updateIn(val, ['a', 'b'], v => v+1);
    expect(v.a.b).to.equal(1);
    const v2 = updateIn(val, ['a', 'b'], v => v+10);
    expect(v2.a.b).to.equal(10);
  });

  it('apply with extra args', () => {
    let add = (...args) => args.reduce((a,b)=>a+b, 0);
    const v = updateIn(val, ['a', 'b'], add, 1, 2, 3);
    expect(v.a.b).to.equal(6);
  });

});


describe('updateIn with persistent update combinators', () => {

  it('set', () => {
    const v = updateIn(val, ['a', 'b'], v => 10);
    expect(v.a.b).to.equal(10);
  });

  it('push', () => {
    const v1 = updateIn(val, ['xs'], push, [3]);
    expect(v1.xs).to.deep.equal([1,2,3]);
    const v2 = updateIn(val, ['xs'], push, [99]);
    expect(v2.xs).to.deep.equal([1,2,99]);
  });

  it('unshift', () => {
    const v1 = updateIn(val, ['xs'], unshift, [0]);
    expect(v1.xs).to.deep.equal([0,1,2]);
  });

  it('splice', () => {
    const v1 = updateIn(val, ['xs'], splice, [[1, 1, 20]]);
    expect(v1.xs).to.deep.equal([1,20]);

    const v2 = updateIn(val, ['xs'], splice, [[0, 1, 6, 5], [4, 0, 99, 99]]);
    expect(v2.xs).to.deep.equal([6,5,2,99,99]);
  });

  it('merge', () => {
    const v1 = updateIn(val, ['a'], merge, {c:99, d: 99});
    expect(v1.a).to.deep.equal({b: 0, c: 99, d: 99});
  });

});

describe('assoc', () => {
  describe('in objects', () => {
    it('can assoc a single existing key', () => {
      const updated = updateIn(val, ['a'], assoc, 'b', 1);
      expect(updated.a).to.deep.equal({b: 1, c: 2});
    });

    it('can assoc multiple existing keys', () => {
      const updated = updateIn(val, ['a'], assoc, 'b', 5, 'c', 6);
      expect(updated.a).to.deep.equal({b: 5, c: 6});
    });

    it('can assoc a single new key', () => {
      const updated = updateIn(val, ['a'], assoc, 'd', 4);
      expect(updated.a).to.deep.equal({b: 0, c: 2, d: 4});
    });

    it('can assoc multiple new keys', () => {
      const updated = updateIn(val, ['a'], assoc, 'd', 4, 'e', 6);
      expect(updated.a).to.deep.equal({b: 0, c: 2, d: 4, e: 6});
    });

    it('expects an even number of varargs', () => {
      expect(() => updateIn(val, ['a'], assoc, 'd', 4, 'e')).to.throw(Error, 'assoc expects an even number of arguments');
    });
  });

  describe('in arrays', () => {
    it('can assoc a single existing key', () => {
      const updated = updateIn(val, ['xs'], assoc, 0, 3);
      expect(updated.xs).to.deep.equal([3, 2]);
    });

    it('can assoc multiple existing keys', () => {
      const updated = updateIn(val, ['xs'], assoc, 0, 3, 1, 4);
      expect(updated.xs).to.deep.equal([3, 4]);
    });

    it('can assoc a single new key', () => {
      const updated = updateIn(val, ['xs'], assoc, 2, 3);
      expect(updated.xs).to.deep.equal([1, 2, 3]);
    });

    it('expects an even number of varargs', () => {
      expect(() => updateIn(val, ['xs'], assoc, 1, false, 0)).to.throw(Error, 'assoc expects an even number of arguments');
    });

    it('rejects non-integer keys', () => {
      expect(() => updateIn(val, ['xs'], assoc, 1.5, 'not an int')).to.throw(TypeError, 'assoc expects only integer keys');
    });

    it('expects keys to be between [0, array.length]', () => {
      expect(() => updateIn(val, ['xs'], assoc, -1, 'negative index?')).to.throw(RangeError, 'assoc expects only numeric keys in the range [0, array.length]');
      expect(() => updateIn(val, ['xs'], assoc, 3, 'sparse arrays?')).to.throw(RangeError, 'assoc expects only numeric keys in the range [0, array.length]');
    });
  });
});

describe('dissoc', () => {
  const collections = {
    array: [1, 2, 3, 4, 5, 6, 7],
    object: {foo: 1, bar: 2, baz: 3}
  };

  describe('from objects', () => {
    it('can dissoc a single key', () => {
      const updated = updateIn(collections, ['object'], dissoc, 'bar');
      expect(updated.object).to.deep.equal({foo: 1, baz: 3});
    });

    it('can dissoc multiple keys', () => {
      const updated = updateIn(collections, ['object'], dissoc, 'foo', 'baz');
      expect(updated.object).to.deep.equal({bar: 2});
    });
  });

  describe('from arrays', () => {
    it('can dissoc a single element', () => {
      const updated = updateIn(collections, ['array'], dissoc, 1);
      expect(updated.array).to.deep.equal([1, 3, 4, 5, 6, 7]);
    });

    it('can dissoc multiple elements', () => {
      const updated = updateIn(collections, ['array'], dissoc, 2, 3, 4);
      expect(updated.array).to.deep.equal([1, 2, 6, 7]);
    });

    it('can dissoc non-adjacent elements', () => {
      const updated = updateIn(collections, ['array'], dissoc, 1, 3, 5);
      expect(updated.array).to.deep.equal([1, 3, 5, 7]);
    });
  });
});
