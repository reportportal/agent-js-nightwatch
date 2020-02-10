const NightwatchAgent = require('../../src/nightwatchReportportalAgent');
const config = require('../rp');
const params = require('./params');

const agent = new NightwatchAgent({ ...config, ...params });

module.exports = {
  write: (results, options, done) => {
    console.log(results);
    return agent.startReporting(results, done);
  },
};
