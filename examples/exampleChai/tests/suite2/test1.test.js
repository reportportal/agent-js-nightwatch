const { expect } = require('chai');

module.exports = {
  'test 1': {
    testSmth() {
      expect(false).to.be.ok;
    },
    testSmth2() {
      expect(true).to.be.ok;
    },
  },
};
