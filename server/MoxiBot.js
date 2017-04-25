
let Subscription = require('./../app/models/Subscription');

class MoxiBot {
  constructor(chatServer) {
    this.connection = new chatServer.builder.UniversalBot(chatServer.connector);
    this.builder = chatServer.builder;
  }

  sendSubscriptionMessage(subscribers, message) {
    if(!subscribers || !message) {
      return;
    }
    for(var key in subscribers) {
      var msg = new this.builder.Message()
        .address(subscribers[key])
        .text(message);
      this.connection.send(msg);
    }
  }

  postMessageToChannel(message) {
    var addresses = this.fetchAddresses();
    for(var key in addresses) {
      var msg = new this.builder.Message()
        .address(addresses[key])
        .text(message);
      this.connection.send(msg);
    }
  }
}

module.exports = MoxiBot;