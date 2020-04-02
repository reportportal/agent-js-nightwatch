export interface ScreenshotDataInterface {
    value: string;
    sessionId: string;
    status: string;
}

export type screenshotCallbackType = ((data: ScreenshotDataInterface) => void) | undefined;
