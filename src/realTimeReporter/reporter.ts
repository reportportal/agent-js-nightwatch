import RPClient from 'reportportal-client';
// @ts-ignore
import { EVENTS as CLIENT_EVENTS } from 'reportportal-client/lib/events';
import { getLastItem } from '../utils';
import { STATUSES, EVENTS } from '../constants';
import { subscribeToEvent } from './utils';
import {
  StartLaunchRQ,
  FinishTestItemRQ,
  ReportPortalConfig,
  StartTestItemRQ,
  Attribute,
} from '../models';

interface TestItem {
  id: string;
  attributes?: Array<Attribute>;
  description?: string;
}

export default class Reporter {
  private client: RPClient;
  private launchId: string;
  private testItems: Array<TestItem>; // TODO: move it to the store in the future

  constructor(config: ReportPortalConfig) {
    this.registerEventsListeners();

    this.client = new RPClient(config);
    this.testItems = [];
  }

  private registerEventsListeners(): void {
    subscribeToEvent(EVENTS.START_TEST_ITEM, this.startTestItem.bind(this));
    subscribeToEvent(EVENTS.FINISH_TEST_ITEM, this.finishTestItem.bind(this));

    subscribeToEvent(CLIENT_EVENTS.ADD_ATTRIBUTES, this.setItemAttributes.bind(this));
    subscribeToEvent(CLIENT_EVENTS.ADD_DESCRIPTION, this.addItemDescription.bind(this));
  };

  private getLastItem(): TestItem {
    return getLastItem(this.testItems);
  };

  private getItemDataObj(testResult: any): FinishTestItemRQ {
    if (!testResult) {
      return {
        status: STATUSES.PASSED,
      };
    }
    const currentTestItem = testResult.results.testcases
        ? testResult.results.testcases[testResult.name]
        : testResult.results;

    let status;
    if (currentTestItem.skipped !== 0) {
      status = STATUSES.SKIPPED;
    } else if (currentTestItem.failed !== 0) {
      status = STATUSES.FAILED;
    } else {
      status = STATUSES.PASSED;
    }

    return {
      status,
    };
  };

  public startLaunch(startLaunchObj: StartLaunchRQ): void {
    this.launchId = this.client.startLaunch(startLaunchObj).tempId;
  };

  public finishLaunch(launchFinishObj = {}): void {
    this.client.finishLaunch(this.launchId, launchFinishObj);
  };

  public startTestItem(startTestItemObj: StartTestItemRQ): void {
    const parentItem = this.getLastItem();
    const itemObj = this.client.startTestItem(startTestItemObj, this.launchId, parentItem ? parentItem.id : undefined);

    const testItem: TestItem = {
      id: itemObj.tempId,
      attributes: [],
      description: startTestItemObj.description || '',
    };

    this.testItems.push(testItem);
  };

  public finishTestItem(testResult: any): void { // for now support only sync reporting
    const finishTestItemObj = this.getItemDataObj(testResult);
    const { id, ...data } = this.testItems.pop();
    const finishItemObj = { ...data, ...finishTestItemObj };

    this.client.finishTestItem(id, finishItemObj);
  };

  public setItemAttributes(data: { attributes: Array<Attribute> }): void {
    const currentItem = this.getLastItem();

    currentItem.attributes = currentItem.attributes.concat(data.attributes);
  };

  public addItemDescription(data: { text: string }): void {
    const currentItem = this.getLastItem();

    currentItem.description = `${currentItem.description}
${data.text}`;
  };
}
