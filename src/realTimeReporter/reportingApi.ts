import { EVENTS, TEST_ITEM_TYPES } from '../constants';
import { StartTestItemRQ, FinishTestItemRQ, LogRQ, AttachmentRQ, Attribute } from '../models';
import { publishEvent } from './utils';

export default class ReportingApi {

  public static startSuite(data: StartTestItemRQ): void { // TODO: may be change it to common startTestItem and manage item type by browser object inside handler
    const suiteObj = {
      type: TEST_ITEM_TYPES.SUITE,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  };

  public static finishSuite(data: FinishTestItemRQ): void {
    publishEvent(EVENTS.FINISH_TEST_ITEM, data);
  };

  public static startTestCase(data: StartTestItemRQ): void {
    const suiteObj = {
      type: TEST_ITEM_TYPES.STEP,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  };

  public static finishTestCase(data: FinishTestItemRQ): void {
    publishEvent(EVENTS.FINISH_TEST_ITEM, data);
  };

  public static sendLog(data: LogRQ): void {
    publishEvent(EVENTS.SEND_LOG, data);
  };

  public static sendAttachment(data: AttachmentRQ): void {
    publishEvent(EVENTS.SEND_ATTACHMENT, data);
  };

  public static addDescription(data: string): void {
    publishEvent(EVENTS.ADD_DESCRIPTION, data);
  };

  public static setAttribute(data: Attribute): void {
    publishEvent(EVENTS.SET_ATTRIBUTE, data);
  };
}
