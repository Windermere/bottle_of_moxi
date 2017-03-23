const request = require('request');
const xml2js = require('xml2js');

class Jenkins {
  static all(uri, buildHandler) {
    request(uri, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        xml2js.parseString(body, (error, data) => {
          const builds = data.Projects.Project.map(project => project.$);
          builds.forEach((build) => buildHandler(build));
        });
      } else {
        console.log(`WARNING! all failed: ${error}`);
      }
    });
  }

  static find(build) {
    const url = `${build.webUrl}${build.lastBuildLabel}/api/json`
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        return JSON.parse(body);
      } else {
        console.log(`WARNING! find failed: ${error}`);
      }
    });
  }
}

module.exports = Jenkins;