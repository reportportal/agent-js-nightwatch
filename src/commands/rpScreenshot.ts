import { DEFAULT_FILE_TYPE } from '../constants';
import { screenshotCallbackType, ScreenshotDataInterface } from '../models/commands';
import { PublicReportingAPI } from '../realTimeReporter';

// More about custom commands in Nightwatch - https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
export const command = function (log_screenshot_data: boolean, callback: screenshotCallbackType) {
    return this.screenshot(log_screenshot_data, (data: ScreenshotDataInterface) => {
        PublicReportingAPI.logInfo('Screenshot', {
            name: 'testScreen',
            type: DEFAULT_FILE_TYPE,
            content: data.value,
        });
        if (callback) {
            callback(data);
        }
    });
};