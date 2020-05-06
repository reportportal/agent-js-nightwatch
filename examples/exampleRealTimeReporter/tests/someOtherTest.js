const fs = require('fs');
const path = require('path');
const { PublicReportingAPI, FILE_TYPES } = require('../../../build');

const suiteName = 'Some other test';

module.exports = {
  before: function () {
    const item = {
      name: suiteName,
      description: 'Suite description',
      attributes: [{ key: 'suite', value: 'someOtherTest.js' }],
    };
    PublicReportingAPI.startSuite(item);
  },

  beforeEach: function (browser) {
    PublicReportingAPI.startTestCase(browser.currentTest, suiteName);
  },

  afterEach: function (browser) {
    PublicReportingAPI.finishTestCase(browser.currentTest);

    // PublicReportingAPI.startAfterTestCase();
    // afterEach related actions
    // PublicReportingAPI.finishAfterTestCase();
  },

  after: function (browser) {
    PublicReportingAPI.finishSuite(suiteName);
    browser.end();
  },

  'test google' : function (client) {
    client
      .url('https://google.com')
      .waitForElementPresent('foo', 1000);

    // PublicReportingAPI.logInfo('Info log for demo test item');
    // PublicReportingAPI.launchLogDebug('Debug log for launch');
    // PublicReportingAPI.setDescription('Demo test for google.com');
  },

  'searching nightwatch' : function(client) {
    client
      .setValue('input[type=text]', ['nightwatch', client.Keys.ENTER])
      .pause(1000)
      .assert.urlContains('search?')
      .assert.urlContains('nightwatch')
      .end();

    // const attachment = {
    //   name: 'Cities',
    //   type: FILE_TYPES.JSON,
    //   content: fs.readFileSync(path.resolve(__dirname, '../data', 'cities.json')),
    // };
    //
    // PublicReportingAPI.launchLogInfo('Log with attachment for launch', attachment);
  }
};
