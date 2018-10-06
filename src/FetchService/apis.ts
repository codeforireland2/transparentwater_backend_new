const request = require('axios');
const urls = require('./urls.config');

function fetchIrishWater(callback: (Object) => any, errorCallback: (string) => any) {
  const url: string = urls.irishWaterServiceNotices;
  request.get(url)
    .then((response) => {
      const data = response.data;
      const finalStructure = [];
      data.features.forEach((feature) => {
        const lat = feature.geometry.coordinates[1];
        const lng = feature.geometry.coordinates[0];
        const struct = feature.properties;
        struct.LAT = lat;
        struct.LONG = lng;

        // remove unnecessary keys
        delete struct.LASTEDITOR;
        delete struct.CREATEDBY;
        delete struct.LASTUPDATE;
        delete struct.CREATEDATE;
        delete struct.PROJECTNUMBER;
        delete struct.PROJECT;
        delete struct.PRIORITY;
        delete struct.APPROVALSTATUS;
        struct.NOTICETYPE = [];
        const keys = ['BOILWATERNOTICE', 'TRAFFICDISRUPTIONS', 'POLLUTION',
          'WATEROUTAGE', 'DONOTDRINK'];
        keys.forEach((key) => {
          const value = struct[key];
          delete struct[key];
          if (value != null) {
            struct.NOTICETYPE.push(key);
          }
        });
        finalStructure.push(struct);
      });
      callback(finalStructure);
    })
    .catch((error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

module.exports = {
  fetchIrishWater: fetchIrishWater
};
