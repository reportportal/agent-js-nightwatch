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

export const startIPCServer = (subscribeServerEvents: (server: any) => void) => {
    if (ipc.server) {
        subscribeServerEvents(ipc.server);
        return;
    }
    ipc.config.id = 'reportportal';
    ipc.config.retry = 1500;
    ipc.config.silent = true;

    ipc.serve(() => {
        ipc.server.on('socket.disconnected', (socket: any, destroyedSocketID: string) => {
            ipc.log(`client ${destroyedSocketID} has disconnected!`);
        });
        ipc.server.on('destroy', () => {
            ipc.log('server destroyed');
        });
        subscribeServerEvents(ipc.server);
        process.on('exit', () => {
            ipc.server.stop();
        });
    });
    ipc.server.start();
};
