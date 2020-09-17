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

import { StartLaunchRQ } from '../../../models';
import { RealTimeReporter } from '../../../realTimeReporter';
import * as reporterUtils from '../../../realTimeReporter/utils';
import * as IPCServer from '../../../realTimeReporter/ipc/server';
import { getDefaultMockConfig, RPClientMock } from '../../mocks';

describe('launchReporting', function() {
  jest.spyOn(IPCServer, 'startIPCServer').mockImplementation((callback: any) => {
    callback({
      on: () => {},
    });
  });
  let reporter: RealTimeReporter;

  beforeEach(() => {
    const config = getDefaultMockConfig();
    const client = new RPClientMock();

    reporter = new RealTimeReporter(config);
    // @ts-ignore access to the class private property
    reporter.client = client;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startLaunch', function() {
    let spyGetStartLaunchObj: jest.SpyInstance;

    beforeEach(() => {
      spyGetStartLaunchObj = jest.spyOn(reporterUtils, 'getStartLaunchObj');
    });

    test('invokes getStartLaunchObj method to receive object to correctly start launch', function() {
      const launchObj: StartLaunchRQ = {
        description: 'Launch description',
        attributes: [{ key: 'example', value: 'true' }],
      };

      reporter.startLaunch(launchObj);

      expect(spyGetStartLaunchObj).toHaveBeenCalledWith(launchObj, {
        description: 'Launch description',
        attributes: [],
      });
    });

    test('should start launch by calling the ReportPortal client startLaunch method', function() {
      const launchObj: StartLaunchRQ = {
        description: 'Launch description',
        attributes: [{ key: 'example', value: 'true' }],
      };
      spyGetStartLaunchObj.mockReturnValueOnce(launchObj);

      reporter.startLaunch(launchObj);

      // @ts-ignore access to the class private property
      expect(reporter.client.startLaunch).toHaveBeenCalledWith(launchObj);
    });
  });

  describe('finishLaunch', function() {
    let spyStopIPCServer: jest.SpyInstance;

    beforeEach(() => {
      spyStopIPCServer = jest.spyOn(IPCServer, 'stopIPCServer').mockImplementation(() => {});
    });

    beforeEach(() => {
      // @ts-ignore access to the class private property
      reporter.launchId = 'tempLaunchId';
    });

    test('should finish launch with empty finish object in case of empty arguments', function() {
      reporter.finishLaunch();

      // @ts-ignore access to the class private property
      expect(reporter.client.finishLaunch).toHaveBeenCalledWith('tempLaunchId', {});
    });

    test('should call stopIPCServer function to switch off the ipc server', function() {
      reporter.finishLaunch();

      expect(spyStopIPCServer).toHaveBeenCalledTimes(1);
    });

    test('should finish launch by calling the ReportPortal client finishLaunch method', function() {
      const launchObj = { attributes: [{ key: 'test' }] };

      reporter.finishLaunch(launchObj);

      // @ts-ignore access to the class private property
      expect(reporter.client.finishLaunch).toHaveBeenCalledWith('tempLaunchId', launchObj);
    });
  });
});
