let ApplicationController = require('./ApplicationController');

class ContactsController extends ApplicationController {


  static contactRelationUpdate(message, bot) {
    if (message.action === 'add') {
      var name = message.user ? message.user.name : null;
      var greeting = "Hello " +  name || 'there' + "... welcome to bottle of moxi (beer).";
      var reply = new bot.builder.Message()
        .address(message.address)
        .text(greeting + '\n' + HelpManager.generalHelp());
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