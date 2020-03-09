const { PublicReportingAPI } = require('../../../build');

module.exports = {
  before: function (browser, done) {
    const item = {
      name: 'Search',
      description: 'Suite description',
      attributes: [{ key: 'suite', value: 'search' }],
    };

    PublicReportingAPI.startSuite(item);
    done();
  },

  beforeEach: function (browser, done) {
    const item = {
      name: browser.currentTest.name,
      attributes: [{ key: 'test', value: 'before' }],
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

    PublicReportingAPI.sendLog.info('Info log for demo test item');

    PublicReportingAPI.sendLaunchLog.info('Info log for launch');

    PublicReportingAPI.addDescription('Demo test for google.com');
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
