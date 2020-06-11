# agent-js-nightwatch

Agent for integration NightwatchJS with ReportPortal.
* More about [NightwatchJS](https://nightwatchjs.org/)
* More about [ReportPortal](http://reportportal.io/)

## Installation

Install the agent in your project:
```cmd
npm install --save-dev @reportportal/agent-js-nightwatch
```
## Configuration

Create rp.json file with reportportal configuration:
```json
{
    "token": "00000000-0000-0000-0000-000000000000",
    "endpoint": "https://your.reportportal.server/api/v1",
    "project": "YourReportPortalProjectName",
    "launch": "YourLauncherName",
    "attributes": [
        {
            "key": "YourKey",
            "value": "YourValue"
        },
        {
            "value": "YourValue"
        }
    ],
    "description": "Your launch description",
    "rerun": true,
    "rerunOf": "launchUuid of already existed launch",
    "parallelRun": true
}
```

| Parameter             | Description                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| token                 | User's Report Portal token from which you want to send requests. It can be found on the profile page of this user.|
| endpoint              | URL of your server. For example 'https://server:8080/api/v1'.                                                     |
| launch                | Name of launch at creation.                                                                                       |
| project               | The name of the project in which the launches will be created.                                                    |
| rerun                 | *Default: false.* Enable [rerun](https://github.com/reportportal/documentation/blob/master/src/md/src/DevGuides/rerun.md)|
| rerunOf               | UUID of launch you want to rerun. If not specified, report portal will update the latest launch with the same name|
| parallelRun           | *Default: false.* Indicates if tests running in parallel (uses for post-factum-reporter)|

## Reporting

**This agent supports two types of reporting:**
* Post-factum reporting
* Real-time reporting

### Post-factum  reporting

This reporter sends results of test executions to Report Portal when **all tests have been finished**.

1. Create reporter.js file with code like:
    ```javascript
    const { PostFactumReporter } = require('@reportportal/agent-js-nightwatch');
    const config = require('./rp.json');
    const reporter = new PostFactumReporter(config);
    
    module.exports = {
        write : (results, options, done) => {
          return reporter.startReporting(results, done);
        }
    };
    ```

2. Create the `nightwatch.conf.js` configuration file.

3. Run your tests with --config and --reporter options specified:
    ```cmd
    nightwatch --config ./nightwatch.conf.js --reporter ./reporter.js
    ```

### Real-time reporting

This reporter sends results of test executions to Report Portal **during tests run**.

Since Nightwatch does not initially support real-time test report results, this approach requires a bit more preparation.

Since tests in nightwatch can be run sequentially or in parallel, each of the execution methods requires its own small preparation steps.

Each run type supports the Reporting API to use it directly in tests.

#### Default run

1. Create the `nightwatch.conf.js` configuration file.

2. Create the `reporter` instance like:
    ```javascript
    const { RealTimeReporter, ReportingAPI } = require('@reportportal/agent-js-nightwatch');
    const config = require('./rp.json');
    const rpReporter = new RealTimeReporter(config);
    ```

3. Add global `before` and `after` hook handlers:<br/>
Start and finish launch here.<br/>
Also to use Reporting API it must be initialized in `before` hook and destroyed in `after` hook.
    ```javascript
    module.exports = {
       // ...your config,
       globals: {
          before: function (done) {
             ReportingAPI.init();

             const launchParams = { // launch params from rp.json can be overwritten here
                 description: 'Awesome launch',
                 attributes: [{ key: 'status', value: 'passed' }],
             };
             
             rpReporter.startLaunch(launchParams);
             done();
          },
                    
          after: function (done) {
             rpReporter.finishLaunch();
          
             ReportingAPI.destroy();
             done();
          },  
       }
       
    }
    
    ```
4. Now you able to use agent API in tests to report results in real time (see the API reference).<br/>
No other preparations are required from the test definitions.

#### Parallel run

1. Create the `nightwatch.conf.js` configuration file.

2. Add global `before` and `after` hook handlers:<br/>
Start and finish launch here.<br/>
Also you create `rpReporter` instance inside the `before` hook body, because the reporter must be created **ONLY ONCE** for the main process.
    ```javascript
    const { RealTimeReporter } = require('@reportportal/agent-js-nightwatch');
    const config = require('./rp.json');
    let rpReporter;
 
    module.exports = {
       // ...your config,
       globals: {
          before: function (done) {
             rpReporter = new RealTimeReporter(config);

             const launchParams = { // launch params from rp.json can be overwritten here
                 description: 'Awesome launch',
                 attributes: [{ key: 'status', value: 'passed' }],
             };
             
             rpReporter.startLaunch(launchParams);
             done();
          },
                    
          after: function (done) {
             rpReporter.finishLaunch();
             done();
          },  
       }
       
    }
    
    ```

3. To start using the Reporting API in tests, you must initialize and destroy the API in **EACH** test suite:
    ```javascript
    const { ReportingAPI } = require('@reportportal/agent-js-nightwatch');
    ReportingAPI.init();
    
    describe('Suite name', function() {
    
      after((browser, done) => {
        browser.end(() => {
          ReportingAPI.destroy();
          done();
        });
      });
    });
    ```
    
4. Now you able to use agent API in tests to report results in real time (see the API reference).

#### Reporting API

##### Items&hooks reporting

The API provide methods for starting and finishing test items and hooks.

###### startSuite
`ReportingAPI.startSuite(suiteStartObj);`<br/>
where `suiteStartObj = { name: string, attributes: Array<Attribute>, description: string }`<br/>
**required**: `name`<br/>
Example:
```javascript
describe('Suite name', function() {
  before((browser, done) => {
    const suiteStartObj = {
      name: 'Suite name',
      attributes: [{ key: 'suite', value: 'any' }],
      description: 'Suite description',
    };
    ReportingAPI.startSuite(suiteStartObj);
    done();
  });
});
```

###### finishSuite
`ReportingAPI.finishSuite(suiteName);`<br/>
**required**: `suiteName`<br/>
Example:
```javascript
describe('Suite name', function() {
  after((browser, done) => {
      ReportingAPI.finishSuite('Suite name');
      browser.end(() => {
        done();
      });
    });
});
```

###### startTestCase
`ReportingAPI.startTestCase(currentTest, parentName);`<br/>
where `currentTest = browser.currentTest` object<br/>
**required**: `currentTest`<br/>
`parentName` **required** only for parallel run<br/>
Example:
```javascript
describe('Suite name', function() {
  beforeEach((browser) => {
      ReportingAPI.startTestCase(browser.currentTest, 'Suite name');
    });
});
```

###### finishTestCase
`ReportingAPI.finishTestCase(currentTest);`<br/>
where `currentTest = browser.currentTest` object<br/>
**required**: `currentTest`<br/>
Example:
```javascript
describe('Suite name', function() {
  afterEach((browser) => {
      ReportingAPI.finishTestCase(browser.currentTest);
    });
});
```

###### startBeforeSuite, finishBeforeSuite
`ReportingAPI.startBeforeSuite(parentName);`<br/>
`ReportingAPI.finishBeforeSuite(data);`<br/>
where `data = { name: string, status: string, attributes: Array<Attribute>, description: string }`<br/>
where `status` must be one of the following: *passed*, *failed*, *stopped*, *skipped*, *interrupted*, *cancelled*, *info*, *warn*<br/>
Example:
```javascript
describe('Suite name', function() {
  before((browser, done) => {
    ReportingAPI.startBeforeSuite();
    // beforeSuite related actions
    ReportingAPI.finishBeforeSuite();

    ReportingAPI.startSuite({ name: 'Suite name' });
    done();
  });
});
```

###### startAfterSuite, finishAfterSuite
`ReportingAPI.startAfterSuite(parentName);`<br/>
`ReportingAPI.finishAfterSuite(data);`<br/>
where `data = { name: string, status: string, attributes: Array<Attribute>, description: string }`<br/>
where `status` must be one of the following: *passed*, *failed*, *stopped*, *skipped*, *interrupted*, *cancelled*, *info*, *warn*<br/>
Example:
```javascript
describe('Suite name', function() {
  after((browser, done) => {
    ReportingAPI.finishSuite(suiteName);
    
    ReportingAPI.startAfterSuite();
    // afterSuite related actions
    ReportingAPI.finishAfterSuite();
    
    browser.end(() => {
      done();
    });
  });
});
```

###### startBeforeTestCase, finishBeforeTestCase
`ReportingAPI.startBeforeTestCase(parentName);`<br/>
**required**: `parentName`<br/>
`ReportingAPI.finishBeforeTestCase(data);`<br/>
where `data = { name: string, status: string, attributes: Array<Attribute>, description: string }`<br/>
where `status` must be one of the following: *passed*, *failed*, *stopped*, *skipped*, *interrupted*, *cancelled*, *info*, *warn*<br/>
Example:
```javascript
describe('Suite name', function() {
  beforeEach((browser) => {
    ReportingAPI.startBeforeTestCase(suiteName);
    // beforeEach related actions
    ReportingAPI.finishBeforeTestCase();
      
    ReportingAPI.startTestCase(browser.currentTest, suiteName);
  });
});
```

###### startAfterTestCase, finishAfterTestCase
`ReportingAPI.startAfterTestCase(parentName);`<br/>
**required**: `parentName`<br/>
`ReportingAPI.finishAfterTestCase(data);`<br/>
where `data = { name: string, status: string, attributes: Array<Attribute>, description: string }`<br/>
where `status` must be one of the following: *passed*, *failed*, *stopped*, *skipped*, *interrupted*, *cancelled*, *info*, *warn*<br/>
Example:
```javascript
describe('Suite name', function() {
  afterEach((browser) => {
    ReportingAPI.finishTestCase(browser.currentTest);
    
    ReportingAPI.startAfterTestCase(suiteName);
    // afterEach related actions
    ReportingAPI.finishAfterTestCase();
  });
});
```

##### Data attaching

The API provide methods for attaching data (logs, attributes, description, testCaseId, status).

###### addAttributes
Add attributes(tags) to the current test or for provided by name. Should be called inside of corresponding test.<br/>
`ReportingAPI.addAttributes(attributes: Array<Attribute>, itemName?: string);`<br/>
**required**: `attributes`<br/>
`itemName` **required** only for parallel run<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function() {
    ReportingAPI.addAttributes([{ key: 'check', value: 'success' }]);
  });
});
```

###### addDescription
Append text description to the current test or for provided by name. Should be called inside of corresponding test.<br/>
`ReportingAPI.addDescription(text: string, itemName?: string);`<br/>
**required**: `text`<br/>
`itemName` **required** only for parallel run<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function() {
    ReportingAPI.addDescription('Item description');
  });
});
```

###### setTestCaseId
Set test case id to the current test or for provided by name. Should be called inside of corresponding test.<br/>
`ReportingAPI.setTestCaseId(id: string, itemName?: string);`<br/>
**required**: `id`<br/>
`itemName` **required** only for parallel run<br/>
If testCaseId not specified, it will be generated automatically.<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function() {
    ReportingAPI.setTestCaseId('itemTestCaseId');
  });
});
```

###### log
Send logs to report portal for the current test or for provided by name. Should be called inside of corresponding test.<br/>
`ReportingAPI.log(level: LOG_LEVELS, message: string, file?: Attachment, itemName?: string);`<br/>
**required**: `level`, `message`<br/>
`itemName` **required** only for parallel run<br/>
where `level` can be one of the following: *TRACE*, *DEBUG*, *WARN*, *INFO*, *ERROR*, *FATAL*<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function() {
    const attachment = {
      name: 'Cities',
      type: FILE_TYPES.JSON,
      content: fs.readFileSync(path.resolve(__dirname, '../data', 'cities.json')),
    };

    ReportingAPI.log('INFO', 'Log with attachment', attachment);
  });
});
```

###### logInfo, logDebug, logWarn, logError, logTrace, logFatal
Send logs with corresponding level to report portal for the current test or for provided by name. Should be called inside of corresponding test.<br/>
`ReportingAPI.logInfo(message: string, file?: Attachment, itemName?: string);`<br/>
`ReportingAPI.logDebug(message: string, file?: Attachment, itemName?: string);`<br/>
`ReportingAPI.logWarn(message: string, file?: Attachment, itemName?: string);`<br/>
`ReportingAPI.logError(message: string, file?: Attachment, itemName?: string);`<br/>
`ReportingAPI.logTrace(message: string, file?: Attachment, itemName?: string);`<br/>
`ReportingAPI.logFatal(message: string, file?: Attachment, itemName?: string);`<br/>
**required**: `message`<br/>
`itemName` **required** only for parallel run<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function() {
    ReportingAPI.logInfo('Log message');
    ReportingAPI.logDebug('Log message');
    ReportingAPI.logWarn('Log message');
    ReportingAPI.logError('Log message');
    ReportingAPI.logTrace('Log message');
    ReportingAPI.logFatal('Log message');
  });
});
```

###### launchLog
Send logs to report portal for the current launch. Should be called inside of the any test.<br/>
`ReportingAPI.log(level: LOG_LEVELS, message: string, file?: Attachment);`<br/>
**required**: `level`, `message`<br/>
where `level` can be one of the following: *TRACE*, *DEBUG*, *WARN*, *INFO*, *ERROR*, *FATAL*<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function() {
    const attachment = {
      name: 'Cities',
      type: FILE_TYPES.JSON,
      content: fs.readFileSync(path.resolve(__dirname, '../data', 'cities.json')),
    };

    ReportingAPI.launchLog('INFO', 'Log with attachment for launch', attachment);
  });
});
```

###### launchLogInfo, launchLogDebug, launchLogWarn, launchLogError, launchLogTrace, launchLogFatal
Send logs with corresponding level to report portal for the current launch. Should be called inside of the any test.<br/>
`ReportingAPI.launchLogInfo(message: string, file?: Attachment);`<br/>
`ReportingAPI.launchLogDebug(message: string, file?: Attachment);`<br/>
`ReportingAPI.launchLogWarn(message: string, file?: Attachment);`<br/>
`ReportingAPI.launchLogError(message: string, file?: Attachment);`<br/>
`ReportingAPI.launchLogTrace(message: string, file?: Attachment);`<br/>
`ReportingAPI.launchLogFatal(message: string, file?: Attachment);`<br/>
**required**: `message`<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function() {
    ReportingAPI.launchLogInfo('Log message');
    ReportingAPI.launchLogDebug('Log message');
    ReportingAPI.launchLogWarn('Log message');
    ReportingAPI.launchLogError('Log message');
    ReportingAPI.launchLogTrace('Log message');
    ReportingAPI.launchLogFatal('Log message');
  });
});
```

###### setStatus
Assign corresponding status to the current test item or for provided by name.<br/>
`ReportingAPI.setStatus(status: string, itemName?: string);`<br/>
**required**: `status`<br/>
`itemName` **required** only for parallel run<br/>
where `status` must be one of the following: *passed*, *failed*, *stopped*, *skipped*, *interrupted*, *cancelled*, *info*, *warn*<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function(browser) {
    ReportingAPI.setStatus('passed', browser.currentTest.name);
  });
});
```

###### setStatusFailed, setStatusPassed, setStatusSkipped, setStatusStopped, setStatusInterrupted, setStatusCancelled, setStatusInfo, setStatusWarn
 Assign corresponding status to the current test item or for provided by name.<br/>
`ReportingAPI.setStatusFailed(itemName?: string);`<br/>
`ReportingAPI.setStatusPassed(itemName?: string);`<br/>
`ReportingAPI.setStatusSkipped(itemName?: string);`<br/>
`ReportingAPI.setStatusStopped(itemName?: string);`<br/>
`ReportingAPI.setStatusInterrupted(itemName?: string);`<br/>
`ReportingAPI.setStatusCancelled(itemName?: string);`<br/>
`ReportingAPI.setStatusInfo(itemName?: string);`<br/>
`ReportingAPI.setStatusWarn(itemName?: string);`<br/>
**required**: `message`<br/>
`itemName` **required** only for parallel run<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function() {
    ReportingAPI.setStatusFailed('Log message');
    ReportingAPI.setStatusPassed('Log message');
    ReportingAPI.setStatusSkipped('Log message');
    ReportingAPI.setStatusStopped('Log message');
    ReportingAPI.setStatusInterrupted('Log message');
    ReportingAPI.setStatusCancelled('Log message');
    ReportingAPI.setStatusInfo('Log message');
    ReportingAPI.setStatusWarn('Log message');
  });
});
```

#### ReportPortal custom commands

Do not forget to specify custom commands path in your `nightwatch.conf.js` file:
```javascript
module.exports = {
   // ...your config,
   custom_commands_path: path.resolve('@reportportal/agent-js-nightwatch/commands'),
}
```

##### rpLog
Send log with corresponding level to report portal for the current test or for provided by name. Should be called inside of corresponding test.<br/>
`ReportingAPI.setStatus(message: string, level: string, itemName?: string);`<br/>
**required**: `message, level = 'INFO'`<br/>
`itemName` **required** only for parallel run<br/>
where `level` can be one of the following: *TRACE*, *DEBUG*, *WARN*, *INFO*, *ERROR*, *FATAL*<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function(browser) {
    browser
      .url('https://www.ecosia.org/')
      .rpLog('Log message')
      .end();
  });
});
```

##### rpSaveScreenshot
Send log with screenshot attachment with provided name to report portal for the current test or for provided by name. Should be called inside of corresponding test.<br/>
`ReportingAPI.rpSaveScreenshot(fileName: string, itemName?: string, callback?: function);`<br/>
**required**: `fileName`<br/>
`itemName` **required** only for parallel run<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function(browser) {
    browser
      .url('https://www.ecosia.org/')
      .rpSaveScreenshot('rpTestScreen.jpg')
      .end();
  });
});
```

##### rpScreenshot
Send log with screenshot attachment to report portal for the current test or for provided by name. Should be called inside of corresponding test.<br/>
`ReportingAPI.rpScreenshot(itemName?: string, callback?: function);`<br/>
`itemName` **required** only for parallel run<br/>
Example:
```javascript
describe('Suite name', function() {
  test('ecosia.org test', function(browser) {
    browser
      .url('https://www.ecosia.org/')
      .rpScreenshot()
      .end();
  });
});
```

#### Integration with Sauce Labs

To integrate with Sauce Labs just add attributes: 

```javascript
[{
 "key": "SLID",
 "value": "# of the job in Sauce Labs"
}, {
 "key": "SLDC",
 "value": "EU (your job region in Sauce Labs)"
}]
```
