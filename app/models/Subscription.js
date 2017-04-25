
class Subscription {

  static storage() {
    if (Subscription._storage) {
      return Subscription._storage;
    }
    Subscription._storage = require('node-persist');
    Subscription._storage.initSync();
    return Subscription._storage;
  }

  static findAll() {
    return this.storage().getItemSync(this.storeName()) || {};
  }


  static storeName() {
    return 'Subscription';
  }


  constructor(opts) {
    this.text = opts.text;
    this.subName = opts.subName;
    this.subType = opts.subType;
    this.session = opts.session;
  }


}

module.exports = Subscription;
