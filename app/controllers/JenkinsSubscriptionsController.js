const SubscriptionsController = require('./SubscriptionsController');
const ApplicationController = require('./ApplicationController');

class JenkinsSubscriptionsController extends SubscriptionsController {
  static failed(bot, build) {
    JenkinsSubscriptionsController.messageFor(bot, build, 'JenkinsSubscriptions/failed');
  }

  static failedAgain(bot, build) {
    JenkinsSubscriptionsController.messageFor(bot, build, 'JenkinsSubscriptions/failedAgain');
  }

  static fixed(bot, build) {
    JenkinsSubscriptionsController.messageFor(bot, build, 'JenkinsSubscriptions/fixed');
  }

  static deployed(bot, build) {
    JenkinsSubscriptionsController.messageFor(bot, build, 'JenkinsSubscriptions/deployed');
  }

  static messageFor(bot, build, template) {
    if (!bot || !build) {
      throw new Error('bot and build required');
    }
    const output = this.renderTemplate(template,
      { build_name: build.name,
        build_url: `${build.webUrl + build.lastBuildLabel}/`,
        build_label: build.lastBuildLabel });
    bot.sendSubscriptionMessage(this.subscriptionNameFor(build), output);
    console.log(output);
  }

  static subscriptionNameFor(build) {
    return `jenkins[${build.name}]`;
  }
}

module.exports = JenkinsSubscriptionsController;
