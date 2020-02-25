import _ from 'lodash';
import RPClient from 'reportportal-client';
import { STATUSES, EVENTS } from '../constants';
import { subscribeToEvent } from './utils';
import { StartLaunchRQ, FinishTestItemRQ, AgentOptions, ReportPortalConfig, StartTestItemRQ } from '../models';

export default class Reporter {
  private client: RPClient;
  private readonly options: AgentOptions;
  private launchId: string;
  private itemIds: Array<string>;

  constructor(clientConfig: ReportPortalConfig, agentOptions: AgentOptions) {
    this.registerEventsListeners();

    this.client = new RPClient(clientConfig);
    this.options = agentOptions;
    this.itemIds = [];
  }

  private registerEventsListeners(): void {
    subscribeToEvent(EVENTS.START_TEST_ITEM, this.startTestItem.bind(this));
    subscribeToEvent(EVENTS.FINISH_TEST_ITEM, this.finishTestItem.bind(this));
  };

  private getLastItem(): string {
    return _.last(this.itemIds);
  };

  private getItemDataObj(testResult: any): FinishTestItemRQ {
    if (!testResult) {
      return {
        status: STATUSES.PASSED,
      };
    }
    const varSuccess = testResult.results.failed === 0;

    return {
      status: varSuccess ? STATUSES.PASSED : STATUSES.FAILED,
    };
  };

  public startLaunch(startLaunchObj: StartLaunchRQ): void {
    this.launchId = this.client.startLaunch(startLaunchObj).tempId;
  };

  public finishLaunch(launchFinishObj = {}): void {
    this.client.finishLaunch(this.launchId, launchFinishObj);
  };

  public startTestItem(startTestItemObj: StartTestItemRQ): void {
    const itemObj = this.client.startTestItem(startTestItemObj, this.launchId, this.getLastItem());

    this.itemIds.push(itemObj.tempId);
  };

  public finishTestItem(testResult: any): void { // for now support only sync reporting
    const finishTestItemObj = this.getItemDataObj(testResult);

    this.client.finishTestItem(this.itemIds.pop(), finishTestItemObj);
  };
}
