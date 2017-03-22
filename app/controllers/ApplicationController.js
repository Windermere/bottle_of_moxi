import '../helpers/ApplicationHelper';

const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

class ApplicationController {

  static renderTemplate(fileName, opts) {
    const contents = this.getContents(fileName);
    const output = Handlebars.compile(contents, opts);
    return output;
  }

  static getContents(fileName) {
    try {
      return fs.readFileSync(path.join(__dirname, `../views/${fileName}.handlebars`), 'utf8');
    } catch (ex) {
      return null;
    }
  }
}

module.exports = ApplicationController;
