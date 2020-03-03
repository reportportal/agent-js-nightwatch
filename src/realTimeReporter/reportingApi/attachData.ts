import { AttachmentRQ, Attribute, LogRQ } from '../../models';
import { publishEvent } from '../utils';
import { EVENTS } from '../../constants';

export interface AttachDataInterface {
    sendLog(data: LogRQ): void;
    sendAttachment(data: AttachmentRQ): void;
    addDescription(data: string): void;
    setAttribute(data: Attribute): void;
}

export const attachData: AttachDataInterface = {
    sendLog(data: LogRQ): void {
        publishEvent(EVENTS.SEND_LOG, data);
    },

    sendAttachment(data: AttachmentRQ): void {
        publishEvent(EVENTS.SEND_ATTACHMENT, data);
    },

    addDescription(data: string): void {
        publishEvent(EVENTS.ADD_DESCRIPTION, data);
    },

    setAttribute(data: Attribute): void {
        publishEvent(EVENTS.SET_ATTRIBUTE, data);
    },
};
