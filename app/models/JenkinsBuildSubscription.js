const Subscription = require('./Subscription');
const Jenkins = require('./resource/Jenkins');
const JenkinsBuildsController = require('../controllers/JenkinsBuildsController');

class JenkinsBuildSubscription extends Subscription {

  static notifySubscribers(bot, previousBuild, currentBuild) {
    JenkinsBuildsController.transitionMessage(previousBuild, currentBuild, (message) => {
      var subscribers = JenkinsBuildSubscription.findAllFor(this.subscriptionNameFor(currentBuild));
      bot.sendSubscriptionMessage(subscribers, message);
    });
  }

  static subscriptionNameFor(build) {
    return build.name;
  }

  static create(opts) {
    // console.log("sub => " + JSON.stringify(opts));
    this.addSubscriberFor(opts.subName, opts.session);
    const subscription = new this(opts);
    return subscription;
  }

  static find(opts) {
    const all = this.findAll();
    var subs = all[opts.name] || {};
    var sub =  subs[opts.subID];
    const subscription = (sub) ? new this(sub) : null;
    return subscription;
  }

  static delete(opts) {
    const all = this.findAll();
    var subs = all[opts.name] || {};
    var sub =  subs[opts.subID];
    const subscription = (sub) ? new this(sub) : null;
    return subscription;
  }

  static findAllFor(subscriptionName) {
    var all = this.findAll();
    var subs = all[subscriptionName];
    var wildcard = all['*'];
    var allSubs = Object.assign({}, subs, wildcard);
    return allSubs;
  }

  static addSubscriberFor(subscriptionName, session) {
    var all = this.findAll();
    var subs = all[subscriptionName] || {};
    subs[session.message.address.id] = session.message.address;
    all[subscriptionName] = subs;
    Subscription.storage().setItemSync(this.storeName(), all);
  }

  static removeSubscriberFor(subscriptionName, subID) {
    var all = this.findAll();
    var subs = all[subscriptionName] || {};
    delete subs[subID];
    all[subscriptionName] = subs;
    Subscription.storage().setItemSync(this.storeName(), all);
  }

  static storeName() {
    return 'JenkinsBuildSubscription';
  }
}

module.exports = JenkinsBuildSubscription;
