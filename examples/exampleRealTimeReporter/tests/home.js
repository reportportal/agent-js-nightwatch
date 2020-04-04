const { PublicReportingAPI } = require('../../../build');

const suiteName = 'Home';

describe(suiteName, function() {

  this.retries(3);

  before((browser, done) => {
    const item = {
      name: suiteName,
      attributes: [{ key: 'suite', value: 'home' }],
      description: 'Common suite description',
    };
    console.log(browser);
    PublicReportingAPI.startSuite(item);

    PublicReportingAPI.startBeforeSuite();
    // beforeSuite related actions
    PublicReportingAPI.finishBeforeSuite();

    done();
  });

  after((browser, done) => {
    PublicReportingAPI.finishSuite();
    browser.end();
    done();
  });

  beforeEach((browser, done) => {
    PublicReportingAPI.startTestCase(browser.currentTest);
    done();
  });

  afterEach((browser, done) => {
    PublicReportingAPI.finishTestCase(browser.currentTest);
    done();
  });

  test('demo test', function(browser) {
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

    PublicReportingAPI.addAttributes([{ key: 'check', value: 'success' }]);
    PublicReportingAPI.addDescription('Attributes added to the test item');
  });

  test('beta test', function(browser) {
    PublicReportingAPI.addDescription('Demo test for ecosia.org #2');

    browser
      .url('https://www.ecosia.org/')
      .setValue('input[type=search]', 'nightwatch')
      .click('button[type=submit]')
      .assert.containsText('.mainline-results', 'Nightwatch.jsasd')
      .end();
  });
});
