/*
 *  Copyright 2020 EPAM Systems
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

const fs = require('fs');
const path = require('path');
const { PublicReportingAPI, FILE_TYPES } = require('../../../build');
PublicReportingAPI.init();

const suiteName = 'Search';

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
    browser.end(() => {
      PublicReportingAPI.destroy();
    });
  },

  'demo test google' : function (client) {
    client
      .url('https://google.com')
      .waitForElementPresent('foo', 1000);

    // PublicReportingAPI.logInfo('Info log for demo test item');
    // PublicReportingAPI.launchLogDebug('Debug log for launch');
    // PublicReportingAPI.setDescription('Demo test for google.com');
  },

  'part two' : function(client) {
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
