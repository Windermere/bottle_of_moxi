import '../helpers/SubscriptionsHelper';

const Subscription = require('../models/Subscription');
const JenkinsBuildSubscription = require('../models/JenkinsBuildSubscription');
const ApplicationController = require('./ApplicationController');

class SubscriptionsController extends ApplicationController {

  static showInvalidSubscriptionRequest(session) {

  }

  static deleteSubscription(session) {
    const text = session.message.text;
    const subType = this.requestTypeFor(text);
    const sn = this.requestNameFor(text);
    const subName = this.configSubName(subType, sn);
    const subID = session.message.address.id;

    var subscription = this.removeSubscription({ text, subType, subName, subID });

    const output = this.renderTemplate('Subscriptions/deleteSubscription',
      { user_name: session.message.user.name,
        subscription_type: subscription.subType,
        subscription_name: subscription.subName });

    session.send(output);
  }

  static createSubscription(session) {
    const text = session.message.text;
    const subType = this.requestTypeFor(text);
    const sn = this.requestNameFor(text);
    const subName = this.configSubName(subType, sn);

    const subscription = this.generateSubscription({ text, subType, subName, session });
    const output = this.renderTemplate('Subscriptions/createSubscription',
      { user_name: session.message.user.name,
        subscription_type: subscription.subType,
        subscription_name: subscription.subName });

    session.send(output);
  }

  static generateSubscription(opts) {
    switch(opts.subType) {
      case ('jenkins'): {
        return JenkinsBuildSubscription.create(opts);
        break;
      }
    }
  }

  static findSubscription(opts) {
    switch(opts.subType) {
      case ('jenkins'): {
        return JenkinsBuildSubscription.find(opts);
        break;
      }
    }
  }

  static removeSubscription(opts) {
    switch(opts.subType) {
      case ('jenkins'): {
        return JenkinsBuildSubscription.delete(opts);
        break;
      }
    }
  }

  static requestTypeFor(name) {
    const arr = name.split(' ');
    const woc = arr[1];
    return woc;
  }
  static requestNameFor(name) {
    const woc = name.substr(name.indexOf(' ') + 1);
    const wsc = woc.substr(woc.indexOf(' ') + 1);
    return wsc;
  }

  static configSubName(type, name) {
    switch (type.toLowerCase()) {
      case ('jenkins'): {
        return this.jenkinsShortcutFor(name);
        break;
      }
    }
  }

  static jenkinsShortcutFor(name) {
    switch (name.toLowerCase()) {
      case ('qa'): {
        return '(QA Deployment)';
        break;
      }
      case ('devint'): {
        return '(Devint Distribute)';
        break;
      }
      case ('prod'): {
        return '(Production Distribute)';
        break;
      }
      default: {
        return name;
      }
    }
  }
}

module.exports = SubscriptionsController;
