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

import { Attribute, LogRQ, StorageTestItem } from '../../../models';
import { RealTimeReporter } from '../../../realTimeReporter';
import {
  getDefaultMockConfig,
  getStorageTestItemMock,
  RPClientMock,
  StorageMock,
} from '../../mocks';
import * as utils from '../../../realTimeReporter/utils';
import * as IPCServer from '../../../realTimeReporter/ipc/server';
import { FILE_TYPES, LOG_LEVELS, STATUSES } from '../../../constants';

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

  describe('sendLogToItem', function() {
    const logItemRQObj: { log: LogRQ; itemName?: string } = {
      log: {
        level: LOG_LEVELS.INFO,
        message: 'Log message',
      },
      itemName: 'itemName',
    };

    let spyGetCurrentItem: jest.SpyInstance;
    let spySetDefaultFileType: jest.SpyInstance;

    beforeEach(() => {
      spyGetCurrentItem = jest.spyOn(storage, 'getCurrentItem').mockReturnValue({
        id: 'testItemId',
      });
      spySetDefaultFileType = jest.spyOn(utils, 'setDefaultFileType');
    });

    test('invokes the storage getCurrentItem method with item name to receive current item id', function() {
      // @ts-ignore access to the class private property
      reporter.sendLogToItem(logItemRQObj);

      expect(spyGetCurrentItem).toHaveBeenCalledWith(logItemRQObj.itemName);
    });

    test('invokes the util setDefaultFileType function to set default type for file', function() {
      // @ts-ignore access to the class private property
      reporter.sendLogToItem(logItemRQObj);

      expect(spySetDefaultFileType).toHaveBeenCalledWith(logItemRQObj.log.file);
    });

    test('should call the client sendLog method to send item log to Report Portal', function() {
      const {
        log: { file, ...log },
      } = logItemRQObj;

      spySetDefaultFileType.mockReturnValueOnce(undefined);

      // @ts-ignore access to the class private property
      reporter.sendLogToItem(logItemRQObj);

      // @ts-ignore access to the class private property
      expect(reporter.client.sendLog).toHaveBeenCalledWith('testItemId', log, undefined);
    });
  });

  describe('sendLogToLaunch', function() {
    const logItemRQObj: LogRQ = {
      level: LOG_LEVELS.INFO,
      message: 'Log message',
      file: {
        name: 'fileName',
        content: 'file content',
        type: FILE_TYPES.TEXT,
      },
    };

    let spySetDefaultFileType: jest.SpyInstance;

    beforeEach(() => {
      spySetDefaultFileType = jest.spyOn(utils, 'setDefaultFileType');
    });

    test('invokes the util setDefaultFileType function to set default type for file', function() {
      // @ts-ignore access to the class private property
      reporter.sendLogToLaunch(logItemRQObj);

      expect(spySetDefaultFileType).toHaveBeenCalledWith(logItemRQObj.file);
    });

    test('should call the client sendLog method to send launch log to Report Portal', function() {
      const { file, ...log } = logItemRQObj;

      spySetDefaultFileType.mockReturnValueOnce(file);

      // @ts-ignore access to the class private property
      reporter.sendLogToLaunch(logItemRQObj);

      // @ts-ignore access to the class private property
      expect(reporter.client.sendLog).toHaveBeenCalledWith('tempLaunchId', log, file);
    });
  });

  describe('addItemAttributes', function() {
    const attributesData: { attributes: Array<Attribute>; itemName?: string } = {
      attributes: [{ value: 'attributeValue', key: 'attributeKey' }],
      itemName: 'itemName',
    };

    let storageItem: StorageTestItem;
    let spyGetCurrentItem: jest.SpyInstance;

    beforeEach(() => {
      storageItem = getStorageTestItemMock('testItem');
      spyGetCurrentItem = jest.spyOn(storage, 'getCurrentItem').mockReturnValue(storageItem);
    });

    test('invokes the storage getCurrentItem method with item name to get item from storage', function() {
      // @ts-ignore access to the class private property
      reporter.addItemAttributes(attributesData);

      expect(spyGetCurrentItem).toHaveBeenCalledWith(attributesData.itemName);
    });

    test('should update attributes for item in storage', function() {
      // @ts-ignore access to the class private property
      reporter.addItemAttributes(attributesData);

      const updatedStorageItem: StorageTestItem = getStorageTestItemMock('testItem');
      updatedStorageItem.attributes = [
        ...updatedStorageItem.attributes,
        { value: 'attributeValue', key: 'attributeKey' },
      ];

      expect(storageItem).toEqual(updatedStorageItem);
    });
  });

  describe('addItemDescription', function() {
    const attributesData: { text: string; itemName?: string } = {
      text: 'New item description',
      itemName: 'itemName',
    };

    let storageItem: StorageTestItem;
    let spyGetCurrentItem: jest.SpyInstance;

    beforeEach(() => {
      storageItem = getStorageTestItemMock('testItem');
      storageItem.description = 'First part of description';
      spyGetCurrentItem = jest.spyOn(storage, 'getCurrentItem').mockReturnValue(storageItem);
    });

    test('invokes the storage getCurrentItem method with item name to get item from storage', function() {
      // @ts-ignore access to the class private property
      reporter.addItemDescription(attributesData);

      expect(spyGetCurrentItem).toHaveBeenCalledWith(attributesData.itemName);
    });

    test('should concat description with existing for item in storage', function() {
      // @ts-ignore access to the class private property
      reporter.addItemDescription(attributesData);

      const updatedStorageItem: StorageTestItem = getStorageTestItemMock('testItem');
      updatedStorageItem.description = 'First part of description<br/>New item description';

      expect(storageItem).toEqual(updatedStorageItem);
    });
  });

  describe('setTestCaseId', function() {
    const data: { id: string; itemName?: string } = {
      id: 'itemTestCaseId',
      itemName: 'itemName',
    };

    let storageItem: StorageTestItem;
    let spyGetCurrentItem: jest.SpyInstance;

    beforeEach(() => {
      storageItem = getStorageTestItemMock('testItem');
      spyGetCurrentItem = jest.spyOn(storage, 'getCurrentItem').mockReturnValue(storageItem);
    });

    test('invokes the storage getCurrentItem method with item name to get item from storage', function() {
      // @ts-ignore access to the class private property
      reporter.setTestCaseId(data);

      expect(spyGetCurrentItem).toHaveBeenCalledWith(data.itemName);
    });

    test('should set testCaseId for item in storage', function() {
      // @ts-ignore access to the class private property
      reporter.setTestCaseId(data);

      const updatedStorageItem: StorageTestItem = getStorageTestItemMock('testItem');
      updatedStorageItem.testCaseId = data.id;

      expect(storageItem).toEqual(updatedStorageItem);
    });
  });

  describe('setStatusToItem', function() {
    const data: { status: STATUSES; itemName?: string } = {
      status: STATUSES.PASSED,
      itemName: 'itemName',
    };

    let storageItem: StorageTestItem;
    let spyGetCurrentItem: jest.SpyInstance;

    beforeEach(() => {
      storageItem = getStorageTestItemMock('testItem');
      spyGetCurrentItem = jest.spyOn(storage, 'getCurrentItem').mockReturnValue(storageItem);
    });

    test('invokes the storage getCurrentItem method with item name to get item from storage', function() {
      // @ts-ignore access to the class private property
      reporter.setStatusToItem(data);

      expect(spyGetCurrentItem).toHaveBeenCalledWith(data.itemName);
    });

    test('should set status for item in storage', function() {
      // @ts-ignore access to the class private property
      reporter.setStatusToItem(data);

      const updatedStorageItem: StorageTestItem = getStorageTestItemMock('testItem');
      updatedStorageItem.status = data.status;

      expect(storageItem).toEqual(updatedStorageItem);
    });
  });
});
