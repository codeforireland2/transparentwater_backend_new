const fs = require('fs');
const path = require('path');
const actions = require('../actions');
const helpers = require('../helpers');
const parse = require('../../Diff/parse');
const Notice = require('../schema/notice.js');
const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/TWbackendTest';

function parseFunction(keyAttr) {
  return (parseInput) => {
    const newObj = {};
    parseInput.forEach((inputObj) => {
      const newInputObj = helpers.lowercaseKeys(inputObj);
      newObj[inputObj[keyAttr]] = newInputObj;
    });
    return newObj;
  };
}

function runDBTest(uri, testFunction) {
  mongoose.connect(uri).then(() => {
    Notice.remove({}, (err, res) => {
      if (err) {
        console.error(err);
        process.exit();
      }
      testFunction(res);
    });
  }).catch((err) => {
    console.log(err);
    process.exit();
  });
}

test('Database: Handle fetch service functions', (done) => { // eslint-disable-line no-undef
  const firstDataFile = path.join(__dirname, '../../..', 'test/sample-in-mongo-test.json');
  const secondDataFile = path.join(__dirname, '../../..', 'test/sample-in-mongo-test2.json');
  const firstData = JSON.parse(fs.readFileSync(firstDataFile, 'utf8'));
  const normalisedFirstData = helpers.normaliseData(firstData);
  const secondData = JSON.parse(fs.readFileSync(secondDataFile, 'utf8'));
  const normaisedSecondData = helpers.normaliseData(secondData);

  runDBTest(mongoURI, () => actions.getAllNotices(async (d) => {
    // tree structure for the older data
    const oldData = parse.keyedTree(d, parseFunction('referencenum'));
    // expect no data to previously exist
    expect(oldData).toMatchObject({});
    expect(firstData.length).toBe(3);
    const diff = parse.getDiff(oldData, firstData);

    // check the diff is correct
    expect(diff.addEvents.length).toBe(3);
    expect(diff.removeEvents.length).toBe(0);
    expect(diff.updateEvents.length).toBe(0);

    if (diff.addEvents.length > 0) {
      const noticesToAdd = diff.addEvents.map(helpers.noticeFromDiff);
      await actions.insertNotices(noticesToAdd);
    }

    if (diff.removeEvents.length > 0) {
      // remove all old notices
      await actions.deleteNotices(diff.removeEvents.map(k => k.key));
    }

    if (diff.updateEvents.length > 0) {
      await diff.updateEvents.forEach(async (record) => {
        // const noticeInstance = helpers.noticeFromDiff(record);
        await actions.updateNotice(record.referencenum, record);
      });
    }
    await actions.getAllNotices(async (storedNotices) => {
      // expect 3 notices to currently exist
      expect(storedNotices.length).toBe(3);
      const normalisedStored = helpers.normaliseData(storedNotices);
      expect(normalisedStored).toEqual(normalisedFirstData);

      // // repeat with newer data
      const storedData = parse.keyedTree(normalisedStored, parseFunction('referencenum'));
      const newData = parse.keyedTree(normaisedSecondData, parseFunction('referencenum'));
      const parsedDiff = parse.getDiff(storedData, newData);
      expect(parsedDiff.addEvents.length).toBe(1);
      expect(parsedDiff.removeEvents.length).toBe(1);
      expect(parsedDiff.updateEvents.length).toBe(1);

      if (parsedDiff.addEvents.length > 0) {
        await actions.insertNotices(parsedDiff.addEvents.map(helpers.noticeFromDiff));
      }

      if (parsedDiff.removeEvents.length > 0) {
        // remove all old notices
        await actions.deleteNotices(parsedDiff.removeEvents.map(k => k.key));
      }

      if (parsedDiff.updateEvents.length > 0) {
        await parsedDiff.updateEvents.forEach(async (record) => {
          const noticeInstance = helpers.noticeFromDiff(record);
          await actions.updateNotice(record.referencenum, noticeInstance);
        });
      }
      done();
    });
  }));
});
