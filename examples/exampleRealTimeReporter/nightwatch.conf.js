const chromedriver = require('chromedriver');

const { RealTimeReporter } = require('../../build');
const config = require('../rp');

const reporter = new RealTimeReporter({ ...config, launch: 'REAL_TIME_REPORTER_LAUNCH' });

module.exports = {
  src_folders : ['./exampleRealTimeReporter/tests'],
  custom_commands_path: '../build/commands',

  test_settings: {
    default: {
      webdriver: {
        start_process: true,
        server_path: chromedriver.path,
        port: 4444,
        cli_args: ['--port=4444']
      },
      globals: {
        before: function (done) {
          const launchParams = {
            description: 'This launch contains nightwatch tests results run with chromedriver',
            attributes: [{ key: 'lib', value: 'chromedriver' }, { key: 'agent', value: 'nightwatch' }],
          };

          reporter.startLaunch(launchParams);
          done();
        },

        after: function (done) {
          reporter.finishLaunch();
          done();
        },
      },
      persist_globals: true,
      screenshots : {
        enabled: true,
        path: './screenshots',
        on_failure: true
      },
      desiredCapabilities: {
        browserName: 'chrome',
          chromeOptions: {
          args: ['--headless']
        },
        acceptSslCerts: true
      }
    }
  }
};
