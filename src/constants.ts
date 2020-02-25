enum EVENTS {
    START_TEST_ITEM = 'rp:startTestItem',
    FINISH_TEST_ITEM = 'rp:finishTestItem',
    SEND_LOG = 'rp:sendLog',
    SEND_ATTACHMENT = 'rp:sendAttachment',
    SET_ATTRIBUTE = 'rp:setAttribute',
    ADD_DESCRIPTION = 'rp:addDescription',
    ADD_PARAMETER = 'rp:addParameter',
}

enum LOG_LEVELS {
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    ERROR = 'ERROR',
}

enum STATUSES {
    FAILED = 'failed',
    PASSED = 'passed',
    SKIPPED = 'skipped',
}

enum TEST_ITEM_TYPES {
    SUITE = 'SUITE',
    TEST = 'TEST',
    STEP = 'STEP',
}

export {
    EVENTS,
    LOG_LEVELS,
    STATUSES,
    TEST_ITEM_TYPES
}
