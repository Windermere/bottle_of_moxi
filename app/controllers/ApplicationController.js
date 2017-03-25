import '../helpers/ApplicationHelper';

const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

class ApplicationController {

  static renderTemplate(fileName, opts={}) {
    if(typeof fileName !== 'string') { throw new Error('Template Name Required'); }
    if(typeof opts !== typeof {}) { throw new Error('Dictionary Object Required'); }
    const contents = ApplicationController.getContents(fileName);
    if(!contents) { throw new Error(`Invalid Template Requested ${fileName} Not Found`); }

    const template = Handlebars.compile(contents);
    var output = template(opts);
    return output;
  }

  static getContents(fileName) {
    if(typeof fileName !== 'string') { throw new Error('Template Name Required'); }
    try {
      return fs.readFileSync(path.join(__dirname, `../views/${fileName}.handlebars`), 'utf8');
    } catch (ex) {
      return null;
    }
  }
}

module.exports = ApplicationController;
