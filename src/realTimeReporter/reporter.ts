/*
 *  Copyright 2020 EPAM Systems
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import RPClient from '@reportportal/client-javascript';
import { getAgentInfo } from '../utils';
import { EVENTS, LOG_LEVELS, STATUSES } from '../constants';
import {
  Attribute,
  FinishTestItemRQ,
  LogRQ,
  ReportPortalConfig,
  StartLaunchRQ,
  StartTestItemRQ,
  StorageTestItem,
} from '../models';
import { getStartLaunchObj, setDefaultFileType, calculateTestItemStatus } from './utils';
import { startIPCServer, stopIPCServer } from './ipc/server';
import { Storage } from './storage';

export default class Reporter {
  private client: RPClient;
  private launchId: string;
  private storage: Storage;
  private config: ReportPortalConfig;

  constructor(config: ReportPortalConfig) {
    this.initReporter();
    const agentInfo = getAgentInfo();

    this.config = config;
    this.client = new RPClient(config, agentInfo);
    this.storage = new Storage();
  }

  private registerEventListeners = (server: any): void => {
    server.on(EVENTS.START_TEST_ITEM, this.startTestItem);
    server.on(EVENTS.FINISH_TEST_ITEM, this.finishTestItem);

    server.on(EVENTS.ADD_LOG, this.sendLogToItem);
    server.on(EVENTS.ADD_LAUNCH_LOG, this.sendLogToLaunch);
    server.on(EVENTS.ADD_ATTRIBUTES, this.addItemAttributes);
    server.on(EVENTS.ADD_DESCRIPTION, this.addItemDescription);
    server.on(EVENTS.SET_TEST_CASE_ID, this.setTestCaseId);
    server.on(EVENTS.SET_STATUS, this.setStatusToItem);
  };

  private unregisterEventListeners = (server: any): void => {
    server.off(EVENTS.START_TEST_ITEM, '*');
    server.off(EVENTS.FINISH_TEST_ITEM, '*');

    server.off(EVENTS.ADD_LOG, '*');
    server.off(EVENTS.ADD_LAUNCH_LOG, '*');
    server.off(EVENTS.ADD_ATTRIBUTES, '*');
    server.off(EVENTS.ADD_DESCRIPTION, '*');
    server.off(EVENTS.SET_TEST_CASE_ID, '*');
    server.off(EVENTS.SET_STATUS, '*');
  };

  private initReporter(): void {
    startIPCServer(this.registerEventListeners, this.unregisterEventListeners);
  }

  private stopReporter() {
    this.launchId = null;

    stopIPCServer(this.unregisterEventListeners);
  }

  private getFinishItemObj(testResult: any, storageItem: StorageTestItem): FinishTestItemRQ {
    const { id, ...data } = storageItem;
    const { name, ...resultData } = testResult;

    if (!testResult.results) {
      return {
        ...data,
        ...resultData,
      };
    }

    const { status, assertionsMessage } = calculateTestItemStatus(testResult);

    if (status === STATUSES.FAILED) {
      const itemLog: LogRQ = {
        level: LOG_LEVELS.ERROR,
        message: assertionsMessage,
      };

      this.client.sendLog(id, itemLog);
    }

    return {
      status,
      ...data,
    };
  }

  public startLaunch(launchObj: StartLaunchRQ): void {
    const startLaunchObj: StartLaunchRQ = getStartLaunchObj(launchObj, this.config);

    this.launchId = this.client.startLaunch(startLaunchObj).tempId;
  }

  public finishLaunch(launchFinishObj = {}): void {
    this.client.finishLaunch(this.launchId, launchFinishObj);

    this.stopReporter();
  }

  private startTestItem = (startTestItemObj: StartTestItemRQ): void => {
    const parentItem = this.storage.getItemByName(startTestItemObj.parentName);
    const parentId = parentItem ? parentItem.id : undefined;
    const itemObj = this.client.startTestItem(startTestItemObj, this.launchId, parentId);

    const testItem: StorageTestItem = {
      id: itemObj.tempId,
      name: startTestItemObj.name,
      attributes: [],
      description: '',
    };

    this.storage.addTestItem(testItem);
  };

  private finishTestItem = (testResult: any): void => {
    const storageItem = this.storage.getItemByName(testResult.name);
    const finishTestItemObj = this.getFinishItemObj(testResult, storageItem);

    this.client.finishTestItem(storageItem.id, finishTestItemObj);

    this.storage.removeItemById(storageItem.id);
  };

  private sendLogToItem = (data: { log: LogRQ; itemName?: string }): void => {
    const {
      log: { file, ...log },
      itemName,
    } = data;
    const currentItem = this.storage.getCurrentItem(itemName);
    const fileToSend = setDefaultFileType(file);

    this.client.sendLog(currentItem.id, log, fileToSend);
  };

  private sendLogToLaunch = (data: LogRQ): void => {
    const { file, ...log } = data;
    const fileToSend = setDefaultFileType(file);

    this.client.sendLog(this.launchId, log, fileToSend);
  };

  private addItemAttributes = (data: { attributes: Array<Attribute>; itemName?: string }): void => {
    const currentItem = this.storage.getCurrentItem(data.itemName);

    currentItem.attributes = currentItem.attributes.concat(data.attributes);
  };

  private addItemDescription = (data: { text: string; itemName?: string }): void => {
    const currentItem = this.storage.getCurrentItem(data.itemName);

    currentItem.description = `${currentItem.description}<br/>${data.text}`;
  };

  private setTestCaseId = (data: { id: string; itemName?: string }): void => {
    const { id, itemName } = data;
    const currentItem = this.storage.getCurrentItem(itemName);

    currentItem.testCaseId = id;
  };

  private setStatusToItem = (data: { status: STATUSES; itemName?: string }): void => {
    const { status, itemName } = data;
    const currentItem = this.storage.getCurrentItem(itemName);

    currentItem.status = status;
  };
}
