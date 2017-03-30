import 'babel-polyfill'

const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
var nock = require('nock');
const fs = require('fs');
const path = require('path');
const JenkinsSubscription = require('../../../app/models/JenkinsSubscription');
const JenkinsBuildMonitor = require('../../../app/monitors/JenkinsBuildMonitor');

describe('JenkinsBuildMonitor Tests', function(){
  var buildMonitor;
  var allResponse;
  var config;
  beforeEach(function() {
    const p = path.join(__dirname, `../../mock_http_data/`);
    allResponse = fs.readFileSync(`${p}/Jenkins.all.response.xml`, 'utf8');
    config = {bot: null,  uri: 'http://jenkins-np.moxi.bz/cc.xml', interval: 5000 };
    buildMonitor = new JenkinsBuildMonitor(config);
    nock('http://jenkins-np.moxi.bz')
      .get('/cc.xml')
      .reply(200, allResponse);
  });

  describe('fetchPreviousBuildFor', function() {
    it('should return a string', function () {
      const buildName = `wms_svc_public-(Build)`;
      const prevBuild = buildMonitor.fetchPreviousBuildFor(buildName);
      assert.equal(typeof prevBuild, 'string');
    });
  });

});