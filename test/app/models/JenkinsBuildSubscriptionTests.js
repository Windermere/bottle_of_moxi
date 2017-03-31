import 'babel-polyfill'

const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
var nock = require('nock');
const fs = require('fs');
const path = require('path');
const JenkinsBuildSubscription = require('../../../app/models/JenkinsBuildSubscription');

describe('JenkinsConnected', function() {
  var allResponse;
  var findResponse;
  var build;
  beforeEach(function() {
    const p = path.join(__dirname, `../../mock_http_data/`);
    allResponse =  fs.readFileSync(`${p}/Jenkins.all.response.xml`, 'utf8');
    findResponse = fs.readFileSync(`${p}/Jenkins.find.response.json`, 'utf8');
    build = {name: 'wms_svc_public-(Build)',  webUrl: 'http://jenkins-np.moxi.bz/job/wms_svc_public-(Build)', lastBuildLabel: '170' }
    nock('http://jenkins-np.moxi.bz')
      .get('/cc.xml')
      .reply(200, allResponse);

    nock('http://jenkins-np.moxi.bz')
      .get('/job/wms_svc_public-(Build)170/api/json')
      .reply(200, findResponse);

  });

  describe('deployedMessage', function() {
    it('should return a string', function () {
      JenkinsBuildSubscription.deployedMessage(build, function(message){
        assert.equal(typeof message, 'string');
      });
    });
  });

  describe('failedMessage', function() {
    it('should return a string', function () {
      JenkinsBuildSubscription.failedMessage(build, function(message){
        assert.equal(typeof message, 'string');
      });
    });
  });

  describe('failedAgainMessage', function() {
    it('should return a string', function () {
      JenkinsBuildSubscription.failedAgainMessage(build, function(message){
        assert.equal(typeof message, 'string');
      });
    });
  });

  describe('fixedMessage', function() {
    it('should return a string', function () {
      JenkinsBuildSubscription.fixedMessage(build, function(message){
        assert.equal(typeof message, 'string');
      });
    });
  });
});