import _ from 'lodash';
import RPClient from 'reportportal-client';
import { STATUSES, EVENTS } from '../constants';
import { subscribeToEvent } from './utils';

export default class Reporter {
  constructor({ agentOptions = {}, ...clientConfig }) {
    this.registerEventsListeners();

    this.client = new RPClient(clientConfig);
    this.options = agentOptions;
    this.itemIds = [];
  }

  private registerEventsListeners() {
    subscribeToEvent(EVENTS.START_TEST_ITEM, this.startTestItem.bind(this));
    subscribeToEvent(EVENTS.FINISH_TEST_ITEM, this.finishTestItem.bind(this));
  };

  private getLastItem() {
    return _.last(this.itemIds);
  };

  private getItemDataObj(testResult) {
    if (!testResult) {
      return {};
    }
    const varSuccess = testResult.results.failed === 0;

    return {
      status: varSuccess ? STATUSES.PASSED : STATUSES.FAILED,
    };
  };

  public startLaunch(launchParams) {
    this.launchId = this.client.startLaunch(launchParams).tempId;
  };

  public finishLaunch(launchFinishObj = {}) {
    this.client.finishLaunch(this.launchId, launchFinishObj);
  };

  public startTestItem(itemData) {
    const itemObj = this.client.startTestItem(itemData, this.launchId, this.getLastItem());

    this.itemIds.push(itemObj.tempId);
  };

  public finishTestItem(testResult) { // for now support only sync reporting
    const itemData = this.getItemDataObj(testResult);

    this.client.finishTestItem(this.itemIds.pop(), itemData);
  };
}
