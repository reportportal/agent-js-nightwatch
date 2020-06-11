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

import { StartTestItemRQ, StorageTestItem } from '../../../models';
import { RealTimeReporter } from '../../../realTimeReporter';
import {
  getDefaultMockConfig,
  getStorageTestItemMock,
  RPClientMock,
  StorageMock,
} from '../../mocks';
import { STATUSES, TEST_ITEM_TYPES } from '../../../constants';
import * as IPCServer from '../../../realTimeReporter/ipc/server';

const TEST_ITEM_START_RQ_EXAMPLE: StartTestItemRQ = {
  name: 'mock_test_item',
  type: TEST_ITEM_TYPES.TEST,
  codeRef: 'tests/example.js/mock_test_item',
  description: 'Item description',
  attributes: [{ key: 'example', value: 'true' }],
};

describe('testItemReporting', function() {
  jest.spyOn(IPCServer, 'startIPCServer').mockImplementation((callback: any) => {
    callback({
      on: () => {},
    });
  });
  let reporter: RealTimeReporter;
  let storage: StorageMock;

  beforeEach(() => {
    const config = getDefaultMockConfig();
    const client = new RPClientMock();
    storage = new StorageMock();

    reporter = new RealTimeReporter(config);
    // @ts-ignore access to the class private property
    reporter.client = client;
    // @ts-ignore access to the class private property
    reporter.storage = storage;
    // @ts-ignore access to the class private property
    reporter.launchId = 'tempLaunchId';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startTestItem', function() {
    let spyGetItemByName: jest.SpyInstance;
    let spyAddTestItem: jest.SpyInstance;

    beforeEach(() => {
      spyGetItemByName = jest.spyOn(storage, 'getItemByName');
      spyAddTestItem = jest.spyOn(storage, 'addTestItem');
    });

    test('invokes the storage getItemByName method with item parent name to receive parent id', function() {
      const itemRQ: StartTestItemRQ = {
        ...TEST_ITEM_START_RQ_EXAMPLE,
        parentName: 'parent_test_item',
      };

      // @ts-ignore access to the class private property
      reporter.startTestItem(itemRQ);

      expect(spyGetItemByName).toHaveBeenCalledWith('parent_test_item');
    });

    test('invokes the storage addTestItem method with item object to save it in storage', function() {
      const itemRQ: StartTestItemRQ = TEST_ITEM_START_RQ_EXAMPLE;

      spyGetItemByName.mockReturnValueOnce(null);

      // @ts-ignore access to the class private property
      reporter.startTestItem(itemRQ);

      const storageTestItem: StorageTestItem = getStorageTestItemMock(itemRQ.name);

      expect(spyAddTestItem).toHaveBeenCalledWith(storageTestItem);
    });

    test('should start test item without parent by calling the ReportPortal client startTestItem method', function() {
      const itemRQ: StartTestItemRQ = TEST_ITEM_START_RQ_EXAMPLE;

      spyGetItemByName.mockReturnValueOnce(null);

      // @ts-ignore access to the class private property
      reporter.startTestItem(itemRQ);

      // @ts-ignore access to the class private property
      expect(reporter.client.startTestItem).toHaveBeenCalledWith(itemRQ, 'tempLaunchId', undefined);
    });

    test('should start test item with parent by calling the ReportPortal client startTestItem method', function() {
      const itemRQ: StartTestItemRQ = {
        ...TEST_ITEM_START_RQ_EXAMPLE,
        parentName: 'parent_test_item',
      };

      spyGetItemByName.mockReturnValueOnce({ id: 'parentItemId' });

      // @ts-ignore access to the class private property
      reporter.startTestItem(itemRQ);

      // @ts-ignore access to the class private property
      expect(reporter.client.startTestItem).toHaveBeenCalledWith(
        itemRQ,
        'tempLaunchId',
        'parentItemId',
      );
    });
  });

  describe('finishTestItem', function() {
    const TEST_ITEM_FINISH_RQ_EXAMPLE: any = {
      name: 'mock_test_item',
    };
    const storageItem = getStorageTestItemMock('testItemName');

    let spyGetItemByName: jest.SpyInstance;
    let spyGetFinishItemObj: jest.SpyInstance;

    beforeEach(() => {
      spyGetItemByName = jest.spyOn(storage, 'getItemByName').mockReturnValue(storageItem);
      // @ts-ignore access to the class private property
      spyGetFinishItemObj = jest.spyOn(reporter, 'getFinishItemObj');
    });

    test('invokes the storage getItemByName method with item name to receive item info from storage', function() {
      const itemRQ: any = TEST_ITEM_FINISH_RQ_EXAMPLE;

      // @ts-ignore access to the class private property
      reporter.finishTestItem(itemRQ);

      expect(spyGetItemByName).toHaveBeenCalledWith(itemRQ.name);
    });

    test('invokes getFinishItemObj method with itemRQ and storageItem to receive finish object', function() {
      const itemRQ: any = TEST_ITEM_FINISH_RQ_EXAMPLE;

      // @ts-ignore access to the class private property
      reporter.finishTestItem(itemRQ);

      expect(spyGetFinishItemObj).toHaveBeenCalledWith(itemRQ, storageItem);
    });

    test('invokes the storage removeItemById method with item id to remove finished item from storage', function() {
      const itemRQ: any = TEST_ITEM_FINISH_RQ_EXAMPLE;

      const spyRemoveItemById = jest.spyOn(storage, 'removeItemById');
      spyGetFinishItemObj.mockReturnValueOnce({ ...storageItem, status: STATUSES.PASSED });

      // @ts-ignore access to the class private property
      reporter.finishTestItem(itemRQ);

      expect(spyRemoveItemById).toHaveBeenCalledWith(storageItem.id);
    });

    test('should finish test item by calling the ReportPortal client finishTestItem method', function() {
      const itemRQ: any = TEST_ITEM_FINISH_RQ_EXAMPLE;
      const finishTestItemObj = { ...storageItem, status: STATUSES.PASSED };

      spyGetFinishItemObj.mockReturnValueOnce(finishTestItemObj);

      // @ts-ignore access to the class private property
      reporter.finishTestItem(itemRQ);

      // @ts-ignore access to the class private property
      expect(reporter.client.finishTestItem).toHaveBeenCalledWith(
        storageItem.id,
        finishTestItemObj,
      );
    });
  });
});
