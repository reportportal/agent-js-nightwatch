module.exports = {
  launch: 'NIGHTWATCH_EXAMPLE_CHAI',
  agentOptions: {
    launchParams: {
      description: 'This launch contains nightwatch tests results asserted by chai',
      attributes: [{ key: 'lib', value: 'chai' }],
    },
  },
};
