const parse = require('../parse');
const fs = require('fs');
const path = require('path');

test('Diff: create keyed JSON tree', () => { // eslint-disable-line no-undef
  // // mock setup
  const input = [{
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

  const expected = {
    'ABC1234': {
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
    }
  };

  const parseFunction = function(input) {
    let newObj = {};
    input.forEach(function(i) {
      newObj[i.REFERENCENUM] = i;
    });
    return newObj;
  }
  expect(parse.keyedTree(input, parseFunction)).toEqual(expected);
});

test('Diff: create transaction', () => { // eslint-disable-line no-undef
  // JOB1 to be deleted
  // JOB4 to be added
  // JOB2 to be modified
  // JOB3 to not show up at all
  expectedTransaction = {
    addEvents: [{
      key: "JOB4",
      data: {
        "TITLE": "Essential Maintenance Works - Leitrim",
        "COUNTY": "Leitrim",
        "REFERENCENUM": "JOB4",
        "LAT": 53.926507006511,
        "LONG": -8.0085297962951,
        "NOTICETYPE": [
          "WATEROUTAGE"
        ] 
      } 
    }],
    removeEvents: [{
      key: "JOB1",
      data: null
    }],
    updateEvents: [{
      key: "JOB2",
      data: {
        "TITLE": "Essential Maintenance Works - Waterford",
        "COUNTY": "Waterford",
        "REFERENCENUM": "JOB2",
        "PROJECT": null,
        "LAT": 56,
        "LONG": 78,
        "NOTICETYPE": [
          "WATEROUTAGE", "BOILNOTICE"
        ]
      }
    }]
  }
  const oldFile = path.join(__dirname, '../../..', 'test/diff-sample-in-old.json');
  const newFile = path.join(__dirname, '../../..', 'test/diff-sample-in-new.json');
  let oldData = JSON.parse(fs.readFileSync(oldFile, 'utf8'));
  let newData = JSON.parse(fs.readFileSync(newFile, 'utf8'));
  const diffed = parse.getDiff(oldData, newData);
  expect(diffed).toEqual(expectedTransaction);
});