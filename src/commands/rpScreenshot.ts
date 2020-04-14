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

import { DEFAULT_FILE_TYPE } from '../constants';
import { screenshotCallbackType, ScreenshotDataInterface } from '../models/commands';
import { PublicReportingAPI } from '../realTimeReporter';

// More about custom commands in Nightwatch - https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
export const command = function (log_screenshot_data: boolean, callback: screenshotCallbackType) {
    return this.screenshot(log_screenshot_data, (data: ScreenshotDataInterface) => {
        PublicReportingAPI.logInfo('Screenshot', {
            name: 'testScreen',
            type: DEFAULT_FILE_TYPE,
            content: data.value,
        });
        if (callback) {
            callback(data);
        }
    });
};
