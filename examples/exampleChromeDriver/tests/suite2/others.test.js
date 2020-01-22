const chromedriver = require('chromedriver');

module.exports = {
  before: function() {
    chromedriver.start();
  },

  after: function() {
    chromedriver.stop();
  },

  'NightwatchJS.org': function (browser) {
    browser
      .url('http://nightwatchjs.org?beforeEach')
      .waitForElementVisible('body', 1500)
      .pause(1000)
      .end()
  },

  'Finished': function(client) {
    client
      .perform(() => {
        console.log('[perform]: Finished Test:', client.currentTest.name)
      })
      .end();
  }
};
