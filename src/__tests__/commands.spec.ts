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

import { command as rpLog } from '../commands/rpLog';
import { command as rpScreenshot } from '../commands/rpScreenshot';
import { command as rpSaveScreenshot } from '../commands/rpSaveScreenshot';
import { screenshotCallbackType, ScreenshotDataInterface } from '../models/nightwatch';
import * as utils from '../utils';
import { PublicReportingAPI } from '../realTimeReporter';
import * as IPCClient from '../realTimeReporter/ipc/client';
import { DEFAULT_FILE_TYPE, LOG_LEVELS } from '../constants';

describe('commands', function () {
  jest.spyOn(IPCClient, 'publishIPCEvent')
    .mockImplementation(() => {});
  let commandsExecutionContext: any;

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('rpLog', function () {
    beforeAll(() => {
      commandsExecutionContext = {
        perform: (action: () => {}) => {
          action();
        },
      };
    });

    test('should call perform method from command execution context', function () {
      const spyPerform = jest.spyOn(commandsExecutionContext, 'perform');

      rpLog.call(commandsExecutionContext, 'Log message', LOG_LEVELS.INFO, 'parent name');

      expect(spyPerform).toHaveBeenCalledTimes(1);
    });

    test('should call log method from PublicReportingAPI to send log message to reporter', function () {
      const spyReportingApiLog = jest.spyOn(PublicReportingAPI, 'log');

      rpLog.call(commandsExecutionContext, 'Log message', LOG_LEVELS.INFO, 'parent name');

      expect(spyReportingApiLog).toHaveBeenCalledWith(LOG_LEVELS.INFO, 'Log message', null, 'parent name');
    });

    test('should set parameter level to INFO in case it missed in arguments', function () {
      const spyReportingApiLog = jest.spyOn(PublicReportingAPI, 'log');

      rpLog.call(commandsExecutionContext, 'Log message');

      expect(spyReportingApiLog).toHaveBeenCalledWith(LOG_LEVELS.INFO, 'Log message', null, undefined);
    });
  });

  describe('rpScreenshot', function () {
    const screenshotActionData: ScreenshotDataInterface = { value: 'file content', sessionId: 'unknown', status: 'done' };

    beforeAll(() => {
      commandsExecutionContext = {
        screenshot: (log_screenshot_data: boolean, action: screenshotCallbackType) => {
          action(screenshotActionData);
        },
      };
    });

    test('should call screenshot method from command execution context', function () {
      const spyScreenshot = jest.spyOn(commandsExecutionContext, 'screenshot');

      rpScreenshot.call(commandsExecutionContext);

      expect(spyScreenshot).toHaveBeenCalledTimes(1);
    });

    test('should call logInfo method from PublicReportingAPI to send log with screenshot to reporter', function () {
      const spyReportingApiLogInfo = jest.spyOn(PublicReportingAPI, 'logInfo');

      rpScreenshot.call(commandsExecutionContext, 'itemName');

      expect(spyReportingApiLogInfo).toHaveBeenCalledWith('Screenshot', {
        name: 'testScreen',
        type: DEFAULT_FILE_TYPE,
        content: 'file content',
      }, 'itemName');
    });

    test('should call additional callback if it exists in parameters', function () {
      const callbacks = {
        anyFunction: (data: screenshotCallbackType) => data,
      };

      const spyCallback = jest.spyOn(callbacks, 'anyFunction');

      rpScreenshot.call(commandsExecutionContext, 'itemName', callbacks.anyFunction);

      expect(spyCallback).toHaveBeenCalledWith(screenshotActionData);
    });
  });

  describe('rpSaveScreenshot', function () {
    const spyGetFileMimeType: jest.SpyInstance = jest.spyOn(utils, 'getFileMimeType')
      .mockReturnValue(DEFAULT_FILE_TYPE);

    const screenshotActionData: ScreenshotDataInterface = { value: 'file content', sessionId: 'unknown', status: 'done' };

    beforeAll(() => {
      commandsExecutionContext = {
        saveScreenshot: (fileName: string, action: screenshotCallbackType) => {
          action(screenshotActionData);
        },
      };
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    test('should call saveScreenshot method from command execution context', function () {
      const spySaveScreenshot = jest.spyOn(commandsExecutionContext, 'saveScreenshot');

      rpSaveScreenshot.call(commandsExecutionContext);

      expect(spySaveScreenshot).toHaveBeenCalledTimes(1);
    });

    test('invokes getFileMimeType util to get file mime type', function () {
      rpSaveScreenshot.call(commandsExecutionContext, 'fileName');

      expect(spyGetFileMimeType).toHaveBeenCalledWith('fileName');
    });

    test('should call logInfo method from PublicReportingAPI to send log with screenshot to reporter', function () {
      const spyReportingApiLogInfo = jest.spyOn(PublicReportingAPI, 'logInfo');

      rpSaveScreenshot.call(commandsExecutionContext, 'fileName', 'itemName');

      expect(spyReportingApiLogInfo).toHaveBeenCalledWith('fileName', {
        name: 'fileName',
        type: DEFAULT_FILE_TYPE,
        content: 'file content',
      }, 'itemName');
    });

    test('should call additional callback if it exists in parameters', function () {
      const callbacks = {
        anyFunction: (data: screenshotCallbackType) => data,
      };

      const spyCallback = jest.spyOn(callbacks, 'anyFunction');

      rpSaveScreenshot.call(commandsExecutionContext, 'fileName', 'itemName', callbacks.anyFunction);

      expect(spyCallback).toHaveBeenCalledWith(screenshotActionData);
    });
  });
});
