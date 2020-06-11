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

import { itemsReporting, ItemsReportingInterface } from './itemsReporting';
import { hooksReporting, HooksReportingInterface } from './hooksReporting';
import { attachData, AttachDataInterface } from './attachData';
import { connectIPCClient, disconnectIPCClient } from '../ipc/client';

interface ApiInterface {
  init: () => void;
  destroy: () => void;
}

type ReportingApiInterface = ItemsReportingInterface &
  HooksReportingInterface &
  AttachDataInterface &
  ApiInterface;

const ReportingApi: ReportingApiInterface = {
  init: () => {
    connectIPCClient();
  },
  destroy: () => {
    setImmediate(disconnectIPCClient);
  },
  ...itemsReporting,
  ...hooksReporting,
  ...attachData,
};

export default ReportingApi;
