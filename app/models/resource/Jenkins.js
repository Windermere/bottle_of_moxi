var request = require('superagent');

class Jenkins {

  static fetchAllBuilds(uri, responseHandler, callback) {
    request.get(uri)
      .end((err, res) =>{
        if (!err) {
          responseHandler(res.text, callback);
        } else {
          console.log(`WARNING! all failed: ${err}`);
        }
      });
  }

  static fetchBuild(build, environment, buildHandler) {
    const uri = (environment.toLowerCase() === 'tests') ?
      `${build.webUrl}${build.lastBuildLabel}/testReport/api/json`:
      `${build.webUrl}${build.lastBuildLabel}/api/json`;
    request.get(uri)
      .end((err, res) =>{
        if (!err) {
          buildHandler(res.text);
        } else {
          console.log(`WARNING! all failed: ${err}`);
        }
      });
  }
}

module.exports = Jenkins;
