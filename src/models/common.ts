import { STATUSES } from '../constants';

export interface Attribute {
    value: string;
    key?: string;
    system?: boolean;
}

export interface Parameter {
    key: string;
    value: string;
}

interface ExternalSystemIssue {
    url: string;
    btsProject: string,
    btsUrl: string,
    ticketId: string,

    submitDate?: number,
}

export interface Issue {
    issueType: string

    autoAnalyzed?: boolean,
    ignoreAnalyzer?: boolean,
    comment?: string,
    externalSystemIssues?: Array<ExternalSystemIssue>;
}

interface RPItem {
    attributes?: Array<Attribute>,
    description?: string,
}

export interface RPItemStartRQ extends RPItem {
    startTime?: Date;
}

export interface RPItemFinishRQ extends RPItem {
    status: STATUSES;
    endTime?: Date;
}
