let ApplicationController = require('./ApplicationController');

class ConversationsController extends ApplicationController {

  static converse(session) {
    session.send(`derp`);
  }
}

module.exports = ConversationsController;