const chromedriver = require('chromedriver');
const { RealTimeReporter, PublicReportingAPI } = require('../../build');
const config = require('../rp');

let rpReporter;

module.exports = {
  src_folders: ['./RTR-exampleChromeDriver/tests'],
  custom_commands_path: '../build/commands',

  test_settings: {
    default: {
      skip_testcases_on_fail: false,
      webdriver: {
        start_process: true,
        server_path: chromedriver.path,
        port: 4444,
        cli_args: ['--port=4444']
      },
      globals: {
        before: function (done) {
          PublicReportingAPI.init();
          rpReporter = new RealTimeReporter({ ...config, launch: 'REAL_TIME_REPORTER_LAUNCH' });

          const launchParams = {
            description: 'This launch contains nightwatch tests results run with chromedriver',
            attributes: [{ key: 'lib', value: 'chromedriver' }, { key: 'agent', value: 'nightwatch' }],
          };

          rpReporter.startLaunch(launchParams);
          done();
        },

        after: function (done) {
          rpReporter.finishLaunch();

          PublicReportingAPI.destroy();
          done();
        },
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
