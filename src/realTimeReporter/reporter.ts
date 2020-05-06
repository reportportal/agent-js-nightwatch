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

import RPClient from 'reportportal-client';
// @ts-ignore
import { EVENTS as CLIENT_EVENTS } from 'reportportal-client/lib/events';
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
import {
  getStartLaunchObj,
  setDefaultFileType,
  subscribeToEvent,
  calculateTestItemStatus,
} from './utils';
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

  private initReporter(): void {
    startIPCServer((server: any) => {
        server.on(EVENTS.START_TEST_ITEM, this.startTestItem);
        server.on(EVENTS.FINISH_TEST_ITEM, this.finishTestItem);

        // server.on(CLIENT_EVENTS.ADD_LOG, this.sendLogToItem);
        // server.on(CLIENT_EVENTS.ADD_LAUNCH_LOG, this.sendLogToLaunch);
        // server.on(CLIENT_EVENTS.ADD_ATTRIBUTES, this.addItemAttributes);
        // server.on(CLIENT_EVENTS.SET_DESCRIPTION, this.setItemDescription);
      }
    );
  };

  private stopReporter() {
    this.launchId = null;

    stopIPCServer();
  };

  private getFinishItemObj(testResult: any, storageItem: StorageTestItem): FinishTestItemRQ {
    const { id, ...data } = storageItem;

    if (!testResult || !testResult.results) {
      return {
        ...data,
        status: STATUSES.PASSED,
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
      ...data,
      status,
    };
  };

  public startLaunch(launchObj: StartLaunchRQ): void {
    const startLaunchObj: StartLaunchRQ = getStartLaunchObj(launchObj);

    this.launchId = this.client.startLaunch(startLaunchObj).tempId;
  };

  public finishLaunch(launchFinishObj = {}): void {
    this.client.finishLaunch(this.launchId, launchFinishObj);

    this.stopReporter();
  };

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

  private sendLogToItem = (data: { log: LogRQ; suite?: string }): void => {
    const { log: { file, ...log }, suite: suiteName } = data;
    const currentItem = this.storage.getCurrentItem(suiteName);
    const fileToSend = setDefaultFileType(file);

    this.client.sendLog(currentItem.id, log, fileToSend);
  };

  private sendLogToLaunch = (data: LogRQ): void => {
    const { file, ...log } = data;
    const fileToSend = setDefaultFileType(file);

    this.client.sendLog(this.launchId, log, fileToSend);
  };

  private addItemAttributes = (data: { attributes: Array<Attribute>, suite?: string }): void => {
    const currentItem = this.storage.getCurrentItem(data.suite);

    currentItem.attributes = currentItem.attributes.concat(data.attributes);
  };

  private setItemDescription = (data: { text: string, suite?: string }): void => {
    const currentItem = this.storage.getCurrentItem(data.suite);

    currentItem.description = data.text;
  };
}
