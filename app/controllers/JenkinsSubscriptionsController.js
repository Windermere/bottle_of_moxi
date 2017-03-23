const SubscriptionsController = require('./SubscriptionsController');
const ApplicationController = require('./ApplicationController');
const Jenkins = require('../models/Jenkins');

class JenkinsSubscriptionsController extends SubscriptionsController {

  static handleTransition(bot, previousBuild, build) {
    const transition = `${previousBuild ? previousBuild.lastBuildStatus : 'Unknown'} > ${build.lastBuildStatus}`;
    switch (transition) {
      case 'Success > Failure':
        JenkinsSubscriptionsController.failed(bot, build);
        break;
      case 'Failure > Failure':
        JenkinsSubscriptionsController.failedAgain(bot, build);
        break;
      case 'Failure > Success':
        JenkinsSubscriptionsController.fixed(bot, build);
        break;
      case 'Success > Success':
        JenkinsSubscriptionsController.deployed(bot, build);
        break;
    }
  }

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
    const details = Jenkins.find(build);
    console.log(JSON.stringify(details));
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
