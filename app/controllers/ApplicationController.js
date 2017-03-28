import '../helpers/ApplicationHelper';

const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

class ApplicationController {

  static renderTemplate(fileName, opts = {}) {
    if (typeof fileName !== 'string') { throw new Error('Template Name Required'); }
    if (typeof opts !== typeof {}) { throw new Error('Dictionary Object Required'); }
    const name = this.nameForFile(fileName);
    const contents = ApplicationController.getContents(name);
    if (!contents) { throw new Error(`Invalid Template Requested ${fileName} Not Found`); }

    const template = Handlebars.compile(contents);
    const output = template(opts);
    return output;
  }

  static renderPartial(fileName, opts = {}) {
    if (typeof fileName !== 'string') { throw new Error('Template Name Required'); }
    if (typeof opts !== typeof {}) { throw new Error('Dictionary Object Required'); }
    const contents = ApplicationController.getContents(fileName);
    if (!contents) { throw new Error(`Invalid Template Requested ${fileName} Not Found`); }

    const template = Handlebars.compile(contents);
    const output = template(opts);
    return output;
  }

  static getContents(fileName) {
    if (typeof fileName !== 'string') { throw new Error('Template Name Required'); }
    try {
      return fs.readFileSync(path.join(__dirname, `../views/${fileName}.handlebars`), 'utf8');
    } catch (ex) {
      return null;
    }
  }
  static nameForFile(fileName) {
    const parts = fileName.split('/');
    const name = (parts.length > 1) ? fileName : `${this.name.replace(/Controller$/, '')}/${fileName}`;
    return name;
  }
}

module.exports = ApplicationController;
