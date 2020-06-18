/*

Loads the 3d buildings tileset from Cesium ION.
See config-template.js for how to obtain a tileset.

 */

const Cesium = require('cesium/Cesium');
const resolutionController = require("./resolutionController");

module.exports = function city(config, viewer) {

    let tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(config.cityAsset), // Lower Manhattan
    });

    viewer.scene.primitives.add(tileset);

    resolutionController(viewer, 10, tileset);

};
