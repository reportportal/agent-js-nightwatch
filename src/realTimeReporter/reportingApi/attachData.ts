// @ts-ignore
import PublicReportingAPI from 'reportportal-client/lib/publicReportingAPI';
import { LOG_LEVELS } from '../../constants';
import { Attribute, LogRQ, Attachment } from '../../models';

type LogMessage = LogRQ['message'];

export interface AttachDataInterface {
    addAttributes(attributes: Array<Attribute>): void;
    addDescription(text: string): void;

    log(level: LOG_LEVELS, message: LogMessage, file?: Attachment): void;
    launchLog(level: LOG_LEVELS, message: LogMessage, file?: Attachment): void;

    logInfo(message: LogMessage, file?: Attachment): void;
    logDebug(message: LogMessage, file?: Attachment): void;
    logWarn(message: LogMessage, file?: Attachment): void;
    logError(message: LogMessage, file?: Attachment): void;
    logTrace(message: LogMessage, file?: Attachment): void;
    logFatal(message: LogMessage, file?: Attachment): void;

    launchLogInfo(message: LogMessage, file?: Attachment): void;
    launchLogDebug(message: LogMessage, file?: Attachment): void;
    launchLogWarn(message: LogMessage, file?: Attachment): void;
    launchLogError(message: LogMessage, file?: Attachment): void;
    launchLogTrace(message: LogMessage, file?: Attachment): void;
    launchLogFatal(message: LogMessage, file?: Attachment): void;
}

export const attachData: AttachDataInterface = {
    addAttributes: PublicReportingAPI.addAttributes,
    addDescription: PublicReportingAPI.addDescription,

    log(level, message = '', file) {
        PublicReportingAPI.addLog({ level, message, file });
    },
    launchLog(level, message = '', file) {
        PublicReportingAPI.addLaunchLog({ level, message, file });
    },

    logInfo(message, file) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.INFO, message, file });
    },
    logDebug(message, file) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.DEBUG, message, file });
    },
    logWarn(message, file) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.WARN, message, file });
    },
    logError(message, file) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.ERROR, message, file });
    },
    logTrace(message, file) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.TRACE, message, file });
    },
    logFatal(message, file) {
        PublicReportingAPI.addLog({ level: LOG_LEVELS.FATAL, message, file });
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
