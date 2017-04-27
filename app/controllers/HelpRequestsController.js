const ApplicationController = require('./ApplicationController');

class HelpRequestsController extends ApplicationController {


  static showGeneralHelp(session, bot) {
    const content = this.renderTemplate('general');
    session.send(content);

  }

  static showSubscribeHelp(session, bot) {
    const content = this.renderTemplate('subscribe');
    session.send(content);

  }

  static showUnsubscribeHelp(session, bot) {
    const content = this.renderTemplate('unsubscribe');
    session.send(content);
  }

  static showCommandHelp(session, bot) {

  }
}

module.exports = HelpRequestsController;
