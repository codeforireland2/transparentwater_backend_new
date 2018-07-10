const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

/**
 * We define the MongoDB schema for the service notices here.
 * See location information and Point datatype at https://docs.mongodb.com/manual/reference/geojson/
 */
const noticeSchema = new mongoose.Schema({
  geocoord: { type: { type: String }, coordinates: [] },
  timeadded: Number,
  timemodified: Number,
  objectid: Number,
  worktype: String,
  title: String,
  contactdetails: String,
  affectedpremises: String,
  trafficimplications: String,
  description: String,
  status: String,
  globalid: String,
  startdate: Number,
  enddate: Number,
  location: String,
  county: String,
  referencenum: String,
  noticetype: [String]
});

module.exports = mongoose.model('Notice', noticeSchema);
