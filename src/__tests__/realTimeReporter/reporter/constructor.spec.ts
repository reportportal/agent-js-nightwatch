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

import RPClient from '@reportportal/client-javascript';
import { Storage } from '../../../realTimeReporter/storage';
import * as IPCServer from '../../../realTimeReporter/ipc/server';
import { RealTimeReporter } from '../../../realTimeReporter';
import { getDefaultMockConfig } from '../../mocks';

describe('constructor', function() {
  jest.spyOn(IPCServer, 'startIPCServer').mockImplementation((callback: any) => {
    callback({
      on: () => {},
    });
  });
  test('should create the RP client instance to communicate with ReportPortal', function() {
    const config = getDefaultMockConfig();
    const reporter = new RealTimeReporter(config);

    // @ts-ignore access to the class private property
    expect(reporter.client).toBeDefined();

    // @ts-ignore access to the class private property
    expect(reporter.client).toBeInstanceOf(RPClient);
  });

  test('should create the Storage instance to hold test items', function() {
    const config = getDefaultMockConfig();
    const reporter = new RealTimeReporter(config);

    // @ts-ignore access to the class private property
    expect(reporter.storage).toBeDefined();

    // @ts-ignore access to the class private property
    expect(reporter.storage).toBeInstanceOf(Storage);
  });

  test('should override default options', function() {
    const config = getDefaultMockConfig();
    config.rerun = true;
    config.rerunOf = 'launchUUID';
    const reporter = new RealTimeReporter(config);

    // @ts-ignore access to the class private property
    expect(reporter.config).toBeDefined();

    // @ts-ignore access to the class private property
    expect(reporter.config.rerunOf).toEqual('launchUUID');

    // @ts-ignore access to the class private property
    expect(reporter.config.rerun).toEqual(true);
  });
});
