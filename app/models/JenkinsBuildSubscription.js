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

  static findAllFor(subscriptionName) {
    var all = this.findAll();
    var subs = all[subscriptionName] || [];
    var wildcard = all['*'] || [];
    subs.concat(wildcard);
    return subs;
  }


  static storeName() {
    return 'JenkinsBuildSubscription';
  }
}

module.exports = JenkinsBuildSubscription;
