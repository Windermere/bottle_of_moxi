const Subscription = require('./Subscription');
const JenkinsBuildsController = require('../controllers/JenkinsBuildsController');

class JenkinsBuildSubscription extends Subscription {

  static notifySubscribers(bot, previousBuild, currentBuild) {
    JenkinsBuildsController.transitionMessage(previousBuild, currentBuild, (message) => {
      if(!message)
        return;
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
    return this.removeSubscriberFor(opts.subName, opts.subID);
  }

  static findAllFor(subscriptionName) {
    var all = this.findAll();
    var subs = all[subscriptionName];
    var group = this.findAllInGroupFor(subscriptionName, all);
    var wildcard = all['*'];
    var allSubs = Object.assign({}, subs, group, wildcard);
    return allSubs;
  }

  static addSubscriberFor(subscriptionName, session) {
    var all = this.findAll();
    var subs = all[subscriptionName] || {};
    subs[session.message.address.user.id] = session.message.address;
    all[subscriptionName] = subs;
    Subscription.storage().setItemSync(this.storeName(), all);
  }

  static removeSubscriberFor(subscriptionName, subID) {
    var all = this.findAll();
    var subs = all[subscriptionName] || {};
    var sub =  subs[subID];
    delete subs[subID];
    all[subscriptionName] = subs;
    Subscription.storage().setItemSync(this.storeName(), all);
    return sub;
  }

  static findAllInGroupFor(name, allSubscriptions) {
    switch (true) {
      case (/.*\(QA.*/.test(name)):
      case (/.*\(Build\)/.test(name)): {
        return allSubscriptions['qa'];
        break;
      }
      case (/.*\(Devint.*/.test(name)): {
        return allSubscriptions['devint'];
        break;
      }
      case (/.*\(Production.*/.test(name)): {
        return allSubscriptions['prod'];
        break;
      }
      default: {
        return {};
      }
    }
  }

  static environmentNameForBuildName(name) {
    switch (true) {
      case (/.*\(QA.*/.test(name)):
      case (/.*\(Build\)/.test(name)): {
        return 'QA';
        break;
      }
      case (/.*\(Devint.*/.test(name)): {
        return 'Devint';
        break;
      }
      case (/.*\(Production.*/.test(name)): {
        return 'Production';
        break;
      }
      default: {
        '';
      }
    }
  }

  static storeName() {
    return 'JenkinsBuildSubscription';
  }

}

module.exports = JenkinsBuildSubscription;
