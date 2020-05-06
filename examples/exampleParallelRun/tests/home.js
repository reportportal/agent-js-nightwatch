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

const { PublicReportingAPI } = require('../../../build');
PublicReportingAPI.init();

const suiteName = 'Home';

describe(suiteName, function() {

  this.retries(3);

  before(() => {
    const item = {
      name: suiteName,
      attributes: [{ key: 'suite', value: 'home' }],
      description: 'Common suite description',
    };
    PublicReportingAPI.startSuite(item);

    // PublicReportingAPI.startBeforeSuite();
    // beforeSuite related actions
    // PublicReportingAPI.finishBeforeSuite();
  });

  after((browser) => {
    PublicReportingAPI.finishSuite(suiteName);
    browser.end(() => {
      PublicReportingAPI.destroy();
    });
  });

  beforeEach((browser) => {
    PublicReportingAPI.startTestCase(browser.currentTest, suiteName);
  });

  afterEach((browser) => {
    PublicReportingAPI.finishTestCase(browser.currentTest);
  });

  test('demo test', function(browser) {
    // PublicReportingAPI.setDescription('Demo test for ecosia.org');

    browser
      .url('https://www.ecosia.org/')
      .setValue('input[type=search]', 'nightwatch')
      // .saveScreenshot('testScreen.png', (data) => {
      //   PublicReportingAPI.logInfo('This is a log with screenshot attachment', {
      //     name: 'testScreen',
      //     content: data.value,
      //   });
      // })
      // .rpSaveScreenshot('rpTestScreen.jpg')
      // .rpLog('Screenshot attached successfully')
      .click('button[type=submit]')
      .assert.containsText('.mainline-results', 'Nightwatch.js')
      .end();

    // PublicReportingAPI.logInfo('Info log for suite', null, suiteName);

    // PublicReportingAPI.addAttributes([{ key: 'check', value: 'success' }]);
    // PublicReportingAPI.setDescription('Attributes added to the test item');
  });

  test('beta test', function(browser) {
    // PublicReportingAPI.setDescription('Demo test for ecosia.org #2');

    let expectedMainlineText = 'Nightwatch.jsasd';

    if (browser.currentTest.results.retries > 2) {
      expectedMainlineText = 'Nightwatch.js';
    }

    browser
      .url('https://www.ecosia.org/')
      .setValue('input[type=search]', 'nightwatch')
      .click('button[type=submit]')
      .assert.containsText('.mainline-results', expectedMainlineText)
      .end();
  });
});