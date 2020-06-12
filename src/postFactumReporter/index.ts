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

import moment from 'moment';
import RPClient from '@reportportal/client-javascript';
import { AgentOptions, Attribute, ReportPortalConfig } from '../models';
import { buildCodeRef, getSystemAttributes, getLastItem } from '../utils';
import { STATUSES, LOG_LEVELS, TEST_ITEM_TYPES, EVENTS } from '../constants';

export default class PostFactumReporter {
  private client: RPClient;
  private readonly options: AgentOptions;
  private launchId: string;
  private launchStartTime: number | Date;
  private launchParams: { attributes: Attribute[]; description: string };

  constructor(config: ReportPortalConfig & AgentOptions) {
    const { attributes = [], description, parallelRun = false, ...clientConfig } = config;
    const launchAttributes = attributes.concat(getSystemAttributes());

    this.client = new RPClient(clientConfig);
    this.launchParams = { attributes: launchAttributes, description };
    this.options = { parallelRun };
    this.launchStartTime = Date.now();
  }

  public startReporting(results: any, done: (param: any) => void): void {
    this.client
      .checkConnect()
      .then(() => this.report(results, done))
      .catch((e: any) => this.finalize(done, { status: STATUSES.FAILED }, e));
  }

  private report(results: any, done: (param: any) => void) {
    const tests = this.collectItems(results);
    const { endTime }: any = getLastItem(tests);

    this.reportItems(tests);
    this.finalize(done, { endTime });
  }

  private reportItems(items: Array<any>) {
    this.launchId = this.client.startLaunch({
      startTime: this.launchStartTime,
      ...this.launchParams,
    }).tempId;

    const stepsTempIds: Array<string> = [];

    items.forEach(({ action, fileObj, ...item } = {}) => {
      let itemObj;
      switch (action) {
        case EVENTS.START_TEST_ITEM:
          itemObj = this.client.startTestItem(item, this.launchId, stepsTempIds[0]);
          stepsTempIds.push(itemObj.tempId);
          break;
        case EVENTS.FINISH_TEST_ITEM:
          this.client.finishTestItem(stepsTempIds.pop(), item);
          break;
        case EVENTS.ADD_LOG:
          this.client.sendLog(getLastItem(stepsTempIds), item, fileObj);
          break;
        default:
          break;
      }
    });
  }

  private collectItems(results: any) {
    const { parallelRun } = this.options;
    const items: {
      action: EVENTS;
      name?: string;
      startTime?: Date;
      endTime?: Date;
      level?: LOG_LEVELS;
      codeRef?: string;
      type?: TEST_ITEM_TYPES;
      time?: Date;
      message?: string;
      status?: STATUSES;
    }[] = [];
    const suiteNames = Object.keys(results.modules);
    let nextSuiteStartTime = new Date(this.launchStartTime);

    suiteNames.forEach((suiteName) => {
      const suite = results.modules[suiteName];
      const suiteCodeRef = buildCodeRef(suite.modulePath);
      const suiteStartTime = nextSuiteStartTime;
      const suiteEndTime = moment(suiteStartTime)
        .add(suite.time, 's')
        .toDate();

      if (!parallelRun) {
        nextSuiteStartTime = suiteEndTime;
      }

      items.push({
        action: EVENTS.START_TEST_ITEM,
        name: suiteName,
        startTime: suiteStartTime,
        codeRef: suiteCodeRef,
        type: TEST_ITEM_TYPES.SUITE,
      });

      const tests = { ...suite.completed };
      if (suite.skipped.length) {
        suite.skipped.forEach((itemName: string) => {
          tests[itemName] = {
            name: itemName,
            status: STATUSES.SKIPPED,
          };
        });
      }
      const testNames = Object.keys(tests);
      let testStartTime = suiteStartTime;

      testNames.forEach((testName) => {
        const test = tests[testName];

        items.push({
          action: EVENTS.START_TEST_ITEM,
          name: testName,
          startTime: testStartTime,
          codeRef: `${suiteCodeRef}/${testName}`,
          type: TEST_ITEM_TYPES.STEP,
        });

        testStartTime = moment(testStartTime)
          .add(test.timeMs, 'ms')
          .toDate();

        let { status } = test;

        if (!status) {
          status = test.failed ? STATUSES.FAILED : STATUSES.PASSED;
        }

        if (status === STATUSES.FAILED) {
          if (test.stackTrace) {
            items.push({
              action: EVENTS.ADD_LOG,
              level: LOG_LEVELS.ERROR,
              time: testStartTime,
              message: test.stackTrace,
            });
          }
        }

        if (test.failed || test.errors) {
          test.assertions.forEach((assertion: any) => {
            items.push({
              action: EVENTS.ADD_LOG,
              level: LOG_LEVELS.INFO,
              time: testStartTime,
              message: assertion.message,
            });
            if (assertion.failure) {
              items.push({
                action: EVENTS.ADD_LOG,
                level: LOG_LEVELS.DEBUG,
                time: testStartTime,
                message: assertion.failure,
              });
            }
            if (assertion.stackTrace) {
              items.push({
                action: EVENTS.ADD_LOG,
                level: LOG_LEVELS.ERROR,
                time: testStartTime,
                message: assertion.stackTrace,
              });
            }
          });
        }

        items.push({
          action: EVENTS.FINISH_TEST_ITEM,
          endTime: testStartTime,
          status,
        });
      });

      items.push({
        action: EVENTS.FINISH_TEST_ITEM,
        endTime: suiteEndTime,
      });
    });

    return items;
  }

  private finalize(done: (param: any) => void, params: any, error?: any) {
    if (this.launchId) {
      this.client.finishLaunch(this.launchId, params);
    }
    done(error);
  }
}
