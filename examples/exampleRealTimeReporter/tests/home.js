const { PublicReportingAPI } = require('../../../build');

const suiteName = 'Home';

describe(suiteName, function() {

  before((browser, done) => {
    const item = {
      name: suiteName,
      attributes: [{ key: 'suite', value: 'home' }],
      description: 'Common suite description',
    };
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
    const item = {
      name: browser.currentTest.name,
    };

    PublicReportingAPI.startTestCase(item);
    done();
  });

  afterEach((browser, done) => {
    PublicReportingAPI.finishTestCase(browser.currentTest);

    PublicReportingAPI.startAfterTestCase();
    // afterEach related actions
    PublicReportingAPI.finishAfterTestCase();

    done();
  });

  test('demo test', function(browser) {
    PublicReportingAPI.addDescription('Demo test for ecosia.org');

    browser
      .url('https://www.ecosia.org/')
      .setValue('input[type=search]', 'nightwatch')
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
