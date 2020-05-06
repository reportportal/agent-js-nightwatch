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

import ipc from 'node-ipc';
import { EVENTS } from '../../constants';

export const connectIPCClient = () => {
  ipc.config.id = `reportPortalReporter_${process.pid}`;
  ipc.config.retry = 1500;
  ipc.config.silent = true;

  ipc.log('connect to reportportal');
  ipc.connectTo('reportportal', () => {
    ipc.of.reportportal.on('connect', () => {
      ipc.log('***connected to reportportal***');
    });
    ipc.of.reportportal.on('disconnect', () => {
      ipc.log('***disconnected from reportportal***');
    });
  });
};

export const publishIPCEvent = (event: EVENTS | string, msg: any) => {
  ipc.log('send event to reportportal');
  ipc.of.reportportal.emit(event, msg);
};

export const disconnectIPCClient = () => {
  ipc.log('disconnect from reportportal');
  ipc.disconnect('reportportal');
};
