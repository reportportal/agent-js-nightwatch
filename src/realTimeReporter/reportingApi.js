const EVENTS = require('../constants/events');
const TEST_ITEM_TYPES = require('../constants/testItemTypes');
const { publishEvent } = require('./utils');

class ReportingApi {

  static startSuite(data) { // TODO: may be change it to common startTestItem and manage item type by browser object inside handler
    const suiteObj = {
      type: TEST_ITEM_TYPES.SUITE,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  };

  static finishSuite(data) {
    publishEvent(EVENTS.FINISH_TEST_ITEM, data);
  };

  static startTestCase(data) {
    const suiteObj = {
      type: TEST_ITEM_TYPES.STEP,
      ...data,
    };

    publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
  };

  static finishTestCase(data) {
    publishEvent(EVENTS.FINISH_TEST_ITEM, data);
  };

  static sendLog(data) {
    publishEvent(EVENTS.SEND_LOG, data);
  };

  static sendAttachment(data) {
    publishEvent(EVENTS.SEND_ATTACHMENT, data);
  };

  static addDescription(data) {
    publishEvent(EVENTS.ADD_DESCRIPTION, data);
  };

  static addParameter(data) {
    publishEvent(EVENTS.ADD_PARAMETER, data);
  };

  static setAttribute(data) {
    publishEvent(EVENTS.SET_ATTRIBUTE, data);
  };
}

module.exports = ReportingApi;
