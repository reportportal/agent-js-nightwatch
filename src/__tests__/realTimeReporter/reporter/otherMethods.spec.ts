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

import { EVENTS, LOG_LEVELS, STATUSES } from '../../../constants';
import { RealTimeReporter } from '../../../realTimeReporter';
import * as utils from '../../../realTimeReporter/utils';
import * as IPCServer from '../../../realTimeReporter/ipc/server';
import { getDefaultMockConfig, getStorageTestItemMock, RPClientMock } from '../../mocks';
import { LogRQ, StorageTestItem } from '../../../models';

describe('otherMethods', function() {
  const serverMock = {
    on: () => {},
  };
  const spyStartIPCServer = jest
    .spyOn(IPCServer, 'startIPCServer')
    .mockImplementation((callback: any) => {
      callback(serverMock);
    });
  const spyServerOn = jest.spyOn(serverMock, 'on');
  let reporter: RealTimeReporter;

  beforeEach(() => {
    const config = getDefaultMockConfig();
    const client = new RPClientMock();

    reporter = new RealTimeReporter(config);
    // @ts-ignore access to the class private property
    reporter.client = client;
    // @ts-ignore access to the class private property
    reporter.launchId = 'tempLaunchId';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initReporter (called in reporter constructor)', function() {
    test('invokes startIPCServer to init IPC server', function() {
      expect(spyStartIPCServer).toHaveBeenCalledWith(
        // @ts-ignore access to the class private property
        reporter.registerEventListeners,
        // @ts-ignore access to the class private property
        reporter.unregisterEventListeners,
      );
    });
  });

  describe('registerEventListeners (called in initReporter constructor)', function() {
    test('invokes server on method the 6 times for necessary events', function() {
      expect(spyServerOn).toHaveBeenCalledTimes(8);
    });

    test('invokes server on method for START_TEST_ITEM event', function() {
      expect(spyServerOn).toHaveBeenNthCalledWith(
        1,
        EVENTS.START_TEST_ITEM,
        // @ts-ignore access to the class private property
        reporter.startTestItem,
      );
    });

    test('invokes server on method for FINISH_TEST_ITEM event', function() {
      expect(spyServerOn).toHaveBeenNthCalledWith(
        2,
        EVENTS.FINISH_TEST_ITEM,
        // @ts-ignore access to the class private property
        reporter.finishTestItem,
      );
    });

    test('invokes server on method for ADD_LOG event', function() {
      expect(spyServerOn).toHaveBeenNthCalledWith(
        3,
        EVENTS.ADD_LOG,
        // @ts-ignore access to the class private property
        reporter.sendLogToItem,
      );
    });

    test('invokes server on method for ADD_LAUNCH_LOG event', function() {
      expect(spyServerOn).toHaveBeenNthCalledWith(
        4,
        EVENTS.ADD_LAUNCH_LOG,
        // @ts-ignore access to the class private property
        reporter.sendLogToLaunch,
      );
    });

    test('invokes server on method for ADD_ATTRIBUTES event', function() {
      expect(spyServerOn).toHaveBeenNthCalledWith(
        5,
        EVENTS.ADD_ATTRIBUTES,
        // @ts-ignore access to the class private property
        reporter.addItemAttributes,
      );
    });

    test('invokes server on method for ADD_DESCRIPTION event', function() {
      expect(spyServerOn).toHaveBeenNthCalledWith(
        6,
        EVENTS.ADD_DESCRIPTION,
        // @ts-ignore access to the class private property
        reporter.addItemDescription,
      );
    });

    test('invokes server on method for SET_TEST_CASE_ID event', function() {
      expect(spyServerOn).toHaveBeenNthCalledWith(
        7,
        EVENTS.SET_TEST_CASE_ID,
        // @ts-ignore access to the class private property
        reporter.setTestCaseId,
      );
    });

    test('invokes server on method for SET_STATUS event', function() {
      expect(spyServerOn).toHaveBeenNthCalledWith(
        8,
        EVENTS.SET_STATUS,
        // @ts-ignore access to the class private property
        reporter.setStatusToItem,
      );
    });
  });

  describe('stopReporter', function() {
    const spyStopIPCServer: jest.SpyInstance = jest
      .spyOn(IPCServer, 'stopIPCServer')
      .mockImplementation(() => {});

    beforeEach(() => {
      // @ts-ignore access to the class private property
      reporter.launchId = 'tempLaunchId';
    });

    test("should set null to reporter's launchId", function() {
      // @ts-ignore access to the class private property
      reporter.stopReporter();

      // @ts-ignore access to the class private property
      expect(reporter.launchId).toBe(null);
    });

    test('should call stopIPCServer to close IPC server connection', function() {
      // @ts-ignore access to the class private property
      reporter.stopReporter();

      expect(spyStopIPCServer).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFinishItemObj', function() {
    const storageTestItem: StorageTestItem = getStorageTestItemMock('itemName');

    test('should return storage item data with other data from testResult in case of no results in testResult', function() {
      // @ts-ignore access to the class private property
      const finishItemObj = reporter.getFinishItemObj({ status: STATUSES.PASSED }, storageTestItem);
      const { id, ...data } = storageTestItem;

      expect(finishItemObj).toEqual({ ...data, status: STATUSES.PASSED });
    });

    test('invokes calculateTestItemStatus in case of results exists to receive proper item status', function() {
      const testResult = {
        name: 'testItem',
        results: {
          testcases: {
            testItem: {
              passed: 1,
              skipped: 2,
              failed: 1,
            },
          },
        },
      };
      const spyCalculateTestItemStatus: jest.SpyInstance = jest.spyOn(
        utils,
        'calculateTestItemStatus',
      );

      // @ts-ignore access to the class private property
      reporter.getFinishItemObj(testResult, storageTestItem);

      expect(spyCalculateTestItemStatus).toHaveBeenCalledWith(testResult);
    });

    test('should call the client sendLog method in case of FAILED status', function() {
      const testResult = {
        name: 'testItem',
        results: {
          testcases: {
            testItem: {
              passed: 1,
              skipped: 0,
              failed: 1,
            },
          },
        },
      };
      jest
        .spyOn(utils, 'calculateTestItemStatus')
        .mockReturnValueOnce({ status: STATUSES.FAILED, assertionsMessage: 'Error' });
      // @ts-ignore access to the class private property
      const spySendLog: jest.SpyInstance = jest.spyOn(reporter.client, 'sendLog');

      const itemLog: LogRQ = {
        level: LOG_LEVELS.ERROR,
        message: 'Error',
      };

      // @ts-ignore access to the class private property
      reporter.getFinishItemObj(testResult, storageTestItem);

      expect(spySendLog).toHaveBeenCalledWith(storageTestItem.id, itemLog);
    });

    test('should return correct finish item object with status', function() {
      const testResult = {
        name: 'testItem',
        results: {
          testcases: {
            testItem: {
              passed: 0,
              skipped: 1,
              failed: 0,
            },
          },
        },
      };
      const { id, ...data } = storageTestItem;

      jest
        .spyOn(utils, 'calculateTestItemStatus')
        .mockReturnValueOnce({ status: STATUSES.SKIPPED, assertionsMessage: null });
      // @ts-ignore access to the class private property
      const finishItemObj = reporter.getFinishItemObj(testResult, storageTestItem);

      expect(finishItemObj).toEqual({
        ...data,
        status: STATUSES.SKIPPED,
      });
    });
  });
});
