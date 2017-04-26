
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

  static findAllByRegex(obj, filter) {
    var key, keys = [];
    for (key in obj) {
      if (obj.hasOwnProperty(key) && filter.test(key)) {
        keys.push(key);
      }
    }
    return keys;
  }

  constructor(opts) {
    this.text = opts.text;
    this.subName = opts.subName;
    this.subType = opts.subType;
    this.session = opts.session;
  }


}

module.exports = Subscription;
