let Subscription = require('./Subscription');
let Jenkins = require('./Jenkins');

class JenkinsSubscription extends Subscription {
  static transitionMessage(previousBuild, build, handler) {
    const transition = `${previousBuild ? previousBuild.lastBuildStatus : 'Unknown'} > ${build.lastBuildStatus}`;
    switch (transition) {
      case 'Success > Failure':
        JenkinsSubscription.failedMessage(build, handler);
        break;
      case 'Failure > Failure':
        JenkinsSubscription.failedAgainMessage(build, handler);
        break;
      case 'Failure > Success':
        JenkinsSubscription.fixedMessage(build, handler);
        break;
      case 'Success > Success':
        JenkinsSubscription.deployedMessage(build, handler);
        break;
    }
  }


  static failedMessage(build, handler) {
    Jenkins.find(build, function(details) {
      const message = JenkinsSubscription.messageFor(build, details, 'failed');
      handler(message);
    });
  }

  static failedAgainMessage(build, handler) {
    Jenkins.find(build, function(details) {
      const message = JenkinsSubscription.messageFor(build, details, 'failedAgain');
      handler(message);
    });
  }

  static fixedMessage(build, handler) {
    Jenkins.find(build, function(details) {
      const message =  JenkinsSubscription.messageFor(build, details, 'fixed');
      handler(message);
    });
  }

  static deployedMessage(build, handler) {
    Jenkins.find(build, function(details) {
      const message = JenkinsSubscription.messageFor(build, details, 'deployed');
      handler(message);
    });
  }

  static messageFor(build, details, template) {
    if ( !build) {
      throw new Error('build required');
    }

    const actions = details.actions[0];
    const changes = details.changeSet;
    const culprits = details.culprits;
    var cause = null;
    var changeItems = null;
    var output = null;

    if(this.detailsHasCause(actions)) {
      cause = actions.causes[0].shortDescription;
    }
    if(this.detailsHasChanges(changes)) {
      changeItems = changes.items;
    }


    if(changeItems) {
      output = this.renderTemplate(template,
        {
          build_name: build.name,
          build_url: `${build.webUrl + build.lastBuildLabel}/`,
          build_label: build.lastBuildLabel,
          cause: cause,
          changes: changeItems,
          culprits: culprits
        });
      console.log(output);
    }
    return output;
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

module.exports = JenkinsSubscription;
