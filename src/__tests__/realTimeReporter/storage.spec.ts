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

import * as utils from '../../utils';
import { StorageTestItem } from '../../models';
import { Storage } from '../../realTimeReporter/storage';

describe('Storage', function() {
  const initialItem = {
    id: 'initialItemId',
    name: 'initialItemName',
    attributes: [{ value: 'initialItem' }],
    description: 'Item description',
  };
  let storage: Storage;

  beforeEach(() => {
    storage = new Storage([initialItem]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', function() {
    test('should create the storage with initial items', function() {
      const storage = new Storage([initialItem]);

      const allStorageItems = storage.getAllItems();

      expect(allStorageItems).toEqual([initialItem]);
    });

    test('should create the empty storage in case of empty constructor params', function() {
      const storage = new Storage();

      expect(storage.getAllItems()).toEqual([]);
    });
  });

  test('getAllItems: should return all stored test items', function() {
    const items = storage.getAllItems();

    expect(items).toEqual([initialItem]);
  });

  describe('getItemById', function() {
    test('should return test item with provided id', function() {
      const item = storage.getItemById('initialItemId');

      expect(item).toEqual(initialItem);
    });

    test('should return null in case of unknown id', function() {
      const item = storage.getItemById('unknownId');

      expect(item).toEqual(null);
    });
  });

  describe('getItemByName', function() {
    test('should return test item with provided name', function() {
      const item = storage.getItemByName('initialItemName');

      expect(item).toEqual(initialItem);
    });

    test('should return null in case of unknown name', function() {
      const item = storage.getItemByName('unknownName');

      expect(item).toEqual(null);
    });
  });

  describe('getCurrentItem', function() {
    test('should call getItemByName method to get test item by provided name', function() {
      const spyGetCurrentItem = jest.spyOn(storage, 'getItemByName');

      storage.getCurrentItem('initialItemName');

      expect(spyGetCurrentItem).toHaveBeenCalledWith('initialItemName');
    });

    test('should call getLastItem method in case of unknown provided name', function() {
      const spyGetLastItem = jest.spyOn(storage, 'getLastItem');

      storage.getCurrentItem('unknownName');

      expect(spyGetLastItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeItemById', function() {
    test('should remove test item according to provided id', function() {
      storage.removeItemById('initialItemId');

      expect(storage.getAllItems()).toEqual([]);
    });

    test('should not change items in case of unknown id', function() {
      storage.removeItemById('unknownId');

      expect(storage.getAllItems()).toEqual([initialItem]);
    });
  });

  test('addTestItem: should add new test item to the test items collection', function() {
    const testItem: StorageTestItem = {
      id: 'itemId',
      name: 'testItem',
    };

    storage.addTestItem(testItem);

    expect(storage.getItemById('itemId')).toEqual(testItem);
  });

  test('getLastItem: should call util function getLastItem', function() {
    const spyGetLastItem = jest.spyOn(utils, 'getLastItem');

    storage.getLastItem();

    expect(spyGetLastItem).toHaveBeenCalledWith([initialItem]);
  });
});
