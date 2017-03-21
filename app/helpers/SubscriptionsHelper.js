let ApplicationHelper = require('./ApplicationHelper');

class SubscriptionsHelper extends ApplicationHelper {
  static requestTypeFor(name) {
    var arr = name.split(' ');
    var woc = arr[1];
    return woc;
  }
  static requestNameFor(name) {
    var woc = name.substr(name.indexOf(" ") + 1);
    var wsc = woc.substr(woc.indexOf(" ") + 1);
    return wsc;
  }


  static configSubName(type, name) {
    switch(type.toLowerCase()) {
      case('jenkins'): {
        return SubscriptionsHelper.jenkinsShortcutFor(name);
        break;
      }
    }

  }

  static jenkinsShortcutFor(name) {
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

module.exports = SubscriptionsHelper;