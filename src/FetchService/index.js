const apis = require('./apis');
const notice = require('../Database/schema/notice'); // eslint-disable-line no-unused-vars
const actions = require('../Database/actions');
const diffParser = require('../Diff/parse');
const helpers = require('../Database/helpers');

function parseFunction(keyAttr) {
  return (parseInput) => {
    const newObj = {};
    parseInput.forEach((inputObj) => {
      // console.log(inputObj);
      const newInputObj = helpers.lowercaseKeys(inputObj);
      newObj[inputObj[keyAttr]] = newInputObj;
    });
    return newObj;
  };
}

apis.fetchIrishWater(((data) => { // eslint-disable-line no-unused-vars
  actions.getAllNotices((d) => {
    const oldData = diffParser.keyedTree(d, parseFunction('referencenum'));
    const newData = diffParser.keyedTree(data, parseFunction('REFERENCENUM'));
    const diff = diffParser.getDiff(oldData, newData);

    if (diff.addEvents.length > 0) {
      actions.insertNotices(diff.addEvents.map(helpers.noticeFromDiff));
    }

    if (diff.removeEvents.length > 0) {
      // remove all old notices
      actions.deleteNotices(diff.removeEvents.map(k => k.key));
    }

    if (diff.updateEvents.length > 0) {
      diff.updateEvents.forEach((record) => {
        const noticeInstance = helpers.noticeFromDiff(record);
        actions.updateNotice(notice.referencenum, noticeInstance);
      });
    }
  });
}));
