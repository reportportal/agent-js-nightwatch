const reporter = {
  sendMessage: (message) => console.log(message)
};

describe('Ecosia', function() {

  beforeEach((browser) => {
    // Setup ReportPortal agent here
    browser.reporter = reporter;
    browser.reporter.sendMessage('Start suite ecosia');
  });

  afterEach((browser) => {
    const varSuccess = browser.currentTest.results.failed === 0;

    /**
     * determines the test's result and passes it to Reporting
     */
    if (varSuccess) {
      browser.reporter.sendMessage('Finish passed test');
    } else {
      browser.reporter.sendMessage('Finish failed test');
    }
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
