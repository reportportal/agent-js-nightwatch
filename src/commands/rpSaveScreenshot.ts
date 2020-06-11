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

import { getFileMimeType } from '../utils';
import { screenshotCallbackType, ScreenshotDataInterface } from '../models/nightwatch';
import { ReportingAPI } from '../realTimeReporter';

// More about custom commands in Nightwatch - https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
export const command = function(
  fileName: string,
  itemName?: string,
  callback?: screenshotCallbackType,
) {
  return this.saveScreenshot(fileName, (data: ScreenshotDataInterface) => {
    const type = getFileMimeType(fileName);

    ReportingAPI.logInfo(
      fileName,
      {
        name: fileName,
        type,
        content: data.value,
      },
      itemName,
    );
    if (callback) {
      callback(data);
    }
  });
};
