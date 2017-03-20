class ConversationsController {

  static converse(session) {
    session.send(`derp`);
  }
}

module.exports = ConversationsController;