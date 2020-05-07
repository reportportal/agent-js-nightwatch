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

import {
  setDefaultFileType,
  getStartLaunchObj,
  getStack,
  getCaller,
  getCodeRef,
} from '../../realTimeReporter/utils';
import * as utils from '../../realTimeReporter/utils';
import { DEFAULT_FILE_TYPE, STATUSES } from '../../constants';
import * as commonUtils from "../../utils";

describe('setDefaultFileType', function() {
  test('should set default file type in case of empty type field in the file parameter', function () {
    // @ts-ignore
    const updatedFile = setDefaultFileType({ name: 'file', content: 'string' });

    expect(updatedFile.type).toBe(DEFAULT_FILE_TYPE);
  });

  test('should return undefined in case of empty parameters', function () {
    // @ts-ignore
    expect(setDefaultFileType()).toBe(undefined);
  });

  test('should leave received file type if it exists in the file parameter', function () {
    const updatedFile = setDefaultFileType({ name: 'file', type: 'application/json', content: 'string' });

    expect(updatedFile.type).toBe('application/json');
  });
});

describe('getStartLaunchObj', function() {
  beforeAll(() => {
    jest.spyOn(commonUtils, 'getSystemAttributes')
      .mockReturnValue([{ value: 'mockValue', key: 'mockKey' }]);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should return startLaunchObject with updated attributes in case of launch has it', function () {
    const startLaunchObject = getStartLaunchObj({ attributes: [{ value: 'value', key: 'key' }] });

    expect(startLaunchObject.attributes).toEqual([
      { value: 'value', key: 'key' },
      { value: 'mockValue', key: 'mockKey' }
    ]);
  });

  test('should return startLaunchObject with system attributes in case of launch has not any attributes',
    function () {
      const startLaunchObject = getStartLaunchObj({});

      expect(startLaunchObject.attributes).toEqual([
        { value: 'mockValue', key: 'mockKey' }
      ]);
    }
  );

  test('should return startLaunchObject with system attributes in case of launch has empty attributes',
    function () {
      const startLaunchObject = getStartLaunchObj({ attributes: [] });

      expect(startLaunchObject.attributes).toEqual([
        { value: 'mockValue', key: 'mockKey' }
      ]);
    }
  );
});

describe('getStack', function() {
  test('should return array of NodeJS.CallSite for the function call', function () {
    const stack = getStack();

    expect(stack).toBeInstanceOf(Array);
  });

  test('the file name for the last item in stack should be equal to full this test file name', function () {
    const stack = getStack();

    expect(stack[0].getFileName()).toBe(__filename);
  });
});

describe('getCaller', function() {
  test('should return the caller\'s caller ', function () {
    jest.spyOn(utils, 'getStack')
      .mockReturnValueOnce([
        {
          getFileName: () => 'getStack call',
        },
        {
          getFileName: () => 'getCaller call',
        },
        {
          getFileName: () => 'getCaller caller call (this test)',
        },
        {
          getFileName: () => 'caller\'s caller',
        }
      ]);
    const caller = getCaller();

    expect(caller.getFileName()).toBe('caller\'s caller');
  });
});

describe('getCodeRef', function() {
  test('invokes getCaller to get caller', function () {
    const spyGetCaller = jest.spyOn(utils, 'getCaller');

    getCodeRef('testItem');

    expect(spyGetCaller).toBeCalled();
  });

  test('invokes buildCodeRef to create code reference based on the test path and item name', function () {
    jest.spyOn(utils, 'getCaller')
      .mockReturnValueOnce({ getFileName: () => 'C:/project/file.js' });
    const spyBuildCodeRef = jest.spyOn(commonUtils, 'buildCodeRef');

    getCodeRef('testItem');

    expect(spyBuildCodeRef).toBeCalledWith('C:/project/file.js', 'testItem');
  });
});

describe('calculateTestItemStatus', function() {
  const calculateTestItemStatus = utils.calculateTestItemStatus;

  test('should return object with SKIPPED status in case of skipped counter not zero in testResult', function () {
    const testResult: any = {
      name: 'testItem',
      results: {
        testcases: {
          'testItem': {
            passed: 1,
            skipped: 1,
            failed: 0,
          }
        }
      }
    };

    const itemInfo = calculateTestItemStatus(testResult);

    expect(itemInfo.status).toBe(STATUSES.SKIPPED);
    expect(itemInfo.assertionsMessage).toBe(null);
  });

  test('should return object with FAILED status and corresponding assertionsMessage in case of failed counter not zero in testResult', function () {
    const testResult: any = {
      name: 'testItem',
      results: {
        testcases: {
          'testItem': {
            passed: 1,
            skipped: 0,
            failed: 1,
            assertions: [{ fullMsg: 'Error', stackTrace: 'from launchController' }],
          }
        }
      }
    };

    const itemInfo = calculateTestItemStatus(testResult);

    expect(itemInfo.status).toBe(STATUSES.FAILED);
    expect(itemInfo.assertionsMessage).toBe(`Error
from launchController`);
  });

  test('should return object with PASSED status in case of no skipped and failed items', function () {
    const testResult: any = {
      name: 'testItem',
      results: {
        testcases: {
          'testItem': {
            passed: 2,
            skipped: 0,
            failed: 0,
          }
        }
      }
    };

    const itemInfo = calculateTestItemStatus(testResult);

    expect(itemInfo.status).toBe(STATUSES.PASSED);
    expect(itemInfo.assertionsMessage).toBe(null);
  });
});

