import { FinishTestItemRQ, StartTestItemRQ } from '../../models';
import { EVENTS, TEST_ITEM_TYPES } from '../../constants';
import { publishEvent } from '../utils';

export interface HooksReportingInterface {
    startBeforeSuite(data: StartTestItemRQ): void;
    finishBeforeSuite(data: FinishTestItemRQ): void;

    startAfterSuite(data: StartTestItemRQ): void;
    finishAfterSuite(data: FinishTestItemRQ): void;

    startBeforeTestCase(data: StartTestItemRQ): void;
    finishBeforeTestCase(data: FinishTestItemRQ): void;

    startAfterTestCase(data: StartTestItemRQ): void;
    finishAfterTestCase(data: FinishTestItemRQ): void;
}

export const hooksReporting: HooksReportingInterface = {
    startBeforeSuite(data: StartTestItemRQ): void {
        const suiteObj = {
            type: TEST_ITEM_TYPES.BEFORE_SUITE,
            name: 'Before suite',
            ...data,
        };

        publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
    },

    finishBeforeSuite(data: FinishTestItemRQ): void {
        publishEvent(EVENTS.FINISH_TEST_ITEM, data);
    },

    startAfterSuite(data: StartTestItemRQ): void {
        const suiteObj = {
            type: TEST_ITEM_TYPES.AFTER_SUITE,
            name: 'After suite',
            ...data,
        };

        publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
    },

    finishAfterSuite(data: FinishTestItemRQ): void {
        publishEvent(EVENTS.FINISH_TEST_ITEM, data);
    },

    startBeforeTestCase(data: StartTestItemRQ): void {
        const suiteObj = {
            type: TEST_ITEM_TYPES.BEFORE_TEST,
            name: 'Before test',
            ...data,
        };

        publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
    },

    finishBeforeTestCase(data: FinishTestItemRQ): void {
        publishEvent(EVENTS.FINISH_TEST_ITEM, data);
    },

    startAfterTestCase(data: StartTestItemRQ): void {
        const suiteObj = {
            type: TEST_ITEM_TYPES.AFTER_TEST,
            name: 'After test',
            ...data,
        };

        publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
    },

    finishAfterTestCase(data: FinishTestItemRQ): void {
        publishEvent(EVENTS.FINISH_TEST_ITEM, data);
    },
};
