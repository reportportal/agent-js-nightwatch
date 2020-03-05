import RPClient from 'reportportal-client';
import { getLastItem } from '../utils';
import { STATUSES, EVENTS } from '../constants';
import { subscribeToEvent } from './utils';
import {
  StartLaunchRQ,
  FinishTestItemRQ,
  ReportPortalConfig,
  StartTestItemRQ,
  Attribute,
  Parameter,
} from '../models';

interface TestItem {
  id: string;
  attributes?: Array<Attribute>;
  parameters?: Array<Parameter>;
}

export default class Reporter {
  private client: RPClient;
  private launchId: string;
  private testItems: Array<TestItem>;

  constructor(config: ReportPortalConfig) {
    this.registerEventsListeners();

    this.client = new RPClient(config);
    this.testItems = [];
  }

  private registerEventsListeners(): void {
    subscribeToEvent(EVENTS.START_TEST_ITEM, this.startTestItem.bind(this));
    subscribeToEvent(EVENTS.FINISH_TEST_ITEM, this.finishTestItem.bind(this));
    subscribeToEvent(EVENTS.SET_ATTRIBUTE, this.setItemAttribute.bind(this));
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
    const currentTestItemName = testResult.name;
    const currentTestItem = testResult.results.testcases
        ? testResult.results.testcases[currentTestItemName]
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

    this.testItems.push({ id: itemObj.tempId, attributes: [], parameters: [] });
  };

  public finishTestItem(testResult: any): void { // for now support only sync reporting
    const finishTestItemObj = this.getItemDataObj(testResult);
    const { id, ...data } = this.testItems.pop();
    const finishItemObj = { ...data, ...finishTestItemObj };

    this.client.finishTestItem(id, finishItemObj);
  };

  public setItemAttribute(attribute: Attribute | Array<Attribute>): void {
    const currentItem = this.getLastItem();

    if (Array.isArray(attribute)) {
      currentItem.attributes = currentItem.attributes.concat(attribute);
    } else {
      currentItem.attributes.push(attribute);
    }

    this.testItems.map((item) => item.id === currentItem.id ? currentItem : item);
  };
}
