// @ts-ignore
import PublicReportingAPI from 'reportportal-client/lib/publicReportingAPI';
import { LOG_LEVELS } from '../../constants';
import { Attribute, LogRQ } from '../../models';

type LogMessage = Pick<LogRQ, 'message'>;

interface LogInterface {
    info(message: LogMessage): void;
    debug(message: LogMessage): void;
    warn(message: LogMessage): void;
    error(message: LogMessage): void;
    trace(message: LogMessage): void;
    fatal(message: LogMessage): void;
}

export interface AttachDataInterface {
    addAttributes(attributes: Array<Attribute>): void;
    addDescription(text: string): void;

    log: LogInterface;
    launchLog: LogInterface;
}

export const attachData: AttachDataInterface = {
    addAttributes: PublicReportingAPI.addAttributes,
    addDescription: PublicReportingAPI.addDescription,

    log: {
        info: (message) => {
            PublicReportingAPI.addLog({ level: LOG_LEVELS.INFO, message });
        },
        debug: (message) => {
            PublicReportingAPI.addLog({ level: LOG_LEVELS.DEBUG, message });
        },
        warn: (message) => {
            PublicReportingAPI.addLog({ level: LOG_LEVELS.WARN, message });
        },
        error: (message) => {
            PublicReportingAPI.addLog({ level: LOG_LEVELS.ERROR, message });
        },
        trace: (message) => {
            PublicReportingAPI.addLog({ level: LOG_LEVELS.TRACE, message });
        },
        fatal: (message) => {
            PublicReportingAPI.addLog({ level: LOG_LEVELS.FATAL, message });
        },
    },

    launchLog: {
        info: (message) => {
            PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.INFO, message });
        },
        debug: (message) => {
            PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.DEBUG, message });
        },
        warn: (message) => {
            PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.WARN, message });
        },
        error: (message) => {
            PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.ERROR, message });
        },
        trace: (message) => {
            PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.TRACE, message });
        },
        fatal: (message) => {
            PublicReportingAPI.addLaunchLog({ level: LOG_LEVELS.FATAL, message });
        },
    },

};
