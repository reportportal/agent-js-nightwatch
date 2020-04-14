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
import moment from 'moment';
import { STATUSES } from '../constants';

const normalizeFileName = (name: string): string => {
  return name
    .replace(/\s/g, '-')
    .replace(/["']/g, '');
};

/*
  This function returns the path to the screenshot according to the getFileName() Nightwatch util function.
  For more details see the https://github.com/nightwatchjs/nightwatch/blob/master/lib/utils/screenshots.js#L12
*/
const getScreenshotPath = (testName: string, basePath: string, timestamp: number | Date): string => {
  const filenamePrefix = `${normalizeFileName(testName)}_${STATUSES.FAILED.toLocaleUpperCase()}`;
  const dateParts = new Date(timestamp).toString().replace(/:/g, '').split(' ');
  dateParts.shift();
  dateParts.pop();

  const dateStamp = dateParts.join('-');

  return path.resolve(path.join(basePath, `${filenamePrefix}_${dateStamp}.png`));
};

/*
  This function returns the possible paths to the auto-generated screenshot for failed test item.
  Since the screenshot can be saved in the file system before / after writing the test item to the report
  it is necessary to generate possible paths according to the delay.
*/
const getScreenshotPossiblePaths = (testName: string, basePath: string, testStartTime: number | Date): Array<Object> => {
  const possibleTimes = [
    testStartTime,
    moment(testStartTime).add(1, 's').toDate(),
    moment(testStartTime).subtract(1, 's').toDate(),
  ];

  return possibleTimes.map((time) =>
    ({ path: getScreenshotPath(testName, basePath, time), time })
  );
};

export {
  normalizeFileName,
  getScreenshotPath,
  getScreenshotPossiblePaths,
};
