import fetch from 'node-fetch';
import fs from 'fs';

// lot 104 geometry
var url = "https://services6.arcgis.com/i4Ofa92MsoSleULR/ArcGIS/rest/services/IUPUI_PermitParking/FeatureServer/2/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=";


function findCentroid(points) {
    console.log("findCentroid");
    // find the center
    var y = points.map((p) => p[1]).sort((a, b) => a - b);
    var yMid = (y[0] + y[y.length - 1]) / 2;
    var x = points.map((p) => p[0]).sort((a, b) => a - b);
    var xMid = (x[0] + x[x.length - 1]) / 2;
    var centroid = [xMid, yMid];
    return centroid;
}

fetch(url).then(function (response) {
    console.log("fetch");
    return response.json();
}).then(function (data) {
    console.log("json");
    var locations = data.features.map(function (feature) {
        feature["centroid"] = findCentroid(feature.geometry.coordinates[0]);
        return feature;
    });
    return locations;
}).then(function (locations) {
    console.log("write");
    fs.writeFileSync("locations.json", JSON.stringify(locations));
}).catch(function (err) {
    console.log(err);
});

