import { FinishTestItemRQ, StartTestItemRQ } from '../../models';
import { EVENTS, TEST_ITEM_TYPES } from '../../constants';
import { publishEvent, getCodeRef } from '../utils';

export interface ItemsReportingInterface {
    startSuite(data: StartTestItemRQ): void;
    finishSuite(data: FinishTestItemRQ): void;
    startTestCase(data: StartTestItemRQ): void;
    finishTestCase(data: FinishTestItemRQ): void;
}

export const itemsReporting: ItemsReportingInterface = {
    startSuite(data: StartTestItemRQ): void {
        const codeRef = getCodeRef(data.name);
        const suiteObj = {
            type: TEST_ITEM_TYPES.SUITE,
            codeRef,
            ...data,
        };

        publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
    },

    finishSuite(data: FinishTestItemRQ): void {
        publishEvent(EVENTS.FINISH_TEST_ITEM, data);
    },

    startTestCase(data: StartTestItemRQ): void {
        const codeRef = getCodeRef(data.name);
        const testObj = {
            type: TEST_ITEM_TYPES.STEP,
            codeRef,
            ...data,
        };

        publishEvent(EVENTS.START_TEST_ITEM, testObj);
    },

    finishTestCase(data: FinishTestItemRQ): void {
        publishEvent(EVENTS.FINISH_TEST_ITEM, data);
    },
};
