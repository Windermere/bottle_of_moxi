
let Handlebars =  require('handlebars');
let Emoji = require('node-emoji')

Handlebars.registerHelper('showEmoji', function(text) {
  var emoji = Emoji.get(text);
  return new Handlebars.SafeString(emoji);
});