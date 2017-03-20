
class Subscription {

  static storage() {
    if(Subscription._storage) {
      return Subscription._storage;
    }
    Subscription._storage = require('node-persist');
    Subscription._storage.initSync();
    return Subscription._storage;
}

  static create(session) {
    var text = session.message.text;
    var subscription = Subscription.requestNameFor(text);
    var subName = Subscription.configSubName(subscription);
    Subscription.addSubscriberFor(subName, session);
  }

  static find(opts) {
    var subs = Subscription.fetchSubscribersFor(opts.name);
    return subs[opts.session.message.address.id];
  }

  static fetchSubscribersFor(subscriptionName) {
    var sub = Subscription.storage().getItemSync(subscriptionName) || {};
    return sub;
  }

  static addSubscriberFor(subscriptionName, session) {
    var sub = Subscription.fetchSubscribersFor(subscriptionName);
    sub[session.message.address.id] = session.message.address;
    Subscription.storage().setItemSync(subscriptionName, sub);
  }

  static removeSubscriberFor(subscriptionName, session) {
    var sub = Subscription.fetchSubscribersFor(subscriptionName);
    delete sub[session.message.address.id];
    Subscription.storage().setItemSync(subscriptionName, sub);
  }

  static requestNameFor(name) {
    var woc = name.substr(name.indexOf(" ") + 1);
    var wsc = woc.substr(woc.indexOf(" ") + 1);
    return wsc;
  }


}

module.exports = Subscription;
