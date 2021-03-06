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

import { DEFAULT_FILE_TYPE, STATUSES } from '../constants';
import { getSystemAttributes, buildCodeRef } from '../utils';
import { Attachment, StartLaunchRQ, Attribute } from '../models';

export const setDefaultFileType = (file: Attachment): Attachment =>
  file ? { type: DEFAULT_FILE_TYPE, ...file } : undefined;

export const getStartLaunchObj = (
  launchObj: StartLaunchRQ,
  config: StartLaunchRQ = {},
): StartLaunchRQ => {
  const systemAttributes: Array<Attribute> = getSystemAttributes();
  const attributes = (launchObj.attributes || config.attributes || []).concat(systemAttributes);

  return {
    description: config.description,
    rerun: config.rerun,
    rerunOf: config.rerunOf,
    mode: config.mode,
    ...launchObj,
    attributes,
  };
};

export const calculateTestItemStatus = (
  testResult: any,
): { status: STATUSES; assertionsMessage: string } => {
  const currentTestItemResults = testResult.results.testcases[testResult.name];
  let assertionsMessage = null;
  let status;

  if (currentTestItemResults.skipped !== 0) {
    status = STATUSES.SKIPPED;
  } else if (currentTestItemResults.failed !== 0) {
    status = STATUSES.FAILED;
    const assertionsResult =
      currentTestItemResults.assertions[currentTestItemResults.assertions.length - 1];

    assertionsMessage = `${assertionsResult.fullMsg}<br/>${assertionsResult.stackTrace}`;
  } else {
    status = STATUSES.PASSED;
  }

  return {
    status,
    assertionsMessage,
  };
};

export const getStack = (): Array<NodeJS.CallSite> | Array<any> => {
  // Save original Error.prepareStackTrace
  const origPrepareStackTrace = Error.prepareStackTrace;

  // Override with function that just returns `stack`
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  };

  // Create a new `Error`, which automatically gets `stack`
  const err = new Error();

  // Evaluate `err.stack`, which calls our new `Error.prepareStackTrace`
  const { stack } = err;

  // Restore original `Error.prepareStackTrace`
  Error.prepareStackTrace = origPrepareStackTrace;

  // Remove superfluous function call on stack
  // @ts-ignore
  stack.shift(); // getStack --> Error

  // @ts-ignore
  return stack;
};

export const getCaller = (): NodeJS.CallSite | any => {
  const stack = getStack();

  // Remove superfluous function calls on stack
  stack.shift(); // getCaller --> getStack
  stack.shift(); // your function call --> getCaller

  // Return caller's caller
  return stack[1];
};

export const getCodeRef = (itemName: string): string => {
  const caller = getCaller();
  const testPath = caller.getFileName();

  return buildCodeRef(testPath, itemName);
};
