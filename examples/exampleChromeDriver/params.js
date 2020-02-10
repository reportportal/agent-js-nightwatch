module.exports = {
  launch: 'NIGHTWATCH_EXAMPLE_CHROMEDRIVER',
  agentOptions: {
    launchParams: {
      description: 'This launch contains nightwatch tests results run with chromedriver',
      attributes: [{ key: 'lib', value: 'chromedriver' }],
    },
    screenshotsPath: './screenshots',
  },
};
