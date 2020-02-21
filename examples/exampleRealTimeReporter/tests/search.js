const { PublicReportingAPI } = require('../../../src');

module.exports = {
  before: function (browser, done) {
    const item = {
      name: 'Search',
      description: 'Suite search tests',
      attributes: [{ key: 'suite', value: 'search' }],
    };

    PublicReportingAPI.startSuite(item);
    done();
  },

  beforeEach: function (browser, done) {
    const item = {
      name: browser.currentTest.name,
      description: 'Test description',
    };

    PublicReportingAPI.startTestCase(item);
    done();
  },

  afterEach: function (browser, done) {
    PublicReportingAPI.finishTestCase(browser.currentTest);
    done();
  },

  after: function (browser, done) {
    PublicReportingAPI.finishSuite();
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
