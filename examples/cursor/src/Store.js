export default class Store {
  constructor (initialVal) {
    this._ref = initialVal;

    // auto-bind store methods
    this.value = () => this._ref;
    this.swap = (f) => { this._ref = f(this._ref); }
  }
}
