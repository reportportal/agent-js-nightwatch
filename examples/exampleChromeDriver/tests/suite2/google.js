const chromedriver = require('chromedriver');

module.exports = {
  // '@disabled': true,

  before() {
    chromedriver.start();
  },

  after() {
    chromedriver.stop();
  },

  'Demo test Google' : function (client) {
    client
      .url('http://google.com')
      .pause(1000)
      .waitForElementVisible('body', 1000)
      .assert.urlContains('blablabla');

    client.end();
  },

  'Demo test Loogle' : function (client) {
    client
      .url('http://google.com')
      .pause(1000)
      .waitForElementVisible('body', 1000)
      .assert.urlContains('blablabla');

    client.end();
  }
};
