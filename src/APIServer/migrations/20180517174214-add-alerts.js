'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
    return db.createCollection('alerts', callback);
};

exports.down = function(db) {
    return db.dropCollection('alerts', callback);
};

exports._meta = {
  "version": 1
};

/**
 *  Data fields and types
 *
 *  // See location information and Point datatype at https://docs.mongodb.com/manual/reference/geojson/
 *  geocoord: {type, Array}
 *  worktype: ??
 *  title: String
 *  contactdetails: ??
 *  affectedpremises: ??
 *  trafficimplications: ??
 *  description: String
 *  status: String
 *  globalid: String
 *  startdate: Date
 *  enddate: Date
 *  location: String
 *  county: String
 *  referencenum: String
 *  noticetype: [String]
 *
 */

/**
 * Sample data fields:
 *
 * geocoord: {type: "Point", coordinates: [ -1.23, 44.44 ]},
 * worktype: null,
 * title: 'Essential Maintenance Works - Dublin',
 * contactdetails: null,
 * affectedpremises: null,
 * trafficimplications: null,
 * description: 'Maintenance works',
 * status: 'Open',
 * globalid: 'd34db33f',
 * startdate: 1527980400000,
 * enddate: 1525388400000,
 * location: 'Dublin',
 * county: 'Dublin',
 * referencenum: 'ABC1234',
 * noticetype: ['BOILWATERNOTICE', 'TRAFFICDISRUPTIONS', 'WATEROUTAGE']
 */

/**
 * Upcoming indices
 * db.alerts.createIndex( { geocoord : "2dsphere" } )
 * db.alerts.createIndex( { location:1, county:1 } )
 */