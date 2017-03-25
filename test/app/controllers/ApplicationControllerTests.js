import 'babel-polyfill'

const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const ApplicationController = require('../../../app/controllers/ApplicationController');

describe('renderTemplate', function() {
  it('should return a string', function () {
    const val = ApplicationController.renderTemplate('Application/404', {});
    assert.equal(typeof val, 'string');
  });

  it('should handle two parameters', function () {
    const val = ApplicationController.renderTemplate('Application/404', {});
    assert.equal(typeof val, 'string');
  });

  it('should render the passed template as expected', function () {
    const val = ApplicationController.renderTemplate('Application/404', {});
    assert.equal(val, '{"httpError":404,"errorCode":,"error":"The specified path for your request was not found"}');
  });

  it('should embed passed data as expected', function () {
    const val = ApplicationController.renderTemplate('Application/404', {error_code: 1234});
    assert.equal(val, '{"httpError":404,"errorCode":1234,"error":"The specified path for your request was not found"}');
  });

  it('should require at least one parameter', function () {
    expect(ApplicationController.renderTemplate.bind()).to.throw(/Template Name Required/)
  });

  it('should expect a string object as the first parameter', function () {
    expect(ApplicationController.renderTemplate.bind(null, {}, {})).to.throw(/Template Name Required/)
  });

  it('should expect a dictionary object as second parameter', function() {
    expect(ApplicationController.renderTemplate.bind(null, 'Application/404', 'whatever')).to.throw(/Dictionary Object Required/)
  });

  it('should expect valid template name as first parameter', function () {
    expect(ApplicationController.renderTemplate.bind(null, 'whatevers2009', {})).to.throw(/Invalid Template Requested/)
  });
});

describe('getContents', function() {
  it('should return a string', function () {
    const val = ApplicationController.getContents('Application/404');
    assert.equal(typeof val, 'string');
  });

  it('should return null when given an invalid template name', function () {
    const val = ApplicationController.getContents('Application/notHere');
    assert.equal(typeof val, typeof null);
  });

  it('should require at least one parameter', function () {
    expect(ApplicationController.getContents.bind()).to.throw(/Template Name Required/)
  });

  it('should expect a string object as the first parameter', function () {
    expect(ApplicationController.getContents.bind(null, {})).to.throw(/Template Name Required/)
  });

  it('should render the passed template as expected', function () {
    const val = ApplicationController.getContents('Application/404', {});
    assert.equal(val, '{"httpError":404,"errorCode":{{{error_code}}},"error":"The specified path for your request was not found"}');
  });
});
