'use strict';


let ContactsController = require( "./../app/controllers/ContactsController");
let ConversationsController = require( "./../app/controllers/ConversationsController");
let HelpRequestsController = require( "./../app/controllers/HelpRequestsController");
let SubscriptionsController = require( "./../app/controllers/SubscriptionsController");

class Router {

  constructor(bot) {
    this.bot = bot;
    this.configureBotConnectionActions();
    this.configureBotDialogResponses();
    return this;
  }


  configureBotConnectionActions() {
    this.bot.connection.on('contactRelationUpdate', function (message) {
      ContactsController.contactRelationUpdate(message, this.bot);
    }.bind(this));

    this.bot.connection.on('typing', function (message) {
      ContactsController.contactTyping(message, this.bot);
    }.bind(this));

    this.bot.connection.on('deleteUserData', function (message) {
      ContactsController.deleteUserData(message, this.bot);
    }.bind(this));

    this.bot.connection.on('conversationUpdate', function(message){
      ContactsController.conversationUpdate(message, this.bot);
    }.bind(this));
  }


  configureBotDialogResponses() {
    this.bot.connection.dialog('/', function (session) {
      this.handleConversationRequestFor(session);
    }.bind(this));
  }

  handleConversationRequestFor(session) {
    var message = session.message.text;
    var pieces = message.split(/[ ,]+/).filter(Boolean);
    if(pieces.length === 0) {
      return;
    }

    var firstCharacter = message.charAt(0);

    if(firstCharacter === '\\') {
      this.handleCommand(session);
    } else {
      ConversationsController.converse(session);
    }

  }

  handleCommand(session) {
    var message = session.message.text;
    var pieces = message.split(/[ ,]+/).filter(Boolean);

    var firstWord = pieces[0];
    switch(firstWord.toLowerCase()) {
      case("\\help"): {
        var helpType = (pieces.length > 1) ? pieces[1] : null;
        this.showHelpFor(helpType, session, this.bot);
        break;
      }

      case("\\subscribe"): {
        var subscriptionType = (pieces.length > 1) ? pieces[1] : null;
        this.handleSubscriptionRequest(subscriptionType, session);
        break;
      }

      case("\\unsubscribe"): {
        var subscriptionType = (pieces.length > 1) ? pieces[1] : null;
        this.handleUnsubscribeRequest(subscriptionType, session);
        break;
      }

      default: {
        HelpRequestsController.showCommandHelp(session, bot);

      }
    }
  }

  showHelpFor(helpType, session, bot) {
    if(helpType === null) {
      HelpRequestsController.showGeneralHelp(session, bot);
    }

    switch(helpType.toLowerCase()) {
      case('subscription'): {
        HelpRequestsController.showSubscriptionHelp(session, bot);
        break;
      }
    }

  }

  handleSubscriptionRequest(subscriptionType, session) {
    if(!subscriptionType) {
      SubscriptionsController.showInvalidSubscriptionRequest(session);
      return;
    }

    SubscriptionsController.createSubscription(session);

  }

  handleUnsubscribeRequest(subscriptionType, session) {
    if(!subscriptionType) {
      SubscriptionsController.showInvalidSubscriptionRequest(session);
      return;
    }

    SubscriptionsController.deleteSubscription(session);

  }
}

module.exports = Router;
