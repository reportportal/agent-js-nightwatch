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

import { LOG_LEVELS } from '../constants';
import { PublicReportingAPI } from '../realTimeReporter';

// More about custom commands in Nightwatch - https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
export const command = function (message: string, level: LOG_LEVELS = LOG_LEVELS.INFO, suiteName?: string) {
  return this.perform(function (data: any) {
    console.log(data);
    PublicReportingAPI.log(level, message, null, suiteName);
  });
};
