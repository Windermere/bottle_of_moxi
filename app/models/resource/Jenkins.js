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

  static fetchBuild(build, buildHandler) {
    const uri = `${build.webUrl}${build.lastBuildLabel}/api/json`;
    request.get(uri).end(function(error, response) {
      if (!error) {
        const out = JSON.parse(response);
        buildHandler(out);
      } else {
        console.log(`WARNING! find failed: ${error}`);
      }
    });
  }
}

module.exports = Jenkins;
