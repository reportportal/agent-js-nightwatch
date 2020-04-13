import RPClient from 'reportportal-client';
// @ts-ignore
import { EVENTS as CLIENT_EVENTS } from 'reportportal-client/lib/events';
import { getLastItem, getAgentInfo } from '../utils';
import { EVENTS, LOG_LEVELS, STATUSES } from '../constants';
import { getStartLaunchObj, setDefaultFileType, subscribeToEvent } from './utils';
import {
  Attribute,
  FinishTestItemRQ,
  LogRQ,
  ReportPortalConfig,
  StartLaunchRQ,
  StartTestItemRQ,
} from '../models';

interface TestItem {
  id: string;
  name: string;
  attributes?: Array<Attribute>;
  description?: string;
}

export default class Reporter {
  private client: RPClient;
  private launchId: string;
  private testItems: Array<TestItem>; // TODO: move it to the store in the future

  constructor(config: ReportPortalConfig) {
    this.registerEventListeners();

    const agentInfo = getAgentInfo();

    this.client = new RPClient(config, agentInfo);
    this.testItems = [];
  }

  private registerEventListeners(): void {
    subscribeToEvent(EVENTS.START_TEST_ITEM, this.startTestItem.bind(this));
    subscribeToEvent(EVENTS.FINISH_TEST_ITEM, this.finishTestItem.bind(this));

    subscribeToEvent(CLIENT_EVENTS.ADD_LOG, this.sendLogToItem.bind(this));
    subscribeToEvent(CLIENT_EVENTS.ADD_LAUNCH_LOG, this.sendLogToLaunch.bind(this));
    subscribeToEvent(CLIENT_EVENTS.ADD_ATTRIBUTES, this.addItemAttributes.bind(this));
    subscribeToEvent(CLIENT_EVENTS.SET_DESCRIPTION, this.setItemDescription.bind(this));
  };

  private getLastItem(): TestItem {
    return getLastItem(this.testItems);
  };

  private getTestItemByName(itemName: string): TestItem {
    const testItem = this.testItems.find((item) => item.name === itemName);

    return testItem || null;
  };

  private getCurrentItem(itemName: string): TestItem {
    const itemByName = this.getTestItemByName(itemName);

    return itemByName || this.getLastItem();
  }

  private removeItemById(id: string): void {
    this.testItems = this.testItems.filter((item) => item.id !== id);
  }

  private getItemDataObj(testResult: any, id: string): FinishTestItemRQ {
    if (!testResult || !testResult.results) {
      return {
        status: STATUSES.PASSED,
      };
    }

    const currentTestItemResults = testResult.results.testcases[testResult.name];
    let status;

    if (currentTestItemResults.skipped !== 0) {
      status = STATUSES.SKIPPED;
    } else if (currentTestItemResults.failed !== 0) {
      status = STATUSES.FAILED;
      const assertionsResult = currentTestItemResults.assertions[0];

      const itemLog: LogRQ = {
        level: LOG_LEVELS.ERROR,
        message: `${assertionsResult.fullMsg}
${assertionsResult.stackTrace}`,
      };

      this.client.sendLog(id, itemLog);
    } else {
      status = STATUSES.PASSED;
    }

    return {
      status,
    };
  };

  public startLaunch(launchObj: StartLaunchRQ): void {
    const startLaunchObj: StartLaunchRQ = getStartLaunchObj(launchObj);

    this.launchId = this.client.startLaunch(startLaunchObj).tempId;
  };

  public finishLaunch(launchFinishObj = {}): void {
    this.client.finishLaunch(this.launchId, launchFinishObj);
  };

  private startTestItem(startTestItemObj: StartTestItemRQ): void {
    const parentItem = this.getCurrentItem(startTestItemObj.parentName);
    const parentId = parentItem ? parentItem.id : undefined;
    const itemObj = this.client.startTestItem(startTestItemObj, this.launchId, parentId);

    const testItem: TestItem = {
      id: itemObj.tempId,
      name: startTestItemObj.name,
      attributes: [],
      description: startTestItemObj.description || '',
    };

    this.testItems.push(testItem);
  };

  private finishTestItem(testResult: any): void {
    const { id, ...data } = this.getTestItemByName(testResult.name);
    const finishTestItemObj = this.getItemDataObj(testResult, id);
    const finishItemObj = { ...data, ...finishTestItemObj };

    this.removeItemById(id);
    this.client.finishTestItem(id, finishItemObj);
  };

  private sendLogToItem(data: { log: LogRQ; suite?: string }): void {
    const { log: { file, ...log }, suite: suiteName } = data;
    const currentItem = this.getCurrentItem(suiteName);
    const fileToSend = setDefaultFileType(file);

    this.client.sendLog(currentItem.id, log, fileToSend);
  };

  private sendLogToLaunch(data: LogRQ): void {
    const { file, ...log } = data;
    const fileToSend = setDefaultFileType(file);

    this.client.sendLog(this.launchId, log, fileToSend);
  }

  private addItemAttributes(data: { attributes: Array<Attribute>, suite?: string }): void {
    const currentItem = this.getCurrentItem(data.suite);

    currentItem.attributes = currentItem.attributes.concat(data.attributes);
  };

  private setItemDescription(data: { text: string, suite?: string }): void {
    const currentItem = this.getCurrentItem(data.suite);

    currentItem.description = data.text;
  };
}
