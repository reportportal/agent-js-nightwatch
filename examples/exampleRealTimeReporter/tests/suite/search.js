const { PublicReportingAPI } = require('../../../../src');

module.exports = {
  before: function (browser, done) {
    const item = {
      name: 'Search',
      description: 'Suite search tests',
      attributes: [{ key: 'suite', value: 'search' }],
    };
    console.log('Start suite');

    PublicReportingAPI.startSuite(item); // TODO: may be change it to common startTestItem and manage item type by browser object inside handler
    done();
  },

  beforeEach: function (browser, done) {
    const item = {
      name: 'testtest',
      description: 'testtest',
    };
    console.log('start item');
    PublicReportingAPI.startTestCase(item);
    done();
  },

  afterEach: function (browser, done) {
    console.log(browser.currentTest.results);
    const varSuccess = browser.currentTest.results.failed === 0;

    const item = {
      status: varSuccess ? 'passed' : 'failed',
    };
    console.log('finish item');
    PublicReportingAPI.finishTestCase(item);
    done();
  },

  after: function (browser, done) {
    PublicReportingAPI.finishSuite();
    console.log('Finish suite');
    browser.end();
    done();
  },

  'demo test google' : function (client) {
    client
      .url('https://google.com')
      .waitForElementPresent('body', 1000);
  },

  'part two' : function(client) {
    client
      .setValue('input[type=text]', ['nightwatch', client.Keys.ENTER])
      .pause(1000)
      .assert.urlContains('search?')
      .assert.urlContains('nightwatch')
      .end();
  }
};
