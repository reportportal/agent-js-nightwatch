const { expect } = require('chai');

module.exports = {

  before(step) {
    testAssertion(step, 'bar');
  },

  'example test': function(step) {
    testAssertion(step, 'bar');
  },
};

const testAssertion = (step, length) => {
  step.assert.ok(true);
  expect(length).to.equal('bar');
};
