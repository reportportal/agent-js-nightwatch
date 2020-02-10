const path = require('path');
const moment = require('moment');
const statuses = require('./constants/statuses');

const normalizeFileName = (name) => {
  return name
    .replace(/\s/g, '-')
    .replace(/["']/g, '');
};

const getScreenshotPath = (testName, basePath, timestamp) => {
  const filenamePrefix = `${normalizeFileName(testName)}_${statuses.FAILED.toLocaleUpperCase()}`;
  const dateParts = new Date(timestamp).toString().replace(/:/g, '').split(' ');
  dateParts.shift();
  dateParts.pop();

  const dateStamp = dateParts.join('-');

  return path.resolve(path.join(basePath, `${filenamePrefix}_${dateStamp}.png`));
};

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
