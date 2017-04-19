const ApplicationController = require('./ApplicationController');
const Jenkins = require('../models/resource/Jenkins');

class JenkinsBuildController extends ApplicationController {

  static transitionMessage(previousBuild, build, handler) {
    const transition = `${previousBuild ? previousBuild.lastBuildStatus : 'Unknown'} > ${build.lastBuildStatus}`;
    var template = null;
    switch (transition) {
      case 'Success > Failure':
        template = 'failed';
        break;
      case 'Failure > Failure':
        template = 'failedAgain';
        break;
      case 'Failure > Success':
        template = 'fixed';
        break;
      case 'Success > Success':
        template = 'deployed';
        break;
    }

    Jenkins.fetchBuild(build, (details) => {
      const message = JenkinsBuildController.messageFor(build, details, template);
      handler(message);
    });
  }

  static messageFor(build, details, template) {
    if (!build) {
      throw new Error('build required');
    }

    const actions = details.actions[0];
    const changes = details.changeSet;
    const culprits = details.culprits;
    let cause = null;
    let changeItems = null;
    let output = null;

    if (this.detailsHasCause(actions)) {
      cause = actions.causes[0].shortDescription;
    }
    if (this.detailsHasChanges(changes)) {
      changeItems = changes.items;
    }


    if (changeItems) {
      output = this.renderTemplate(template,
        {
          build_name: build.name,
          build_url: `${build.webUrl + build.lastBuildLabel}/`,
          build_label: build.lastBuildLabel,
          cause,
          changes: changeItems,
          culprits
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

}

module.exports = JenkinsBuildController;
