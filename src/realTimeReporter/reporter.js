const _ = require('lodash');
const RPClient = require('reportportal-client');

const EVENTS = require('../constants/events');
const STATUSES = require('../constants/statuses');
const { subscribeToEvent } = require('./utils');

class Reporter {
  constructor({ agentOptions = {}, ...clientConfig }) {
    this.registerEventsListeners();

    this.client = new RPClient(clientConfig);
    this.options = agentOptions;
    this.itemIds = [];
  }

  registerEventsListeners() {
    subscribeToEvent(EVENTS.START_TEST_ITEM, this.startTestItem.bind(this));
    subscribeToEvent(EVENTS.FINISH_TEST_ITEM, this.finishTestItem.bind(this));
  };

  getLastItem() {
    return _.last(this.itemIds);
  };

  getItemDataObj(testResult) {
    if (!testResult) {
      return {};
    }
    const varSuccess = testResult.results.failed === 0;

    return {
      status: varSuccess ? STATUSES.PASSED : STATUSES.FAILED,
    };
  };

  startLaunch(launchParams) {
    this.launchId = this.client.startLaunch(launchParams).tempId;
  };

  finishLaunch(launchFinishObj = {}) {
    this.client.finishLaunch(this.launchId, launchFinishObj);
  };

  startTestItem(itemData) {
    const itemObj = this.client.startTestItem(itemData, this.launchId, this.getLastItem());

    this.itemIds.push(itemObj.tempId);
  };

  finishTestItem(testResult) { // for now support only sync reporting
    const itemData = this.getItemDataObj(testResult);

    this.client.finishTestItem(this.itemIds.pop(), itemData);
  };
}

module.exports = Reporter;
