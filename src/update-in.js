import {default as persistentUpdate} from 'react-addons-update';
import isEqual from 'deep-equal';


export function merge (a, b) {
  return persistentUpdate(a, {$merge: b});
}

export function push (as, bs) {
  return persistentUpdate(as, {$push: bs});
}

export function unshift (as, bs) {
  return persistentUpdate(as, {$unshift: bs});
}

export function splice (as, splices) {
  // persistentUpdate([12, 17, 15], {$splice: [[1, 1, 13, 14]]}) => [12, 13, 14, 15]
  return persistentUpdate(as, {$splice: splices});
}

export function assoc(coll, ...kvs) {
  if (kvs.length % 2 !== 0) throw new Error('assoc expects an even number of arguments');
  const ps = pairs(kvs);

  if (Array.isArray(coll)) {
    ps.forEach(([k, v]) => {
      if (! (typeof k === 'number' && parseInt(k, 10) === k)) throw new TypeError('assoc expects only integer keys');
      if (k < 0 || k > coll.length) throw new RangeError('assoc expects only numeric keys in the range [0, array.length]');
    });
  }

  return persistentUpdate(coll, {$apply: o => ps.reduce((acc, [k, v]) => { acc[k] = v; return acc; }, o)});
}

export function dissoc (coll, ...keys) {
  if (Array.isArray(coll)) {
    return persistentUpdate(coll, {$apply: a => a.filter((v,i) => keys.indexOf(i) === -1)});
  } else {
    return persistentUpdate(coll, {$apply: o => {
      keys.forEach(k => delete o[k]);
      return o;
    }});
  }
}

/**
 * Thin wrapper over react-addons-update to apply a function at path
 * preserving other references.
 */
export function updateIn (rootVal, paths, f, ...args) {
  let ff = (v) => f.apply(null, [v].concat(args));

  var newRootVal;
  if (paths.length > 0) {
    const command = rootAt(paths, {$apply: ff});
    newRootVal = persistentUpdate(rootVal, command);
  }
  else if (paths.length === 0) {
    newRootVal = ff(rootVal);
  }

  // would be better to do this valEq check on just the leaf
  return isEqual(rootVal, newRootVal)
      ? rootVal // preserve === if same value
      : newRootVal;
}



// Helper methods for forming react-addons-update commands.

/**
 * @param leafVal e.g. {$apply: f}
 * @param paths e.g. ['x', 'y', 'z']
 * @returns e.g. {x: {y: {z: {$apply: f}}}
 */
function rootAt (paths, leafVal) {
  return paths.reduceRight(unDeref, leafVal)
}


/**
 * @param obj e.g {$apply: f}
 * @param key e.g. 'foo'
 * @returns e.g. {foo: {$apply: f}}
 */
function unDeref(obj, key) { // aka un-get
  var nextObj = {};
  nextObj[key] = obj;
  return nextObj;
}

// Other helper functions

/**
 *
 * @param array e.g. [1, 2, 3, 4, 5, 6]
 * @returns {Array} e.g. [[1, 2], [3, 4], [5, 6]]
 */
function pairs (array) {
  let index = 0;
  let pairs = [];

  while (index < array.length) {
    pairs.push([array[index++], array[index++]]);
  }

  return  pairs;
}
