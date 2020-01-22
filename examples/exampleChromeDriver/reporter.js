const NightwatchAgent = require('../../src/nightwatchReportportalAgent');
const config = require('../rp');
const launchParams = require('./launchParams');
const agent = new NightwatchAgent({ ...config, ...launchParams });

module.exports = {
  write : (results, options, done) => {
    return agent.startReporting(results, done);
  }
};
