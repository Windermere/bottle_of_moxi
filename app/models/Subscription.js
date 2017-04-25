
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
    this.addSubscriberFor(opts.subName, opts.session);
    var className = this.toString().split ('(' || /s+/)[0].split (' ' || /s+/)[1];
    const subscription = new this[className](opts);
    return subscription;
  }

  static find(opts) {
    const all = this.findAll();
    var subs = all[opts.name] || {};
    var sub =  subs[opts.session.message.address.id];
    var className = this.toString().split ('(' || /s+/)[0].split (' ' || /s+/)[1];
    const subscription = (sub) ? new this[className](sub) : null;
    return subscription;
  }

  static findAll() {
    return this.storage().getItemSync(this.storeName()) || {};
  }


  static addSubscriberFor(subscriptionName, session) {
    var all = this.findAll();
    var subs = all[subscriptionName] || {};
    subs[session.message.address.id] = session.message.address;
    all[subscriptionName] = subs;
    Subscription.storage().setItemSync(this.storeName(), all);
  }

  static removeSubscriberFor(subscriptionName, session) {
    var all = this.findAll();
    var subs = all[subscriptionName] || {};
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
