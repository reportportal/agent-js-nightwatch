declare module 'reportportal-client' {
    export default class {
        constructor(config: any, agentInfo: any);

        public startLaunch(launchObj: any): any;
        public finishLaunch(launchId: string, launchObj: any): any;
        public startTestItem(itemObj: any, launchId: string, parentId?: string): any;
        public finishTestItem(itemId: string, itemObj: any): any;
        public sendLog(itemId: string, itemObj: any, fileObj?: any): any;
        public checkConnect(): any;
    }
}
