const assert = require('assert');
const mongoose = require('mongoose');

const apis = require('./apis');
const notice = require('../Database/schema/notice'); // eslint-disable-line no-unused-vars
const actions = require('../Database/actions');
const diffParser = require('../Diff/parse');
const helpers = require('../Database/helpers');

const mongoURI = 'mongodb://127.0.0.1:27017/TWbackend';

function parseFunction(keyAttr) {
  return (parseInput) => {
    if (parseInput == null) {
      console.log(parseInput);
      assert(parseInput);
    }
    const newObj = {};
    parseInput.forEach((inputObj) => {
      assert(inputObj != null);
      assert(inputObj[keyAttr]);
      const newInputObj = helpers.lowercaseKeys(inputObj);
      newObj[inputObj[keyAttr]] = newInputObj;
    });
    assert(newObj !== {});
    return newObj;
  };
}

function fetchAPIs() {
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
          mongoose.disconnect();
          resolve();
        });
      });
    }));
  });
}

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
  fetchAPIs().then(() => {});
  setInterval(() => {
    fetchAPIs().then(() => {
    });
  }, options.interval);
} else {
  fetchAPIs().then(() => {
    process.exit();
  });
}

