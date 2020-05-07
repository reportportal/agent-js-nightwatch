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

import * as IPCClient from '../../../realTimeReporter/ipc/client';
import { attachData } from '../../../realTimeReporter/reportingApi/attachData';
import { FILE_TYPES, LOG_LEVELS, EVENTS } from '../../../constants';
import { LogRQ } from '../../../models';

describe('attachData', function () {
  const spyPublishIPCEvent = jest.spyOn(IPCClient, 'publishIPCEvent')
    .mockImplementation(() => {});

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('addAttributes: should call spyPublishIPCEvent with ADD_ATTRIBUTES event', function () {
    attachData.addAttributes([], 'parentItem');

    expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_ATTRIBUTES, { attributes: [], itemName: 'parentItem' });
  });

  test('addDescription: should call spyPublishIPCEvent with ADD_DESCRIPTION event', function () {
    attachData.addDescription('description', 'parentItem');

    expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_DESCRIPTION, { text: 'description', itemName: 'parentItem' });
  });

  describe('item log functions', function () {
    describe('log', function () {
      test('should call should call spyPublishIPCEvent with ADD_LOG event', function () {
        const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

        attachData.log(LOG_LEVELS.INFO, 'log', file, 'parentName');

        const expectedObject = {
          log: { level: LOG_LEVELS.INFO, message: 'log', file },
          itemName: 'parentName',
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });

      test('should set file to null if it not exists', function () {
        attachData.log(LOG_LEVELS.INFO, 'log');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.INFO, message: 'log', file: null },
          itemName: undefined,
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });
    });

    describe('logInfo', function () {
      test('should call should call spyPublishIPCEvent with ADD_LOG event with INFO log level', function () {
        const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

        attachData.logInfo('log', file, 'parentName');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.INFO, message: 'log', file },
          itemName: 'parentName',
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });

      test('should set file to null if it not exists', function () {
        attachData.logInfo('log');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.INFO, message: 'log', file: null },
          itemName: undefined,
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });
    });

    describe('logDebug', function () {
      test('should call should call spyPublishIPCEvent with ADD_LOG event with DEBUG log level', function () {
        const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

        attachData.logDebug('log', file, 'parentName');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.DEBUG, message: 'log', file },
          itemName: 'parentName',
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });

      test('should set file to null if it not exists', function () {
        attachData.logDebug('log');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.DEBUG, message: 'log', file: null },
          itemName: undefined,
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });
    });

    describe('logWarn', function () {
      test('should call should call spyPublishIPCEvent with ADD_LOG event with WARN log level', function () {
        const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

        attachData.logWarn('log', file, 'parentName');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.WARN, message: 'log', file },
          itemName: 'parentName',
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });

      test('should set file to null if it not exists', function () {
        attachData.logWarn('log');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.WARN, message: 'log', file: null },
          itemName: undefined,
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });
    });

    describe('logError', function () {
      test('should call should call spyPublishIPCEvent with ADD_LOG event with ERROR log level', function () {
        const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

        attachData.logError('log', file, 'parentName');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.ERROR, message: 'log', file },
          itemName: 'parentName',
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });

      test('should set file to null if it not exists', function () {
        attachData.logError('log');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.ERROR, message: 'log', file: null },
          itemName: undefined,
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });
    });

    describe('logTrace', function () {
      test('should call should call spyPublishIPCEvent with ADD_LOG event with TRACE log level', function () {
        const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

        attachData.logTrace('log', file, 'parentName');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.TRACE, message: 'log', file },
          itemName: 'parentName',
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });

      test('should set file to null if it not exists', function () {
        attachData.logTrace('log');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.TRACE, message: 'log', file: null },
          itemName: undefined,
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });
    });

    describe('logFatal', function () {
      test('should call should call spyPublishIPCEvent with ADD_LOG event with FATAL log level', function () {
        const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

        attachData.logFatal('log', file, 'parentName');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.FATAL, message: 'log', file },
          itemName: 'parentName',
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });

      test('should set file to null if it not exists', function () {
        attachData.logFatal('log');

        const expectedObject: { log: LogRQ, itemName: string } = {
          log: { level: LOG_LEVELS.FATAL, message: 'log', file: null },
          itemName: undefined,
        };

        expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LOG, expectedObject);
      });
    });
  });

  describe('launch log functions', function () {
    test('launchLog: should call should call spyPublishIPCEvent with ADD_LAUNCH_LOG event', function () {
      const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

      attachData.launchLog(LOG_LEVELS.INFO, 'log', file);

      expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LAUNCH_LOG, { level: LOG_LEVELS.INFO, message: 'log', file });
    });

    test('launchLogInfo: should call should call spyPublishIPCEvent with ADD_LAUNCH_LOG event with INFO log level', function () {
      const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

      attachData.launchLogInfo('log', file);

      expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LAUNCH_LOG, { level: LOG_LEVELS.INFO, message: 'log', file });
    });

    test('launchLogDebug: should call should call spyPublishIPCEvent with ADD_LAUNCH_LOG event with DEBUG log level', function () {
      const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

      attachData.launchLogDebug('log', file);

      expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LAUNCH_LOG, { level: LOG_LEVELS.DEBUG, message: 'log', file });
    });

    test('launchLogWarn: should call should call spyPublishIPCEvent with ADD_LAUNCH_LOG event with WARN log level', function () {
      const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

      attachData.launchLogWarn('log', file);

      expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LAUNCH_LOG, { level: LOG_LEVELS.WARN, message: 'log', file });
    });

    test('launchLogError: should call should call spyPublishIPCEvent with ADD_LAUNCH_LOG event with ERROR log level', function () {
      const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

      attachData.launchLogError('log', file);

      expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LAUNCH_LOG, { level: LOG_LEVELS.ERROR, message: 'log', file });
    });

    test('launchLogTrace: should call should call spyPublishIPCEvent with ADD_LAUNCH_LOG event with TRACE log level', function () {
      const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

      attachData.launchLogTrace('log', file);

      expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LAUNCH_LOG, { level: LOG_LEVELS.TRACE, message: 'log', file });
    });

    test('launchLogFatal: should call should call spyPublishIPCEvent with ADD_LAUNCH_LOG event with FATAL log level', function () {
      const file = { name: 'fileName', type: FILE_TYPES.TEXT, content: 'empty' };

      attachData.launchLogFatal('log', file);

      expect(spyPublishIPCEvent).toHaveBeenCalledWith(EVENTS.ADD_LAUNCH_LOG, { level: LOG_LEVELS.FATAL, message: 'log', file });
    });
  });
});
