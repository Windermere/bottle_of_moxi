
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

  runJenkinsCheck(callback) {
    Jenkins.all(this.uri, this.handleAllBuildsResponse.bind(this), callback);
  }

  handleAllBuildsResponse(builds, callback) {
    builds.forEach(this.handleBuild, this);
    if (callback) {
      callback();
    }
  }

  handleBuild(build) {
    const previousBuild = this.fetchPreviousBuildFor(build.name);
    if (previousBuild && build.lastBuildLabel !== previousBuild.lastBuildLabel) {
      this.notify(build, previousBuild);
    }
    this.updateLastBuildFor(build);
  }

  notify(build, previousBuild) {
    const handler = function (message) {
      this.bot.sendSubscriptionMessage(this.subscriptionNameFor(build), message);
    }.bind(this);
    JenkinsSubscription.transitionMessage(previousBuild, build, handler);
  }

  fetchPreviousBuildFor(buildName) {
    return this.previousBuilds[buildName];
  }

  updateLastBuildFor(build) {
    this.previousBuilds[build.name] = build;
  }

}

module.exports = JenkinsBuildMonitor;
