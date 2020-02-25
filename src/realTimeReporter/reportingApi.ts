import { EVENTS, TEST_ITEM_TYPES } from '../constants';
import { publishEvent } from './utils';

export default class ReportingApi {

  public static startSuite(data) { // TODO: may be change it to common startTestItem and manage item type by browser object inside handler
    const suiteObj = {
      type: TEST_ITEM_TYPES.SUITE,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  };

  public static finishSuite(data) {
    publishEvent(EVENTS.FINISH_TEST_ITEM, data);
  };

  public static startTestCase(data) {
    const suiteObj = {
      type: TEST_ITEM_TYPES.STEP,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  };

  public static finishTestCase(data) {
    publishEvent(EVENTS.FINISH_TEST_ITEM, data);
  };

  public static sendLog(data) {
    publishEvent(EVENTS.SEND_LOG, data);
  };

  public static sendAttachment(data) {
    publishEvent(EVENTS.SEND_ATTACHMENT, data);
  };

  public static addDescription(data) {
    publishEvent(EVENTS.ADD_DESCRIPTION, data);
  };

  public static addParameter(data) {
    publishEvent(EVENTS.ADD_PARAMETER, data);
  };

  public static setAttribute(data) {
    publishEvent(EVENTS.SET_ATTRIBUTE, data);
  };
}
