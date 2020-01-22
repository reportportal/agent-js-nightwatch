const expect = require('chai').expect;

module.exports = {
  'example test': function (step){
    testAssertion(step, 'bar');
  }
};

const testAssertion = (step, length) => {
  step.assert.ok(true);
  expect(length).to.equal('bar');
};
