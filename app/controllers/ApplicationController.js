import '../helpers/ApplicationHelper';

const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
var registeredPartials = {};

class ApplicationController {

  static renderTemplate(fileName, opts = {}) {
    if (typeof fileName !== 'string') { throw new Error('Template Name Required'); }
    if (typeof opts !== typeof {}) { throw new Error('Dictionary Object Required'); }
    const name = this.nameForTemplate(fileName);
    const contents = ApplicationController.getContents(name);
    if (!contents) { throw new Error(`Invalid Template Requested ${fileName} Not Found`); }
    this.registerPartials(fileName);
    const template = Handlebars.compile(contents);
    const output = template(opts);
    return output;
  }

  static registerPartials(fileName, opts = {}) {
    if (typeof fileName !== 'string') { throw new Error('Template Name Required'); }
    if (typeof opts !== typeof {}) { throw new Error('Dictionary Object Required'); }
    this.registerGlobalPartials();
    this.registerPartialsForController();
  }

  static getContents(fileName) {
    if (typeof fileName !== 'string') { throw new Error('Template Name Required'); }
    try {
      return fs.readFileSync(path.join(__dirname, `../views/${fileName}.handlebars`), 'utf8');
    } catch (ex) {
      return null;
    }
  }
  static nameForTemplate(fileName) {
    if (!fileName) { throw new Error(`Invalid Template Requested ${fileName} Not Found`); }
    const parts = fileName.split('/');
    const name = (parts.length > 1) ? fileName : `${this.name.replace(/Controller$/, '')}/${fileName}`;
    return name;
  }

  static nameForPartial(fileName) {
    if (!fileName) { throw new Error(`Invalid Partial Requested ${fileName} Not Found`); }
    const parts = fileName.split('/');
    const name = (parts.length > 1) ? fileName : `${this.name.replace(/Controller$/, '')}/${fileName}`;
    return name;
  }


  static registerGlobalPartials() {
    if(!registeredPartials['global']) {
      this.registerPartialsInDirectory('partials', true);
      registeredPartials['global'] = true;
    }
  }

  static registerPartialsForController() {
    const dirName = this.directoryNameForController();
    if(!registeredPartials[dirName]) {

      this.registerPartialsInDirectory(dirName);
      registeredPartials[dirName] = true;
    }
  }

  static registerPartialsInDirectory(dirName, globalScope=false) {
    const p = path.join(__dirname, `../views/${dirName}`);
    const fileNames = fs.readdirSync(p);
    fileNames.forEach(function (file) {
      const matches = /^_([^.]+).handlebars$/.exec(file);
      if (matches) {
        const fileName = matches[1];
        const name = this.nameForPartial(`_${fileName}`);
        const contents = this.getContents(name);
        const partialName = (globalScope) ? fileName : this.partialNameForController(fileName);
        Handlebars.registerPartial(partialName, contents);
      }
    }.bind(this));
  }

  static directoryNameForController() {
    const name = `${this.name.replace(/Controller$/, '')}`;
    return name;
  }


  static partialNameForController(fileName) {
    const controller = `${this.name.replace(/Controller$/, '')}`;
    return `${controller}.${fileName}`;
  }

}

module.exports = ApplicationController;
