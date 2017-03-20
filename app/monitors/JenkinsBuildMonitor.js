'use strict';
let request = require('request');
let xml2js = require('xml2js');


class JenkinsBuildMonitor {

  static subscriptionNameFor(build) {
    return 'jenkins[' + build.name + ']';
  }

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
          let builds = data['Projects']['Project'].map(project => project.$);
          builds.forEach(build => {
            let previousBuild = this.previousBuilds[build.name];
            if (!previousBuild || build.lastBuildLabel !== previousBuild.lastBuildLabel) {
              this.handleTransition(previousBuild, build);
            }
            this.previousBuilds[build.name] = build;
          });
        });
      } else {
        console.log('WARNING! Update failed: ' + error);
      }
      setTimeout(this.update.bind(this), this.interval);
    });
  }

  handleTransition(previousBuild, build) {
    let transition = (previousBuild ? previousBuild.lastBuildStatus : 'Unknown') + ' > ' + build.lastBuildStatus;
    var message = null;
    switch (transition) {
      case 'Success > Failure':
        message = this.buildFailedMessage(build);
        break;
      case 'Failure > Failure':
        message = this.buildFailedAgainMessage(build);
        break;
      case 'Failure > Success':
        message = this.buildFixedMessage(build);
        break;
      case 'Success > Success':
        message = this.buildDeployedMessage(build);
        break;
    }
    if(message) {
      this.bot.sendSubscriptionMessage(JenkinsBuildMonitor.subscriptionNameFor(build), message);
      console.log(message);
    }
  }


  buildFailedMessage(build) {
    return this.formatMessage(':(  Failed', build);
  }

  buildFailedAgainMessage(build) {
    return this.formatMessage('(puke) Failed again', build);
  }

  buildFixedMessage(build) {
    return this.formatMessage('(rainbow) Fixed', build);
  }

  buildDeployedMessage(build) {
    return this.formatMessage('(slamdunk) Deployed', build);
  }

  formatMessage(comment, build) {
    return comment + ': ' + build.name + ' ➔ ' + build.webUrl + build.lastBuildLabel + '/';
  }

}



module.exports = JenkinsBuildMonitor;
