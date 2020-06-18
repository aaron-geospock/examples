// Copy this file to config.js and edit

module.exports = {
// Obtain a Cesium Ion Token - see https://cesium.com/
    cesiumIonToken: 'replace-with-token',
// The location of the GeoSpock Presto server
    prestoURL: 'replace-with-presto-url',
// The Cesium ION asset of the 3d model of the taxi, eg the included models loaded into Cesium ION:
// src/models/cars/Realistic\ Car\ Pack\ -\ Nov\ 2018/OBJ/Taxi.*
// obtained from:
// https://quaternius.itch.io/lowpoly-cars
    taxiAsset: 0,
// The Cesium ION asset of the city 3d tileset.
// Recommended to use a tileset where buildings have been clamped to sea level.
// For example, load this file into Cesium ION, selecting clamp to sea level:
// https://geospock-example-data.s3.amazonaws.com/LowerManhattan.gml
    cityAsset: 0,
};


