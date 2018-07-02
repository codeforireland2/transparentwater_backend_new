const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const router = express.Router();

/**
 * Responds to our GET all query and responds with JSON.
 */
router.get('/', (req, res, next) => { // eslint-disable-line no-unused-vars
  mongoose.model('Notice').find()
    .then((docs, err) => { // eslint-disable-line no-unused-vars
      res.json(docs);
    }).catch((err) => {
      console.log(err);
    });
});

module.exports = router;
