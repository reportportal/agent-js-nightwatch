const fs = require('fs');
const path = require('path');
const { PublicReportingAPI, FILE_TYPES } = require('../../../build');

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

    PublicReportingAPI.logInfo('Info log for demo test item');
    PublicReportingAPI.launchLogDebug('Debug log for launch');
    PublicReportingAPI.addDescription('Demo test for google.com');
  },

  'part two' : function(client) {
    client
      .setValue('input[type=text]', ['nightwatch', client.Keys.ENTER])
      .pause(1000)
      .assert.urlContains('search?')
      .assert.urlContains('nightwatch')
      .end();

    const attachment = {
      name: 'Cities',
      type: FILE_TYPES.JSON,
      content: fs.readFileSync(path.resolve(__dirname, '../data', 'cities.json')),
    };

    PublicReportingAPI.launchLogInfo('Log with attachment for launch', attachment);
  }
};
