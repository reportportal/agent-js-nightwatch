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

import path from 'path';
// @ts-ignore
import packageJson from '../../package.json';
import {
  getLastItem,
  getFileMimeType,
  getAgentInfo,
  getSystemAttributes,
  buildCodeRef,
} from '../utils';
import { DEFAULT_FILE_TYPE } from '../constants';

describe('getLastItem', function() {
  test('should return the last item from array', function() {
    const items = [1, 2, 3];

    expect(getLastItem(items)).toBe(3);
  });

  test('should return undefined for empty array', function() {
    expect(getLastItem([])).toBe(undefined);
  });

  test('should return undefined in case of no arguments', function() {
    expect(getLastItem()).toBe(undefined);
  });
});

describe('getFileMimeType', function() {
  test('should return file MIME type according to provided file name', function() {
    expect(getFileMimeType('fileName.png')).toBe('image/png');
  });

  test('should return DEFAULT_FILE_TYPE for file name without extension', function() {
    expect(getFileMimeType('fileName')).toBe(DEFAULT_FILE_TYPE);
  });

  test('should return DEFAULT_FILE_TYPE for file name with unsupported extension', function() {
    expect(getFileMimeType('fileName.unknown')).toBe(DEFAULT_FILE_TYPE);
  });
});

describe('getAgentInfo', function() {
  test('should return the name and version of application from package.json file', function() {
    const agentInfo = getAgentInfo();

    expect(agentInfo.name).toBe(packageJson.name);
    expect(agentInfo.version).toBe(packageJson.version);
  });
});

describe('getSystemAttributes', function() {
  test('should return the list of system attributes', function() {
    const systemAttributes = getSystemAttributes();

    expect(systemAttributes).toEqual([
      {
        key: 'agent',
        value: `${packageJson.name}|${packageJson.version}`,
        system: true,
      },
    ]);
  });
});

describe('buildCodeRef', function() {
  const root = 'C:\\project\\nightwatch-reportportal';

  beforeAll(() => {
    jest.spyOn(process, 'cwd').mockImplementation(() => root);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should return formatted code ref from testPath', function() {
    const codeRef = buildCodeRef(`${root}${path.sep}dir\\fileName.ts`);

    expect(codeRef).toBe('dir/fileName.ts');
  });

  test('should return formatted code ref from testPath and testName', function() {
    const codeRef = buildCodeRef(`${root}${path.sep}dir\\fileName.ts`, 'awesomeTest');

    expect(codeRef).toBe('dir/fileName.ts/awesomeTest');
  });
});
