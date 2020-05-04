const { RealTimeReporter } = require('../build');
const config = require('./rp');

let rpReporter;

module.exports = {
    before: function (done) {
        rpReporter = new RealTimeReporter({ ...config, launch: 'REAL_TIME_REPORTER_LAUNCH' });
        console.log('---CREATE_REPORTER---');

        console.log('---START_LAUNCH---');
        const launchParams = {
            description: 'This launch contains nightwatch tests results run with chromedriver',
            attributes: [{ key: 'lib', value: 'chromedriver' }, { key: 'agent', value: 'nightwatch' }],
        };

        rpReporter.startLaunch(launchParams);
        done();
    },

    after: function (done) {
        rpReporter.finishLaunch();
        done();
    },
};
