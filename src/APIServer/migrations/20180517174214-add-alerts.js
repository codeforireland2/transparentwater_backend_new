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
    return db.createCollection('notices', callback);
};

exports.down = function(db) {
    return db.dropCollection('notices', callback);
};

exports._meta = {
  "version": 1
};

/**
 *  Data fields and types
 *
 *  // See location information and Point datatype at https://docs.mongodb.com/manual/reference/geojson/
 *  geocoord: {type, Array}
 *  timeadded: Date
 *  timemodified: Date
 *  objectid: Integer
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
 * timeadded: '2012-12-19T06:01:17.171Z,'
 * timemodified: '2012-12-19T06:01:17.171Z',
 * objectid: 27359,
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
 * location: 'Esker',
 * county: 'Dublin',
 * referencenum: 'ABC1234',
 * noticetype: ['BOILWATERNOTICE', 'TRAFFICDISRUPTIONS', 'WATEROUTAGE']
 */

/**
 * Upcoming indices
 * db.alerts.createIndex( { geocoord : "2dsphere" } )
 * db.alerts.createIndex( { location:1, county:1 } )
 * db.alerts.createIndex( { timeadded:1 } )
 * db.alerts.createIndex( { timemodified:1 } )
 */