// @ts-ignore
import PublicReportingAPI from 'reportportal-client/lib/publicReportingAPI';
import { AttachmentRQ, Attribute, LogRQ } from '../../models';

export interface AttachDataInterface {
    addAttributes(attributes: Array<Attribute>): void;
    addDescription(text: string): void;
    addLog(level: Pick<LogRQ, 'level'>, message: Pick<LogRQ, 'message'>): void;
    addAttachment(level: Pick<LogRQ, 'level'>, file: Pick<AttachmentRQ, 'file'>, message: Pick<LogRQ, 'message'>): void;
}

export const attachData: AttachDataInterface = {
    addAttributes: PublicReportingAPI.addAttributes,
    addDescription: PublicReportingAPI.addDescription,
    addLog: PublicReportingAPI.addLog,
    addAttachment: PublicReportingAPI.addAttachment,
};
