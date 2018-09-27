const Notice = require('./schema/notice.js');


async function insertNotices(notices) {
  await Notice.collection.insert(notices, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
}

async function getCurrentNotices(callback) {
  await Notice.find({}).lean().exec((err, result) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    callback(result);
  });
}

async function deleteNotices(notices) {
  await Notice.remove({ referencenum: { $in: notices } }, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
}

async function deleteAllNotices() {
  await Notice.remove({}, (err) => {
    if (err != null) {
      console.log(err);
      process.exit(1);
    }
  });
}

async function updateNotice(referenceNum, newVal) {
  await Notice.update(
    { _id: newVal._id }, // eslint-disable-line no-underscore-dangle
    newVal,
    { overwrite: true },
    (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    }
  ).catch((err) => {
    console.log(err);
  });
}

module.exports = {
  insertNotices: insertNotices,
  getAllNotices: getCurrentNotices,
  deleteNotices: deleteNotices,
  deleteAllNotices: deleteAllNotices,
  updateNotice: updateNotice
};
