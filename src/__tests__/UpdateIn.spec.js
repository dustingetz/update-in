/* global describe, it, expect */
import _ from 'lodash';
import {updateIn, merge, push, unshift, splice} from '../update-in';


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
