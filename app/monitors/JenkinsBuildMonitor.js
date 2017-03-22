
const request = require('request');
const xml2js = require('xml2js');
const JenkinsSubscriptionsController = require('../controllers/JenkinsSubscriptionsController');

class JenkinsBuildMonitor {

  constructor(config) {
    this.uri = config.uri;
    this.interval = config.interval;
    this.bot = config.bot;
    this.previousBuilds = {};
  }

  start() {
    this.update();
  }

  update() {
    request(this.uri, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        xml2js.parseString(body, (error, data) => {
          const builds = data.Projects.Project.map(project => project.$);
          builds.forEach((build) => {
            const previousBuild = this.previousBuilds[build.name];
            if (!previousBuild || build.lastBuildLabel !== previousBuild.lastBuildLabel) {
              this.handleTransition(previousBuild, build);
            }
            this.previousBuilds[build.name] = build;
          });
        });
      } else {
        console.log(`WARNING! Update failed: ${error}`);
      }
      setTimeout(this.update.bind(this), this.interval);
    });
  }

  handleTransition(previousBuild, build) {
    const transition = `${previousBuild ? previousBuild.lastBuildStatus : 'Unknown'} > ${build.lastBuildStatus}`;
    switch (transition) {
      case 'Success > Failure':
        JenkinsSubscriptionsController.failed(this.bot, build);
        break;
      case 'Failure > Failure':
        JenkinsSubscriptionsController.failedAgain(this.bot, build);
        break;
      case 'Failure > Success':
        JenkinsSubscriptionsController.fixed(this.bot, build);
        break;
      case 'Success > Success':
        JenkinsSubscriptionsController.deployed(this.bot, build);
        break;
    }
  }
}

module.exports = JenkinsBuildMonitor;
