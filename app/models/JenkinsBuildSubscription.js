const Subscription = require('./Subscription');
const Jenkins = require('./resource/Jenkins');
const JenkinsBuildController = require('../controllers/JenkinsBuildController');

class JenkinsBuildSubscription extends Subscription {

  static notifySubscribers(bot, previousBuild, currentBuild) {
    JenkinsBuildController.transitionMessage(previousBuild, currentBuild, (message) => {
      bot.sendSubscriptionMessage(this.subscriptionNameFor(currentBuild), message);
    });
  }

  static subscriptionNameFor(build) {
    return `jenkins_build[${build.name}]`;
  }
}

module.exports = JenkinsBuildSubscription;
