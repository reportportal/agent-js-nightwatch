import { LOG_LEVELS } from '../constants';
import { PublicReportingAPI } from '../realTimeReporter';

// More about custom commands in Nightwatch - https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
export const command = function (message: string, level: LOG_LEVELS = LOG_LEVELS.INFO) {
    return this.perform(function () {
        console.log(message);

        PublicReportingAPI.log(level, message);
    });
};
