const iwsn = 'https://www.water.ie/site-files/cms-templates/utils/proxy/index.xml?' +
'https://services2.arcgis.com/OqejhVam51LdtxGa/ArcGIS/rest/services/' +
'WaterAdvisoryCR021/FeatureServer/0/query?returnGeometry=true&where=' +
'STATUS!%3D%27Closed%27&outFields=*&orderByFields=STARTDATE%20DESC' +
'&outSR=4326&returnIdsOnly=false&f=pgeojson';

module.exports = {
  irishWaterServiceNotices: iwsn
};
