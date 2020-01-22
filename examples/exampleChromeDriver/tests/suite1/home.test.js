const chromedriver = require('chromedriver');

module.exports = {
  before: function() {
    chromedriver.start();
  },

  after: function() {
    chromedriver.stop();
  },

  'Demo test beta.demo.reportportal.io': function (browser) {
    browser
      .url('https://beta.demo.reportportal.io/')
      .pause(1000)
      .end()
  },

  'Demo test ecosia.org': function (browser) {
    browser
      .url('https://www.ecosia.org/')
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
