// @ts-ignore
import PublicReportingAPI from 'reportportal-client/lib/publicReportingAPI';
import { LOG_LEVELS } from '../../constants';
import { AttachmentRQ, Attribute, LogRQ } from '../../models';

type LogMessage = Pick<LogRQ, 'message'>;

interface SendLogInterface {
    info(message: LogMessage): void;
    debug(message: LogMessage): void;
    error(message: LogMessage): void;
    trace(message: LogMessage): void;
    fatal(message: LogMessage): void;
}

export interface AttachDataInterface {
    addAttributes(attributes: Array<Attribute>): void;
    addDescription(text: string): void;
    addAttachment(level: Pick<LogRQ, 'level'>, file: Pick<AttachmentRQ, 'file'>, message: LogMessage): void;

    sendLog: SendLogInterface;
    sendLaunchLog: SendLogInterface;
}

export const attachData: AttachDataInterface = {
    addAttributes: PublicReportingAPI.addAttributes,
    addDescription: PublicReportingAPI.addDescription,
    addAttachment: PublicReportingAPI.addAttachment,

    sendLog: {
        info: (message) => {
            PublicReportingAPI.addLog(LOG_LEVELS.INFO, message);
        },
        debug: (message) => {
            PublicReportingAPI.addLog(LOG_LEVELS.DEBUG, message);
        },
        error: (message) => {
            PublicReportingAPI.addLog(LOG_LEVELS.ERROR, message);
        },
        trace: (message) => {
            PublicReportingAPI.addLog(LOG_LEVELS.TRACE, message);
        },
        fatal: (message) => {
            PublicReportingAPI.addLog(LOG_LEVELS.FATAL, message);
        },
    },

    sendLaunchLog: {
        info: (message) => {
            PublicReportingAPI.addLaunchLog(LOG_LEVELS.INFO, message);
        },
        debug: (message) => {
            PublicReportingAPI.addLaunchLog(LOG_LEVELS.DEBUG, message);
        },
        error: (message) => {
            PublicReportingAPI.addLaunchLog(LOG_LEVELS.ERROR, message);
        },
        trace: (message) => {
            PublicReportingAPI.addLaunchLog(LOG_LEVELS.TRACE, message);
        },
        fatal: (message) => {
            PublicReportingAPI.addLaunchLog(LOG_LEVELS.FATAL, message);
        },
    },

};
