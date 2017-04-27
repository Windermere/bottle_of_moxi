
const Handlebars = require('handlebars');
const Emoji = require('node-emoji');

Handlebars.registerHelper('showEmoji', (text) => {
  const emoji = Emoji.get(text);
  return new Handlebars.SafeString(emoji);
});

Handlebars.registerHelper('firstLine', (text) => {
  return text.split('\n')[0];
})
