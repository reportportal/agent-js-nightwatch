import RPClient from 'reportportal-client';
// @ts-ignore
import { EVENTS as CLIENT_EVENTS } from 'reportportal-client/lib/events';
import { getLastItem } from '../utils';
import { STATUSES, EVENTS, LOG_LEVELS } from '../constants';
import { subscribeToEvent, setDefaultFileType } from './utils';
import {
  StartLaunchRQ,
  FinishTestItemRQ,
  ReportPortalConfig,
  StartTestItemRQ,
  Attribute,
  LogRQ,
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
    this.registerEventListeners();

    this.client = new RPClient(config);
    this.testItems = [];
  }

  private registerEventListeners(): void {
    subscribeToEvent(EVENTS.START_TEST_ITEM, this.startTestItem.bind(this));
    subscribeToEvent(EVENTS.FINISH_TEST_ITEM, this.finishTestItem.bind(this));

    subscribeToEvent(CLIENT_EVENTS.ADD_LOG, this.sendLogToItem.bind(this));
    subscribeToEvent(CLIENT_EVENTS.ADD_LAUNCH_LOG, this.sendLogToLaunch.bind(this));
    subscribeToEvent(CLIENT_EVENTS.ADD_ATTRIBUTES, this.setItemAttributes.bind(this));
    subscribeToEvent(CLIENT_EVENTS.ADD_DESCRIPTION, this.addItemDescription.bind(this));
  };

  private getLastItem(): TestItem {
    return getLastItem(this.testItems);
  };

  private getItemDataObj(testResult: any, id: string): FinishTestItemRQ {
    if (!testResult) {
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

  public startLaunch(startLaunchObj: StartLaunchRQ): void {
    this.launchId = this.client.startLaunch(startLaunchObj).tempId;
  };

  public finishLaunch(launchFinishObj = {}): void {
    this.client.finishLaunch(this.launchId, launchFinishObj);
  };

  private startTestItem(startTestItemObj: StartTestItemRQ): void {
    const parentItem = this.getLastItem();
    const itemObj = this.client.startTestItem(startTestItemObj, this.launchId, parentItem ? parentItem.id : undefined);

    const testItem: TestItem = {
      id: itemObj.tempId,
      attributes: [],
      description: startTestItemObj.description || '',
    };

    this.testItems.push(testItem);
  };

  private finishTestItem(testResult: any): void { // for now support only sync reporting
    const { id, ...data } = this.testItems.pop();
    const finishTestItemObj = this.getItemDataObj(testResult, id);
    const finishItemObj = { ...data, ...finishTestItemObj };

    this.client.finishTestItem(id, finishItemObj);
  };

  private sendLogToItem(data: LogRQ): void {
    const currentItem = this.getLastItem();
    const { file, ...log } = data;
    const fileToSend = setDefaultFileType(file);

    this.client.sendLog(currentItem.id, log, fileToSend);
  };

  private sendLogToLaunch(data: LogRQ): void {
    const { file, ...log } = data;
    const fileToSend = setDefaultFileType(file);

    this.client.sendLog(this.launchId, log, fileToSend);
  }

  private setItemAttributes(data: { attributes: Array<Attribute> }): void {
    const currentItem = this.getLastItem();

    currentItem.attributes = currentItem.attributes.concat(data.attributes);
  };

  private addItemDescription(data: { text: string }): void {
    const currentItem = this.getLastItem();

    currentItem.description = `${currentItem.description}
${data.text}`;
  };
}
