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
import { version as pjsonVersion, name as pjsonName } from '../package.json';
import { FILE_TYPES, DEFAULT_FILE_TYPE } from './constants';
import { Attribute } from './models';

export const getLastItem = (items: any[] = []): any => items[items.length - 1];

export const getFileMimeType = (fileName: string): string => {
  const matches = fileName.match(/\.([^.]*)$/);
  let type;

  if (matches) {
    // @ts-ignore
    type = FILE_TYPES[matches[1].toUpperCase()];
  }

  return type || DEFAULT_FILE_TYPE;
};

export const getAgentInfo = () => ({
  version: pjsonVersion,
  name: pjsonName,
});

export const getSystemAttributes = (): Array<Attribute> => [
  {
    key: 'agent',
    value: `${pjsonName}|${pjsonVersion}`,
    system: true,
  },
];

export const buildCodeRef = (testPath: string, itemName = ''): string => {
  const workingDir = process.cwd();

  const codeRef = testPath.replace(`${workingDir}${path.sep}`, '').replace(/\\/g, '/');

  return itemName ? `${codeRef}/${itemName}` : codeRef;
};
