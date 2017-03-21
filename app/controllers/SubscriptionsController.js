
let Subscription = require('../models/Subscription');
let ApplicationController = require('./ApplicationController');
let SubscriptionsHelper = require('../helpers/SubscriptionsHelper');

class SubscriptionsController extends ApplicationController {

  static showInvalidSubscriptionRequest(session) {
    
  }



  static createSubscription(session) {
    var text = session.message.text;
    var subType = SubscriptionsHelper.requestTypeFor(text);
    var sn = SubscriptionsHelper.requestNameFor(text);
    var subName = SubscriptionsHelper.configSubName(subType, sn);

    var subscription = Subscription.create({text: text, subType: subType, subName: subName, session: session});
    var output = this.renderTemplate('Subscriptions/createSubscription',
      {user_name: session.message.user.name,
        subscription_type: subscription.subType,
        subscription_name: subscription.subName});

    session.send(output);
  }
}

module.exports = SubscriptionsController;