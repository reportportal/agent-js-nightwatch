import { Attribute } from "./common";

export interface ReportPortalConfig {
    token: string;
    project: string;
    endpoint: string;
    launch: string;

    debug?: boolean;
    attributes?: Array<Attribute>;
    description?: string;
    isLaunchMergeRequired?: boolean;
}

export interface AgentOptions {
    screenshotsPath?: string;
}
