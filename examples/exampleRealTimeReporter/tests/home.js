const { PublicReportingAPI } = require('../../../build');

describe('Home', function() {

  before((browser, done) => {
    const item = {
      name: 'Home',
      description: 'Suite search tests',
      attributes: [{ key: 'suite', value: 'search' }],
    };

    PublicReportingAPI.startSuite(item);
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
      description: 'Test description',
    };

    PublicReportingAPI.startTestCase(item);
    done();
  });

  afterEach((browser, done) => {
    PublicReportingAPI.finishTestCase(browser.currentTest);
    done();
  });

  test('demo test', function(browser) {
    browser
      .url('https://www.ecosia.org/')
      .setValue('input[type=search]', 'nightwatch')
      .click('button[type=submit]')
      .assert.containsText('.mainline-results', 'Nightwatch.js')
      .end();
  });

  test('beta test', function(browser) {
    browser
      .url('https://www.ecosia.org/')
      .setValue('input[type=search]', 'nightwatch')
      .click('button[type=submit]')
      .assert.containsText('.mainline-results', 'Nightwatch.jsasd')
      .end();
  });
});
