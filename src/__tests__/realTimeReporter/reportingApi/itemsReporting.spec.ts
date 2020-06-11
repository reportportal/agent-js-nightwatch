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

import { itemsReporting } from '../../../realTimeReporter/reportingApi/itemsReporting';
import { StartTestItemRQ } from '../../../models';
import * as IPCClient from '../../../realTimeReporter/ipc/client';
import * as commonUtils from '../../../realTimeReporter/utils';
import { EVENTS, TEST_ITEM_TYPES } from '../../../constants';

describe('itemsReporting', function() {
  let spyPublishEvent: jest.SpyInstance;

  beforeEach(() => {
    spyPublishEvent = jest.spyOn(IPCClient, 'publishIPCEvent').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startSuite', function() {
    const itemCodeRef = 'tests/items.js/test suite';
    let spyGetCodeRef: jest.SpyInstance;

    beforeEach(() => {
      spyGetCodeRef = jest.spyOn(commonUtils, 'getCodeRef').mockReturnValue(itemCodeRef);
    });

    test('invokes the getCodeRef util to receive test item code reference', function() {
      // @ts-ignore required type property
      const suiteStartRQ: StartTestItemRQ = {
        name: 'mock_test_item',
        description: 'Item description',
        attributes: [{ key: 'example', value: 'true' }],
      };

      itemsReporting.startSuite(suiteStartRQ);

      expect(spyGetCodeRef).toHaveBeenCalledWith(suiteStartRQ.name);
    });

    test('should call publishEvent util to send event to reporter with SUITE type', function() {
      // @ts-ignore required type property
      const suiteStartRQ: StartTestItemRQ = {
        name: 'mock_test_item',
        description: 'Item description',
        attributes: [{ key: 'example', value: 'true' }],
      };
      const resultSuiteRQ = {
        type: TEST_ITEM_TYPES.SUITE,
        codeRef: itemCodeRef,
        ...suiteStartRQ,
      };

      itemsReporting.startSuite(suiteStartRQ);

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.START_TEST_ITEM, resultSuiteRQ);
    });

    test('should leave test item type if it exists in parameters', function() {
      // @ts-ignore required type property
      const suiteStartRQ: StartTestItemRQ = {
        name: 'mock_test_item',
        type: TEST_ITEM_TYPES.TEST,
        description: 'Item description',
        attributes: [{ key: 'example', value: 'true' }],
      };
      const resultSuiteRQ: StartTestItemRQ = {
        type: TEST_ITEM_TYPES.TEST,
        codeRef: itemCodeRef,
        ...suiteStartRQ,
      };

      itemsReporting.startSuite(suiteStartRQ);

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.START_TEST_ITEM, resultSuiteRQ);
    });
  });

  describe('startTestCase', function() {
    const itemCodeRef = 'tests/items.js/test suite';
    let spyGetCodeRef: jest.SpyInstance;

    beforeEach(() => {
      spyGetCodeRef = jest.spyOn(commonUtils, 'getCodeRef').mockReturnValue(itemCodeRef);
    });

    test('invokes the getCodeRef util to receive test item code reference', function() {
      const itemStartRQ: any = {
        name: 'mock_test_item',
        results: {
          retries: 0,
        },
      };

      itemsReporting.startTestCase(itemStartRQ, 'item suite');

      expect(spyGetCodeRef).toHaveBeenCalledWith(itemStartRQ.name);
    });

    test('should call publishEvent util to send event to reporter with STEP type', function() {
      const itemParentName = 'item suite';
      const itemStartRQ: any = {
        name: 'mock_test_item',
        results: {
          retries: 0,
        },
      };
      const resultSuiteRQ: StartTestItemRQ = {
        name: itemStartRQ.name,
        type: TEST_ITEM_TYPES.STEP,
        codeRef: itemCodeRef,
        parentName: itemParentName,
        retry: false,
      };

      itemsReporting.startTestCase(itemStartRQ, itemParentName);

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.START_TEST_ITEM, resultSuiteRQ);
    });

    test('should set retry to true if test item have been retried 1 and more times', function() {
      const itemParentName = 'item suite';
      const itemStartRQ: any = {
        name: 'mock_test_item',
        results: {
          retries: 1,
        },
      };
      const resultSuiteRQ: StartTestItemRQ = {
        name: itemStartRQ.name,
        type: TEST_ITEM_TYPES.STEP,
        codeRef: itemCodeRef,
        parentName: itemParentName,
        retry: true,
      };

      itemsReporting.startTestCase(itemStartRQ, itemParentName);

      expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.START_TEST_ITEM, resultSuiteRQ);
    });
  });

  test('finishSuite: should call publishEvent util to send event to reporter with test result', function() {
    const finishSuiteRQ = { name: 'suiteName' };

    itemsReporting.finishSuite('suiteName');

    expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.FINISH_TEST_ITEM, finishSuiteRQ);
  });

  test('finishTestCase: should call publishEvent util to send event to reporter with test result', function() {
    const finishItemRQ = { name: 'itemName' };

    itemsReporting.finishTestCase(finishItemRQ);

    expect(spyPublishEvent).toHaveBeenCalledWith(EVENTS.FINISH_TEST_ITEM, finishItemRQ);
  });
});
