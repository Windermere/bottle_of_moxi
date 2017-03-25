import 'babel-polyfill'

const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const JenkinsSubsriptionController = require('../../../app/controllers/JenkinsSubscriptionsController');

describe('renderTemplate', function() {
  it('should inherit from ApplicationController', function () {
    const val = JenkinsSubsriptionController.renderTemplate('Application/404', {});
    assert.equal(typeof val, 'string');
  });

});