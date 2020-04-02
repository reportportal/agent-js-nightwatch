import { getFileType } from '../utils';
import { screenshotCallbackType, ScreenshotDataInterface } from '../models/commands';
import { PublicReportingAPI } from '../realTimeReporter';

// More about custom commands in Nightwatch - https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
export const command = function (fileName: string, callback: screenshotCallbackType) {
    return this.saveScreenshot(fileName, (data: ScreenshotDataInterface) => {
        const type = getFileType(fileName);

        PublicReportingAPI.logInfo('Screenshot', {
            name: fileName,
            type,
            content: data.value,
        });
        if (callback) {
            callback(data);
        }
    });
};
