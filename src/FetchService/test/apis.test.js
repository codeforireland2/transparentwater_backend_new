const axios = require('axios');
const Adapter = require('axios-mock-adapter');
const fs = require('fs');
const path = require('path');

const urls = require('../urls.config');
const apis = require('../apis');

// This sets the mock adapter on the default instance
const mock = new Adapter(axios);

test('fetch: irish water service notices', () => { // eslint-disable-line no-undef
  // mock setup
  const expected = [{
    OBJECTID: 1,
    WORKTYP: null,
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
  }];
  const filePath = path.join(__dirname, '..', 'sample-in.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
      process.exit(1);
    }
    mock.onGet(urls.irishWaterServiceNotices).reply(200, data);
    apis.fetchIrishWater((got) => {
      expect(got).toEqual(expected); // eslint-disable-line no-undef
    }, (error) => {
      console.error(error); // eslint-disable-line no-console
      process.exit(1);
    });
  });
});
