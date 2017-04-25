
class Subscription {

  static storage() {
    if (Subscription._storage) {
      return Subscription._storage;
    }
    Subscription._storage = require('node-persist');
    Subscription._storage.initSync();
    return Subscription._storage;
  }

  static create(opts) {
    // console.log("sub => " + JSON.stringify(opts));

    Subscription.addSubscriberFor(opts.subName, opts.session);
    const subscription = new Subscription(opts);
    return subscription;
  }

  static find(opts) {
    const subs = Subscription.findAll();
    var sub =  subs[opts.session.message.address.id];
    return (sub) ? new Subscription(sub) : null;
  }

  static findAll() {
    return Subscription.storage().getItemSync(this.storeName()) || {};
  }


  static addSubscriberFor(subscriptionName, session) {
    var all = this.findAll();
    var subs = all[subscriptionName];
    subs[session.message.address.id] = session.message.address;
    all[subscriptionName] = subs;
    Subscription.storage().setItemSync(this.storeName(), all);
  }

  static removeSubscriberFor(subscriptionName, session) {
    var all = this.findAll();
    var subs = all[subscriptionName];
    delete subs[session.message.address.id];
    all[subscriptionName] = subs;
    Subscription.storage().setItemSync(this.storeName(), all);
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
