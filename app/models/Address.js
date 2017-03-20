
class Address {

  static storage() {
    if(Address._storage) {
      return Address._storage;
    }
    Address._storage = require('node-persist');
    Address._storage.initSync();
    return Address._storage;
  }

  static storeName() {
    return 'addresses::';
  }

  static create(session) {
    var sub = Address.fetchAddresses();
    sub[session.message.address.id] = session.message.address;
    Address.saveAll(sub);
  }

  static find(opts) {
    var subs = Address.fetchAddresses();
    return subs[opts.session.message.address.id];
  }

  static saveAll(addresses) {
    Address.storage().setItemSync(Address.storeName(), addresses);
  }

  static fetchAddresses() {
    var sub = Address.storage().getItemSync(Address.storeName()) || {};
    return sub;
  }

  static removeAddressFor(session) {
    var sub = Address.fetchAddresses();
    delete sub[session.message.address.id];
    Address.saveAll(sub);
  }

}

module.exports = Subscription;
