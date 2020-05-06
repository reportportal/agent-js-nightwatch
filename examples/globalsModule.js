const { RealTimeReporter } = require('../build');
const config = require('./rp');

let rpReporter;

module.exports = {
    before: function (done) {
        rpReporter = new RealTimeReporter({ ...config, launch: 'REAL_TIME_REPORTER_LAUNCH' });

        console.log('---START_LAUNCH---');
        console.log(process.pid);
        console.log('---START_LAUNCH---');

        const launchParams = {
            description: 'This launch contains nightwatch tests results run with chromedriver',
            attributes: [{ key: 'lib', value: 'chromedriver' }, { key: 'agent', value: 'nightwatch' }],
        };

        rpReporter.startLaunch(launchParams);
        done();
    },

    after: function (done) {
        console.log('---FINISH_LAUNCH---');

        rpReporter.finishLaunch();
        done();
    },
};
