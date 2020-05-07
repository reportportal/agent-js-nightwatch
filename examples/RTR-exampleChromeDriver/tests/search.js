const fs = require('fs');
const path = require('path');
const { PublicReportingAPI, FILE_TYPES } = require('../../../build');

const suiteName = 'Search';

module.exports = {
  before: function () {
    const item = {
      name: suiteName,
      description: 'Suite description',
      attributes: [{ key: 'suite', value: 'search' }],
    };
    PublicReportingAPI.startSuite(item);
  },

  beforeEach: function (browser) {
    PublicReportingAPI.startTestCase(browser.currentTest);
  },

  afterEach: function (browser) {
    PublicReportingAPI.finishTestCase(browser.currentTest);

    PublicReportingAPI.startAfterTestCase();
    // afterEach related actions
    PublicReportingAPI.finishAfterTestCase();
  },

  after: function (browser, done) {
    PublicReportingAPI.finishSuite(suiteName);
    browser.end(() => {
      done();
    });
  },

  'test google' : function (browser) {
    browser
      .url('https://google.com')
      .waitForElementPresent('foo', 1000);

    PublicReportingAPI.logInfo('Info log for demo test item');
    PublicReportingAPI.launchLogDebug('Debug log for launch');
    PublicReportingAPI.addDescription('Demo test for google.com');
  },

  'searching nightwatch' : function(browser) {
    browser
      .setValue('input[type=text]', ['nightwatch', browser.Keys.ENTER])
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
