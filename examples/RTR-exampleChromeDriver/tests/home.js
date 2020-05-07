const { PublicReportingAPI } = require('../../../build');

const suiteName = 'Home';

describe(suiteName, function() {

  this.retries(3);

  before(() => {
    const item = {
      name: suiteName,
      attributes: [{ key: 'suite', value: 'home.js' }],
      description: 'Suite description',
    };
    PublicReportingAPI.startSuite(item);

    PublicReportingAPI.startBeforeSuite();
    // beforeSuite related actions
    PublicReportingAPI.finishBeforeSuite();
  });

  after((browser, done) => {
    PublicReportingAPI.finishSuite(suiteName);
    browser.end(() => {
      done();
    });
  });

  beforeEach((browser) => {
    PublicReportingAPI.startTestCase(browser.currentTest);
  });

  afterEach((browser) => {
    PublicReportingAPI.finishTestCase(browser.currentTest);
  });

  test('ecosia.org test', function(browser) {
    PublicReportingAPI.addDescription('Demo test for ecosia.org');

    browser
      .url('https://www.ecosia.org/')
      .setValue('input[type=search]', 'nightwatch')
      .saveScreenshot('testScreen.png', (data) => {
        PublicReportingAPI.logInfo('This is a log with screenshot attachment', {
          name: 'testScreen',
          content: data.value,
        });
      })
      .rpSaveScreenshot('rpTestScreen.jpg')
      .rpLog('Screenshot attached successfully')
      .click('button[type=submit]')
      .assert.containsText('.mainline-results', 'Nightwatch.js')
      .end();

    PublicReportingAPI.logInfo('Info log for suite', null, suiteName);

    PublicReportingAPI.addAttributes([{ key: 'check', value: 'success' }]);
    PublicReportingAPI.addDescription('Attributes added to the test item');
  });

  test('search nightwatch on ecosia.org', function(browser) {
    PublicReportingAPI.addDescription('Demo test for ecosia.org #2');

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
