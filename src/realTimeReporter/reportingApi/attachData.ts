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
import PublicReportingAPI from 'reportportal-client/lib/publicReportingAPI';
import { LOG_LEVELS } from '../../constants';
import { Attribute, LogRQ, Attachment } from '../../models';

type LogMessage = LogRQ['message'];

export interface AttachDataInterface {
    addAttributes(attributes: Array<Attribute>, suite?: string): void;
    setDescription(text: string, suite?: string): void;

    log(level: LOG_LEVELS, message: LogMessage, file?: Attachment, suite?: string): void;
    launchLog(level: LOG_LEVELS, message: LogMessage, file?: Attachment): void;

    logInfo(message: LogMessage, file?: Attachment, suite?: string): void;
    logDebug(message: LogMessage, file?: Attachment, suite?: string): void;
    logWarn(message: LogMessage, file?: Attachment, suite?: string): void;
    logError(message: LogMessage, file?: Attachment, suite?: string): void;
    logTrace(message: LogMessage, file?: Attachment, suite?: string): void;
    logFatal(message: LogMessage, file?: Attachment, suite?: string): void;

    launchLogInfo(message: LogMessage, file?: Attachment): void;
    launchLogDebug(message: LogMessage, file?: Attachment): void;
    launchLogWarn(message: LogMessage, file?: Attachment): void;
    launchLogError(message: LogMessage, file?: Attachment): void;
    launchLogTrace(message: LogMessage, file?: Attachment): void;
    launchLogFatal(message: LogMessage, file?: Attachment): void;
}

export const attachData: AttachDataInterface = {
    addAttributes: PublicReportingAPI.addAttributes,
    setDescription: PublicReportingAPI.setDescription,

    log(level, message = '', file = null, suite?: string) {
        PublicReportingAPI.addLog({ level, message, file }, suite);
    },
    launchLog(level, message = '', file) {
        PublicReportingAPI.addLaunchLog({ level, message, file });
    },

    logInfo(message, file = null, suite?: string) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.INFO, message, file }, suite);
    },
    logDebug(message, file = null, suite?: string) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.DEBUG, message, file }, suite);
    },
    logWarn(message, file = null, suite?: string) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.WARN, message, file }, suite);
    },
    logError(message, file = null, suite?: string) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.ERROR, message, file }, suite);
    },
    logTrace(message, file = null, suite?: string) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.TRACE, message, file }, suite);
    },
    logFatal(message, file = null, suite?: string) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.FATAL, message, file }, suite);
    },

    launchLogInfo(message, file) {
        PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.INFO, message, file });
    },
    launchLogDebug(message, file) {
        PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.DEBUG, message, file });
    },
    launchLogWarn(message, file) {
        PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.WARN, message, file });
    },
    launchLogError(message, file) {
        PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.ERROR, message, file });
    },
    launchLogTrace(message, file) {
        PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.TRACE, message, file });
    },
    launchLogFatal(message, file) {
        PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.FATAL, message, file });
    },
};
