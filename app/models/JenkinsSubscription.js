let Subscription = require('./Subscription');

class JenkinsSubscription extends Subscription {


  static configSubName(name) {
    switch(name.toLowerCase()) {
      case('qa'): {
        return "(QA Deployment)";
        break;
      }
      case('devint'): {
        return "(Devint Distribute)";
        break;
      }
      case('prod'): {
        return "(Production Distribute)";
        break;
      }
      default: {
        return name;
      }
    }
  }


}

module.exports = JenkinsSubscription;