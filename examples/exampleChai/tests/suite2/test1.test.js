const expect = require('chai').expect;

module.exports = {
  'test 1': {
    testSmth: function () {
      expect(false).to.be.ok;
    },
    testSmth2: function () {
      expect(true).to.be.ok;
    }
  }
};
