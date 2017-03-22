
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
    const subs = Subscription.fetchSubscribersFor(opts.name);
    return subs[opts.session.message.address.id];
  }

  static fetchSubscribersFor(subscriptionName) {
    const sub = Subscription.storage().getItemSync(subscriptionName) || {};
    return sub;
  }

  static addSubscriberFor(subscriptionName, session) {
    const sub = Subscription.fetchSubscribersFor(subscriptionName);
    sub[session.message.address.id] = session.message.address;
    Subscription.storage().setItemSync(subscriptionName, sub);
  }

  static removeSubscriberFor(subscriptionName, session) {
    const sub = Subscription.fetchSubscribersFor(subscriptionName);
    delete sub[session.message.address.id];
    Subscription.storage().setItemSync(subscriptionName, sub);
  }


  constructor(opts) {
    this.text = opts.text;
    this.subName = opts.subName;
    this.subType = opts.subType;
    this.session = opts.session;
  }


}

module.exports = Subscription;
