import '../helpers/SubscriptionsHelper';

let Subscription = require('../models/Subscription');
let ApplicationController = require('./ApplicationController');

class SubscriptionsController extends ApplicationController {

  static showInvalidSubscriptionRequest(session) {
    
  }



  static createSubscription(session) {
    var text = session.message.text;
    var subType = this.requestTypeFor(text);
    var sn = this.requestNameFor(text);
    var subName = this.configSubName(subType, sn);

    var subscription = Subscription.create({text: text, subType: subType, subName: subName, session: session});
    var output = this.renderTemplate('Subscriptions/createSubscription',
      {user_name: session.message.user.name,
        subscription_type: subscription.subType,
        subscription_name: subscription.subName});

    session.send(output);
  }

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
        return this.jenkinsShortcutFor(name);
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

module.exports = SubscriptionsController;