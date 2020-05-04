const chromedriver = require('chromedriver');

module.exports = {
  src_folders: ['./exampleRealTimeReporter/tests'],
  custom_commands_path: '../build/commands',
  globals_path: '../globalsModule.js',
  test_workers: true,

  test_settings: {
    default: {
      skip_testcases_on_fail: false,
      webdriver: {
        start_process: true,
        server_path: chromedriver.path,
        port: 4444,
        cli_args: ['--port=4444']
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
