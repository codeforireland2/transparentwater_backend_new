const mongoose = require('mongoose');
const Notice = require('./schema/notice.js');

const mongoURI = 'mongodb://mongo/TWbackend?replicaSet=rs';

async function insertNotices(notices) {
  mongoose.connect(mongoURI).then(() => {
    Notice.collection.insert(notices, (err) => {
      if (err) {
        console.log(err);
        process.exit();
      }
    });
  }).catch((err) => {
    console.log(err);
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
  });
}

async function getCurrentNotices(callback) {
  mongoose.connect(mongoURI).then(() => {
    Notice.find({}).lean().exec((err, result) => {
      if (err) {
        throw err;
      }
      callback(result);
    });
  });
}

async function deleteNotices(notices) {
  mongoose.connect(mongoURI).then(() => {
    Notice.remove({ referencenum: { $in: notices } }, (err) => {
      console.log(err);
      process.exit();
    });
  }).catch((err) => {
    console.log(err);
    process.exit();
  });
}

async function deleteAllNotices() {
  mongoose.connect(mongoURI).then(() => {
    Notice.remove({}, (err) => {
      console.log(err);
      process.exit();
    });
  }).catch((err) => {
    console.log(err);
    process.exit();
  });
}

async function updateNotice(referenceNum, newVal) {
  mongoose.connect(mongoURI).then(() => {
    Notice.update(
      { referencenum: referenceNum }, newVal, { upsert: true },
      (err) => {
        console.log(err);
        process.exit();
      }
    );
  }).catch((err) => {
    console.log(err);
    process.exit();
  });
}

module.exports = {
  insertNotices: insertNotices,
  getAllNotices: getCurrentNotices,
  deleteNotices: deleteNotices,
  deleteAllNotices: deleteAllNotices,
  updateNotice: updateNotice
};
