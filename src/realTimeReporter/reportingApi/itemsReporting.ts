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

import { StartTestItemRQ } from '../../models';
import { EVENTS, TEST_ITEM_TYPES } from '../../constants';
import { getCodeRef } from '../utils';
import { publishIPCEvent as publishEvent } from '../ipc/client';

export interface ItemsReportingInterface {
  startSuite(data: StartTestItemRQ): void;
  finishSuite(name?: string): void;
  startTestCase(data: any, parentName: string): void;
  finishTestCase(data: any): void;
}

export const itemsReporting: ItemsReportingInterface = {
  startSuite(data: StartTestItemRQ): void {
    const codeRef = getCodeRef(data.name);
    const suiteObj = {
      type: TEST_ITEM_TYPES.SUITE,
      codeRef,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  },

  finishSuite(name: string): void {
    publishEvent(EVENTS.FINISH_TEST_ITEM, { name });
  },

  startTestCase(currentTest: any, parentName: string): void {
    const codeRef = getCodeRef(currentTest.name);
    const testObj: StartTestItemRQ = {
      type: TEST_ITEM_TYPES.STEP,
      codeRef,
      name: currentTest.name,
      retry: !!currentTest.results.retries,
      parentName,
    };

    publishEvent(EVENTS.START_TEST_ITEM, testObj);
  },

  finishTestCase(data: any): void {
    publishEvent(EVENTS.FINISH_TEST_ITEM, data);
  },
};
