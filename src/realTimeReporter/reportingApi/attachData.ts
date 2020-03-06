// @ts-ignore
import PublicReportingAPI from 'reportportal-client/lib/publicReportingAPI';
import { AttachmentRQ, Attribute, LogRQ } from '../../models';

export interface AttachDataInterface {
    addAttributes(attributes: Array<Attribute>): void;
    addDescription(text: string): void;
    addLog(message: LogRQ['message'], level: LogRQ['level']): void;
    addAttachment(message: LogRQ['message'], file: AttachmentRQ['file'], level: LogRQ['level']): void;
}

export const attachData: AttachDataInterface = {
    addAttributes: PublicReportingAPI.addAttributes,
    addDescription: PublicReportingAPI.addDescription,
    addLog: PublicReportingAPI.addLog,
    addAttachment: PublicReportingAPI.addAttachment,
};
