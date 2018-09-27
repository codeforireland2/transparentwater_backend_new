const assert = require('assert');
const mongoose = require('mongoose');
const winston = require('winston');

const apis = require('./apis');
const notice = require('../Database/schema/notice'); // eslint-disable-line no-unused-vars
const actions = require('../Database/actions');
const diffParser = require('../Diff/parse');
const helpers = require('../Database/helpers');

const mongoURI = 'mongodb://127.0.0.1:27017/TWbackend';

const msgFormat = winston.format.printf((info) => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

function parseFunction(keyAttr) {
  return (parseInput) => {
    if (parseInput == null) {
      assert(parseInput);
    }
    const newObj = {};
    parseInput.forEach((inputObj) => {
      assert(inputObj != null);
      const newInputObj = helpers.lowercaseKeys(inputObj);
      newObj[inputObj[keyAttr]] = newInputObj;
    });
    assert(newObj !== {});
    return newObj;
  };
}

function logInfo(log, message) {
  log.log({
    level: 'info',
    message: message
  });
}

function fetchAPIs(log) {
  return new Promise((resolve) => {
    apis.fetchIrishWater(((data) => { // eslint-disable-line no-unused-vars
      mongoose.connect(mongoURI, {
        // sets how many times to try reconnecting
        reconnectTries: Number.MAX_VALUE,
        // sets the delay between every retry (milliseconds)
        reconnectInterval: 1000
      }).then(async () => {
        actions.getAllNotices(async (d) => {
          const normalisedIWData = helpers.normaliseData(data);
          const oldData = diffParser.keyedTree(d, parseFunction('referencenum'));
          const newData = diffParser.keyedTree(normalisedIWData, parseFunction('referencenum'));
          const diff = diffParser.getDiff(oldData, newData);
          logInfo(log, 'Events found');
          logInfo(log, `add events: ${diff.addEvents.length}, ` +
                  `update events: ${diff.updateEvents.length}, ` +
                  `remove events: ${diff.removeEvents.length}`);
          if (diff.addEvents.length > 0) {
            await actions.insertNotices(diff.addEvents.map(helpers.noticeFromDiff));
          }

          if (diff.removeEvents.length > 0) {
            // remove all old notices
            await actions.deleteNotices(diff.removeEvents.map(k => k.key));
          }

          if (diff.updateEvents.length > 0) {
            await diff.updateEvents.forEach(async (record) => {
              const noticeInstance = helpers.noticeFromDiff(record);
              await actions.updateNotice(notice.referencenum, noticeInstance);
            });
          }
          logInfo(log, 'data written successfully');
          mongoose.disconnect();
          resolve();
        });
      });
    }));
  });
}

const now = new Date();
const logfile = `logs/FetchService-${now.getFullYear()}-${now.getMonth()}-` +
                `${now.getUTCDate()}-${now.getUTCHours()}-${now.getUTCMinutes()}.log`;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.label({ label: 'FetchService' }),
    winston.format.timestamp(),
    msgFormat
  ),
  transports: [
    new winston.transports.File({ filename: logfile, level: 'error' }),
    new winston.transports.File({ filename: logfile })
  ]
});
fetchAPIs(logger).then({});

