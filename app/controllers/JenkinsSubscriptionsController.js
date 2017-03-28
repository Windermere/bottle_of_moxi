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
    Jenkins.find(build, function(details) {
      JenkinsSubscriptionsController.messageFor(bot, build, details, 'failed');
    });
  }

  static failedAgain(bot, build) {
    Jenkins.find(build, function(details) {
      JenkinsSubscriptionsController.messageFor(bot, build, details, 'failedAgain');
    });
  }

  static fixed(bot, build) {
    Jenkins.find(build, function(details) {
      JenkinsSubscriptionsController.messageFor(bot, build, details, 'fixed');
    });
  }

  static deployed(bot, build) {
    Jenkins.find(build, function(details) {
      JenkinsSubscriptionsController.messageFor(bot, build, details, 'deployed');
    });
  }

  static messageFor(bot, build, details, template) {
    if (!bot || !build) {
      throw new Error('bot and build required');
    }
    console.log(`OUTTTT => ${JSON.stringify(details)}`);

    const actions = details.actions[0];
    const changes = details.changeSet;
    const culprits = details.culprits;
    var cause = null;
    var changeItems = null;

    if(this.detailsHasCause(actions)) {
      cause = actions.causes[0].shortDescription;
    }
    if(this.detailsHasChanges(changes)) {
      changeItems = changes.items;
    }

    console.log(`OUTTTT => ${cause}`);
    console.log(`OUTTTT => ${JSON.stringify(changes)}`);
    console.log(`OUTTTT => ${JSON.stringify(culprits)}`);

    if(changeItems) {
      const output = this.renderTemplate(template,
        {
          build_name: build.name,
          build_url: `${build.webUrl + build.lastBuildLabel}/`,
          build_label: build.lastBuildLabel,
          cause: cause,
          changes: changeItems,
          culprits: culprits
        });
      bot.sendSubscriptionMessage(this.subscriptionNameFor(build), output);
      console.log(output);
    }
  }

  static detailsHasChanges(changes) {
    return (changes !== undefined && changes.items !== undefined && changes.items[0] !== undefined);
  }

  static detailsHasCause(actions) {
    return (actions !== undefined && actions.causes !== undefined && actions.causes[0] !== undefined && actions.causes[0].shortDescription !== undefined);
  }

  static subscriptionNameFor(build) {
    return `jenkins[${build.name}]`;
  }
}

module.exports = JenkinsSubscriptionsController;
