declare module 'reportportal-client' {
    export default class RPClient {
        constructor(config: any);
        public startLaunch(): void;
        public finishLaunch(): void;
        public startTestItem(): void;
        public finishTestItem(): void;
    }
}
