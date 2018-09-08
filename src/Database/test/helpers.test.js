const helpers = require('../helpers');

test('Database: Notice from Diff', () => { // eslint-disable-line no-undef
  // mock setup
  const input = {
    OBJECTID: 1,
    WORKTYPE: null,
    TITLE: 'Essential Maintenance Works - Dublin',
    CONTACTDETAILS: null,
    AFFECTEDPREMISES: null,
    TRAFFICIMPLICATIONS: null,
    DESCRIPTION: 'Maintenance works',
    STATUS: 'Open',
    GLOBALID: 'd34db33f',
    STARTDATE: 1527980400000,
    ENDDATE: 1525388400000,
    LOCATION: 'Dublin',
    COUNTY: 'Dublin',
    REFERENCENUM: 'ABC1234',
    LONG: -1.23,
    LAT: 44.44,
    NOTICETYPE: ['BOILWATERNOTICE', 'TRAFFICDISRUPTIONS', 'WATEROUTAGE']
  };

  const n = helpers.noticeFromDiff({ data: helpers.lowercaseKeys(input) });
  expect(n.objectid).toEqual(input.OBJECTID);
  expect(n.worktype).toEqual(input.WORKTYPE);
  expect(n.title).toEqual(input.TITLE);
  expect(n.contactdetails).toEqual(input.CONTACTDETAILS);
  expect(n.affectedpremises).toEqual(input.AFFECTEDPREMISES);
  expect(n.trafficimplications).toEqual(input.TRAFFICIMPLICATIONS);
  expect(n.description).toEqual(input.DESCRIPTION);
  expect(n.status).toEqual(input.STATUS);
  expect(n.globalid).toEqual(input.GLOBALID);
  expect(n.startdate).toEqual(input.STARTDATE);
  expect(n.enddate).toEqual(input.ENDDATE);
  expect(n.location).toEqual(input.LOCATION);
  expect(n.county).toEqual(input.COUNTY);
  expect(n.referencenum).toEqual(input.REFERENCENUM);
  expect(n.geocoord.coordinates[0]).toEqual(input.LAT);
  expect(n.geocoord.coordinates[1]).toEqual(input.LONG);
});

test('Diff: lowercaseKeys helper', () => { // eslint-disable-line no-undef
  const input = {
    OBJECTID: 1,
    WORKTYPE: null,
    TITLE: 'Essential Maintenance Works - Dublin',
    CONTACTDETAILS: null,
    AFFECTEDPREMISES: null,
    TRAFFICIMPLICATIONS: null,
    DESCRIPTION: 'Maintenance works',
    STATUS: 'Open',
    GLOBALID: 'd34db33f',
    STARTDATE: 1527980400000,
    ENDDATE: 1525388400000,
    LOCATION: 'Dublin',
    COUNTY: 'Dublin',
    REFERENCENUM: 'ABC1234',
    LONG: -1.23,
    LAT: 44.44,
    NOTICETYPE: ['BOILWATERNOTICE', 'TRAFFICDISRUPTIONS', 'WATEROUTAGE']
  };

  const n = helpers.lowercaseKeys(input);
  expect(n.objectid).toEqual(input.OBJECTID);
  expect(n.worktype).toEqual(input.WORKTYPE);
  expect(n.title).toEqual(input.TITLE);
  expect(n.contactdetails).toEqual(input.CONTACTDETAILS);
  expect(n.affectedpremises).toEqual(input.AFFECTEDPREMISES);
  expect(n.trafficimplications).toEqual(input.TRAFFICIMPLICATIONS);
  expect(n.description).toEqual(input.DESCRIPTION);
  expect(n.status).toEqual(input.STATUS);
  expect(n.globalid).toEqual(input.GLOBALID);
  expect(n.startdate).toEqual(input.STARTDATE);
  expect(n.enddate).toEqual(input.ENDDATE);
  expect(n.location).toEqual(input.LOCATION);
  expect(n.county).toEqual(input.COUNTY);
  expect(n.referencenum).toEqual(input.REFERENCENUM);
  expect(n.lat).toEqual(input.LAT);
  expect(n.long).toEqual(input.LONG);
  expect(n.noticetype).toEqual(input.NOTICETYPE);
});
