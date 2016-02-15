# update-in
Persistent functional object updates on vanilla js data structures (wraps react-addons-update)

## Quick Examples
```javascript
import {updateIn, merge, push, unshift, splice, assoc, dissoc} from 'update-in';

const val = {a: {b: 0, c: 2}, xs: [1, 2]};

updateIn(val, ['a', 'b'], v => v+1)                            // => {a: {b: 1, c: 2}, xs: [1, 2]}
updateIn(val, ['a', 'b'], v => v+10)                           // => {a: {b: 10, c: 2}, xs: [1, 2]}

let add = (...args) => args.reduce((a,b)=>a+b, 0);
updateIn(val, ['a', 'b'], add, 1, 2, 3)                        // => {a: {b: 6, c: 2}, xs: [1, 2]}

updateIn(val, ['a', 'b'], v => 99)                             // => {a: {b: 99, c: 2}, xs: [1, 2]}

merge({x: 1, y: 1}, {y: 2, z: 2})                              // => {x: 1, y: 2, z: 2}
updateIn(val, ['a'], merge, {c:99, d: 99})                     // => {a: {b: 0, c: 99, d: 99}, xs: [1, 2]}

updateIn(val, ['xs'], push, [3])                               // => {a: {b: 0, c: 2}, xs: [1, 2, 3]}
updateIn(val, ['xs'], push, [99])                              // => {a: {b: 0, c: 2}, xs: [1, 2, 99]}

updateIn(val, ['xs'], unshift, [0])                            // => {a: {b: 0, c: 2}, xs: [0, 1, 2]}

updateIn(val, ['xs'], splice, [[1, 1, 20]])                    // => {a: {b: 0, c: 2}, xs: [1, 20]}
updateIn(val, ['xs'], splice, [[0, 1, 6, 5], [4, 0, 99, 99]])  // => {a: {b: 0, c: 99, d: 99}, xs: [6,5,2,99,99]}

updateIn(val, ['a'], assoc, 'b', 1);                           // => {b: 1, c: 2}
updateIn(val, ['a'], assoc, 'b', 5, 'c', 6);                   // => {b: 5, c: 6}
updateIn(val, ['a'], assoc, 'd', 4);                           // => {b: 0, c: 2, d: 4}
updateIn(val, ['a'], assoc, 'd', 4, 'e', 6);                   // => {b: 0, c: 2, d: 4, e: 6}
updateIn(val, ['a'], assoc, 'd', 4, 'e')                       // => Error('assoc expects an even number of arguments')

updateIn(val, ['xs'], assoc, 0, 3);                            // => [3, 2]
updateIn(val, ['xs'], assoc, 0, 3, 1, 4);                      // => [3, 4]
updateIn(val, ['xs'], assoc, 2, 3);                            // => [1, 2, 3]
updateIn(val, ['xs'], assoc, 1, false, 0)                      // => Error('assoc expects an even number of arguments')
updateIn(val, ['xs'], assoc, 1.5, 'not an int')                // => TypeError('assoc expects only integer keys')
updateIn(val, ['xs'], assoc, -1, 'negative index?')            // => RangeError('assoc expects only numeric keys in the range [0, array.length]')
updateIn(val, ['xs'], assoc, 3, 'sparse arrays?')              // => RangeError('assoc expects only numeric keys in the range [0, array.length]')

const collections = {
  object: {foo: 1, bar: 2, baz: 3},
  array: [1, 2, 3, 4, 5, 6, 7]
};

updateIn(collections, ['object'], dissoc, 'bar')               // => {foo: 1, baz: 3}
updateIn(collections, ['object'], dissoc, 'foo', 'baz')        // => {bar: 2}

updateIn(collections, ['array'], dissoc, 1)                    // => [1, 3, 4, 5, 6, 7]
updateIn(collections, ['array'], dissoc, 2, 3, 4)              // => [1, 2, 6, 7]
updateIn(collections, ['array'], dissoc, 1, 3, 5)              // => [1, 3, 5, 7]
```

These combinators use structure sharing to preserve `===` for unchanged nodes, structure sharing is provided by [react-addons-update](https://www.npmjs.com/package/react-addons-update). As of React 0.14, react-addons-update requires all of React as a peer dependency.


## Bigger example

We can implement cursors in very few lines with `updateIn`, see the examples subdirectory.
