const path = require('path');
const moment = require('moment');
const statuses = require('./constants/statuses');

const normalizeFileName = (name) => {
  return name
    .replace(/\s/g, '-')
    .replace(/["']/g, '');
};

/*
  This function returns the path to the screenshot according to the getFileName() Nightwatch util function.
  For more details see the https://github.com/nightwatchjs/nightwatch/blob/master/lib/utils/screenshots.js#L12
*/
const getScreenshotPath = (testName, basePath, timestamp) => {
  const filenamePrefix = `${normalizeFileName(testName)}_${statuses.FAILED.toLocaleUpperCase()}`;
  const dateParts = new Date(timestamp).toString().replace(/:/g, '').split(' ');
  dateParts.shift();
  dateParts.pop();

  const dateStamp = dateParts.join('-');

  return path.resolve(path.join(basePath, `${filenamePrefix}_${dateStamp}.png`));
};

/*
  This function returns the possible paths to the auto-generated screenshot for failed test item.
  Since the screenshot can be saved in the file system before / after writing the test item to the report
  it is necessary to generate possible paths according to the delay.
*/
const getScreenshotPossiblePaths = (testName, basePath, testStartTime) => {
  const possibleTimes = [
    testStartTime,
    moment(testStartTime).add(1, 's').toDate(),
    moment(testStartTime).subtract(1, 's').toDate(),
  ];

  return possibleTimes.map((time) =>
    ({ path: getScreenshotPath(testName, basePath, time), time })
  );
};

module.exports = {
  normalizeFileName,
  getScreenshotPath,
  getScreenshotPossiblePaths,
};
