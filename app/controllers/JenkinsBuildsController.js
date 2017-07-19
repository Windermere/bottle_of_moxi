const ApplicationController = require('./ApplicationController');
const Jenkins = require('../models/resource/Jenkins');

class JenkinsBuildsController extends ApplicationController {

  static transitionMessage(previousBuild, build, handler) {
    const transition = `${previousBuild ? previousBuild.lastBuildStatus : 'Unknown'} > ${build.lastBuildStatus}`;
    var environment = this.environmentNameForBuildName(build.name);
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
        if (environment.toLowerCase() !== 'devint') {
          template = 'deployed';
        }
        break;
    }
    if(template) {
      Jenkins.fetchBuild(build, (details) => {
        const out = JSON.parse(details);
        const message = JenkinsBuildsController.messageFor(build, out, template);
        handler(message);
      });
    }
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
    const env = this.environmentNameForBuildName(build.name);

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
          deployment_time: new Date().toLocaleString(),
          build_label: build.lastBuildLabel,
          cause,
          changes: changeItems,
          culprits,
          environment: env
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

  static environmentNameForBuildName(name) {
    switch (true) {
      case (/.*\(QA.*/.test(name)):
      case (/.*\(Build\)/.test(name)): {
        return 'QA';
        break;
      }
      case (/.*Test\).*/.test(name)): {
        return 'Test';
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
        return '';
      }
    }
  }
}

module.exports = JenkinsBuildsController;
