
const JenkinsSubscriptionsController = require('../controllers/JenkinsSubscriptionsController');
const Jenkins = require('../models/Jenkins');

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
    Jenkins.all(this.uri, function(build) {
      const previousBuild = this.previousBuilds[build.name];
      if (!previousBuild || build.lastBuildLabel !== previousBuild.lastBuildLabel) {
        JenkinsSubscriptionsController.handleTransition(this.bot, previousBuild, build);
      }
      this.previousBuilds[build.name] = build;
    }.bind(this));
    setTimeout(this.update.bind(this), this.interval);
  }
}

module.exports = JenkinsBuildMonitor;
