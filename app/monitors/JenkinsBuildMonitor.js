
const JenkinsBuildSubscription = require('../models/JenkinsBuildSubscription');
const Jenkins = require('../models/resource/Jenkins');
const xml2js = require('xml2js');
const JenkinsBuild = require('../models/JenkinsBuild');

class JenkinsBuildMonitor {

  constructor(config) {
    this.uri = config.uri;
    this.interval = config.interval;
    this.bot = config.bot;
  }

  start() {
    this.updateLoop();
  }

  updateLoop() {
    this.runJenkinsCheck();
    setTimeout(this.updateLoop.bind(this), this.interval);
  }

  runJenkinsCheck(callback) {
    Jenkins.fetchAllBuilds(this.uri, this.parseAllBuildsResponse.bind(this), callback);
  }

  parseAllBuildsResponse(body, callback) {
    xml2js.parseString(body, (parseError, data) => {
      const builds = data.Projects.Project.map(project => project.$);
      this.handleAllBuildsResponse(builds, callback);
    });
  }

  handleAllBuildsResponse(builds, callback) {
    builds.forEach(this.handleBuild, this);
    if (callback) {
      callback();
    }
  }

  handleBuild(build) {
    const previousBuild = this.fetchPreviousBuildFor(build.name);
    if (previousBuild) {
      if (previousBuild && build.lastBuildLabel !== previousBuild.lastBuildLabel) {
        this.notify(build, previousBuild);
      }
    } else {
      console.log(`no previous build for ${build.name}`);
    }
    this.updateLastBuildFor(build);
  }

  notify(build, previousBuild) {
    JenkinsBuildSubscription.notifySubscribers(this.bot, previousBuild, build);
  }

  fetchPreviousBuildFor(buildName) {
    return JenkinsBuild.find({name: buildName});
  }

  updateLastBuildFor(build) {
    var jenkinsBuild = JenkinsBuild.find({name: build.name});
    if(!jenkinsBuild) {
      JenkinsBuild.create({name: build.name, build: build})
    } else if(build.lastBuildLabel != jenkinsBuild.build.lastBuildLabel) {
      jenkinsBuild.build = build;
      jenkinsBuild.save();
    }
  }

}

module.exports = JenkinsBuildMonitor;
