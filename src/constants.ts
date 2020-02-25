export enum EVENTS {
    START_TEST_ITEM = 'rp:startTestItem',
    FINISH_TEST_ITEM = 'rp:finishTestItem',
    SEND_LOG = 'rp:sendLog',
    SEND_ATTACHMENT = 'rp:sendAttachment',
    SET_ATTRIBUTE = 'rp:setAttribute',
    ADD_DESCRIPTION = 'rp:addDescription',
}

export enum LOG_LEVELS {
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    ERROR = 'ERROR',
}

export enum STATUSES {
    FAILED = 'failed',
    PASSED = 'passed',
    SKIPPED = 'skipped',
}

export enum TEST_ITEM_TYPES {
    SUITE = 'SUITE',
    TEST = 'TEST',
    STEP = 'STEP',
}

export enum FILE_TYPES {
    XML = 'application/xml',
    HTML = 'application/html',
    JAVASCRIPT = 'application/javascript',
    JSON = 'application/json',
    PHP = 'application/php',
    CSS = 'application/css',
    TEXT = 'text/plain',
    PNG = 'image/png',
    JPG = 'image/jpg',
}
