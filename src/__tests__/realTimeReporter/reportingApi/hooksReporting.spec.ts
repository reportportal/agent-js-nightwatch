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

import { hooksReporting } from '../../../realTimeReporter/reportingApi/hooksReporting';
import * as IPCClient from '../../../realTimeReporter/ipc/client';
import * as commonUtils from '../../../realTimeReporter/utils';
import { EVENTS, STATUSES, TEST_ITEM_TYPES } from '../../../constants';

describe('hooksReporting', function() {
  let spyPublishEvent: jest.SpyInstance;

  beforeEach(() => {
    spyPublishEvent = jest.spyOn(IPCClient, 'publishIPCEvent').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startBeforeSuite', function() {
    const itemCodeRef = 'tests/items.js/test hook';
    let spyGetCodeRef: jest.SpyInstance;

    beforeEach(() => {
      spyGetCodeRef = jest.spyOn(commonUtils, 'getCodeRef').mockReturnValue(itemCodeRef);
    });

    test('invokes the getCodeRef util to receive test hook code reference', function() {
      hooksReporting.startBeforeSuite('suiteName');

      expect(spyGetCodeRef).toHaveBeenCalledWith('Before suite');
    });

    test('should call publishEvent util to send event to reporter with BEFORE_SUITE item type', function() {
      const resultHookRQ = {
        name: 'Before suite',
        type: TEST_ITEM_TYPES.BEFORE_SUITE,
        codeRef: itemCodeRef,
        parentName: 'suiteName',
      };

      hooksReporting.startBeforeSuite('suiteName');

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.START_TEST_ITEM, resultHookRQ);
    });
  });

  describe('finishBeforeSuite', function() {
    test('should call publishEvent util to send event to reporter with test hook result with default PASSED status', function() {
      hooksReporting.finishBeforeSuite();

      const expectedItemObj = { name: 'Before suite', status: STATUSES.PASSED };
      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.FINISH_TEST_ITEM, expectedItemObj);
    });

    test('should overwrite default hook name & status if the other one exists in parameters', function() {
      const finishHookRQ = { name: 'Not before suite', status: STATUSES.SKIPPED };

      // @ts-ignore required status property
      hooksReporting.finishBeforeSuite(finishHookRQ);

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.FINISH_TEST_ITEM, finishHookRQ);
    });
  });

  describe('startAfterSuite', function() {
    const itemCodeRef = 'tests/items.js/test hook';
    let spyGetCodeRef: jest.SpyInstance;

    beforeEach(() => {
      spyGetCodeRef = jest.spyOn(commonUtils, 'getCodeRef').mockReturnValue(itemCodeRef);
    });

    test('invokes the getCodeRef util to receive test hook code reference', function() {
      hooksReporting.startAfterSuite('suiteName');

      expect(spyGetCodeRef).toHaveBeenCalledWith('After suite');
    });

    test('should call publishEvent util to send event to reporter with AFTER_SUITE item type', function() {
      const resultHookRQ = {
        name: 'After suite',
        type: TEST_ITEM_TYPES.AFTER_SUITE,
        codeRef: itemCodeRef,
        parentName: 'suiteName',
      };

      hooksReporting.startAfterSuite('suiteName');

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.START_TEST_ITEM, resultHookRQ);
    });
  });

  describe('finishAfterSuite', function() {
    test('should call publishEvent util to send event to reporter with test hook result with default PASSED status', function() {
      hooksReporting.finishAfterSuite();

      const expectedItemObj = { name: 'After suite', status: STATUSES.PASSED };
      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.FINISH_TEST_ITEM, expectedItemObj);
    });

    test('should overwrite default hook name & status if the other one exists in parameters', function() {
      const finishHookRQ = { name: 'Not after suite', status: STATUSES.SKIPPED };

      // @ts-ignore required status property
      hooksReporting.finishAfterSuite(finishHookRQ);

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.FINISH_TEST_ITEM, finishHookRQ);
    });
  });

  describe('startBeforeTestCase', function() {
    const itemCodeRef = 'tests/items.js/test hook';
    let spyGetCodeRef: jest.SpyInstance;

    beforeEach(() => {
      spyGetCodeRef = jest.spyOn(commonUtils, 'getCodeRef').mockReturnValue(itemCodeRef);
    });

    test('invokes the getCodeRef util to receive test hook code reference', function() {
      hooksReporting.startBeforeTestCase('suiteName');

      expect(spyGetCodeRef).toHaveBeenCalledWith('Before test');
    });

    test('should call publishEvent util to send event to reporter with BEFORE_TEST item type', function() {
      const resultHookRQ = {
        name: 'Before test',
        type: TEST_ITEM_TYPES.BEFORE_TEST,
        codeRef: itemCodeRef,
        parentName: 'suiteName',
      };

      hooksReporting.startBeforeTestCase('suiteName');

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.START_TEST_ITEM, resultHookRQ);
    });
  });

  describe('finishBeforeTestCase', function() {
    test('should call publishEvent util to send event to reporter with test hook result with default PASSED status', function() {
      hooksReporting.finishBeforeTestCase();

      const expectedItemObj = { name: 'Before test', status: STATUSES.PASSED };
      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.FINISH_TEST_ITEM, expectedItemObj);
    });

    test('should overwrite default hook name & status if the other one exists in parameters', function() {
      const finishHookRQ = { name: 'Not before test', status: STATUSES.SKIPPED };

      // @ts-ignore required status property
      hooksReporting.finishBeforeTestCase(finishHookRQ);

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.FINISH_TEST_ITEM, finishHookRQ);
    });
  });

  describe('startAfterTestCase', function() {
    const itemCodeRef = 'tests/items.js/test hook';
    let spyGetCodeRef: jest.SpyInstance;

    beforeEach(() => {
      spyGetCodeRef = jest.spyOn(commonUtils, 'getCodeRef').mockReturnValue(itemCodeRef);
    });

    test('invokes the getCodeRef util to receive test hook code reference', function() {
      hooksReporting.startAfterTestCase('suiteName');

      expect(spyGetCodeRef).toHaveBeenCalledWith('After test');
    });

    test('should call publishEvent util to send event to reporter with AFTER_TEST item type', function() {
      const resultHookRQ = {
        name: 'After test',
        type: TEST_ITEM_TYPES.AFTER_TEST,
        codeRef: itemCodeRef,
        parentName: 'suiteName',
      };

      hooksReporting.startAfterTestCase('suiteName');

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.START_TEST_ITEM, resultHookRQ);
    });
  });

  describe('finishAfterTestCase', function() {
    test('should call publishEvent util to send event to reporter with test hook result with default PASSED status', function() {
      hooksReporting.finishAfterTestCase();

      const expectedItemObj = { name: 'After test', status: STATUSES.PASSED };
      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.FINISH_TEST_ITEM, expectedItemObj);
    });

    test('should overwrite default hook name & status if the other one exists in parameters', function() {
      const finishHookRQ = { name: 'Not after test', status: STATUSES.SKIPPED };

      // @ts-ignore required status property
      hooksReporting.finishAfterTestCase(finishHookRQ);

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.FINISH_TEST_ITEM, finishHookRQ);
    });
  });
});
