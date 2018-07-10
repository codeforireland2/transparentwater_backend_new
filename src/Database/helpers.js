const Notice = require('./schema/notice');

/*
* noticeFromJSONDiff creates a notice object from a JSON diff
* used for additions
*/
function noticeFromJSONDiff(jn) {
  const n = new Notice();
  n.geocoord = { type: 'Point', coordinates: [jn.data.lat, jn.data.long] };
  n.objectid = jn.data.objectid;
  n.title = jn.data.title;
  n.status = jn.data.status;
  n.worktype = jn.data.worktype;
  n.affectedpremises = jn.data.affectedpremises;
  n.trafficimplications = jn.data.trafficimplications;
  n.description = jn.data.description;
  n.globalid = jn.data.globalid;
  n.location = jn.data.location;
  n.startdate = jn.data.startdate;
  n.enddate = jn.data.enddate;
  n.county = jn.data.county;
  n.referencenum = jn.data.referencenum;
  n.noticetype = jn.data.noticetype;
  n.contactdetails = jn.data.contactdetails;
  return n;
}

/*
* lowercaseKeys converts the keys of an object into lowercase
*/
function lowercaseKeys(obj) {
  const keys = Object.keys(obj);
  let n = keys.length;
  const newObj = {};
  while (n--) {
    const key = keys[n];
    if (key !== '_id') {
      // skip the Mongo _id key
      newObj[key.toLowerCase()] = obj[key];
    }
  }
  return newObj;
}


module.exports = {
  noticeFromDiff: noticeFromJSONDiff,
  lowercaseKeys: lowercaseKeys
};
