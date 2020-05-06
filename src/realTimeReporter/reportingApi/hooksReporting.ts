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

import { FinishTestItemRQ, StartTestItemRQ } from '../../models';
import { EVENTS, TEST_ITEM_TYPES } from '../../constants';
import { getCodeRef } from '../utils';
import { publishIPCEvent as publishEvent } from '../ipc/client';

export interface HooksReportingInterface {
  startBeforeSuite(data?: StartTestItemRQ): void;
  finishBeforeSuite(data?: FinishTestItemRQ): void;

  startAfterSuite(data?: StartTestItemRQ): void;
  finishAfterSuite(data?: FinishTestItemRQ): void;

  startBeforeTestCase(data?: StartTestItemRQ): void;
  finishBeforeTestCase(data?: FinishTestItemRQ): void;

  startAfterTestCase(data?: StartTestItemRQ): void;
  finishAfterTestCase(data?: FinishTestItemRQ): void;
}

export const hooksReporting: HooksReportingInterface = {
  startBeforeSuite(data: StartTestItemRQ): void {
    const hookName = 'Before suite';
    const codeRef = getCodeRef(hookName);

    const suiteObj = {
      type: TEST_ITEM_TYPES.BEFORE_SUITE,
      name: hookName,
      codeRef,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  },

  finishBeforeSuite(data: FinishTestItemRQ): void {
    publishEvent(EVENTS.FINISH_TEST_ITEM, { name: 'Before suite', ...data });
  },

  startAfterSuite(data: StartTestItemRQ): void {
    const hookName = 'After suite';
    const codeRef = getCodeRef(hookName);

    const suiteObj = {
      type: TEST_ITEM_TYPES.AFTER_SUITE,
      name: hookName,
      codeRef,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  },

  finishAfterSuite(data: FinishTestItemRQ): void {
    publishEvent(EVENTS.FINISH_TEST_ITEM, { name: 'After suite', ...data });
  },

  startBeforeTestCase(data: StartTestItemRQ): void {
    const hookName = 'Before test';
    const codeRef = getCodeRef(hookName);

    const suiteObj = {
      type: TEST_ITEM_TYPES.BEFORE_TEST,
      name: hookName,
      codeRef,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  },

  finishBeforeTestCase(data: FinishTestItemRQ): void {
    publishEvent(EVENTS.FINISH_TEST_ITEM, { name: 'Before test', ...data });
  },

  startAfterTestCase(data: StartTestItemRQ): void {
    const hookName = 'After test';
    const codeRef = getCodeRef(hookName);

    const suiteObj = {
      type: TEST_ITEM_TYPES.AFTER_TEST,
      name: hookName,
      codeRef,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  },

  finishAfterTestCase(data: FinishTestItemRQ): void {
    publishEvent(EVENTS.FINISH_TEST_ITEM, { name: 'After test', ...data });
  },
};
