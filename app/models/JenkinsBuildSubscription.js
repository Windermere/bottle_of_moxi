const Subscription = require('./Subscription');
const Jenkins = require('./resource/Jenkins');
const JenkinsBuildsController = require('../controllers/JenkinsBuildsController');

class JenkinsBuildSubscription extends Subscription {

  static notifySubscribers(bot, previousBuild, currentBuild) {
    JenkinsBuildsController.transitionMessage(previousBuild, currentBuild, (message) => {
      bot.sendSubscriptionMessage(this.subscriptionNameFor(currentBuild), message);
    });
  }

  static subscriptionNameFor(build) {
    return `jenkins_build[${build.name}]`;
  }
}

module.exports = JenkinsBuildSubscription;
