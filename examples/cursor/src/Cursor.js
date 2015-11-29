import _ from 'lodash';
import {updateIn} from 'update-in';


let get = (o, k) => o[k];
let getIn = (o, ks) => _.reduce(ks, get, o);

class Cursor {
  constructor(store, paths, value) {
    this.value = () => getIn(value, paths);
    this.swap = (f, ...args) => store.swap(v => updateIn(v, paths, f, args));
    this.refine = (...morePaths) => new Cursor(store, paths.concat(morePaths), value);
  }
}

export let cursor = (store) => new Cursor(store, [], store.value());
