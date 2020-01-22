# agent-js-nightwatch

Agent for integration Nightwatch with ReportPortal.
[ReportPortal](http://reportportal.io/)<br>
[ReportPortal on GitHub](https://github.com/reportportal)

### How to use
1. Install the agent in your project:
```cmd
will be soon
```
2. Create rp.json file with reportportal configuration:
```
{
    // client settings
    "token": "00000000-0000-0000-0000-000000000000",
    "endpoint": "https://your.reportportal.server/api/v1",
    "project": "YourReportPortalProjectName",
    "launch": "YourLauncherName",
    // agent settings
    "agentOptions": {
        "launchParams": {
            "attributes": [
                {
                    "key": "YourKey",
                    "value": "YourValue"
                },
                {
                    "value": "YourValue"
                }
            ],
            "description": "Your launch description"
        }
    }
}
```
3. Create reporter.js file with code like:
```javascript
const NightwatchAgent = require('agent-js-nightwatch');
const config = require('./rp');
const agent = new NightwatchAgent(config);

module.exports = {
    write : (results, options, done) => {
      return agent.startReporting(results, done);
    }
};
```
4. Add a reporter to executed command:
```cmd
nightwatch --config examples/nightwatch.json --reporter examples/reporter.js
```
### Example

To run example:
```cmd
npm test
```
