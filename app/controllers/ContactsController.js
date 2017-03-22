const ApplicationController = require('./ApplicationController');

class ContactsController extends ApplicationController {


  static contactRelationUpdate(message, bot) {
    if (message.action === 'add') {
      const name = message.user ? message.user.name : null;
      const greeting = `Hello ${name}` || 'there' + '... welcome to bottle of moxi (beer).';
      const reply = new bot.builder.Message()
        .address(message.address)
        .text(`${greeting}\n${HelpManager.generalHelp()}`);
      bot.connection.send(reply);
    } else {
      // delete their data
    }
  }

  static contactTyping(message, bot) {

  }

  static deleteUserData(message, bot) {

  }

  static conversationUpdate(message, bot) {

  }
}

module.exports = ContactsController;
