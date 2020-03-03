# agent-js-nightwatch

Agent for integration NightwatchJS with ReportPortal.
* More about [NightwatchJS](https://nightwatchjs.org/)
* More about [ReportPortal](http://reportportal.io/)

## Usage
1. Install the agent in your project:
    ```cmd
    npm install --save-dev @reportportal/agent-js-nightwatch
    ```
2. Create rp.json file with reportportal configuration:
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
        "rerunOf": "00000000-0000-0000-0000-000000000000",
        "screenshotsPath": "path" // used only for PostFactumReporter
    }
    ```
    Where
    - rerun - to enable rerun
    - rerunOf - UUID of launch you want to rerun. If not specified, report portal will update the latest launch with the same name

3. Create reporter.js file with code like:
    ```javascript
    const NightwatchAgent = require('agent-js-nightwatch');
    const config = require('./rp.json');
    const agent = new NightwatchAgent(config);
    
    module.exports = {
        write : (results, options, done) => {
          return agent.startReporting(results, done);
        }
    };
    ```

4. Create the nightwatch.json configuration file.

5. Run your tests with --config and --reporter options specified:
```cmd
nightwatch --config ./nightwatch.json --reporter ./reporter.js
```
## Example
To run example:
```cmd
npm run example:{exampleName}
```
