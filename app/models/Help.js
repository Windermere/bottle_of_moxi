
class Help {
  static handleRequest(session) {
    session.send(`How can I help you?`);
  }
  static generalHelp() {
    return `to subscribe to a jenkins builds for a specific environment send "subscribe jenkins [environment]" -- subscribe jenkins qa`;
  }
}

module.exports = Help;
