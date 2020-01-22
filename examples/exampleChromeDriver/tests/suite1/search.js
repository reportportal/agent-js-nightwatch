const chromedriver = require('chromedriver');

module.exports = {
  '@disabled': false,

  before() {
    chromedriver.start();
  },

  after() {
    chromedriver.stop();
  },

  'demo test google' : function (client) {
    client
      .url('https://google.com')
      .waitForElementPresent('body', 1000);
  },

  'part two' : function(client) {
    client
      .setValue('input[type=text]', ['nightwatch', client.Keys.ENTER])
      .pause(1000)
      .assert.urlContains('search?')
      .assert.urlContains('nightwatch')
      .end();
  }
};
