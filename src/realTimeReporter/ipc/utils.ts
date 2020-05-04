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

// @ts-ignore
import { EVENTS as CLIENT_EVENTS } from 'reportportal-client/lib/events';
import { EVENTS } from '../../constants';
import { publishEvent } from '../utils';

// TODO: update types
export const subscribeToEvents = (server: any) => {
  server.on(EVENTS.START_TEST_ITEM, (data: any) => {
    publishEvent(EVENTS.START_TEST_ITEM, data);
  });
  server.on(EVENTS.FINISH_TEST_ITEM, (data: any) => {
    publishEvent(EVENTS.FINISH_TEST_ITEM, data);
  });
  server.on(CLIENT_EVENTS.ADD_LOG, (data: any) => {
    publishEvent(CLIENT_EVENTS.ADD_LOG, data);
  });
  server.on(CLIENT_EVENTS.ADD_LAUNCH_LOG, (data: any) => {
    publishEvent(CLIENT_EVENTS.ADD_LAUNCH_LOG, data);
  });
  server.on(CLIENT_EVENTS.ADD_ATTRIBUTES, (data: any) => {
    publishEvent(CLIENT_EVENTS.ADD_ATTRIBUTES, data);
  });
  server.on(CLIENT_EVENTS.SET_DESCRIPTION, (data: any) => {
    publishEvent(CLIENT_EVENTS.SET_DESCRIPTION, data);
  });
};
