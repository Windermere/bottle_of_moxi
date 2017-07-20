const ApplicationController = require('./ApplicationController');
const Jenkins = require('../models/resource/Jenkins');

class JenkinsBuildsController extends ApplicationController {

  static transitionMessage(previousBuild, build, handler) {
    const transition = `${previousBuild ? previousBuild.lastBuildStatus : 'Unknown'} > ${build.lastBuildStatus}`;
    var environment = this.environmentNameForBuildName(build.name);
    var template = null;

    template = JenkinsBuildsController.getBuildTemplateFor(transition, environment);

    if(template) {
      Jenkins.fetchBuild(build, environment, (details) => {
        const out = JSON.parse(details);
        const message = JenkinsBuildsController.messageFor(build, out, template);
        handler(message);
      });
    }
  }

  static getBuildTemplateFor(transition, environment) {
    switch (transition) {
      case 'Success > Failure':
        return 'failed';
      case 'Failure > Failure':
        return 'failedAgain';
      case 'Failure > Success':
        return 'fixed';
      case 'Success > Success':
        if (environment.toLowerCase() !== 'devint' && environment.toLowerCase() !== 'tests') {
          return 'deployed';
        }
      default:
        return null;
    }
  }

  static messageFor(build, details, template) {
    if (!build) {
      throw new Error('build required');
    }

    const actions = (details.actions !== undefined) ? details.actions[0] : {};
    const changes = details.changeSet;
    const culprits = details.culprits;
    let cause = null;
    let changeItems = null;
    let testResult = null;
    let buildUrl = null;
    let output = null;
    const env = this.environmentNameForBuildName(build.name);

    if(env === '') return null;

    if (this.detailsHasCause(actions)) {
      cause = actions.causes[0].shortDescription;
    }
    if (this.detailsHasChanges(changes)) {
      changeItems = changes.items;
    }



    if (changeItems || this.isAUnitTestDeployment(build)) {
      if(this.isAUnitTestDeployment(build)) {
        testResult = {total: details.totalCount, skipped: details.skipCount, failed: details.failCount};
        buildUrl = `${build.webUrl + build.lastBuildLabel}/testReport`;
      } else {
        buildUrl = `${build.webUrl + build.lastBuildLabel}/`;
      }

      output = this.renderTemplate(template,
        {
          build_name: build.name,
          build_url: buildUrl,
          deployment_time: new Date().toLocaleString(),
          build_label: build.lastBuildLabel,
          cause,
          changes: changeItems,
          culprits,
          environment: env,
          testResult
        });
      console.log(output);
    }
    return output;
  }


  static detailsHasChanges(changes) {
    return (changes !== undefined && changes.items !== undefined && changes.items[0] !== undefined);
  }

  static isAUnitTestDeployment(build) {
    return (/.*\(Unit Tests\).*/.test(build.name));
  }

  static detailsHasCause(actions) {
    return (actions !== undefined && actions.causes !== undefined && actions.causes[0] !== undefined && actions.causes[0].shortDescription !== undefined);
  }

  static environmentNameForBuildName(name) {
    switch (true) {
      case (/.*Reconnect Offline Slaves.*/.test(name)): {
        return '';
      }
      case (/.*\(QA.*/.test(name)):
      case (/.*\(Build\)/.test(name)): {
        return 'QA';
      }
      case (/.*\(Unit Tests\).*/.test(name)): {
        return 'Tests';
      }
      case (/.*\(Devint.*/.test(name)): {
        return 'Devint';
      }
      case (/.*\(Production.*/.test(name)): {
        return 'Production';
      }
      default: {
        return '';
      }
    }
  }
}

module.exports = JenkinsBuildsController;
