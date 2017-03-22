import '../helpers/ApplicationHelper';

let Handlebars =  require('handlebars');

class ApplicationController {

  static renderTemplate(fileName, opts) {
    var contents = this.getContents(fileName);
    var output = Handlebars.compile(contents, opts);
    return output;
  }

  static getContents(fileName) {
    var fs = require('fs');
    var path = require('path');
    try {
      return fs.readFileSync(path.join(__dirname,  '../views/' + fileName + '.handlebars'), 'utf8');
    } catch (ex) {
      return null;
    }
  }
}

module.exports = ApplicationController