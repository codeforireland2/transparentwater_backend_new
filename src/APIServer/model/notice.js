const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

/**
 * We define the MongoDB schema for the service notices here.
 * See location information and Point datatype at https://docs.mongodb.com/manual/reference/geojson/
 */
const noticeSchema = new mongoose.Schema({
  geocoord: { type: String, coordinates: [Number] },
  timeadded: Date,
  timemodified: Date,
  objectid: Number,
  worktype: String,
  title: String,
  contactdetails: String,
  affectedpremises: String,
  trafficimplications: String,
  description: String,
  status: String,
  globalid: String,
  startdate: Date,
  enddate: Date,
  location: String,
  county: String,
  referencenum: String,
  noticetype: [String]
});

module.exports = mongoose.model('Notice', noticeSchema);
