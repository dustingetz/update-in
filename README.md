# update-in
Persistent functional object updates on vanilla js data structures (wraps react-addons-update)

## Quick Examples
```javascript
import {updateIn, merge, push, unshift, splice} from 'update-in';

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
```

These combinators use structure sharing to preserve `===` for unchanged nodes, structure sharing is provided by [react-addons-update](https://www.npmjs.com/package/react-addons-update). As of React 0.14, react-addons-update requires all of React as a peer dependency.


## Bigger example

We can implement cursors in very few lines with `updateIn`, see the examples subdirectory.
