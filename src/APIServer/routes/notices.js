const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

/**
 * Responds to our GET all query and responds with JSON.
 */
router.get('/notice', (req, res, next) => { // eslint-disable-line no-unused-vars
  mongoose.model('Notice').find()
    .then((docs, err) => { // eslint-disable-line no-unused-vars
      res.json(docs);
    }).catch((err) => {
      console.log(err);
    });
});

module.exports = router;
