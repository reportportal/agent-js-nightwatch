import { TEST_ITEM_TYPES, FILE_TYPES, LAUNCH_MODES, LOG_LEVELS } from '../constants';
import { RPItemStartRQ, RPItemFinishRQ, Parameter, Issue } from './common';

export interface StartTestItemRQ extends RPItemStartRQ {
    name: string;
    type: TEST_ITEM_TYPES;

    parameters?: Array<Parameter>;
    codeRef?: string;
    hasStats?: boolean,
    retry?: boolean,
    launchUuid?: string;
    testCaseHash?: number;
    testCaseId?: string;
    uniqueId?: string
}

export interface FinishTestItemRQ extends RPItemFinishRQ {
    launchUuid?: string;
    retry?: boolean,
    issue?: Issue,
}

export interface StartLaunchRQ extends RPItemStartRQ {
    rerun?: boolean,
    rerunOf?: string,
    mode?: LAUNCH_MODES;
}

export interface FinishLaunchRQ extends RPItemFinishRQ {}

export interface Attachment {
    name: string,
    type: FILE_TYPES | string,
    content: string | Buffer,
}

export interface LogRQ {
    level?: LOG_LEVELS;
    message?: string;
    time?: number;
    file?: Attachment;
}
