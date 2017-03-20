let MoxiBot = require('./MoxiBot');

class ChatServer {

  constructor(appId, appPassword, appPort) {
    this.restify = require('restify');
    this.builder = require('botbuilder');
    this.server = this.restify.createServer();
    this.server.listen(appPort, function () {
      console.log('%s listening to %s', this.server.name, this.server.url);
    }.bind(this));

    this.connector = new this.builder.ChatConnector({
      appId: appId,
      appPassword: appPassword
    });

    this.server.post('/api/messages', this.connector.listen());
  }
}

module.exports = ChatServer;