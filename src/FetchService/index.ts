const assert = require('assert');
const fs = require('fs');
const mongoose = require('mongoose');
const winston = require('winston');

const apis = require('./apis');
const _notice = require('../Database/schema/notice'); // eslint-disable-line no-unused-vars
const actions = require('../Database/actions');
const helpers = require('../Database/helpers');
mongoose.Promise = require('bluebird');

// typescript imports
import * as diffParser from '../Diff/parse';

const mongoURI = 'mongodb://mongo/TWbackend?replicaSet=primary';

const msgFormat = winston.format.printf(info =>
  `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

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
  // console.log(message);
}

function logError(log, message) {
  log.log({
    level: 'error',
    message: message
  });
  // console.error(message);
}

function fetchAPIs(log: any) {
  return new Promise((resolve) => {
    apis.fetchIrishWater(((data) => { // eslint-disable-line no-unused-vars
      console.log("running request")
      mongoose.connect(mongoURI, {
        // sets how many times to try reconnecting
        reconnectTries: Number.MAX_VALUE,
        // sets the delay between every retry (milliseconds)
        reconnectInterval: 1000
      }).then(async () => {
        actions.getAllNotices(async (d) => {
          const normalisedIWData = helpers.normaliseData(data);
          const oldData = diffParser.createKeyedTree('referencenum', d, (input) => {
            return helpers.lowercaseKeys(input);
          });
          const newData = diffParser.createKeyedTree('referencenum', normalisedIWData, (input) => {
            const newData = helpers.lowercaseKeys(input);
            if ('lat' in newData || 'long' in newData) {
              newData.geocoord = {
                coordinates: [
                  newData.lat,
                  newData.long
                ],
                type: 'Point'
              };
              delete newData.lat;
              delete newData.long;
            }

            if ('_id' in newData) {
              delete newData._id; // eslint-disable-line no-underscore-dangle
            }
            return newData;
          });
          const diff = diffParser.createTransactionDiff(oldData, newData);
          logInfo(log, 'Events found');
          logInfo(log, `add events: ${diff.addEvents.length}, ` +
                  `update events: ${diff.updateEvents.length}, ` +
                  `remove events: ${diff.deleteEvents.length}`);
          if (diff.addEvents.length > 0) {
            await actions.insertNotices(diff.addEvents.map(helpers.noticeFromDiff));
          }

          if (diff.deleteEvents.length > 0) {
            // remove all old notices
            await actions.deleteNotices(diff.deleteEvents.map(k => k.key));
          }

          if (diff.updateEvents.length > 0) {
            await diff.updateEvents.forEach(async (record) => {
              const noticeInstance = helpers.noticeFromDiff(record);
              await actions.updateNotice(noticeInstance.referencenum, noticeInstance);
            });
          }
          logInfo(log, 'data written successfully');
          mongoose.disconnect();
          resolve();
        });
      }).catch((err) => {
        logError(logger, err);
      });
    }));
  });
}

const now = new Date();
const logdir = `${__dirname}/../../logs`;
if (!fs.existsSync(logdir)) {
  fs.mkdirSync(logdir);
}
const logfile = `${logdir}/FetchService-${now.getFullYear()}-${now.getMonth()}-` +
                `${now.getUTCDate()}.log`;

const logger = winston.createLogger({
  filename: logfile,
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

const options = {
  interval: null
};

for (let i = 0; i < process.argv.length; i++) {
  switch (process.argv[i]) {
  case '--interval':
    options.interval = process.argv[i + 1];
    i++;
    break;
  case '--daily':
    options.interval = 24 * 60 * 60 * 1000;
    break;
  default:
    break;
  }
}

if (options.interval) {
  fetchAPIs(logger).then(() => {});
  setInterval(() => {
    fetchAPIs(logger).then(() => {
    });
  }, options.interval);
} else {
  fetchAPIs(logger).then(() => {
    process.exit();
  });
}

