var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
}));

/**
 * Responds to our GET all query and responds with JSON.
 */
router.get('/notice', function(req, res, next) {
    mongoose.model('Notice').find()
    .then(function(docs, err) {
        res.json(docs);
    }).catch(function (err) {
        console.log(err);
    });
});

module.exports = router;
