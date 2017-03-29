
const JenkinsSubscription = require('../models/JenkinsSubscription');
const Jenkins = require('../models/Jenkins');

class JenkinsBuildMonitor {

  constructor(config) {
    this.uri = config.uri;
    this.interval = config.interval;
    this.bot = config.bot;
    this.previousBuilds = {};
  }

  start() {
    this.updateLoop();
  }

  updateLoop() {
    this.runJenkinsCheck();
    setTimeout(this.updateLoop.bind(this), this.interval);
  }

  runJenkinsCheck() {
    Jenkins.all(this.uri, function(build) {
      const previousBuild = this.fetchPreviousBuildFor(build.name);
      if (!previousBuild || build.lastBuildLabel !== previousBuild.lastBuildLabel) {
        const handler = function(message){
          //abstract notification
          this.bot.sendSubscriptionMessage(this.subscriptionNameFor(build), message);
        }.bind(this);
        JenkinsSubscription.transitionMessage(previousBuild, build, handler);
      }
      this.updateLastBuildFor(build);
    }.bind(this));
  }

  fetchPreviousBuildFor(buildName) {
    return this.previousBuilds[buildName];
  }

  updateLastBuildFor(build) {
    this.previousBuilds[build.name] = build;
  }

}

module.exports = JenkinsBuildMonitor;
