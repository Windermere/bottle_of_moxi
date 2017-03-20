
let Subscription = require('../models/Subscription');

class SubscriptionsController {

  static showInvalidSubscriptionRequest(session) {
    
  }



  static createSubscription(subName, session, bot) {
    Subscription.create(session);
    session.send("Subscribing " + session.message.user.name + " to jenkins deploy notifications for " + subName);

  }
}

module.exports = SubscriptionsController;