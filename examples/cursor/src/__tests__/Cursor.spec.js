import {cursor} from '../Cursor';
import Store from '../Store'


describe('Cursor', () => {
  var cur, store;
  var initialState = {a: {b: 42}, c: [1, 2, 3]};

  beforeEach(() => {
    store = new Store(initialState);
    cur = cursor(store);
  });

  afterEach(() => {
    cur = null;
    store = null;
  });

  it('get value from refined cursor', () => {
    expect(cur.refine('a', 'b').value()).to.equal(42);
  });

  it('swap at refined cursor reflected in store', () => {
    cur.refine('a', 'b').swap(v => v+1);
    expect(store.value().a.b).to.equal(43);
  });

  it('cursor value semantics', () => {
    cur.refine('a', 'b').swap(v => v+1);
    expect(cur.refine('a','b').value()).to.equal(42);
  });

});
