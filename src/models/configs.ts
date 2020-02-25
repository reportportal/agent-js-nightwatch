export interface ReportPortalConfig {
    token: string;
    project: string;
    endpoint: string;
    launch: string;

    debug?: boolean;
    isLaunchMergeRequired?: boolean;
}

export interface AgentOptions {
    reportItemsWithLaunchAttributes?: boolean;
    reportItemsWithLaunchDescription?: boolean;
    screenshotsPath?: boolean;
}
